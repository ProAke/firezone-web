import { clearLineProfileCookie } from '../../utils/line-session'
import { verifySameOriginRequest } from '../../utils/security'

export default defineEventHandler((event) => {
  verifySameOriginRequest(event)
  clearLineProfileCookie(event)
  return { ok: true }
})
