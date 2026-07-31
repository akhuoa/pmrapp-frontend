export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const githubAuthApi = config.public.githubAuthApi
  const token = getHeader(event, 'authorization')

  const response = await $fetch(`${githubAuthApi}/api/auth/revoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
      ...(token && { Authorization: token }),
    },
  })

  return response
})
