<script setup lang="ts">
import type { Role } from '@blog-engine/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthClient()
const config = useRuntimeConfig()
const { data: me, refresh } = await useMe()

interface NavItem {
  label: string
  to: string
  icon: string
  minRole?: Role
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: 'i-lucide-layout-dashboard' },
  { label: 'Posts', to: '/posts', icon: 'i-lucide-file-text' },
  { label: 'Pages', to: '/pages', icon: 'i-lucide-layout' },
  { label: 'Media', to: '/media', icon: 'i-lucide-image' },
  { label: 'Users', to: '/users', icon: 'i-lucide-users', minRole: 'editor' },
  { label: 'Audit log', to: '/audit', icon: 'i-lucide-history', minRole: 'admin' },
  { label: 'Settings', to: '/settings', icon: 'i-lucide-settings', minRole: 'admin' },
]

const visibleNav = computed(() => {
  const userRole = me.value?.user?.role
  if (!userRole) return []
  const rank: Record<Role, number> = { admin: 3, editor: 2, author: 1 }
  return navItems.filter((item) => {
    if (!item.minRole) return true
    return rank[userRole] >= rank[item.minRole]
  })
})

async function handleLogout() {
  await auth.signOut()
  await refresh()
  await router.push('/login')
}

const userMenuItems = computed(() => [
  [
    {
      label: me.value?.user?.email ?? '',
      slot: 'account' as const,
      disabled: true,
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-lucide-log-out',
      onSelect: handleLogout,
    },
  ],
])
</script>

<template>
  <div class="min-h-screen flex bg-(--ui-bg-muted)">
    <aside class="w-64 shrink-0 border-r border-(--ui-border) bg-(--ui-bg) flex flex-col">
      <div class="h-14 flex items-center px-4 border-b border-(--ui-border)">
        <NuxtLink to="/" class="font-semibold tracking-tight">
          {{ config.public.cmsName }}
        </NuxtLink>
      </div>

      <nav class="flex-1 p-2 space-y-1">
        <UButton
          v-for="item in visibleNav"
          :key="item.to"
          :to="item.to"
          :icon="item.icon"
          :label="item.label"
          :color="route.path === item.to ? 'primary' : 'neutral'"
          :variant="route.path === item.to ? 'soft' : 'ghost'"
          block
          class="justify-start"
        />
      </nav>

      <div class="p-3 border-t border-(--ui-border)">
        <UDropdownMenu :items="userMenuItems">
          <UButton
            color="neutral"
            variant="ghost"
            block
            class="justify-start"
          >
            <UAvatar
              :alt="me?.user?.name ?? '?'"
              size="xs"
            />
            <span class="flex-1 text-left truncate ml-2">{{ me?.user?.name }}</span>
            <UIcon name="i-lucide-chevrons-up-down" class="text-(--ui-text-muted)" />
          </UButton>
        </UDropdownMenu>
      </div>
    </aside>

    <main class="flex-1 min-w-0 flex flex-col">
      <slot />
    </main>
  </div>
</template>
