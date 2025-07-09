import type { SettingNameType, SettingValueType } from '#shared/types/types'

interface SettingParams {
  id: SettingNameType // Instead of standard Id
  value: SettingValueType
}

/**
 * Setting model is used for app wide settings. They are initialized and live
 * queried during startup in `App.vue` and inserted into a store for easy access.
 */
export class Setting {
  id: SettingNameType // Instead of standard Id
  value: SettingValueType

  constructor(params: SettingParams) {
    this.id = params.id
    this.value = params.value
  }
}
