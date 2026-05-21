export default defineEventHandler((event) => {
  const auth = useServerAuth()
  return auth.handler(toWebRequest(event))
})
