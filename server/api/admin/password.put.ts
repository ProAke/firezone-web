import { hashPassword, requireAdmin, setAdminSessionCookie, verifyPassword } from '../../utils/auth'
import { getDb } from '../../utils/db'
import { enforceRateLimit } from '../../utils/security'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, 'admin-password-change', 5, 1000 * 60 * 15)
  const user = requireAdmin(event)
  const body = await readBody(event)

  const currentPassword = String(body?.currentPassword || '')
  const newPassword = String(body?.newPassword || '')

  if (!currentPassword || newPassword.length < 8 || newPassword.length > 256) {
    throw createError({
      statusCode: 400,
      statusMessage: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร'
    })
  }

  const db = getDb()
  const admin = db
    .prepare('SELECT id, password_hash as passwordHash FROM admins WHERE username = ?')
    .get(user.username) as { id: number; passwordHash: string } | undefined

  if (!admin || !verifyPassword(currentPassword, admin.passwordHash)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
    })
  }

  const nextHash = hashPassword(newPassword)
  db.prepare('UPDATE admins SET password_hash = ?, updated_at = ? WHERE id = ?').run(
    nextHash,
    new Date().toISOString(),
    admin.id
  )

  // Rotate session cookie with new passwordHash fingerprint (revokes all previous sessions on other devices)
  setAdminSessionCookie(event, user.username, nextHash)

  return { ok: true }
})
