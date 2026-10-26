import { requireAdmin } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = getDb()
  const query = getQuery(event)
  const status = String(query.status || '').trim()

  const items = status
    ? db
        .prepare(
          `SELECT id, name, phone, email, company, subject, product_name as productName, message, status, admin_note as adminNote, created_at as createdAt
           FROM inquiries WHERE status = ? ORDER BY id DESC`
        )
        .all(status)
    : db
        .prepare(
          `SELECT id, name, phone, email, company, subject, product_name as productName, message, status, admin_note as adminNote, created_at as createdAt
           FROM inquiries ORDER BY id DESC`
        )
        .all()

  return { items }
})
