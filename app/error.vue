<script setup lang="ts">
import type { NuxtError } from '#app'
import { QBtn } from 'quasar'
import { appTitle } from '~~/shared/constants'

useMeta({ title: `${appTitle} | Error` })

const props = withDefaults(
  defineProps<{
    error?: NuxtError
  }>(),
  {
    error: () => ({
      statusCode: 500,
      message: 'Unknown error',
      fatal: false,
      unhandled: false,
      name: 'Error',
      toJSON: () => ({ statusCode: 500, message: 'Unknown error' }),
    }),
  },
)
</script>

<template>
  <div class="flex flex-center content-container">
    <div class="q-pa-lg content-extra">
      <h4 class="text-center">{{ appTitle }}</h4>

      <div class="text-center q-mb-md">
        <div class="text-h5 q-mb-xs">Error {{ props.error?.statusCode }}</div>
        <div class="q-mb-md">{{ props.error?.message || 'Unknown error' }}</div>
      </div>

      <QBtn
        label="Go Home"
        color="primary"
        class="q-mt-md full-width"
        @click="clearError({ redirect: '/' })"
      />
    </div>
  </div>
</template>

<style scoped>
.content-container {
  min-height: 80vh;
}

.content-extra {
  max-width: 400px;
  width: 100%;
}
</style>
