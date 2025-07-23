<script setup lang="ts">
import {
  DialogCreate,
  DialogFormItemCreatedDate,
  DialogFormItemMessage,
  DialogFormItemReminders,
} from '#components'
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
    reminders: ['None'],
  },
  {
    id: 'example-2',
    created_at: new Date('2025-05-15').toISOString(),
    message: 'This is another example record.',
    reminders: ['Weekly'],
  },
  {
    id: 'example-3',
    created_at: new Date('2025-01-31').toISOString(),
    message: 'This is yet another example record.',
    reminders: ['Monthly', 'Yearly'],
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
        { component: DialogFormItemReminders },
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
