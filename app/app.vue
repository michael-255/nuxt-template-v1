<script setup lang="ts">
import { errorIcon } from '#shared/constants'
import { Notify } from 'quasar'
import { onMounted, onUnmounted } from 'vue'
import { localDatabase } from '~/utils/local-database'
import useLogger from './composables/useLogger'
import { useSettingsStore } from './stores/settings'

const logger = useLogger()
const settingsStore = useSettingsStore()

// Loading live Settings into the store on startup for use throughout the app.
const subscription = localDatabase.liveSettings().subscribe({
  next: (records) => (settingsStore.settings = records),
  error: (error) => logger.error('Error loading live Settings', error as Error),
})

onMounted(async () => {
  // Initializes the local database settings
  try {
    await localDatabase.initializeSettings()
  } catch (error) {
    // Output the error and notify user since it could be a database or logger failure
    Notify.create({
      message: 'Error initializing settings',
      icon: errorIcon,
      color: 'negative',
    })
    console.error(error)
  }

  // Delete expired logs
  try {
    const logsDeleted = await localDatabase.deleteExpiredLogs()
    logger.debug('Expired logs deleted', { logsDeleted })
  } catch (error) {
    logger.error('Error deleting expired logs', error as Error)
  }
})

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <div>App</div>
  <NuxtPage />
</template>
