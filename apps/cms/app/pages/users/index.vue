<script setup lang="ts">
import { ROLES, type Role, hasRole } from '@blog-engine/auth'

interface UserRow {
  id: string
  email: string
  name: string
  role: Role
  image: string | null
  createdAt: string
}

interface InviteRow {
  id: string
  email: string
  role: Role
  invitedByName: string | null
  invitedByEmail: string | null
  expiresAt: string
  createdAt: string
}

const toast = useToast()
const { data: me } = await useMe()
const isAdmin = computed(() => hasRole(me.value?.user?.role, 'admin'))

const { data: usersData, refresh: refreshUsers } = await useFetch<{ users: UserRow[] }>(
  '/api/users',
  { default: () => ({ users: [] }) },
)
const { data: invitesData, refresh: refreshInvites } = await useFetch<{ invites: InviteRow[] }>(
  '/api/invites',
  { default: () => ({ invites: [] }), server: false },
)

const inviteOpen = ref(false)
const inviteEmail = ref('')
const inviteRole = ref<Role>('author')
const inviteSubmitting = ref(false)

const roleOptions = ROLES.map((r) => ({ label: r, value: r }))

async function submitInvite() {
  if (inviteSubmitting.value) return
  inviteSubmitting.value = true
  try {
    await $fetch('/api/invites', {
      method: 'POST',
      body: { email: inviteEmail.value, role: inviteRole.value },
    })
    toast.add({ title: 'Invite sent', color: 'success' })
    inviteEmail.value = ''
    inviteRole.value = 'author'
    inviteOpen.value = false
    await refreshInvites()
  } catch (err) {
    const e = err as { data?: { statusMessage?: string }; statusMessage?: string }
    toast.add({
      title: 'Could not send invite',
      description: e.data?.statusMessage ?? e.statusMessage ?? 'Unknown error',
      color: 'error',
    })
  } finally {
    inviteSubmitting.value = false
  }
}

async function updateRole(userId: string, role: Role) {
  try {
    await $fetch(`/api/users/${userId}`, { method: 'PATCH', body: { role } })
    toast.add({ title: 'Role updated', color: 'success' })
    await refreshUsers()
  } catch {
    toast.add({ title: 'Failed to update role', color: 'error' })
  }
}

async function removeUser(userId: string, email: string) {
  if (!confirm(`Remove ${email}? This cannot be undone.`)) return
  try {
    await $fetch(`/api/users/${userId}`, { method: 'DELETE' })
    toast.add({ title: 'User removed', color: 'success' })
    await refreshUsers()
  } catch (err) {
    const e = err as { data?: { statusMessage?: string } }
    toast.add({
      title: 'Failed to remove user',
      description: e.data?.statusMessage,
      color: 'error',
    })
  }
}

async function revokeInvite(id: string) {
  try {
    await $fetch(`/api/invites/${id}`, { method: 'DELETE' })
    toast.add({ title: 'Invite revoked', color: 'success' })
    await refreshInvites()
  } catch {
    toast.add({ title: 'Failed to revoke invite', color: 'error' })
  }
}
</script>

<template>
  <div>
    <header class="h-14 border-b border-(--ui-border) bg-(--ui-bg) px-6 flex items-center justify-between">
      <h1 class="font-semibold">Users</h1>
      <UButton
        v-if="isAdmin"
        icon="i-lucide-user-plus"
        label="Invite user"
        @click="inviteOpen = true"
      />
    </header>

    <div class="p-6 space-y-8">
      <section>
        <h2 class="text-sm font-medium text-(--ui-text-muted) mb-3">Members ({{ usersData.users.length }})</h2>
        <UCard :ui="{ body: 'p-0 sm:p-0' }">
          <table class="w-full text-sm">
            <thead class="text-left text-(--ui-text-muted) border-b border-(--ui-border)">
              <tr>
                <th class="px-4 py-3 font-medium">Name</th>
                <th class="px-4 py-3 font-medium">Email</th>
                <th class="px-4 py-3 font-medium">Role</th>
                <th class="px-4 py-3 font-medium w-px" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in usersData.users"
                :key="u.id"
                class="border-b border-(--ui-border) last:border-b-0"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <UAvatar :alt="u.name" size="xs" />
                    <span>{{ u.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-(--ui-text-muted)">{{ u.email }}</td>
                <td class="px-4 py-3">
                  <USelectMenu
                    v-if="isAdmin && u.id !== me?.user?.id"
                    :model-value="u.role"
                    :items="roleOptions"
                    value-key="value"
                    class="w-32"
                    @update:model-value="(val: Role) => updateRole(u.id, val)"
                  />
                  <UBadge v-else color="neutral" variant="subtle">{{ u.role }}</UBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <UButton
                    v-if="isAdmin && u.id !== me?.user?.id"
                    icon="i-lucide-trash-2"
                    color="error"
                    variant="ghost"
                    size="sm"
                    @click="removeUser(u.id, u.email)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </UCard>
      </section>

      <section v-if="isAdmin">
        <h2 class="text-sm font-medium text-(--ui-text-muted) mb-3">
          Pending invites ({{ invitesData.invites.length }})
        </h2>
        <UCard v-if="invitesData.invites.length" :ui="{ body: 'p-0 sm:p-0' }">
          <table class="w-full text-sm">
            <thead class="text-left text-(--ui-text-muted) border-b border-(--ui-border)">
              <tr>
                <th class="px-4 py-3 font-medium">Email</th>
                <th class="px-4 py-3 font-medium">Role</th>
                <th class="px-4 py-3 font-medium">Invited by</th>
                <th class="px-4 py-3 font-medium">Expires</th>
                <th class="px-4 py-3 font-medium w-px" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="i in invitesData.invites"
                :key="i.id"
                class="border-b border-(--ui-border) last:border-b-0"
              >
                <td class="px-4 py-3">{{ i.email }}</td>
                <td class="px-4 py-3"><UBadge variant="subtle">{{ i.role }}</UBadge></td>
                <td class="px-4 py-3 text-(--ui-text-muted)">{{ i.invitedByName }}</td>
                <td class="px-4 py-3 text-(--ui-text-muted)">
                  {{ new Date(i.expiresAt).toLocaleDateString() }}
                </td>
                <td class="px-4 py-3 text-right">
                  <UButton
                    icon="i-lucide-x"
                    variant="ghost"
                    size="sm"
                    @click="revokeInvite(i.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </UCard>
        <p v-else class="text-sm text-(--ui-text-muted)">No pending invites.</p>
      </section>
    </div>

    <UModal v-model:open="inviteOpen" title="Invite user">
      <template #body>
        <form class="space-y-4" @submit.prevent="submitInvite">
          <UFormField label="Email" required>
            <UInput
              v-model="inviteEmail"
              type="email"
              placeholder="someone@example.com"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField label="Role" required>
            <USelectMenu
              v-model="inviteRole"
              :items="roleOptions"
              value-key="value"
              class="w-full"
            />
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton color="neutral" variant="ghost" @click="inviteOpen = false">Cancel</UButton>
            <UButton type="submit" :loading="inviteSubmitting">Send invite</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>
