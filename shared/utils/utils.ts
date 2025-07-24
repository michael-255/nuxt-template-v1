import { date, type QTableColumn } from 'quasar'
import type { DurationNameType } from '../types/types'

/**
 * Used to look up the duration in milliseconds for a given duration name..
 */
export const durationLookup: Record<DurationNameType, number> = {
  Now: 1,
  'One Second': 1_000,
  'One Minute': 60_000,
  'One Hour': 3_600_000,
  'One Day': 86_400_000,
  'One Week': 604_800_000,
  'One Month': 2_592_000_000,
  'Three Months': 7_776_000_000,
  'Six Months': 15_552_000_000,
  'One Year': 31_536_000_000,
  'Two Years': 63_072_000_000,
  'Three Years': 94_608_000_000,
  'All Time': 9007199254740990, // So it doesn't match 'Forever'
  Forever: 9007199254740991, // Number.MAX_SAFE_INTEGER
} as const

/**
 * Used to look up limit rules for app inputs.
 * Test against these directly instead of using a Zod schema.
 * @example
 * val.length <= limitRulesLookup.maxTextArea
 */
export const limitRuleLookup = {
  maxTextArea: 300,
  maxTextLine: 50,
} as const

/**
 * Create a hidden `QTableColumn`. Use this to hide a column that may be needed for `QTable` row
 * props, but should not be visible in the UI (normally `id`).
 * @param rowPropertyName Name of the property on the record for this column
 * @returns `QTableColumn`
 */
export function hiddenTableColumn(rowPropertyName: string): QTableColumn {
  return {
    name: 'hidden', // Needed in QTable row props
    label: '',
    align: 'left',
    sortable: false,
    required: true,
    field: (row: Record<string, string>) => row[rowPropertyName],
    format: (val: string) => `${val}`,
    style: 'display: none', // Hide column in QTable
  }
}

/**
 * Create a standard `QTableColumn`.
 * @param rowPropertyName Name of the property on the record for this column
 * @param label Display label for the property on this column
 * @param format How the property data should be formatted for display
 * @returns `QTableColumn`
 */
export function tableColumn(
  rowPropertyName: string,
  label: string,
  format?:
    | 'UUID'
    | 'TEXT'
    | 'BOOL'
    | 'OBJECT'
    | 'ISO-DATE'
    | 'LIST-COUNT'
    | 'LIST-PRINT'
    | 'SETTING',
): QTableColumn {
  // Initial column properties
  const tableColumn: QTableColumn = {
    name: rowPropertyName,
    label: label,
    align: 'left',
    sortable: true,
    required: false,
    field: (row: Record<string, string>) => row[rowPropertyName],
    format: (val: string) => `${val}`, // Default converts everything to a string
  }

  switch (format) {
    case 'UUID':
      // Truncates so it won't overflow the table cell
      tableColumn.format = (val: string) => truncateText(val, 8, '*')
      return tableColumn
    case 'TEXT':
      // Truncates so it won't overflow the table cell
      tableColumn.format = (val: string) => truncateText(val, 40, '...')
      return tableColumn
    case 'BOOL':
      // Converts output to a Yes or No string
      tableColumn.format = (val: boolean) => (val ? 'Yes' : 'No')
      return tableColumn
    case 'OBJECT':
      // Converts to JSON and truncates so it won't overflow the table cell
      tableColumn.format = (val: Record<string, string>) =>
        truncateText(JSON.stringify(val), 40, '...')
      return tableColumn
    case 'ISO-DATE':
      // Converts to a compact date string
      tableColumn.format = (val: string) => compactDateFromISODate(val)
      return tableColumn
    case 'LIST-COUNT':
      // Converts list to a count of the number of items
      tableColumn.format = (val: any[]) => `${val?.length ? val.length : 0}`
      return tableColumn
    case 'LIST-PRINT':
      // Prints the list as a truncated string
      tableColumn.format = (val: any[]) => truncateText(val.join(', '), 40, '...')
      return tableColumn
    case 'SETTING':
      // Formats the setting value based on the setting type
      tableColumn.format = (val: SettingValueType) => {
        if (val === true) {
          return 'Yes'
        } else if (val === false) {
          return 'No'
        } else {
          return `${val}`
        }
      }
      return tableColumn
    default:
      // STRING: Default just converts the result to a string with no length limit
      return tableColumn
  }
}

/**
 * Column options from a `QTableColumn` array for your `QTable`.
 * @param tableColumns Your `QTableColumn` array
 * @returns `QTableColumn[]`
 */
export function columnOptionsFromTableColumns(tableColumns: QTableColumn[]) {
  return tableColumns.filter((col) => !col.required)
}

/**
 * Visible columns from a `QTableColumn` array for your `QTable`.
 * @param tableColumns Your `QTableColumn` array
 * @returns `string[]`
 */
export function visibleColumnsFromTableColumns(tableColumns: QTableColumn[]) {
  const columnOptions = columnOptionsFromTableColumns(tableColumns).filter((col) => !col.required)
  return columnOptions.map((col) => col.name)
}

