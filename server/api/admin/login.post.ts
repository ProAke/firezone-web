import { setAdminSessionCookie, verifyPassword } from '../../utils/auth'
import { getDb } from '../../utils/db'
import { enforceRateLimit, verifySameOriginRequest } from '../../utils/security'

export default defineEventHandler(async (event) => {
  verifySameOriginRequest(event)
  enforceRateLimit(event, 'admin-login', 8, 1000 * 60 * 15)

  const body = await readBody(event)
  const username = String(body?.username || '').trim().slice(0, 64)
  const password = String(body?.password || '')

  if (!username || !password || password.length > 256) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ถูกต้อง'
    })
  }

  const db = getDb()
  const admin = db
    .prepare('SELECT id, username, password_hash as passwordHash FROM admins WHERE username = ?')
    .get(username) as { id: number; username: string; passwordHash: string } | undefined

  // Always run scrypt verification even if admin is undefined to prevent timing username enumeration
  const passwordOk = verifyPassword(password, admin?.passwordHash)
  if (!admin || !passwordOk) {
    throw createError({
      statusCode: 401,
      statusMessage: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
    })
  }

  setAdminSessionCookie(event, admin.username, admin.passwordHash)
  return {
    ok: true,
    user: { username: admin.username }
  }
})
