import { clearAdminSessionCookie } from '../../utils/auth'

export default defineEventHandler((event) => {
  clearAdminSessionCookie(event)
  return { ok: true }
})
