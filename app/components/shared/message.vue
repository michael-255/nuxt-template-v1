<script setup lang="ts">
import { colors, useQuasar } from 'quasar'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  messages: string[]
  paletteColor: string
  buttonLabel?: string
}>()

const emit = defineEmits<{
  (event: 'onEmptyAction'): void
}>()

const $q = useQuasar()

const borderStyle = computed(() => ({
  borderRadius: '10px',
  border: `3px dashed ${colors.getPaletteColor(props.paletteColor)}`,
}))
</script>

<template>
  <QItem class="q-mb-md" :style="borderStyle">
    <QItemSection>
      <QItemLabel class="text-h6 q-mb-md">{{ title }}</QItemLabel>

      <QItemLabel v-for="(message, i) in messages" :key="i" class="q-mb-md">
        {{ message }}
      </QItemLabel>

      <QItemLabel>
        <QBtn
          v-if="buttonLabel"
          :disable="$q.loading.isActive"
          :color="paletteColor"
          :label="buttonLabel"
          class="full-width"
          @click="emit('onEmptyAction')"
        />
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<style scoped>
.rounded-dashed-border {
  border-radius: 10px;
  border: 3px dashed;
}
</style>
