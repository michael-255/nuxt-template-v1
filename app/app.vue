<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { localDatabase } from '~/utils/local-database'
import useLogger from './composables/useLogger'
import { useSettingsStore } from './stores/settings'

const { log } = useLogger()
const settingsStore = useSettingsStore()
const toast = useToast()

// Loading live Settings into the store on startup for use throughout the app.
const subscription = localDatabase.liveSettings().subscribe({
  next: (records) => (settingsStore.settings = records),
  error: (error) => log.error('Error loading live Settings', error as Error),
})

onMounted(async () => {
  // Initializes the local database settings
  try {
    await localDatabase.initializeSettings()
  } catch (error) {
    // Output the error and notify user since it could be a database or logger failure
    // TODO
    toast.add({
      title: 'Error initializing settings',
      icon: 'material-symbols:info-outline-rounded',
    })
    console.error(error)
  }

  // Delete expired logs
  try {
    const logsDeleted = await localDatabase.deleteExpiredLogs()
    log.silentDebug('Expired logs deleted', { logsDeleted })
  } catch (error) {
    log.error('Error deleting expired logs', error as Error)
  }

  log.info('App initialized successfully')
})

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
