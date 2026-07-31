export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const { id, path } = await readBody(event)

  const response = await $fetch(`${apiBaseUrl}/api/resolve_exposure_path`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
    body: JSON.stringify({
      id: { Aliased: id },
      path,
    }),
  })

  return response
})
