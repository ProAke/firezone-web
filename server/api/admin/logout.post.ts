import { clearAdminSessionCookie } from '../../utils/auth'
import { verifySameOriginRequest } from '../../utils/security'

export default defineEventHandler((event) => {
  verifySameOriginRequest(event)
  clearAdminSessionCookie(event)
  return { ok: true }
})
