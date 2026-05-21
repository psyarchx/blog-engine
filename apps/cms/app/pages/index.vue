<script setup lang="ts">
const { data: me } = await useMe()
</script>

<template>
  <div>
    <header class="h-14 border-b border-(--ui-border) bg-(--ui-bg) px-6 flex items-center">
      <h1 class="font-semibold">Dashboard</h1>
    </header>

    <div class="p-6 space-y-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-medium">Welcome, {{ me?.user?.name }}</h2>
            <UBadge color="warning" variant="subtle">Phase 1</UBadge>
          </div>
        </template>

        <p class="text-(--ui-text-muted)">
          Auth is live. Posts, media and the page builder land in the next phases.
        </p>
      </UCard>
    </div>
  </div>
</template>
