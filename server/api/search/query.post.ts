export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const payload = await readBody(event)

  const response = await $fetch(`${apiBaseUrl}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
    body: JSON.stringify(payload),
  })

  return response
})
