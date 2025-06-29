import { appTitle } from '#shared/constants'
import { LocalTableEnum, LogLevelEnum } from '#shared/types/enums'
import type { LogDetailsType } from '#shared/types/types'
import { Log } from '@/models/Log'
import { useSettingsStore } from '~/stores/settings'
import { localDatabase } from '~/utils/local-database'

/**
 * Logger meant to be used in the Vue application frontend code.
 */
export default function useLogger() {
  const toast = useToast()
  const loggerName = `%c${appTitle}`
  const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
  const style = {
    print: `${baseStyle} #607d8b;`,
    debug: `${baseStyle} #673ab7;`,
    info: `${baseStyle} #0d47a1;`,
    warn: `${baseStyle} #ff6f00;`,
    error: `${baseStyle} #C10015;`,
  }

  const settingsStore = useSettingsStore()

  const log = {
    /**
     * Generic print method for logging messages during testing with no log level.
     */
    print: (message: any, ...args: any) => {
      console.log(loggerName, style.print, message, ...args)
    },

    /**
     * Log a debug message to the console only.
     */
    silentDebug: (name: string, details?: LogDetailsType) => {
      if (import.meta.env.DEV) {
        console.log(loggerName, style.debug, `[${LogLevelEnum.DEBUG}]`, name, details)
      }
    },

    debug: (name: string, details?: LogDetailsType) => {
      if (import.meta.env.DEV) {
        console.log(loggerName, style.debug, `[${LogLevelEnum.DEBUG}]`, name, details)
        toast.add({
          title: name,
          color: 'primary',
        })
        // notify({ message: name, icon: debugIcon, color: 'accent' })
      }
    },

    info: async (name: string, details?: LogDetailsType) => {
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
        toast.add({
          title: name,
          color: 'primary',
        })
        // notify({ message: name, icon: infoIcon, color: 'info' })
      }
    },

    warn: async (name: string, details?: LogDetailsType) => {
      if (settingsStore.consoleLogs) {
        console.warn(loggerName, style.warn, `[${LogLevelEnum.WARN}]`, name, details)
      }
      const log = new Log({
        logLevel: LogLevelEnum.WARN,
        label: name,
        details,
      })
      await localDatabase.table(LocalTableEnum.LOGS).add(log)
      toast.add({
        title: name,
        color: 'primary',
      })
      // notify({ message: name, icon: warnIcon, color: 'warning' })
    },

    error: async (name: string, details?: LogDetailsType) => {
      if (settingsStore.consoleLogs) {
        console.error(loggerName, style.error, `[${LogLevelEnum.ERROR}]`, name, details)
      }
      const log = new Log({
        logLevel: LogLevelEnum.ERROR,
        label: name,
        details,
      })
      await localDatabase.table(LocalTableEnum.LOGS).add(log)
      toast.add({
        title: name,
        color: 'primary',
      })
      // notify({ message: name, icon: errorIcon, color: 'negative' })
    },
  }

  return { log }
}
