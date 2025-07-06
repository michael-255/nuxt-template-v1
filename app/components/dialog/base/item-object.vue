<script setup lang="ts">
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
    <div v-if="value && Object.keys(value).length > 0">
      <div v-for="(v, k) in value" :key="k">
        <span class="text-amber">{{ k }}:</span> {{ v }}
      </div>
    </div>

    <div v-else class="text-italic text-secondary">-empty-</div>
  </DialogBaseItem>
</template>