/**
 * Display string for the number of Settings found in the live data.
 * @param records Array of records
 * @param labelSingular Singular label for the records
 * @param labelPlural Plural label for the records
 * @returns `999 Settings found`
 */
export function recordCount(records: any[], labelSingular: string, labelPlural: string) {
  const count = records?.length ?? 0

  if (count === 0) {
    return `No ${labelPlural} found`
  } else if (count === 1) {
    return `1 ${labelSingular} found`
  } else {
    return `${count} ${labelPlural} found`
  }
}

/**
 * Returns a truncated string with a custom ending if it exceeds the max length.
 * @param str Original string to be truncated
 * @param maxLength How much of the original string to keep
 * @param ending Any valid string like `...` or `*` make good endings
 * @returns
 */
export function truncateText(text: string | null | undefined, maxLength: number, ending: string) {
  return text && text.length > maxLength ? text.slice(0, maxLength) + ending : text || ''
}

/**
 * Compact readable date string from a UTC ISO date string, converted to local time, or an empty
 * string if invalid.
 * @param utcIsoDate UTC ISO date string
 * @returns `Sat, 2021 Jan 2nd, 12:00 PM`
 */
export function compactDate(utcIsoDate?: string) {
  if (!utcIsoDate) {
    return ''
  }

  const dateObj = new Date(utcIsoDate)
  if (isNaN(dateObj.getTime())) {
    return ''
  }

  // Convert to local time by using the Date object as-is
  return date.formatDate(dateObj, 'ddd, YYYY MMM Do, h:mm A')
}

/**
 * Readable time duration string from a UTC ISO date string (converted to local time) to now, or an
 * empty string if invalid or less than one second.
 * @param utcIsoDate UTC ISO date string
 * @returns `9d 9h 9m 9s`
 */
export function timeFromDate(utcIsoDate?: string): string {
  if (!utcIsoDate) {
    return ''
  }

  const dateObj = new Date(utcIsoDate)
  if (isNaN(dateObj.getTime())) {
    return ''
  }

  const now = Date.now()
  const diff = Math.abs(now - dateObj.getTime())
  if (diff < durationLookup['One Second']) {
    return ''
  }

  const seconds = Math.floor((diff / durationLookup['One Second']) % 60)
  const minutes = Math.floor((diff / durationLookup['One Minute']) % 60)
  const hours = Math.floor((diff / durationLookup['One Hour']) % 24)
  const days = Math.floor(diff / durationLookup['One Day'])

  const daysStr = days > 0 ? `${days}d ` : ''
  const hoursStr = hours > 0 ? `${hours}h ` : ''
  const minutesStr = minutes > 0 ? `${minutes}m ` : ''
  const secondsStr = seconds > 0 ? `${seconds}s` : ''

  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`
}

/**
 * Calculates relative time difference between the current time and a given UTC ISO date string
 * (converted to local time). Returns a formatted string with a color for the difference.
 * @param utcIsoDate UTC ISO date string
 * @returns `{ message: '1 months ago', color: 'amber' }`
 */
export function timeAgo(utcIsoDate?: string): { message: string; color: string } {
  if (!utcIsoDate) {
    return { message: 'Invalid date', color: 'negative' }
  }

  const dateObj = new Date(utcIsoDate)
  if (isNaN(dateObj.getTime())) {
    return { message: 'Invalid date', color: 'negative' }
  }

  const now = Date.now()
  const diff = dateObj.getTime() - now
  const absDiff = Math.abs(diff)
  const isPast = diff < 0

  if (absDiff < durationLookup['One Minute']) {
    return { message: 'just now', color: 'primary' }
  }

  const units = [
    {
      max: durationLookup['One Hour'],
      value: durationLookup['One Minute'],
      name: 'minute',
      color: 'primary',
    },
    {
      max: durationLookup['One Day'],
      value: durationLookup['One Hour'],
      name: 'hour',
      color: 'primary',
    },
    {
      max: durationLookup['One Week'],
      value: durationLookup['One Day'],
      name: 'day',
      color: 'positive',
    },
    {
      max: durationLookup['One Month'],
      value: durationLookup['One Week'],
      name: 'week',
      color: 'positive',
    },
    {
      max: durationLookup['One Year'],
      value: durationLookup['One Month'],
      name: 'month',
      color: 'amber',
    },
    {
      max: Number.POSITIVE_INFINITY,
      value: durationLookup['One Year'],
      name: 'year',
      color: 'warning',
    },
  ]

  for (const unit of units) {
    if (absDiff < unit.max) {
      const count = Math.floor(absDiff / unit.value)
      const unitName = count === 1 ? unit.name : `${unit.name}s`
      const message = isPast ? `${count} ${unitName} ago` : `in ${count} ${unitName}`
      return { message, color: unit.color }
    }
  }

  throw new Error('Unable to calculate time difference')
}
