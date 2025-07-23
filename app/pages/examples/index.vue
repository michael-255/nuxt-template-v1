<script setup lang="ts">
import {
  DialogCreate,
  DialogEdit,
  DialogFormItemCreatedDate,
  DialogFormItemMessage,
} from '#components'
import { appTitle } from '#shared/constants'
import { fakeOperation } from '~/utils/data-layer'

useMeta({ title: `${appTitle} | Examples` })

definePageMeta({
  layout: 'examples',
})

const $q = useQuasar()
// const logger = useLogger()

const records = ref([])

function onCreate() {
  $q.dialog({
    component: DialogCreate,
    componentProps: {
      label: 'Example',
      initialRecord: {
        id: 'test-123',
        created_at: new Date().toISOString(),
        message: 'This is a test example record.',
      },
      onSubmitHandler: fakeOperation,
      formComponents: [
        { component: DialogFormItemCreatedDate },
        { component: DialogFormItemMessage },
      ],
    },
  })
}

function onEdit() {
  $q.dialog({
    component: DialogEdit,
    componentProps: {
      label: 'Example',
      initialRecord: {
        id: 'test-123',
        created_at: new Date().toISOString(),
        message: 'This is a test example record.',
      },
      onSubmitHandler: fakeOperation,
      formComponents: [
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

    <SharedMessage
      v-if="records && records.length == 0"
      :title="`No Examples Found`"
      :messages="['Click below to edit an Example.']"
      palette-color="positive"
      button-label="Edit Example"
      @on-empty-action="() => onEdit()"
    />

    <!-- <DashboardActivityItem
      v-for="record in liveRecords"
      :key="record.id"
      :record="record"
      :service="ExerciseServInst"
      :child-service="ExerciseResultServInst"
    /> -->
  </QList>
</template>
