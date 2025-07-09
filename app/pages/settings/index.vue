<script setup lang="ts">
import { DialogConfirm } from '#components'
import {
  appTitle,
  closeIcon,
  createIcon,
  debugIcon,
  deleteIcon,
  deleteXIcon,
  durationNames,
  exportFileIcon,
  importFileIcon,
  localTables,
  logoutIcon,
  logsIcon,
  optionsIcon,
  refreshIcon,
  settingNames,
  settingsIcon,
  storageIcon,
  userIcon,
  warnIcon,
} from '#shared/constants'
import { logSchema, settingSchema } from '#shared/types/schemas'
import type { BackupType, LogType, SettingType } from '#shared/types/types'
import { useSettingsStore } from '@/stores/settings'
import { exportFile, QSpinnerGears, useQuasar } from 'quasar'
import { ref, type Ref } from 'vue'
import { localDatabase } from '~/utils/local-database'

useMeta({ title: `${appTitle} | Settings` })

const $q = useQuasar()
const logger = useLogger()
const { goBack } = useRouting()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const settingsStore = useSettingsStore()

const isDevMode = import.meta.env.DEV
const importFile: Ref<File | null> = ref(null)
const logRetentionOptions = [
  durationNames.enum['One Week'],
  durationNames.enum['One Month'],
  durationNames.enum['Three Months'],
  durationNames.enum['Six Months'],
  durationNames.enum['One Year'],
  durationNames.enum.Forever,
]

/**
 * Handles rejected files during import and logs a warning.
 */
function onRejectedFile(entries: any) {
  const name = entries?.[0]?.file?.name
  const size = entries?.[0]?.file?.size
  const type = entries?.[0]?.file?.type
  logger.warn(`Cannot import ${name}`, { name, size, type })
  importFile.value = null! // Clear input
}

/**
 * Logs the user out of the application.
 */
