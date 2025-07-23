<script setup lang="ts">
import { cancelIcon } from '#shared/constants'
import { limitRuleLookup } from '#shared/utils/utils'

const localRecordStore = useLocalRecordStore()
</script>

<template>
  <DialogFormItem label="Message">
    <QItemLabel>
      <QInput
        v-model="localRecordStore.record.message"
        :rules="[
          (val: string) =>
            !val ||
            val.length <= limitRuleLookup.maxTextArea ||
            `Messages cannot exceed ${limitRuleLookup.maxTextArea} characters`,
        ]"
        :maxlength="limitRuleLookup.maxTextArea"
        type="textarea"
        lazy-rules
        autogrow
        counter
        dense
        outlined
        color="primary"
        @blur="localRecordStore.record.message = localRecordStore.record?.message?.trim()"
      >
        <template #append>
          <QIcon
            v-if="localRecordStore.record.message && localRecordStore.record.message !== ''"
            class="cursor-pointer"
            :name="cancelIcon"
            @click="localRecordStore.record.message = ''"
          />
        </template>
      </QInput>
    </QItemLabel>
  </DialogFormItem>
</template>
