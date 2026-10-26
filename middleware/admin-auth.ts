export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  try {
    const res = await $fetch<{ authenticated: boolean }>('/api/admin/me', { headers })
    if (!res?.authenticated) {
      return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})
