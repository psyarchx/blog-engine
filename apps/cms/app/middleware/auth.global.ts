const PUBLIC_PATHS = ['/login']
const PUBLIC_PREFIXES = ['/accept-invite/']

function isPublic(path: string) {
  if (PUBLIC_PATHS.includes(path)) return true
  return PUBLIC_PREFIXES.some((p) => path.startsWith(p))
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (isPublic(to.path)) return

  const { data } = await useMe()
  if (!data.value?.user) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
