<script setup lang="ts">
import { appDescription, appTitle, errorIcon } from '#shared/constants'
import { colors, Notify } from 'quasar'
import { localDatabase } from '~/utils/local-database'

const config = useRuntimeConfig()
const logger = useLogger()
const settingsStore = useSettingsStore()

/**
 * Do NOT overwrite these specific properties in another useMeta call
 */
useMeta({
  title: appTitle,
  meta: {
    description: { name: 'description', content: appDescription },
    charset: { charset: 'UTF-8' },
    viewport: {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0',
    },
    // Color values MUST match the manifest
    themeColor: {
      name: 'theme-color',
      content: `${colors.getPaletteColor('primary')}`,
    },
    backgroundColor: {
      name: 'background-color',
      content: `${colors.getPaletteColor('black')}`,
    },
  },
  link: {
    manifest: {
      rel: 'manifest',
      href: `${config.app.baseURL}site.webmanifest`,
    },
    appleTouchIcon: {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: `${config.app.baseURL}apple-touch-icon.png`,
    },
    favicon96: {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: `${config.app.baseURL}favicon-96x96.png`,
    },
  },
  noscript: {
    default:
      'Your browser does not support JavaScript or has it disabled. Please enable JavaScript in your web browser settings or white-list our domain in your JavaScript blocker for the best experience.',
  },
})

// Loading live Settings into the store on startup for use throughout the app
const subscription = localDatabase.liveSettings().subscribe({
  next: (settings) => (settingsStore.settings = settings),
  error: (error) => logger.error('Error loading live Settings', error as Error),
})

onMounted(async () => {
  try {
    await localDatabase.initializeSettings()
  } catch (error) {
    // Output the error and notify user since it could be a database or logger failure
    Notify.create({
      message: 'Error initializing settings',
      icon: errorIcon,
      color: 'negative',
    })
    console.error(error)
  }

  try {
    const logsDeleted = await localDatabase.deleteExpiredLogs()
    if (logsDeleted > 0) {
      logger.info('Expired logs deleted', { logsDeleted })
    } else {
      logger.debug('No expired logs to delete')
    }
  } catch (error) {
    logger.error('Error deleting expired logs', error as Error)
  }
})

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
