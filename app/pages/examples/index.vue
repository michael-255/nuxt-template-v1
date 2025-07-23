<script setup lang="ts">
import { DialogCreate, DialogFormItemCreatedDate, DialogFormItemMessage } from '#components'
import { appTitle } from '#shared/constants'
import { fakeOperation } from '~/utils/data-layer'

useMeta({ title: `${appTitle} | Examples` })

definePageMeta({
  layout: 'examples',
})

const $q = useQuasar()
// const logger = useLogger()

const records = ref([
  // Test records for demonstration purposes
  {
    id: 'example-1',
    created_at: new Date().toISOString(),
    message: 'This is an example record.',
  },
  {
    id: 'example-2',
    created_at: new Date('2025-05-15').toISOString(),
    message: 'This is another example record.',
  },
  {
    id: 'example-3',
    created_at: new Date('2025-01-31').toISOString(),
    message: 'This is yet another example record.',
  },
])

function onCreate() {
  $q.dialog({
    component: DialogCreate,
    componentProps: {
      label: 'Example',
      record: {},
      onSubmitHandler: fakeOperation,
      subComponents: [
        { component: DialogFormItemCreatedDate },
        { component: DialogFormItemMessage },
      ],
    },
  })
}
</script>

<template>
  <SharedHeading title="Examples" />

  <QList padding>
    <SharedMessage
      v-if="records && records.length == 0"
      :title="`No Examples Found`"
      :messages="['Click below to create an Example.']"
      palette-color="positive"
      button-label="Create Example"
      @on-empty-action="() => onCreate()"
    />

    <SharedContent v-for="record in records" :key="record.id" :record="record" />
  </QList>
</template>
