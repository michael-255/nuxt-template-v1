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
      <QToolbarTitle>Inspect Log</QToolbarTitle>
      <QBtn flat round :icon="closeIcon" @click="onDialogCancel()" />
    </QToolbar>

    <QCard class="q-dialog-plugin">
      <QCardSection>
        <div class="row justify-center">
          <div class="page-width-limit">
            <QList padding>
              <div v-if="record">
                <DialogInspectItemText label="Id" field="id" :record />
                <DialogInspectItemDate label="Created Date" field="created_at" :record />
                <DialogInspectItemText label="Log Level" field="log_level" :record />
                <DialogInspectItemText label="Label" field="label" :record />
                <DialogInspectItemObject label="Details" field="details" :record />
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
