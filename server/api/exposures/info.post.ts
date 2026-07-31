export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const { alias } = await readBody(event)

  const response = await $fetch(`${apiBaseUrl}/api/get_exposure_info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
    body: JSON.stringify({
      id: { Aliased: alias },
    }),
  })

  return response
})
