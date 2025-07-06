<script setup lang="ts">
import { goToTopIcon } from '#shared/constants'
</script>

<template>
  <QPageContainer>
    <QPage padding>
      <div class="row justify-center">
        <div class="page-width-limit">
          <NuxtPage />
          <QSpace class="page-scroller-space" />
        </div>
      </div>

      <QPageScroller position="bottom">
        <QBtn fab glossy :icon="goToTopIcon" color="accent" />
      </QPageScroller>
    </QPage>
  </QPageContainer>
</template>

<style scoped>
.page-scroller-space {
  height: 60px;
}
</style>
