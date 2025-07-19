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

function isoToLocalString(iso: string) {
  if (!iso) return ''
  return date.formatDate(iso, pickerDateFormat)
}

function localStringToIso(local: string) {
  if (!local) return ''
  return new Date(local).toISOString()
}

function onNow() {
  localRecordStore.record.created_at = new Date().toISOString()
  dateTimePicker.value = isoToLocalString(localRecordStore.record.created_at)
}

const displayDate = computed(() =>
  localRecordStore.record?.created_at
    ? date.formatDate(localRecordStore.record?.created_at, displayDateFormat)
    : '',
)

const dateTimePicker = ref(
  localRecordStore.record?.created_at ? isoToLocalString(localRecordStore.record.created_at) : '',
)

watch(
  () => localRecordStore.record?.created_at,
  (newTimestamp) => {
    dateTimePicker.value = newTimestamp ? isoToLocalString(newTimestamp) : ''
  },
)

watch(dateTimePicker, () => {
  if (dateTimePicker.value) {
    localRecordStore.record.created_at = localStringToIso(dateTimePicker.value)
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
          <QDate v-model="dateTimePicker" :mask="pickerDateFormat" today-btn no-unset />
        </QPopupProxy>
      </QBtn>

      <QBtn :disable="isDisabled" :icon="scheduleTimeIcon" size="sm" label="Time" color="primary">
        <QPopupProxy>
          <QTime v-model="dateTimePicker" :mask="pickerDateFormat" />
        </QPopupProxy>
      </QBtn>

      <QBtn
        :disable="isDisabled"
        :icon="calendarCheckIcon"
        size="sm"
        label="Now"
        color="positive"
        @click="onNow"
      />
    </QItemLabel>
  </DialogFormItem>
</template>
