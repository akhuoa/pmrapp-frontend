export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const githubAuthApi = config.public.githubAuthApi
  const { code } = await readBody(event)

  try {
    const response = await $fetch(`${githubAuthApi}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
      body: JSON.stringify({ code }),
    })

    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'GitHub authentication failed',
    })
  }
})
