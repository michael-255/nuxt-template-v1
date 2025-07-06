<script setup lang="ts">
import { colors, useQuasar } from 'quasar'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  messages: string[]
  buttonLabel?: string
  buttonColor?: string
  borderColor?: string
  bgColor?: string
  textColor?: string
}>()

const emit = defineEmits<{
  (event: 'onEmptyAction'): void
}>()

const $q = useQuasar()

const borderStyle = computed(() => ({
  borderRadius: '10px',
  border: `3px dashed ${props.borderColor || colors.getPaletteColor('info')}`,
}))

const cardClasses = computed(() => [
  'q-mb-md',
  props.bgColor ? `bg-${props.bgColor}` : '',
  props.textColor ? `text-${props.textColor}` : '',
])
</script>

<template>
  <QItem :class="cardClasses" :style="borderStyle">
    <QItemSection>
      <QItemLabel class="text-h6 q-mb-md">{{ title }}</QItemLabel>

      <QItemLabel v-for="(message, i) in messages" :key="i" class="q-mb-md">
        {{ message }}
      </QItemLabel>

      <QItemLabel>
        <QBtn
          :disable="$q.loading.isActive"
          :color="buttonColor"
          :label="buttonLabel"
          class="full-width"
          @click="emit('onEmptyAction')"
        />
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<style scoped>
/* No static border style, now handled by computed style */
</style>
