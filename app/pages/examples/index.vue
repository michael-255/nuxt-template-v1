<script setup lang="ts">
import { appTitle } from '#shared/constants'

useMeta({ title: `${appTitle} | Examples` })

definePageMeta({
  layout: 'examples',
})
</script>

<template>
  <SharedHeading title="Examples" />

  <NuxtPage />
</template>
