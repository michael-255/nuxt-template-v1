import type { z } from 'zod'
import type {
  idSchema,
  localTableSchema,
  logDetailsSchema,
  logLabelSchema,
  logLevelSchema,
  logSchema,
  notificationSchema,
  routeNameSchema,
  settingIdSchema,
  settingSchema,
  settingValueSchema,
  tableSchema,
  textAreaSchema,
  textLineSchema,
  timestampzSchema,
} from './schemas'

//
// App
//

export type BackupType = {
  appTitle: string
  createdAt: TimestampzType
  logs: LogType[]
  settings: SettingType[]
  notifications: NotificationType[]
}

//
// Shared
//

export type TextLineType = z.infer<typeof textLineSchema>
export type TextAreaType = z.infer<typeof textAreaSchema>
export type LocalTableType = z.infer<typeof localTableSchema>
export type TableType = z.infer<typeof tableSchema>
export type RouteNameType = z.infer<typeof routeNameSchema>
export type IdType = z.infer<typeof idSchema>
export type TimestampzType = z.infer<typeof timestampzSchema>

//
// Settings
//

export type SettingIdType = z.infer<typeof settingIdSchema>
export type SettingValueType = z.infer<typeof settingValueSchema>
export type SettingType = z.infer<typeof settingSchema>

//
// Logs
//

export type LogLevelType = z.infer<typeof logLevelSchema>
export type LogLabelType = z.infer<typeof logLabelSchema>
export type LogDetailsType = z.infer<typeof logDetailsSchema>
export type LogType = z.infer<typeof logSchema>

//
// Notifications
//

export type NotificationType = z.infer<typeof notificationSchema>
