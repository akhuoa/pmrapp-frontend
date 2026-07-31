export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const token = getHeader(event, 'authorization')

  const response = await $fetch(`${apiBaseUrl}/api/sign_out`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
      ...(token && { Authorization: token }),
    },
  })

  return response
})
