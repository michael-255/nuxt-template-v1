<script setup lang="ts">
import { DialogCreate, DialogFormItemCreatedDate, DialogFormItemMessage } from '#components'
import { appTitle } from '#shared/constants'

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
      initialRecord: {},
      onSubmitHandler: () => console.log('Create onSubmitHandler called'),
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

    <!-- <DashboardActivityItem
      v-for="record in liveRecords"
      :key="record.id"
      :record="record"
      :service="ExerciseServInst"
      :child-service="ExerciseResultServInst"
    /> -->
  </QList>
</template>
