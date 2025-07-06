<script setup lang="ts">
defineProps<{
  title: string
  icon?: string
}>()
</script>

<template>
  <QToolbar class="q-pr-xs">
    <QToolbarTitle>
      <QIcon v-if="icon" class="on-left q-pb-xs" :name="icon" />
      {{ title }}
    </QToolbarTitle>

    <slot />
  </QToolbar>

  <QSeparator class="q-mb-sm" />
</template>
