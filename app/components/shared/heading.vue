<script setup lang="ts">
defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <QToolbar class="q-pr-xs">
    <QToolbarTitle>
      <QIcon class="on-left q-pb-xs" :name="icon" />
      {{ title }}
    </QToolbarTitle>

    <slot />
  </QToolbar>

  <QSeparator class="q-mb-sm" />
</template>
