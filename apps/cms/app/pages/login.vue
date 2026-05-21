<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const route = useRoute()
const router = useRouter()
const auth = useAuthClient()
const toast = useToast()
const { refresh } = await useMe()

const email = ref('')
const password = ref('')
const submitting = ref(false)

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    const { error } = await auth.signIn.email({
      email: email.value,
      password: password.value,
    })
    if (error) {
      toast.add({
        title: 'Sign in failed',
        description: error.message ?? 'Invalid credentials',
        color: 'error',
      })
      return
    }
    await refresh()
    const redirect = (route.query.redirect as string | undefined) ?? '/'
    await router.push(redirect)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <h1 class="text-lg font-semibold">Sign in</h1>
    </template>

    <form class="space-y-4" @submit.prevent="submit">
      <UFormField label="Email" required>
        <UInput
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" required>
        <UInput
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        :loading="submitting"
        :disabled="!email || !password"
      >
        Sign in
      </UButton>
    </form>
  </UCard>
</template>
