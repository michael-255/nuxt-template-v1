import type { SettingType } from '#shared/types/types'
import { defineStore } from 'pinia'
import { settingNames } from '~~/shared/constants'

/**
 * The default values for each setting are defined in `local-database.ts`
 */
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: [] as SettingType[],
  }),

  /**
   * Destructing the getters from the store will break reactivity.
   * Use settingsStore.{getter} instead.
   */
  getters: {
    // Supabase
    userEmail: (state) => {
      return state.settings.find((s: SettingType) => s.id === settingNames.enum['User Email'])
        ?.value as string
    },

    // App
    consoleLogs: (state) => {
      return state.settings.find((s: SettingType) => s.id === settingNames.enum['Console Logs'])
        ?.value as boolean
    },

    infoPopus: (state) => {
      return state.settings.find((s: SettingType) => s.id === settingNames.enum['Info Popups'])
        ?.value as boolean
    },

    logRetentionDuration: (state) => {
      return state.settings.find(
        (s: SettingType) => s.id === settingNames.enum['Log Rentention Duration'],
      )?.value as string
    },
  },
})
