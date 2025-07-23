<script setup lang="ts">
import {
  DialogConfirm,
  DialogEdit,
  DialogFormItemCreatedDate,
  DialogFormItemMessage,
  DialogInspect,
  DialogInspectItemDate,
  DialogInspectItemText,
} from '#components'
import { deleteIcon, editIcon, inspectIcon, verticalDotMenuIcon } from '#shared/constants'
import { useQuasar } from 'quasar'

const props = defineProps<{
  record: Record<string, any>
}>()

const $q = useQuasar()
const logger = useLogger()

function onInspect() {
  $q.dialog({
    component: DialogInspect,
    componentProps: {
      label: 'Example',
      record: props.record,
      subComponents: [
        {
          component: DialogInspectItemText,
          props: { label: 'Id', field: 'id', record: props.record },
        },
        {
          component: DialogInspectItemDate,
          props: { label: 'Created Date', field: 'created_at', record: props.record },
        },
        {
          component: DialogInspectItemText,
          props: { label: 'Message', field: 'message', record: props.record },
        },
      ],
    },
  })
}

function onEdit() {
  $q.dialog({
    component: DialogEdit,
    componentProps: {
      label: 'Example',
      record: props.record,
      onSubmitHandler: fakeOperation,
      subComponents: [
        { component: DialogFormItemCreatedDate },
        { component: DialogFormItemMessage },
      ],
    },
  })
}

function onDelete() {
  $q.dialog({
    component: DialogConfirm,
    componentProps: {
      title: 'Delete Example',
      message: `Are you sure you want to delete this Example?`,
      color: 'negative',
      icon: deleteIcon,
      requiresUnlock: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()
      logger.info(`Example deleted`)
    } catch (error) {
      logger.error(`Error deleting Example`, error as Error)
    } finally {
      $q.loading.hide()
    }
  })
}
</script>

<template>
  <QItem>
    <QItemSection>
      <QCard flat bordered>
        <QItem class="q-mt-sm">
          <QItemSection top>
            <QItemLabel class="text-body1">{{ record.id }}</QItemLabel>

            <QItemLabel caption>
              <div class="text-grey-5 row">
                <span class="q-mt-xs">
                  {{ record.created_at }}
                </span>
              </div>
            </QItemLabel>
          </QItemSection>

          <QItemSection top side>
            <div class="row btn-translation">
              <QBtn :disable="$q.loading.isActive" :icon="verticalDotMenuIcon" flat dense round>
                <QMenu
                  auto-close
                  anchor="top right"
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  <QList>
                    <QItem clickable @click="onInspect">
                      <QItemSection avatar>
                        <QIcon color="primary" :name="inspectIcon" />
                      </QItemSection>

                      <QItemSection>Inspect</QItemSection>
                    </QItem>

                    <QItem clickable @click="onEdit">
                      <QItemSection avatar>
                        <QIcon color="amber" :name="editIcon" />
                      </QItemSection>

                      <QItemSection>Edit</QItemSection>
                    </QItem>

                    <QItem clickable @click="onDelete">
                      <QItemSection avatar>
                        <QIcon color="negative" :name="deleteIcon" />
                      </QItemSection>

                      <QItemSection>Delete</QItemSection>
                    </QItem>
                  </QList>
                </QMenu>
              </QBtn>
            </div>
          </QItemSection>
        </QItem>

        <QItem>
          <QItemSection>
            <QItemLabel>
              {{ record.message }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QCard>
    </QItemSection>
  </QItem>
</template>

<style scoped>
.btn-translation {
  transform: translateY(-10px) translateX(12px);
}
</style>