function onLogout() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      color: 'negative',
      icon: logoutIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      await supabase.auth.signOut() // TODO - Triggers redirect to login page right away?
      logger.info('Successfully logged out')
    } catch (error) {
      logger.error('Error logging out', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Imports all data from a backup JSON file into the app database.
 */
function onImportBackup() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Import',
      message: 'Import backup local data from a JSON file into the local database?',
      color: 'info',
      icon: importFileIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()

      if (!importFile.value) {
        logger.warn('No file selected for import')
        return
      }

      const backup = JSON.parse(await importFile.value.text()) as BackupType

      logger.debug('backup:', backup)

      const importSettings = backup?.settings ?? []
      const importLogs = backup?.logs ?? []

      const validLogs: LogType[] = []
      const validSettings: SettingType[] = []
      const invalidLogs: Partial<LogType>[] = []
      const invalidSettings: Partial<SettingType>[] = []

      // Validate each Log
      for (let i = 0; i < importLogs.length; i++) {
        const record = importLogs[i]
        if (record && logSchema.safeParse(record).success) {
          validLogs.push(logSchema.parse(record)) // Clean record with parse
        } else if (record !== undefined) {
          invalidLogs.push(record)
        }
      }

      // Validate each Setting
      for (let i = 0; i < importSettings.length; i++) {
        const record = importSettings[i]
        if (settingSchema.safeParse(record).success) {
          validSettings.push(settingSchema.parse(record)) // Clean record with parse
        } else if (record !== undefined) {
          invalidSettings.push(record)
        }
      }

      // Put settings into the local database over existing settings
      await Promise.all(
        validSettings.map((record) => localDatabase.table(localTables.enum.settings).put(record)),
      )

      logger.info('Successfully imported Settings', {
        valid: validSettings.length,
        invalid: invalidSettings.length,
      })

      await localDatabase.table(localTables.enum.logs).bulkAdd(validLogs)

      logger.info('Successfully imported Logs', {
        valid: validLogs.length,
        invalid: invalidLogs.length,
      })

      importFile.value = null // Clear input
    } catch (error) {
      logger.error('Error during import', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Exports all app data into a backup JSON file.
 */
function onExportBackup() {
  const appNameSlug = appTitle.toLowerCase().split(' ').join('-')
  const date = new Date().toISOString().split('T')[0]
  const filename = `${appNameSlug}-${date}.json`

  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Export',
      message: `Export local data into the backup file ${filename}?`,
      color: 'info',
      icon: exportFileIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()

      const backup: BackupType = {
        appTitle: appTitle,
        createdAt: new Date().toISOString(),
        logs: await localDatabase.table(localTables.enum.logs).toArray(),
        settings: await localDatabase.table(localTables.enum.settings).toArray(),
      }

      logger.debug('backup:', backup)

      const backupJson = JSON.stringify(backup)

      const exported = exportFile(filename, backupJson, {
        encoding: 'UTF-8',
        mimeType: 'application/json',
      })

      if (exported === true) {
        logger.info('Backup downloaded successfully', { filename })
      } else {
        throw new Error('Browser denied file download')
      }
    } catch (error) {
      logger.error('Export failed', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Resets the app to default settings and logs the user out.
 */
function onResetSettings() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Reset Settings',
      message:
        'Are you sure you want to reset the app to default settings? This will log you out and remove all credentials.',
      color: 'warning',
      icon: refreshIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      await localDatabase.table(localTables.enum.settings).clear()
      await localDatabase.initializeSettings()
      await supabase.auth.signOut() // TODO - Triggers redirect to login page right away?
      logger.info('Successfully reset Settings')
    } catch (error) {
      logger.error('Error reseting Settings', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Deletes all logs from the local database.
 */
function onDeleteLogs() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Delete Logs',
      message: 'Are you sure you want to delete all Logs?',
      color: 'negative',
      icon: deleteIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      await localDatabase.table(localTables.enum.logs).clear()
      logger.info('Successfully deleted Logs')
    } catch (error) {
      logger.error('Error deleting Logs', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Deletes the local database (settings and logs).
 */
function onDeleteLocalDatabase() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Delete Local Database',
      message:
        'Are you sure you want to delete the local database? You must reload the website after this action.',
      color: 'negative',
      icon: deleteXIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      await localDatabase.delete()
      $q.notify({
        message: 'Reload the website now',
        icon: warnIcon,
        color: 'warning',
      })
    } catch (error) {
      logger.error('Error deleting local database', error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

/**
 * Generates test logs for the application. Only available in development mode.
 */
function onTestLogs() {
  $q.loading.show({
    message: 'Testing Logs',
    spinner: QSpinnerGears,
  })

  const testData = {
    userId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    userName: 'Test User',
    categories: ['test', 'test2', 'test3', 'test4', 'test5'],
    junk: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quos iure repudiandae ipsa magni reiciendis eius? Ipsam, asperiores veniam minus eum, sequi aspernatur ullam molestiae ex ad deleniti, reiciendis fuga. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione quos iure repudiandae ipsa magni reiciendis eius? Ipsam, asperiores veniam minus eum, sequi aspernatur ullam molestiae ex ad deleniti, reiciendis fuga.',
    error: new Error('Deep Error'),
  }

  logger.print('Log - Print', testData)
  logger.debug('Log - Debug', testData)
  logger.info('Log - Info', testData)
  logger.warn('Log - Warn', testData)
  logger.error('Log - Error', new Error('Test Error'))

  $q.loading.hide()
}
</script>

<template>
  <SharedHeading title="Settings">
    <QBtn flat round :icon="closeIcon" @click="goBack()" />
  </SharedHeading>

  <QList padding>
    <QItemLabel header>
      <QIcon class="on-left" size="sm" :name="userIcon" />
      User
    </QItemLabel>

    <QItem>
      <QItemSection top>
        <QItemLabel>Email</QItemLabel>
        <QItemLabel caption> {{ user?.email || 'No User' }} </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QItemSection top>
        <QItemLabel>Id</QItemLabel>
        <QItemLabel caption> {{ user?.id || 'No User' }} </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QBtn
        :disable="$q.loading.isActive || !user"
        :icon="logoutIcon"
        color="negative"
        label="Logout"
        @click="onLogout()"
      />
    </QItem>
  </QList>

  <QSeparator />

  <QList padding>
    <QItemLabel header>
      <QIcon class="on-left" size="sm" :name="optionsIcon" />
      Options
    </QItemLabel>

    <QItem tag="label" :disable="$q.loading.isActive">
      <QItemSection top>
        <QItemLabel>Console Logs</QItemLabel>
        <QItemLabel caption> Show all console logs in the browser console. </QItemLabel>
      </QItemSection>

      <QItemSection side>
        <QToggle
          :model-value="settingsStore.consoleLogs"
          :disable="$q.loading.isActive"
          size="lg"
          @update:model-value="
            localDatabase.table(localTables.enum.settings).put({
              id: settingNames.enum['Console Logs'],
              value: $event,
            })
          "
        />
      </QItemSection>
    </QItem>

    <QItem tag="label" :disable="$q.loading.isActive">
      <QItemSection top>
        <QItemLabel>Info Popups</QItemLabel>
        <QItemLabel caption>
          Show popup messages when certain actions have been completed.
        </QItemLabel>
      </QItemSection>

      <QItemSection side>
        <QToggle
          :model-value="settingsStore.infoPopus"
          :disable="$q.loading.isActive"
          size="lg"
          @update:model-value="
            localDatabase.table(localTables.enum.settings).put({
              id: settingNames.enum['Info Popups'],
              value: $event,
            })
          "
        />
      </QItemSection>
    </QItem>

    <QItem>
      <QItemSection top>
        <QItemLabel>Log Retention</QItemLabel>
        <QItemLabel caption>
          Duration that logs remain stored until being removed automatically.
        </QItemLabel>
      </QItemSection>

      <QItemSection side>
        <QSelect
          :model-value="settingsStore.logRetentionDuration"
          :options="logRetentionOptions"
          :disable="$q.loading.isActive"
          dense
          outlined
          label="Duration"
          class="log-retention-width"
          @update:model-value="
            localDatabase.table(localTables.enum.settings).put({
              id: settingNames.enum['Log Rentention Duration'],
              value: $event,
            })
          "
        />
      </QItemSection>
    </QItem>
  </QList>

  <QSeparator />

  <QList padding>
    <QItemLabel header>
      <QIcon class="on-left" size="sm" :name="storageIcon" />
      Local Data
    </QItemLabel>

    <QItem>
      <QItemSection top>
        <QItemLabel>Import</QItemLabel>
        <QItemLabel caption>
          Import your local data from a JSON file. The app expects the data in the file to be
          structured the same as the exported version.
        </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem class="q-mb-sm">
      <QItemSection top>
        <QFile
          v-model="importFile"
          :disable="$q.loading.isActive"
          label="Import File"
          clearable
          dense
          outlined
          accept="application/json"
          @rejected="onRejectedFile($event)"
        >
          <template #before>
            <QBtn
              :disable="!importFile || $q.loading.isActive"
              :icon="importFileIcon"
              color="primary"
              @click="onImportBackup()"
            />
          </template>
        </QFile>
      </QItemSection>
    </QItem>

    <QItem>
      <QItemSection top>
        <QItemLabel>Export</QItemLabel>
        <QItemLabel caption> Export your local data as a JSON file. </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QBtn
        color="primary"
        label="Export as JSON"
        :icon="exportFileIcon"
        :disable="$q.loading.isActive"
        @click="onExportBackup()"
      />
    </QItem>

    <QItem>
      <QItemSection top>
        <QItemLabel>Tables</QItemLabel>
        <QItemLabel caption> View tables for data stored in the local database. </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QBtn
        :disable="$q.loading.isActive"
        :icon="logsIcon"
        color="info"
        label="View Logs"
        to="/settings/view-logs"
      />
    </QItem>

    <QItem>
      <QBtn
        :disable="$q.loading.isActive"
        :icon="settingsIcon"
        color="info"
        label="View Settings"
        to="/settings/view-settings"
      />
    </QItem>

    <QItem>
      <QItemSection top>
        <QItemLabel>Reset Settings</QItemLabel>
        <QItemLabel caption>
          Resets the app to default settings. This will log you out and remove all credentials.
        </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QBtn
        :disable="$q.loading.isActive"
        :icon="refreshIcon"
        color="warning"
        label="Reset Settings"
        @click="onResetSettings()"
      />
    </QItem>

    <QItem>
      <QItemSection top>
        <QItemLabel>Delete Logs</QItemLabel>
        <QItemLabel caption>
          Deletes all logs stored in the local database. This action cannot be undone.
        </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QBtn
        :disable="$q.loading.isActive"
        :icon="deleteIcon"
        color="negative"
        label="Delete Logs"
        @click="onDeleteLogs()"
      />
    </QItem>

    <QItem>
      <QItemSection top>
        <QItemLabel>Delete Local Database</QItemLabel>
        <QItemLabel caption>
          Delete the local browser database and all of its data (requires app reload). Only required
          when making modifications to the local database configuration. Does not impact the data on
          Supabase. This action cannot be undone.
        </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QBtn
        :disable="$q.loading.isActive"
        :icon="deleteXIcon"
        color="negative"
        label="Delete Local Database"
        @click="onDeleteLocalDatabase()"
      />
    </QItem>
  </QList>

  <QSeparator v-if="isDevMode" />

  <QList v-if="isDevMode" padding>
    <QItemLabel header>
      <QIcon class="on-left" size="sm" :name="debugIcon" />
      Development
    </QItemLabel>

    <QItem>
      <QItemSection top>
        <QItemLabel>Test Logger</QItemLabel>
        <QItemLabel caption> Generate several test logs for the app. </QItemLabel>
      </QItemSection>
    </QItem>

    <QItem>
      <QBtn
        :disable="$q.loading.isActive"
        :icon="createIcon"
        color="accent"
        label="Test Logger"
        @click="onTestLogs()"
      />
    </QItem>
  </QList>
</template>

<style scoped>
.log-retention-width {
  width: 150px;
}
</style>
