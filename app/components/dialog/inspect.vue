<script setup lang="ts">
import { closeIcon, inspectIcon } from '#shared/constants'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
  label: string
  record: Record<string, any>
  subComponents: Array<{ component: string; props: Record<string, any> }>
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
</script>

<template>
  <QDialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
    @hide="onDialogHide()"
  >
    <QToolbar class="bg-info text-white toolbar-height">
      <QIcon :name="inspectIcon" size="sm" class="q-mx-sm" />
      <QToolbarTitle>Inspect {{ label }}</QToolbarTitle>
      <QBtn flat round :icon="closeIcon" @click="onDialogCancel()" />
    </QToolbar>

    <QCard class="q-dialog-plugin">
      <QCardSection>
        <div class="row justify-center">
          <div class="page-width-limit">
            <QList padding>
              <div v-if="record">
                <component
                  :is="subComponent.component"
                  v-for="(subComponent, index) in subComponents"
                  :key="index"
                  v-bind="subComponent.props"
                />
              </div>

              <div v-else>Record missing</div>
            </QList>
            <div class="q-mt-xl" />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<style scoped>
.toolbar-height {
  max-height: 50px;
}
</style>
