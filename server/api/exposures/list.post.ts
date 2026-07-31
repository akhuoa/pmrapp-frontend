export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  const response = await $fetch(`${apiBaseUrl}/api/list_aliased_exposures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
  })

  return response
})
