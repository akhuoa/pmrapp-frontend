export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const kind = getRouterParam(event, 'kind')
  const term = getRouterParam(event, 'term')

  const response = await $fetch(
    `${apiBaseUrl}/api/index/${encodeURIComponent(kind as string)}/${encodeURIComponent(term as string)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
      },
    },
  )

  return response
})
