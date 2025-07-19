import { defineStore } from 'pinia'
import { extend } from 'quasar'

/**
 * Storing the currently selected record locally for actions like create and edit.
 */
export const useLocalRecordStore = defineStore('local-record', {
  state: () => ({
    /**
     * Initial record state, can be used to reset the form.
     */
    initialRecord: {} as Record<string, any>,
    record: {} as Record<string, any>,
  }),

  actions: {
    /**
     * Set the initial record values prior to editing or creating a record.
     */
    setInitialState(record: Record<string, any>) {
      this.initialRecord = extend(true, {}, record)
      this.record = extend(true, {}, record)
    },

    resetRecordToInitial() {
      this.record = extend(true, {}, this.record, this.initialRecord)
    },
  },

  // TODO - Getters for accessing specific common properties
})
