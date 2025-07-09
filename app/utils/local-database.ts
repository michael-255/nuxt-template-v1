import { appTitle, durationNames, localTables, settingNames } from '#shared/constants'
import { timestampzSchema } from '#shared/types/schemas'
import type {
  DurationNameType,
  IdType,
  LogType,
  SettingType,
  SettingValueType,
  TimestampzType,
} from '#shared/types/types'
import Dexie, { liveQuery, type Observable, type Table } from 'dexie'
import { Log } from '~/models/Log'
import { Setting } from '~/models/Setting'
import { durationLookup } from '~~/shared/utils/utils'

/**
 * The database for the application defining the tables that are available and the models that are
 * mapped to those tables. An instance of this class is created and exported at the end of the file.
 */
export class LocalDatabase extends Dexie {
  // Required for easier TypeScript usage
  [localTables.enum.logs]!: Table<Log>;
  [localTables.enum.settings]!: Table<Setting>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [localTables.enum.logs]: '&id, created_at',
      [localTables.enum.settings]: '&id',
    })

    this[localTables.enum.logs].mapToClass(Log)
    this[localTables.enum.settings].mapToClass(Setting)
  }

  /**
   * Initializes the settings in the local database. If the settings already exist, they are not
   * overwritten. If the settings do not exist, they are created with default values.
   * @note This MUST be called in `App.vue` on startup
   */
  async initializeSettings(): Promise<void> {
    const defaultSettings: Record<SettingNameType, SettingValueType> = {
      'User Email': '',
      'Console Logs': true,
      'Info Popups': true,
      'Log Rentention Duration': durationNames.enum['Six Months'],
    }

    // Get all settings or create them with default values
    const settings = await Promise.all(
      settingNames.options.map(async (name) => {
        const setting = await this.table(localTables.enum.settings).get(name)
        if (setting) {
          return setting
        } else {
          return new Setting({
            id: name,
            value: defaultSettings[name],
          })
        }
      }),
    )

    await Promise.all(settings.map((setting) => this.table(localTables.enum.settings).put(setting)))
  }

  /**
   * Deletes all logs that are older than the retention time set in the settings. If the retention
   * time is set to 'Forever', no logs will be deleted. This should be called on app startup.
   * @returns The number of logs deleted
   */
  async deleteExpiredLogs() {
    const setting = await this.table(localTables.enum.settings).get(
      settingNames.enum['Log Rentention Duration'],
    )
    const durationName = setting?.value as DurationNameType
    const durationValue = durationLookup[durationName]
    const durationForever = durationLookup.Forever

    if (!durationName || durationValue >= durationForever) {
      return 0 // No logs purged
    }

    const allLogs = await this.table(localTables.enum.logs).toArray()
    const now = Date.now()

    // Find Logs that are older than the retention time and map them to their keys
    const removableLogs = allLogs
      .filter((log: LogType) => {
        // Skip logs with invalid dates instead of marking them for deletion
        if (!timestampzSchema.safeParse(log.created_at).success) {
          return false
        }
        const logTimestamp = new Date(log.created_at as TimestampzType).getTime()
        const logAge = now - logTimestamp
        return logAge > durationValue
      })
      .map((log: LogType) => log.id) // Map remaining Log ids for removal

    await this.table(localTables.enum.logs).bulkDelete(removableLogs as IdType[])
    return removableLogs.length // Number of logs deleted
  }

  /**
   * Returns an observable of the logs in the database. The logs are ordered by created_at in
   * descending order. This is a live query, so it will update automatically when the database
   * changes.
   */
  liveLogs(): Observable<LogType[]> {
    return liveQuery(() =>
      this.table(localTables.enum.logs).orderBy('created_at').reverse().toArray(),
    )
  }

  /**
   * Returns an observable of the settings in the database. The settings are ordered by created_at
   * in descending order. This is a live query, so it will update automatically when the database
   * changes.
   */
  liveSettings(): Observable<SettingType[]> {
    return liveQuery(() => this.table(localTables.enum.settings).toArray())
  }
}

/**
 * Pre-instantiated database instance that can be used throughout the application.
 */
export const localDatabase = new LocalDatabase(appTitle)
