<script setup lang="ts">
import { appTitle, notificationsIcon } from '#shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Notifications` })

definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <SharedHeading :icon="notificationsIcon" title="Notifications" />

  <div>
    <h3>Notifications</h3>
    <NuxtPage />
  </div>
</template>
