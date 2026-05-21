export default defineEventHandler(async (event) => {
  const session = await getAuthSession(event)
  if (!session) return { user: null }
  return {
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
    },
  }
})
