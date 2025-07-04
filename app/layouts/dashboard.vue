<script setup lang="ts">
import {
  dashboardIcon,
  errorIcon,
  examplesIcon,
  goToTopIcon,
  infoIcon,
  warnIcon,
} from '#shared/constants'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

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

    <QPageContainer>
      <QPage padding>
        <div class="row justify-center">
          <div class="page-width-limit">
            <slot />
            <QSpace class="page-scroller-space" />
          </div>
        </div>

        <QPageScroller position="bottom">
          <QBtn fab glossy :icon="goToTopIcon" color="accent" />
        </QPageScroller>
      </QPage>
    </QPageContainer>
  </QLayout>
</template>

<style scoped>
.page-scroller-space {
  height: 60px;
}
</style>
