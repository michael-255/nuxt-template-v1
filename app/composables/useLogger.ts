import {
  appTitle,
  debugIcon,
  errorIcon,
  infoIcon,
  localTables,
  logLevels,
  warnIcon,
} from '#shared/constants'
import type { LogDetailsType } from '#shared/types/types'
import { Log } from '@/models/Log'
import { Notify, colors } from 'quasar'
import { useSettingsStore } from '~/stores/settings'
import { localDatabase } from '~/utils/local-database'

/**
 * Logger for the Vue application frontend code.
 */
export default function useLogger() {
  const loggerName = `%c${appTitle}`
  const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
  const style = {
    print: `${baseStyle} ${colors.getPaletteColor('secondary')};`,
    debug: `${baseStyle} ${colors.getPaletteColor('info')};`,
    info: `${baseStyle} ${colors.getPaletteColor('primary')};`,
    warn: `${baseStyle} ${colors.getPaletteColor('warning')};`,
    error: `${baseStyle} ${colors.getPaletteColor('negative')};`,
  }

  const settingsStore = useSettingsStore()

  /**
   * Generic notification method for displaying messages.
   */
  function notify(
    message: string,
    icon: string = infoIcon,
    color: string = 'info',
    options?: Record<string, any>,
  ) {
    Notify.create({
      message,
      icon,
      color,
      ...options,
    })
  }

  /**
   * Generic print method for logging messages during testing with no log level.
   */
  function print(message: any, ...args: any) {
    console.log(loggerName, style.print, message, ...args)
  }

  /**
   * Show a notification debug message while in development mode.
   */
  function debug(label: string, details?: LogDetailsType) {
    if (import.meta.env.DEV) {
      console.log(loggerName, style.debug, `[${logLevels.enum.DEBUG}]`, label, details)
      Notify.create({ message: label, icon: debugIcon, color: 'info' })
    }
  }

  /**
   * Info notification and logging.
   */
  async function info(label: string, details?: LogDetailsType) {
    if (settingsStore.consoleLogs) {
      console.log(loggerName, style.info, `[${logLevels.enum.INFO}]`, label, details)
    }

    const log = new Log({
      logLevel: logLevels.enum.INFO,
      label,
      details,
    })

    await localDatabase.table(localTables.enum.logs).add(log)

    if (settingsStore.infoPopus) {
      Notify.create({ message: label, icon: infoIcon, color: 'primary' })
    }
  }

  /**
   * Warning notification and logging.
   */
  async function warn(label: string, details?: LogDetailsType) {
    if (settingsStore.consoleLogs) {
      console.warn(loggerName, style.warn, `[${logLevels.enum.WARN}]`, label, details)
    }

    const log = new Log({
      logLevel: logLevels.enum.WARN,
      label,
      details,
    })

    await localDatabase.table(localTables.enum.logs).add(log)

    Notify.create({ message: label, icon: warnIcon, color: 'warning' })
  }

  /**
   * Error notification and logging.
   */
  async function error(label: string, details?: LogDetailsType) {
    if (settingsStore.consoleLogs) {
      console.error(loggerName, style.error, `[${logLevels.enum.ERROR}]`, label, details)
    }

    const log = new Log({
      logLevel: logLevels.enum.ERROR,
      label,
      details,
    })

    await localDatabase.table(localTables.enum.logs).add(log)

    Notify.create({ message: label, icon: errorIcon, color: 'negative' })
  }

  return {
    notify,
    print,
    debug,
    info,
    warn,
    error,
  }
}
