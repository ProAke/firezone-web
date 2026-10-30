import { requireAdmin } from '../../utils/auth'
import { getAllSettingsMap, getDb } from '../../utils/db'
import {
  sendInquiryEmailNotification,
  sendInquiryLineOaNotification
} from '../../utils/notifier'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const channel = String(body?.channel || 'both')

  const db = getDb()
  const settings = getAllSettingsMap(db)
  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const siteOrigin = `${proto}://${host}`

  const sampleInquiry = {
    id: 9999,
    name: 'ทดสอบระบบแจ้งเตือน (Admin Test)',
    phone: settings.phone1 || '086-363-5495',
    email: settings.email || 'fire_zone@hotmail.com',
    company: 'FIRESZONE CMS',
    subject: 'ทดสอบการเชื่อมต่อ Email & LINE OA',
    productName: 'Notifier NFS-320',
    message: 'ข้อความทดสอบจากหน้าตั้งค่าระบบหลังบ้าน FIRESZONE CMS',
    lineId: settings.lineId || '0864492598',
    lineUserId: '',
    lineDisplayName: 'Admin Test',
    lineVerified: 1,
    attachments: [],
    createdAt: new Date().toISOString()
  }

  const emailResult =
    channel === 'email' || channel === 'both'
      ? await sendInquiryEmailNotification(sampleInquiry, settings, siteOrigin)
      : 'skipped'
  const lineResult =
    channel === 'line' || channel === 'both'
      ? await sendInquiryLineOaNotification(sampleInquiry, settings, siteOrigin)
      : 'skipped'

  return {
    ok: true,
    emailResult,
    lineResult
  }
})
