<script setup lang="ts">
const config = useRuntimeConfig()
const siteName = config.public.siteName
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="max-w-2xl text-center space-y-4">
      <UBadge color="primary" variant="subtle">Phase 0</UBadge>
      <h1 class="text-4xl font-bold tracking-tight">
        {{ siteName }}
      </h1>
      <p class="text-lg text-(--ui-text-muted)">
        Public blog scaffold is up. Themes, posts and the page builder land in the next phases.
      </p>
    </div>
  </div>
</template>
