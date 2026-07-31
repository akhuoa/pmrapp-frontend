export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const credentials = await readBody(event)

  try {
    const response = await $fetch<string>(`${apiBaseUrl}/api/bearer/from_login_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify(credentials),
      responseType: 'text',
    })

    return { token: response }
  } catch (error: any) {
    const status = error.response?.status || 500
    const errorText = error.data || error.message || ''

    throw createError({
      statusCode: status,
      message: errorText,
    })
  }
})
