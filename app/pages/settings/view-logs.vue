<script setup lang="ts">
import {
  DialogInspect,
  DialogInspectItemDate,
  DialogInspectItemObject,
  DialogInspectItemText,
} from '#components'
import { useRouting } from '#imports'
import { appTitle, closeIcon, columnsIcon, searchIcon } from '#shared/constants'
import {
  columnOptionsFromTableColumns,
  hiddenTableColumn,
  recordCount,
  tableColumn,
  visibleColumnsFromTableColumns,
} from '#shared/utils/utils'
import useLogger from '@/composables/useLogger'
import { useMeta, useQuasar, type QTableColumn } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { localDatabase } from '~/utils/local-database'

useMeta({ title: `${appTitle} | View Logs` })

const $q = useQuasar()
const logger = useLogger()
const { goBack } = useRouting()

const labelSingular = 'Log'
const labelPlural = 'Logs'
const searchFilter: Ref<string> = ref('')
const tableColumns = [
  hiddenTableColumn('id'),
  tableColumn('id', 'Id', 'UUID'),
  tableColumn('created_at', 'Created Date', 'ISO-DATE'),
  tableColumn('log_level', 'Log Level'),
  tableColumn('label', 'Label', 'TEXT'),
  tableColumn('details', 'Details', 'OBJECT'),
]
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))

const liveData: Ref<LogType[]> = ref([])
const isLiveQueryFinished = ref(false)

const subscription = localDatabase.liveLogs().subscribe({
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
 * Opens the Inspect Log dialog using the data from the clicked row.
 */
function onInspectLog(record: Record<string, any>) {
  $q.dialog({
    component: DialogInspect,
    componentProps: {
      label: 'Log',
      record,
      subComponents: [
        { component: DialogInspectItemText, props: { label: 'Id', field: 'id', record } },
        {
          component: DialogInspectItemDate,
          props: { label: 'Created Date', field: 'created_at', record },
        },
        {
          component: DialogInspectItemText,
          props: { label: 'Log Level', field: 'log_level', record },
        },
        { component: DialogInspectItemText, props: { label: 'Label', field: 'label', record } },
        {
          component: DialogInspectItemObject,
          props: { label: 'Details', field: 'details', record },
        },
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
        <QTh
          v-for="col in props.cols"
          v-show="col.name !== 'hidden'"
          :key="col.name"
          :props="props"
        >
          {{ col.label }}
        </QTh>
      </QTr>
    </template>

    <template #body="props">
      <QTr :props="props" class="cursor-pointer" @click="onInspectLog(props.row)">
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
        >
          <template #after>
            <QSelect
              v-model="visibleColumns"
              :options="columnOptions"
              :disable="!liveData.length"
              multiple
              dense
              options-dense
              emit-value
              map-options
              option-value="name"
              display-value=""
              bg-color="primary"
            >
              <template #append>
                <QIcon color="white" :name="columnsIcon" />
              </template>
            </QSelect>
          </template>

          <template #append>
            <QIcon :name="searchIcon" />
          </template>
        </QInput>
      </div>
    </template>

    <template #bottom>
      {{ recordCount(liveData, labelSingular, labelPlural) }}
    </template>
  </QTable>
</template>
