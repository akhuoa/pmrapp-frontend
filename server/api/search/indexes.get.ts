export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const response = await $fetch(`${apiBaseUrl}/api/index`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
  })

  return response
})
