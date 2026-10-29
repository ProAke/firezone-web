import { clearLineProfileCookie } from '../../utils/line-session'

export default defineEventHandler((event) => {
  clearLineProfileCookie(event)
  return { ok: true }
})
