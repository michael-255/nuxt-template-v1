<script setup lang="ts">
import { DialogConfirm } from '#components'
import { closeIcon, createIcon, refreshIcon, saveIcon } from '#shared/constants'
import useLogger from '@/composables/useLogger'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, onUnmounted, ref } from 'vue'
import { useLocalRecordStore } from '~/stores/local-record'

const props = defineProps<{
  label: string
  record: Record<string, any>
  onSubmitHandler: (record: Record<string, any>) => Promise<void>
  subComponents: Array<{ component: string; props: Record<string, any> }>
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const logger = useLogger()
const localRecordStore = useLocalRecordStore()

localRecordStore.setInitialRecords(props.record)

const isFormValid = ref(true)
const showResetBtn = computed(() => {
  return JSON.stringify(localRecordStore.initialRecord) !== JSON.stringify(localRecordStore.record)
})

onUnmounted(() => {
  localRecordStore.$reset()
})

function onReset() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: `Reset ${props.label}`,
      message: `Are you sure you want to reset this ${props.label} to the initial values?`,
      color: 'warning',
      icon: refreshIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      localRecordStore.resetRecord()
      logger.info(`Reset ${props.label}`)
    } catch (error) {
      logger.error(`Error reseting ${props.label}`, error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}

async function onSubmit() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: `Create ${props.label}`,
      message: `Are you sure you want to create this ${props.label}?`,
      color: 'positive',
      icon: saveIcon,
      requiresUnlock: false,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      const recordDeepCopy = extend(true, {}, localRecordStore.record) as Record<string, any>
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
      <QToolbarTitle>Create {{ label }}</QToolbarTitle>
      <QBtn v-show="showResetBtn" flat round color="yellow" :icon="refreshIcon" @click="onReset" />
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
                  :is="subComponent.component"
                  v-for="(subComponent, index) in subComponents"
                  :key="index"
                  v-bind="subComponent.props"
                />

                <QItem>
                  <QItemSection>
                    <QItemLabel>
                      <div class="row justify-center">
                        <QBtn
                          :label="`Create ${label}`"
                          :icon="saveIcon"
                          :disable="!isFormValid"
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
  max-height: 3rem;
}
.responsive-container {
  width: 100%;
  max-width: 50rem;
}
</style>
