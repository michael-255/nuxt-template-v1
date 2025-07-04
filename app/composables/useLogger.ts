import { appTitle, debugIcon, errorIcon, infoIcon, warnIcon } from '#shared/constants'
import { LocalTableEnum, LogLevelEnum } from '#shared/types/enums'
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
    print: `${baseStyle} ${colors.getPaletteColor('dark')};`, // TODO - Better color
    debug: `${baseStyle} ${colors.getPaletteColor('accent')};`,
    info: `${baseStyle} ${colors.getPaletteColor('info')};`,
    warn: `${baseStyle} ${colors.getPaletteColor('warning')};`,
    error: `${baseStyle} ${colors.getPaletteColor('negative')};`,
  }

  const settingsStore = useSettingsStore()

  /**
   * Generic notification method for displaying messages.
   */
  function notify(message: string, icon: string, color: string, options?: Record<string, any>) {
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
  function debug(name: string, details?: LogDetailsType) {
    if (import.meta.env.DEV) {
      console.log(loggerName, style.debug, `[${LogLevelEnum.DEBUG}]`, name, details)
      Notify.create({ message: name, icon: debugIcon, color: 'accent' })
    }
  }

  /**
   * Info notification and logging.
   */
  async function info(name: string, details?: LogDetailsType) {
    if (settingsStore.consoleLogs) {
      console.log(loggerName, style.info, `[${LogLevelEnum.INFO}]`, name, details)
    }

    const log = new Log({
      logLevel: LogLevelEnum.INFO,
      label: name,
      details,
    })

    await localDatabase.table(LocalTableEnum.LOGS).add(log)

    if (settingsStore.infoPopus) {
      Notify.create({ message: name, icon: infoIcon, color: 'info' })
    }
  }

  /**
   * Warning notification and logging.
   */
  async function warn(name: string, details?: LogDetailsType) {
    if (settingsStore.consoleLogs) {
      console.warn(loggerName, style.warn, `[${LogLevelEnum.WARN}]`, name, details)
    }

    const log = new Log({
      logLevel: LogLevelEnum.WARN,
      label: name,
      details,
    })

    await localDatabase.table(LocalTableEnum.LOGS).add(log)
    Notify.create({ message: name, icon: warnIcon, color: 'warning' })
  }

  /**
   * Error notification and logging.
   */
  async function error(name: string, details?: LogDetailsType) {
    if (settingsStore.consoleLogs) {
      console.error(loggerName, style.error, `[${LogLevelEnum.ERROR}]`, name, details)
    }

    const log = new Log({
      logLevel: LogLevelEnum.ERROR,
      label: name,
      details,
    })

    await localDatabase.table(LocalTableEnum.LOGS).add(log)

    Notify.create({ message: name, icon: errorIcon, color: 'negative' })
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
