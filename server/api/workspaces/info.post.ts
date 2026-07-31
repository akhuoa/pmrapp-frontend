export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const { alias, commitId, path } = await readBody(event)

  const response = await $fetch(`${apiBaseUrl}/api/get_workspace_info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
    body: JSON.stringify({
      id: { Aliased: alias },
      commit_id: commitId || '',
      path: path || '',
    }),
  })

  return response
})
