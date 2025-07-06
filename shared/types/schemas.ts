import { LocalTableEnum, LogLevelEnum, SettingIdEnum, TableEnum } from '#shared/types/enums'
import { z } from 'zod'
import { LimitEnum } from './enums'

/**
 * Defining in one file to reduce the likelyhood of circular dependencies.
 */

//
// Shared
//

export const textLineSchema = z.string().min(1).max(LimitEnum.MAX_TEXT_LINE).trim()
export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // desc, notes, etc.
export const urlSchema = z.string().url()
export const emailSchema = z.string().email()
export const localTableSchema = z.nativeEnum(LocalTableEnum)
export const tableSchema = z.nativeEnum(TableEnum)
export const idSchema = z.string().refine(
  (id) => {
    if (z.string().uuid().safeParse(id).success) {
      return true // uuid valid
    } else if (settingIdSchema.safeParse(id).success) {
      return true // setting id valid
    } else {
      return false // invalid
    }
  },
  {
    message: 'Invalid Id',
  },
)
export const timestampzSchema = z.string().refine(
  (timestamp) => {
    return !isNaN(Date.parse(timestamp))
  },
  { message: 'Invalid timestamp' },
)

//
// Settings
//

export const settingIdSchema = z.nativeEnum(SettingIdEnum)
export const settingValueSchema = z.union([z.boolean(), z.string(), z.number()])
export const settingSchema = z.object({
  id: settingIdSchema, // Instead of standard ID
  value: settingValueSchema,
})

//
// Logs
//

export const logLevelSchema = z.nativeEnum(LogLevelEnum)
export const logLabelSchema = z.string().trim()
export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()
export const logSchema = z.object({
  id: idSchema,
  created_at: timestampzSchema,
  log_level: logLevelSchema,
  label: logLabelSchema,
  details: logDetailsSchema,
})
