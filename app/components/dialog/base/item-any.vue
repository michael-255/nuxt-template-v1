<script setup lang="ts">
import { DialogBaseItem } from '#components'
import { computed } from 'vue'

const props = defineProps<{
  label: string
  field: string
  record: Record<string, any>
}>()

const value = computed(() => {
  return props.record[props.field]
})
</script>

<template>
  <DialogBaseItem :label="label">
    {{ value }}
  </DialogBaseItem>
</template>
