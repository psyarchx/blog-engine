<script setup lang="ts">
import type { Role } from '@blog-engine/auth'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthClient()
const { refresh: refreshMe } = await useMe()

const token = route.params.token as string

interface Invite {
  id: string
  email: string
  role: Role
  expiresAt: string
}

const { data, error } = await useFetch<{ invite: Invite }>(`/api/invites/token/${token}`)

const name = ref('')
const password = ref('')
const submitting = ref(false)

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch('/api/invites/accept', {
      method: 'POST',
      body: { token, name: name.value, password: password.value },
    })
    // Sign the user in to establish a session.
    await auth.signIn.email({ email: data.value!.invite.email, password: password.value })
    await refreshMe()
    toast.add({ title: 'Welcome aboard', color: 'success' })
    await router.push('/')
  } catch (err) {
    const e = err as { data?: { statusMessage?: string }; statusMessage?: string }
    toast.add({
      title: 'Could not accept invite',
      description: e.data?.statusMessage ?? e.statusMessage ?? 'Unknown error',
      color: 'error',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <h1 class="text-lg font-semibold">Accept invite</h1>
    </template>

    <div v-if="error" class="space-y-2">
      <p class="text-sm text-(--ui-color-error-500)">
        {{ error.statusMessage ?? 'This invite is no longer valid.' }}
      </p>
      <UButton to="/login" variant="ghost" block>Go to sign in</UButton>
    </div>

    <form v-else-if="data?.invite" class="space-y-4" @submit.prevent="submit">
      <p class="text-sm text-(--ui-text-muted)">
        Setting up the account for
        <span class="font-medium text-(--ui-text)">{{ data.invite.email }}</span>
        as <UBadge variant="subtle">{{ data.invite.role }}</UBadge>
      </p>

      <UFormField label="Your name" required>
        <UInput v-model="name" required class="w-full" />
      </UFormField>

      <UFormField label="Choose a password" required>
        <UInput
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
          minlength="8"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="submitting" :disabled="!name || password.length < 8">
        Create account
      </UButton>
    </form>
  </UCard>
</template>
