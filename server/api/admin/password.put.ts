import { hashPassword, requireAdmin, verifyPassword } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const user = requireAdmin(event)
  const body = await readBody(event)

  const currentPassword = String(body?.currentPassword || '')
  const newPassword = String(body?.newPassword || '')

  if (!currentPassword || newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
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

  db.prepare('UPDATE admins SET password_hash = ?, updated_at = ? WHERE id = ?').run(
    hashPassword(newPassword),
    new Date().toISOString(),
    admin.id
  )

  return { ok: true }
})
