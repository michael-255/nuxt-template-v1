<script setup lang="ts">
import { appTitle } from '#shared/constants'

useMeta({ title: `${appTitle} | Examples` })

definePageMeta({
  layout: 'examples',
})

const logger = useLogger()

const records = ref([])
</script>

<template>
  <SharedHeading title="Examples" />

  <QList padding>
    <SharedMessage
      v-if="records && records.length == 0"
      :title="`No Examples Found`"
      :messages="[
        'If this is your first time using the app, try creating a new Exercise below.',
        'Don\'t see an Exercise that you created? Make sure it does not have the hidden status.',
      ]"
      palette-color="positive"
      button-label="Create Example"
      @on-empty-action="() => logger.debug('clicked')"
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
