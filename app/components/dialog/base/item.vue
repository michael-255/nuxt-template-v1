<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <QItem>
    <QItemSection>
      <QItemLabel>{{ label }}</QItemLabel>

      <QItemLabel caption>
        <slot />
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>
