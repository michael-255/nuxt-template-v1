<script setup lang="ts">
import { closeIcon, inspectIcon } from '#shared/constants'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
  record: Record<string, any>
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
      <QToolbarTitle>Inspect Notification</QToolbarTitle>
      <QBtn flat round :icon="closeIcon" @click="onDialogCancel()" />
    </QToolbar>

    <QCard class="q-dialog-plugin">
      <QCardSection>
        <div class="row justify-center">
          <div class="page-width-limit">
            <QList padding>
              <div v-if="record">
                <DialogBaseItemText label="Id" field="id" :record />
                <DialogBaseItemText label="Value" field="value" :record />
              </div>
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
