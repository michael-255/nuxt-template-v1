<script setup lang="ts">
const logger = useLogger()
</script>

<template>
  <div>Login</div>
  <div>
    <QBtn
      label="Logging"
      color="primary"
      @click="logger.warn('Really Large and Wide Notification!')"
    />
  </div>
</template>
