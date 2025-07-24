<script setup lang="ts">
import { computed } from 'vue'

const localRecordStore = useLocalRecordStore()

// Reminder options from enum (excluding 'None')
const reminderOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly']

// Split options into two columns
const mid = Math.ceil(reminderOptions.length / 2)
const col1 = reminderOptions.slice(0, mid)
const col2 = reminderOptions.slice(mid)

// Ensure reminders is always an array
const reminders = computed({
  get: () => localRecordStore.record.reminders || [],
  set: (val) => (localRecordStore.record.reminders = val),
})
</script>

<template>
  <DialogFormItem label="Reminders">
    <QItemLabel>
      <div class="row">
        <div class="col column">
          <QCheckbox
            v-for="option in col1"
            :key="option"
            v-model="reminders"
            :val="option"
            :label="option"
            color="primary"
          />
        </div>

        <div class="col column">
          <QCheckbox
            v-for="option in col2"
            :key="option"
            v-model="reminders"
            :val="option"
            :label="option"
            color="primary"
          />
        </div>
      </div>
    </QItemLabel>
  </DialogFormItem>
</template>
