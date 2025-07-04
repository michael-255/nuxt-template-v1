<script setup lang="ts">
import { useSupabaseClient } from '#imports'
import { QBtn, QInput } from 'quasar'
import { ref } from 'vue'
import { appTitle } from '~~/shared/constants'

const logger = useLogger()
const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  error.value = ''
  loading.value = true

  try {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (loginError) {
      logger.error(loginError.message, loginError)
    } else {
      logger.info('Login successful')
      // TODO - Redirect here?
    }
  } catch (error) {
    logger.error('Unexpected login error', error as Error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-center form-container">
    <QForm class="q-pa-lg form-extra" @submit.prevent="login">
      <h4>{{ appTitle }}</h4>

      <div class="text-h5 q-mb-lg">Login</div>

      <QInput
        v-model="email"
        label="Email"
        type="email"
        outlined
        autofocus
        :disable="loading"
        class="q-mb-md"
      />

      <QInput
        v-model="password"
        label="Password"
        type="password"
        outlined
        :disable="loading"
        class="q-mb-md"
      />

      <div v-if="error" class="text-negative q-mb-md">{{ error }}</div>

      <QBtn
        label="Login"
        color="primary"
        :loading="loading"
        :disable="loading"
        type="submit"
        class="q-mt-md full-width"
      />
    </QForm>
  </div>
</template>

<style scoped>
.form-container {
  min-height: 80vh;
}

.form-extra {
  max-width: 400px;
  width: 100%;
}
</style>
