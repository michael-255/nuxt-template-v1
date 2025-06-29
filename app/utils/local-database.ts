import { appTitle } from '#shared/constants'
import { DurationEnum, DurationMSEnum, LocalTableEnum, SettingIdEnum } from '#shared/types/enums'
import { timestampzSchema } from '#shared/types/schemas'
import type {
  IdType,
  LogType,
  SettingType,
  SettingValueType,
  TimestampzType,
} from '#shared/types/types'
import Dexie, { liveQuery, type Observable, type Table } from 'dexie'
import { Log } from '~/models/Log'
import { Notification } from '~/models/Notification'
import { Setting } from '~/models/Setting'

/**
 * The database for the application defining the tables that are available and the models that are
 * mapped to those tables. An instance of this class is created and exported at the end of the file.
 */
export class LocalDatabase extends Dexie {
  // Required for easier TypeScript usage
  [LocalTableEnum.SETTINGS]!: Table<Setting>;
  [LocalTableEnum.LOGS]!: Table<Log>;
  [LocalTableEnum.NOTIFICATIONS]!: Table<Notification>

  constructor(name: string) {
    super(name)

    this.version(1).stores({
      [LocalTableEnum.SETTINGS]: '&id',
      [LocalTableEnum.LOGS]: '&id, created_at',
      [LocalTableEnum.NOTIFICATIONS]: '&id, created_at',
    })

    this[LocalTableEnum.SETTINGS].mapToClass(Setting)
    this[LocalTableEnum.LOGS].mapToClass(Log)
    this[LocalTableEnum.NOTIFICATIONS].mapToClass(Notification)
  }

  /**
   * Initializes the settings in the local database. If the settings already exist, they are not
   * overwritten. If the settings do not exist, they are created with default values.
   * @note This MUST be called in `App.vue` on startup
   */
  async initializeSettings(): Promise<void> {
    const defaultSettings: {
      [key in SettingIdEnum]: SettingValueType
    } = {
      [SettingIdEnum.USER_EMAIL]: '',
      [SettingIdEnum.CONSOLE_LOGS]: true,
      [SettingIdEnum.INFO_POPUPS]: true,
      [SettingIdEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
    }

    const settingids = Object.values(SettingIdEnum)

    // Get all settings or create them with default values
    const settings = await Promise.all(
      settingids.map(async (id) => {
        const setting = await this.table(LocalTableEnum.SETTINGS).get(id)
        if (setting) {
          return setting
        } else {
          return new Setting({
            id,
            value: defaultSettings[id],
          })
        }
      }),
    )

    await Promise.all(settings.map((setting) => this.table(LocalTableEnum.SETTINGS).put(setting)))
  }

  /**
   * Deletes all logs that are older than the retention time set in the settings. If the retention
   * time is set to 'Forever', no logs will be deleted. This should be called on app startup.
   * @returns The number of logs deleted
   */
  async deleteExpiredLogs() {
    const setting = await this.table(LocalTableEnum.SETTINGS).get(
      SettingIdEnum.LOG_RETENTION_DURATION,
    )
    const logRetentionDuration = setting?.value as DurationEnum

    if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
      return 0 // No logs purged
    }

    const allLogs = await this.table(LocalTableEnum.LOGS).toArray()
    const maxLogAgeMs = DurationMSEnum[logRetentionDuration]
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
        return logAge > maxLogAgeMs
      })
      .map((log: LogType) => log.id) // Map remaining Log ids for removal

    await this.table(LocalTableEnum.LOGS).bulkDelete(removableLogs as IdType[])
    return removableLogs.length // Number of logs deleted
  }

  /**
   * Returns an observable of the logs in the database. The logs are ordered by createdAt in
   * descending order. This is a live query, so it will update automatically when the database
   * changes.
   */
  liveLogs(): Observable<LogType[]> {
    return liveQuery(() =>
      this.table(LocalTableEnum.LOGS).orderBy('created_at').reverse().toArray(),
    )
  }

  /**
   * Returns an observable of the images in the database. The images are ordered by createdAt in
   * descending order. This is a live query, so it will update automatically when the database
   * changes.
   */
  liveSettings(): Observable<SettingType[]> {
    return liveQuery(() => this.table(LocalTableEnum.SETTINGS).toArray())
  }
}

/**
 * Pre-instantiated database instance that can be used throughout the application.
 */
export const localDatabase = new LocalDatabase(appTitle)
