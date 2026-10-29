import { setAdminSessionCookie, verifyPassword } from '../../utils/auth'
import { getDb } from '../../utils/db'
import { enforceRateLimit } from '../../utils/security'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, 'admin-login', 8, 1000 * 60 * 15)

  const body = await readBody(event)
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
    })
  }

  const db = getDb()
  const admin = db
    .prepare('SELECT id, username, password_hash as passwordHash FROM admins WHERE username = ?')
    .get(username) as { id: number; username: string; passwordHash: string } | undefined

  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
    })
  }

  setAdminSessionCookie(event, admin.username)
  return {
    ok: true,
    user: { username: admin.username }
  }
})
