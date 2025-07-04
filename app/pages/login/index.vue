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

async function login() {
  try {
    loading.value = true

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
        class="q-mb-md"
        :rules="[
          (val: string) => emailSchema.safeParse(val).success || 'Must be a valid email address',
        ]"
        :disable="loading"
      />

      <QInput
        v-model="password"
        label="Password"
        type="password"
        outlined
        class="q-mb-md"
        :rules="[(val: string) => !!val || 'Password is required']"
        :disable="loading"
      />

      <QBtn
        label="Login"
        color="primary"
        type="submit"
        class="q-mt-md full-width"
        :loading="loading"
        :disable="loading"
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
