<script setup lang="ts">
import { DialogConfirm } from '#components'
import { closeIcon, createIcon, refreshIcon, saveIcon } from '#shared/constants'
import useLogger from '@/composables/useLogger'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, onUnmounted, ref } from 'vue'
import type { z, ZodObject, ZodRawShape } from 'zod'
import { useLocalRecordStore } from '~/stores/local-record'

const props = defineProps<{
  label: string
  initialRecord: Record<string, any>
  recordSchema: ZodObject<ZodRawShape>
  onSubmitHandler: (record: Record<string, any>) => Promise<void>
  formComponents: Array<{ component: string; props: Record<string, any> }>
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const logger = useLogger()
const localRecordStore = useLocalRecordStore()

localRecordStore.setInitialRecord(props.initialRecord)

const isFormValid = ref(true)
const isDisabled = computed(() => $q.loading.isActive || !isFormValid.value)

onUnmounted(() => {
  localRecordStore.$reset()
})

function onReset() {
  localRecordStore.resetRecord()
}

async function onSubmit() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: `Update ${props.label}`,
      message: `Are you sure you want to update this ${props.label}?`,
      color: 'warning',
      icon: saveIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      const recordDeepCopy = extend(true, {}, localRecordStore.record) as z.infer<
        typeof props.recordSchema
      >
      await props.onSubmitHandler(recordDeepCopy)
      logger.info(`${props.label} created`, recordDeepCopy)
    } catch (error) {
      logger.error(`Error creating ${props.label}`, error as Error)
    } finally {
      $q.loading.hide()
      onDialogOK()
    }
  })
}
</script>

<template>
  <QDialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    maximized
    @hide="onDialogHide"
  >
    <QToolbar class="bg-primary text-white toolbar-height q-pr-xs">
      <QIcon :name="createIcon" size="sm" />
      <QToolbarTitle>Edit {{ label }}</QToolbarTitle>
      <QBtn flat round :icon="refreshIcon" @click="onReset" />
      <QBtn flat round :icon="closeIcon" @click="onDialogCancel" />
    </QToolbar>

    <QCard class="q-dialog-plugin">
      <QCardSection>
        <div class="row justify-center">
          <div class="responsive-container">
            <QForm
              class="q-mb-xl"
              @submit.prevent="onSubmit"
              @validation-error="isFormValid = false"
              @validation-success="isFormValid = true"
            >
              <QList padding>
                <component
                  :is="formComponent.component"
                  v-for="(formComponent, index) in props.formComponents"
                  :key="index"
                  v-bind="formComponent.props"
                />

                <QItem>
                  <QItemSection>
                    <QItemLabel>
                      <div class="row justify-center">
                        <QBtn
                          :label="`Edit ${props.label}`"
                          :icon="saveIcon"
                          :disable="isDisabled"
                          color="positive"
                          type="submit"
                        />
                      </div>
                    </QItemLabel>
                  </QItemSection>
                </QItem>

                <QItem v-show="!isFormValid">
                  <QItemSection>
                    <div class="row justify-center text-warning">
                      Correct invalid form entries and try again
                    </div>
                  </QItemSection>
                </QItem>
              </QList>
            </QForm>
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
.responsive-container {
  width: 100%;
  max-width: 800px;
}
</style>
