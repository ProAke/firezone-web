import { getDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const name = String(body?.name || '').trim().slice(0, 120)
  const phone = String(body?.phone || '').trim().slice(0, 60)
  const email = String(body?.email || '').trim().slice(0, 120)
  const company = String(body?.company || '').trim().slice(0, 150)
  const subject = String(body?.subject || '').trim().slice(0, 200)
  const productName = String(body?.productName || '').trim().slice(0, 200)
  const message = String(body?.message || '').trim().slice(0, 3000)

  if (!name || !phone || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณากรอกชื่อ เบอร์โทรศัพท์ และรายละเอียดที่ต้องการติดต่อ'
    })
  }

  const db = getDb()
  const now = new Date().toISOString()

  const res = db
    .prepare(`
      INSERT INTO inquiries (name, phone, email, company, subject, product_name, message, status, admin_note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new', '', ?)
    `)
    .run(name, phone, email, company, subject, productName, message, now)

  return {
    ok: true,
    id: Number(res.lastInsertRowid),
    message: 'ส่งข้อความติดต่อเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด'
  }
})
