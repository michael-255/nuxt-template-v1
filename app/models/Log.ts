import type {
  IdType,
  LogDetailsType,
  LogLabelType,
  LogLevelType,
  TimestampzType,
} from '#shared/types/types'
import { v4 as uid } from 'uuid'

interface LogParams {
  logLevel: LogLevelType
  label: LogLabelType
  details: LogDetailsType | Error
}

/**
 * Log stored in the local browser databse for the app.
 */
export class Log {
  id: IdType
  created_at: TimestampzType
  log_level: LogLevelType
  label: LogLabelType
  details: LogDetailsType

  constructor(params: LogParams) {
    this.id = uid()
    this.created_at = new Date().toISOString()
    this.log_level = params.logLevel
    this.label = params.label

    if (params.details instanceof Error) {
      this.details = {
        name: params.details.name,
        message: params.details.message,
        stack: params.details.stack,
      }
    } else {
      this.details = params.details
    }
  }
}
