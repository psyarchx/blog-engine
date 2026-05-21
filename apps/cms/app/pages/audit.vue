<script setup lang="ts">
interface Entry {
  id: string
  userId: string | null
  userName: string | null
  userEmail: string | null
  action: string
  entityType: string
  entityId: string | null
  diff: unknown
  at: string
}

const { data } = await useFetch<{ entries: Entry[] }>('/api/audit', {
  default: () => ({ entries: [] }),
})

function format(at: string) {
  return new Date(at).toLocaleString()
}
</script>

<template>
  <div>
    <header class="h-14 border-b border-(--ui-border) bg-(--ui-bg) px-6 flex items-center">
      <h1 class="font-semibold">Audit log</h1>
    </header>

    <div class="p-6">
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <table class="w-full text-sm">
          <thead class="text-left text-(--ui-text-muted) border-b border-(--ui-border)">
            <tr>
              <th class="px-4 py-3 font-medium">When</th>
              <th class="px-4 py-3 font-medium">Actor</th>
              <th class="px-4 py-3 font-medium">Action</th>
              <th class="px-4 py-3 font-medium">Entity</th>
              <th class="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in data.entries"
              :key="e.id"
              class="border-b border-(--ui-border) last:border-b-0"
            >
              <td class="px-4 py-3 text-(--ui-text-muted) whitespace-nowrap">
                {{ format(e.at) }}
              </td>
              <td class="px-4 py-3">
                <div v-if="e.userName">
                  <div>{{ e.userName }}</div>
                  <div class="text-xs text-(--ui-text-muted)">{{ e.userEmail }}</div>
                </div>
                <span v-else class="text-(--ui-text-muted)">system</span>
              </td>
              <td class="px-4 py-3"><UBadge variant="subtle">{{ e.action }}</UBadge></td>
              <td class="px-4 py-3 text-(--ui-text-muted)">
                {{ e.entityType }}<span v-if="e.entityId" class="text-(--ui-text-dimmed)"> · {{ e.entityId.slice(0, 8) }}</span>
              </td>
              <td class="px-4 py-3">
                <code v-if="e.diff" class="text-xs text-(--ui-text-muted)">
                  {{ JSON.stringify(e.diff) }}
                </code>
              </td>
            </tr>
            <tr v-if="!data.entries.length">
              <td colspan="5" class="px-4 py-8 text-center text-(--ui-text-muted)">
                No audit entries yet.
              </td>
            </tr>
          </tbody>
        </table>
      </UCard>
    </div>
  </div>
</template>
