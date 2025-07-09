import type { z } from 'zod'
import type { durationNames, logLevels, settingNames } from '../constants'
import type {
  idSchema,
  logDetailsSchema,
  logLabelSchema,
  logSchema,
  settingSchema,
  settingValueSchema,
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
}

//
// Shared
//

export type IdType = z.infer<typeof idSchema>
export type TimestampzType = z.infer<typeof timestampzSchema>
export type DurationNameType = z.infer<typeof durationNames>

//
// Settings
//

export type SettingNameType = z.infer<typeof settingNames>
export type SettingValueType = z.infer<typeof settingValueSchema>
export type SettingType = z.infer<typeof settingSchema>

//
// Logs
//

export type LogLevelType = z.infer<typeof logLevels>
export type LogLabelType = z.infer<typeof logLabelSchema>
export type LogDetailsType = z.infer<typeof logDetailsSchema>
export type LogType = z.infer<typeof logSchema>
