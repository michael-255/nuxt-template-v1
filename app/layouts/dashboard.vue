<script setup lang="ts">
import { dashboardIcon, notificationsIcon, settingsIcon } from '#shared/constants'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isDesktop = computed(() => $q.screen.gt.xs)
</script>

<template>
  <QLayout view="hHh lpr lfr">
    <QHeader bordered>
      <QTabs class="text-caption" active-color="yellow" outside-arrows mobile-arrows>
        <QRouteTab no-caps :icon="dashboardIcon" exact to="/">
          <template v-if="isDesktop">Dashboard</template>
        </QRouteTab>

        <QRouteTab no-caps :icon="notificationsIcon" exact to="/notifications">
          <template v-if="isDesktop">Notifications</template>
        </QRouteTab>

        <QRouteTab no-caps :icon="settingsIcon" exact to="/settings">
          <template v-if="isDesktop">Settings</template>
        </QRouteTab>
      </QTabs>
    </QHeader>

    <LayoutContainer />
  </QLayout>
</template>
