export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const kind = getRouterParam(event, 'kind')

  const response = await $fetch(`${apiBaseUrl}/api/index/${encodeURIComponent(kind as string)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
  })

  return response
})
