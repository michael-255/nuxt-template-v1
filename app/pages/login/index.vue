<script setup lang="ts">
const toast = useToast()

onMounted(async () => {
  toast.add({
    title: 'Hello World!',
    description: 'Testing.',
    icon: 'material-symbols:info-outline-rounded',
  })
})

function generateTimeOptions() {
  const times: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = ((h + 11) % 12) + 1 // 12-hour format
      const minute = m.toString().padStart(2, '0')
      const ampm = h < 12 ? 'AM' : 'PM'
      times.push(`${hour.toString().padStart(2, '0')}:${minute} ${ampm}`)
    }
  }
  return times
}

const items = ref(generateTimeOptions())
const value = ref(items.value[0])
</script>

<template>
  <UContainer>
    <div>
      <USelect v-model="value" :items="items" class="w-48" />
    </div>
  </UContainer>
</template>
