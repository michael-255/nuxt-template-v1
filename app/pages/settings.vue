<script setup lang="ts">
import { appTitle, settingsIcon } from '#shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Settings` })

definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <SharedHeading :icon="settingsIcon" title="Settings" />

  <div>
    <h3>Settings</h3>
    <NuxtPage />
  </div>
</template>
