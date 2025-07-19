<script setup lang="ts">
import {
  calendarCheckIcon,
  calendarIcon,
  displayDateFormat,
  pickerDateFormat,
  scheduleTimeIcon,
} from '#shared/constants'
import { date, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

const $q = useQuasar()
const localRecordStore = useLocalRecordStore()

const isDisabled = computed(() => $q.loading.isActive)
const displayDate = computed(() =>
  date.formatDate(localRecordStore.record?.created_at, displayDateFormat),
)
const dateTimePicker = ref(date.formatDate(localRecordStore.record?.created_at, pickerDateFormat))

watch(
  () => localRecordStore.record?.created_at,
  (newTimestamp) => {
    // Update the dateTimePicker with the new created_at when the store changes
    dateTimePicker.value = date.formatDate(newTimestamp, pickerDateFormat)
  },
)

watch(dateTimePicker, () => {
  const newTimestamp = new Date(dateTimePicker.value).getTime()
  if (newTimestamp && !isNaN(newTimestamp)) {
    // Update the store with the new timestamp from the dateTimePicker
    localRecordStore.record.created_at = newTimestamp
  }
})
</script>

<template>
  <DialogFormItem label="Created Date">
    <QItemLabel v-if="displayDate" class="text-h6">{{ displayDate }}</QItemLabel>
    <QItemLabel v-else class="text-h6">No Date</QItemLabel>

    <QItemLabel class="q-gutter-xs">
      <QBtn :disable="isDisabled" :icon="calendarIcon" size="sm" label="Date" color="primary">
        <QPopupProxy>
          <QDate v-model="dateTimePicker" mask="ddd MMM DD YYYY HH:mm:00" today-btn no-unset>
            <QBtn v-close-popup label="Close" flat class="full-width" />
          </QDate>
        </QPopupProxy>
      </QBtn>

      <QBtn :disable="isDisabled" :icon="scheduleTimeIcon" size="sm" label="Time" color="primary">
        <QPopupProxy>
          <QTime v-model="dateTimePicker" mask="ddd MMM DD YYYY HH:mm:00">
            <QBtn v-close-popup label="Close" flat class="full-width" />
          </QTime>
        </QPopupProxy>
      </QBtn>

      <QBtn
        :disable="isDisabled"
        :icon="calendarCheckIcon"
        size="sm"
        label="Now"
        color="positive"
        @click="localRecordStore.record.created_at = Date.now()"
      />
    </QItemLabel>
  </DialogFormItem>
</template>
