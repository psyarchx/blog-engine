<script setup lang="ts">
const config = useRuntimeConfig()
const cmsName = config.public.cmsName
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <UCard class="max-w-xl w-full">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">{{ cmsName }}</h1>
          <UBadge color="warning" variant="subtle">Phase 0</UBadge>
        </div>
      </template>

      <p class="text-(--ui-text-muted)">
        Admin scaffold is ready. Auth, users, posts and the page builder will land in the next phases.
      </p>
    </UCard>
  </div>
</template>
