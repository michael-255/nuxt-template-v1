<script setup lang="ts">
import { appTitle, examplesIcon, settingsIcon } from '#shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appTitle} | Dashboard` })

const dashboardButtons = [
  {
    label: 'Examples',
    icon: examplesIcon,
    color: 'info',
    to: '/examples',
  },
]
</script>

<template>
  <SharedHeading :title="appTitle">
    <QBtn flat round :icon="settingsIcon" to="/settings" />
  </SharedHeading>

  <div class="row q-col-gutter-md q-pa-sm">
    <div v-for="button in dashboardButtons" :key="button.label" class="col-6">
      <QBtn
        class="dashboard-btn full-width q-py-lg"
        stack
        glossy
        no-caps
        :color="button.color"
        :to="button.to"
      >
        <!-- <QBadge color="red" floating size="lg">7 </QBadge> -->
        <QIcon :name="button.icon" size="4rem" />
        <div class="q-mt-sm text-h6">
          {{ button.label }}
        </div>
      </QBtn>
    </div>
  </div>
</template>

<style scoped>
.dashboard-btn {
  height: 280;
  border-radius: 8px;
}
</style>
