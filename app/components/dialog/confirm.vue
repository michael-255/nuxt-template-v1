<script setup lang="ts">
import { lockIcon, unlockIcon } from '#shared/constants'
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

const props = defineProps<{
  title: string
  message: string
  color: string
  icon: string
  requiresUnlock: boolean
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const toggle = ref(false)
</script>

<template>
  <QDialog ref="dialogRef" @hide="onDialogHide" @keyup.enter="onDialogOK">
    <QCard class="q-dialog-plugin">
      <QCardSection :class="`bg-${props.color} text-white q-pt-sm q-pb-xs`">
        <QIcon :name="icon" size="sm" class="q-pb-sm q-mr-md" />
        <span class="text-h6">{{ title }}</span>
      </QCardSection>

      <QCardSection class="q-mt-lg">{{ message }}</QCardSection>

      <QCardSection v-if="requiresUnlock">
        <QItem tag="label">
          <QItemSection>
            <QItemLabel>Unlock Required</QItemLabel>
            <QItemLabel caption> Toggle this operation on to proceed. </QItemLabel>
          </QItemSection>

          <QItemSection side>
            <QToggle
              v-model="toggle"
              :color="color"
              size="xl"
              :unchecked-icon="lockIcon"
              :checked-icon="unlockIcon"
            />
          </QItemSection>
        </QItem>
      </QCardSection>

      <QCardActions align="right">
        <QBtn flat label="Cancel" @click="onDialogCancel" />
        <QBtn
          v-if="requiresUnlock"
          :disable="!toggle"
          flat
          label="Confirm"
          :color="toggle ? 'negative' : 'grey'"
          @click="onDialogOK"
        />
        <QBtn v-else flat label="Confirm" :color="color" @click="onDialogOK" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
