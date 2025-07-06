import {
  symRoundedAddCircle,
  symRoundedBugReport,
  symRoundedClose,
  symRoundedDatabase,
  symRoundedDelete,
  symRoundedDeleteForever,
  symRoundedDownload,
  symRoundedError,
  symRoundedExitToApp,
  symRoundedFeatureSearch,
  symRoundedGridView,
  symRoundedInfo,
  symRoundedLock,
  symRoundedLockOpenRight,
  symRoundedLogout,
  symRoundedManageSearch,
  symRoundedNotifications,
  symRoundedPerson,
  symRoundedPublish,
  symRoundedRefresh,
  symRoundedSearch,
  symRoundedSettings,
  symRoundedSmartToy,
  symRoundedStat2,
  symRoundedStorage,
  symRoundedTune,
  symRoundedViewWeek,
  symRoundedWarning,
} from '@quasar/extras/material-symbols-rounded'

//
// General
//

export const appTitle = 'Nuxt Template App'
export const appDescription = `${appTitle} is a foundation for building web apps.`

export const displayDateFormat = 'ddd, YYYY MMM Do, h:mm A' // Sun, 2024 Sep 1st, 12:17 PM
export const pickerDateFormat = 'ddd MMM DD YYYY HH:mm:00' // Sun Sep 01 2024 12:17:00

/**
 * Icons
 * Use `string` as the expected type for Icons.
 * @see https://fonts.google.com/icons
 * @see https://quasar.dev/vue-components/icon#import-guide
 */

// Log Levels (Severity)
export const debugIcon = symRoundedBugReport
export const infoIcon = symRoundedInfo
export const warnIcon = symRoundedWarning
export const errorIcon = symRoundedError

// Pages
export const examplesIcon = symRoundedSmartToy
export const dashboardIcon = symRoundedGridView
export const logsIcon = symRoundedFeatureSearch
export const notificationsIcon = symRoundedNotifications
export const settingsIcon = symRoundedSettings

// Actions
export const createIcon = symRoundedAddCircle
export const closeIcon = symRoundedClose
export const goToTopIcon = symRoundedStat2
export const lockIcon = symRoundedLock
export const unlockIcon = symRoundedLockOpenRight
export const importFileIcon = symRoundedPublish
export const exportFileIcon = symRoundedDownload
export const refreshIcon = symRoundedRefresh
export const deleteIcon = symRoundedDelete
export const deleteXIcon = symRoundedDeleteForever
export const exitIcon = symRoundedExitToApp
export const logoutIcon = symRoundedLogout
export const searchIcon = symRoundedSearch

// Design Elements
export const userIcon = symRoundedPerson
export const optionsIcon = symRoundedTune
export const storageIcon = symRoundedStorage
export const columnsIcon = symRoundedViewWeek
export const inspectIcon = symRoundedManageSearch
export const databaseIcon = symRoundedDatabase
