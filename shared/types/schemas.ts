import { z } from 'zod'
import { logLevels, settingNames } from '../constants'

/**
 * Defining in one file to reduce the likelyhood of circular dependencies.
 */

//
// Shared
//

export const urlSchema = z.string().url()
export const emailSchema = z.string().email()
export const idSchema = z.string().refine(
  (id) => {
    if (z.string().uuid().safeParse(id).success) {
      return true // uuid valid
    } else if (settingNames.safeParse(id).success) {
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

export const settingValueSchema = z.union([z.boolean(), z.string(), z.number()])
export const settingSchema = z.object({
  id: settingNames, // Instead of standard Id
  value: settingValueSchema,
})

//
// Logs
//

export const logLabelSchema = z.string().trim()
export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()
export const logSchema = z.object({
  id: idSchema,
  created_at: timestampzSchema,
  log_level: logLevels,
  label: logLabelSchema,
  details: logDetailsSchema,
})
