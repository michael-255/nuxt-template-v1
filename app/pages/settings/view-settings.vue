<script setup lang="ts">
import { DialogInspect, DialogInspectItemText } from '#components'
import { appTitle, closeIcon } from '#shared/constants'
import type { SettingType } from '#shared/types/types'
import { recordCount, tableColumn, visibleColumnsFromTableColumns } from '#shared/utils/utils'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { localDatabase } from '~/utils/local-database'

useMeta({ title: `${appTitle} | View Settings` })

const $q = useQuasar()
const logger = useLogger()
const { goBack } = useRouting()

const labelSingular = 'Setting'
const labelPlural = 'Settings'
const searchFilter: Ref<string> = ref('')
const tableColumns = [tableColumn('id', 'Id'), tableColumn('value', 'Value', 'SETTING')]
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))

const liveData: Ref<SettingType[]> = ref([])
const isLiveQueryFinished = ref(false)

const subscription = localDatabase.liveSettings().subscribe({
  next: (data) => {
    liveData.value = data
    isLiveQueryFinished.value = true
  },
  error: (error) => {
    logger.error(`Error loading live ${labelPlural} data`, error as Error)
    isLiveQueryFinished.value = true
  },
})

/**
 * Opens the Inspect Setting dialog using the data from the clicked row.
 */
function onInspectSetting(record: Record<string, any>) {
  $q.dialog({
    component: DialogInspect,
    componentProps: {
      label: 'Setting',
      record,
      subComponents: [
        { component: DialogInspectItemText, props: { label: 'Id', field: 'id', record } },
        { component: DialogInspectItemText, props: { label: 'Value', field: 'value', record } },
      ],
    },
  })
}

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <QTable
    fullscreen
    :rows="liveData"
    :columns="tableColumns"
    :visible-columns="visibleColumns"
    :rows-per-page-options="[0]"
    :filter="searchFilter"
    virtual-scroll
    row-key="id"
  >
    <template #header="props">
      <QTr :props="props">
        <QTh v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </QTh>
      </QTr>
    </template>

    <template #body="props">
      <QTr :props="props" class="cursor-pointer" @click="onInspectSetting(props.row)">
        <QTd v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </QTd>
      </QTr>
    </template>

    <template #top>
      <div class="row justify-start full-width q-mb-md">
        <div class="col-10 text-h6 text-bold ellipsis">
          {{ labelPlural }}
        </div>

        <QBtn
          round
          flat
          class="absolute-top-right q-mr-sm q-mt-sm"
          :icon="closeIcon"
          @click="goBack()"
        />
      </div>

      <div class="row justify-start full-width">
        <QInput
          v-model="searchFilter"
          :disable="!liveData.length"
          outlined
          dense
          clearable
          debounce="300"
          placeholder="Search"
          class="full-width"
        />
      </div>
    </template>

    <template #bottom>
      {{ recordCount(liveData, labelSingular, labelPlural) }}
    </template>
  </QTable>
</template>
