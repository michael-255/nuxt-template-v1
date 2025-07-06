<script setup lang="ts">
import { dashboardIcon, errorIcon, examplesIcon, infoIcon, warnIcon } from '#shared/constants'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isDesktop = computed(() => $q.screen.gt.xs)
</script>

<template>
  <QLayout view="hHh lpr lfr">
    <QHeader bordered>
      <QTabs class="text-caption" active-color="yellow" outside-arrows mobile-arrows>
        <QRouteTab no-caps :icon="examplesIcon" exact>
          <template v-if="isDesktop">Examples</template>
        </QRouteTab>

        <QRouteTab no-caps :icon="infoIcon" exact>
          <template v-if="isDesktop">Information</template>
        </QRouteTab>

        <QRouteTab no-caps :icon="warnIcon" exact>
          <template v-if="isDesktop">Warnings</template>
        </QRouteTab>

        <QRouteTab no-caps :icon="errorIcon" exact>
          <template v-if="isDesktop">Errors</template>
        </QRouteTab>

        <QRouteTab :icon="dashboardIcon" no-caps exact>
          <template v-if="isDesktop">Dashboard</template>
        </QRouteTab>
      </QTabs>
    </QHeader>

    <LayoutsPageContainerSlot />
  </QLayout>
</template>
