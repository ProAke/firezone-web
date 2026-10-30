import { requireAdmin } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = getDb()
  const query = getQuery(event)
  const status = String(query.status || '').trim()

  const sqlBase = `
    SELECT
      id,
      name,
      phone,
      email,
      company,
      subject,
      product_name as productName,
      message,
      line_id as lineId,
      line_user_id as lineUserId,
      line_display_name as lineDisplayName,
      line_picture_url as linePictureUrl,
      line_verified as lineVerified,
      attachments_json as attachmentsJson,
      pdpa_consent as pdpaConsent,
      notify_email_status as notifyEmailStatus,
      notify_line_status as notifyLineStatus,
      status,
      admin_note as adminNote,
      created_at as createdAt
    FROM inquiries
  `

  const rows = (
    status
      ? db.prepare(`${sqlBase} WHERE status = ? ORDER BY id DESC`).all(status)
      : db.prepare(`${sqlBase} ORDER BY id DESC`).all()
  ) as Array<Record<string, any>>

  const items = rows.map((r) => {
    let attachments = []
    try {
      attachments = JSON.parse(r.attachmentsJson || '[]')
    } catch {
      attachments = []
    }
    return {
      ...r,
      attachments
    }
  })

  return { items }
})
