import {
  symRoundedBugReport,
  symRoundedClose,
  symRoundedError,
  symRoundedGridView,
  symRoundedInfo,
  symRoundedSmartToy,
  symRoundedStat2,
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

// Actions
export const closeIcon = symRoundedClose
export const goToTopIcon = symRoundedStat2

// Pages
export const examplesIcon = symRoundedSmartToy
export const dashboardIcon = symRoundedGridView
