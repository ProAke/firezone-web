import { enforceRateLimit } from '../../utils/security'
import { setLineProfileCookie } from '../../utils/line-session'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, 'line-quick-connect', 15, 1000 * 60 * 10)
  const body = await readBody(event)

  const lineId = String(body?.lineId || '').trim().slice(0, 80)
  const displayName = String(body?.displayName || lineId).trim().slice(0, 80)

  if (!lineId || !/^[a-zA-Z0-9._\-@]{2,80}$/.test(lineId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณาระบุ LINE ID ให้ถูกต้อง (ตัวอักษรภาษาอังกฤษ ตัวเลข จุด ขีดกลาง หรือ _)'
    })
  }

  const profile = {
    userId: '',
    lineId,
    displayName: displayName || lineId,
    pictureUrl: '',
    verified: 2
  }

  setLineProfileCookie(event, profile)
  return { ok: true, profile }
})
