<script setup lang="ts">
defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <QItem class="q-mb-sm">
    <QItemSection>
      <QItemLabel class="text-bold">{{ label }}</QItemLabel>

      <QItemLabel v-if="description">
        {{ description }}
      </QItemLabel>

      <slot />
    </QItemSection>
  </QItem>
</template>
