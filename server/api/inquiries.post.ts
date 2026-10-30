import { mkdirSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { join } from 'node:path'
import { getEffectiveSessionSecret } from '../utils/auth'
import { getAllSettingsMap, getDb } from '../utils/db'
import { getLineProfileCookie } from '../utils/line-session'
import {
  sendInquiryEmailNotification,
  sendInquiryLineOaNotification
} from '../utils/notifier'
import {
  detectSpamText,
  enforceRateLimit,
  getClientIp,
  MAX_INQUIRY_FILES,
  signInquiryAttachmentUrl,
  validateInquiryFile,
  verifySameOriginRequest,
  verifySpamChallenge
} from '../utils/security'

export default defineEventHandler(async (event) => {
  verifySameOriginRequest(event)
  // 1. IP Rate Limit: max 6 submissions per 10 minutes per IP
  enforceRateLimit(event, 'inquiry-submit', 6, 1000 * 60 * 10)

  const contentType = getHeader(event, 'content-type') || ''
  const fields: Record<string, string> = {}
  const rawFiles: Array<{ filename: string; data: Buffer }> = []

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    if (!parts) {
      throw createError({ statusCode: 400, statusMessage: 'รูปแบบข้อมูลที่ส่งไม่ถูกต้อง' })
    }
    for (const part of parts) {
      if (part.filename && part.data && part.data.length > 0) {
        rawFiles.push({ filename: part.filename, data: part.data })
      } else if (part.name) {
        fields[part.name] = part.data.toString('utf8')
      }
    }
  } else {
    const body = await readBody(event)
    if (body && typeof body === 'object') {
      for (const [k, v] of Object.entries(body)) {
        fields[k] = v == null ? '' : String(v)
      }
    }
  }

  // 2. Honeypot Anti-Bot Check (hidden field must remain empty)
  if ((fields.websiteUrl || fields.website_url || '').trim() !== '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'ระบบตรวจพบการทำงานอัตโนมัติ (Spam Blocked)'
    })
  }

  // 3. Anti-Spam Challenge Verification
  const sessionSecret = getEffectiveSessionSecret(event)
  const challengeResult = verifySpamChallenge(
    fields.challengeToken || '',
    fields.challengeAnswer || '',
    sessionSecret
  )
  if (!challengeResult.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: challengeResult.reason || 'การยืนยันป้องกันสแปมไม่ผ่าน'
    })
  }

  // 4. Optional Cloudflare Turnstile Verification (if configured in Admin Settings)
  const db = getDb()
  const settings = getAllSettingsMap(db)
  if (settings.turnstileSiteKey && settings.turnstileSecretKey) {
    const cfToken = (fields.turnstileToken || '').trim()
    if (!cfToken) {
      throw createError({ statusCode: 400, statusMessage: 'กรุณายืนยันตัวตน Cloudflare Turnstile' })
    }
    try {
      const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: settings.turnstileSecretKey,
          response: cfToken,
          remoteip: getClientIp(event)
        })
      })
      const cfJson = (await cfRes.json()) as { success?: boolean }
      if (!cfJson.success) {
        throw createError({ statusCode: 400, statusMessage: 'การยืนยัน Turnstile ไม่ผ่าน' })
      }
    } catch (err: any) {
      if (err?.statusCode) throw err
    }
  }

  // 5. Required Fields & PDPA Consent Check
  const name = (fields.name || '').trim().slice(0, 120)
  const phone = (fields.phone || '').trim().slice(0, 60)
  const email = (fields.email || '').trim().slice(0, 120)
  const company = (fields.company || '').trim().slice(0, 150)
  const subject = (fields.subject || '').trim().slice(0, 200)
  const productName = (fields.productName || '').trim().slice(0, 200)
  const message = (fields.message || '').trim().slice(0, 3000)
  const manualLineId = (fields.lineId || '').trim().slice(0, 80)
  const pdpaConsent = fields.pdpaConsent === '1' || fields.pdpaConsent === 'true' ? 1 : 0

  if (!name || !phone || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณากรอกชื่อ เบอร์โทรศัพท์ และรายละเอียดที่ต้องการติดต่อ'
    })
  }

  if (settings.pdpaEnabled !== '0' && !pdpaConsent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'กรุณายอมรับนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ก่อนส่งข้อมูล'
    })
  }

  // 6. Spam Keyword / Casino Link Filter
  const combinedText = `${name} ${company} ${subject} ${productName} ${message}`
  const spamReason = detectSpamText(combinedText)
  if (spamReason) {
    throw createError({ statusCode: 400, statusMessage: spamReason })
  }

  // 7. File Attachments Validation (Max 5 files, PDF & Photos only, magic-byte checked)
  if (rawFiles.length > MAX_INQUIRY_FILES) {
    throw createError({
      statusCode: 400,
      statusMessage: `แนบไฟล์ได้สูงสุดไม่เกิน ${MAX_INQUIRY_FILES} ไฟล์`
    })
  }

  const savedAttachments: Array<{
    name: string
    url: string
    mimeType: string
    size: number
    diskName: string
  }> = []

  if (rawFiles.length > 0) {
    const destDir = join(process.cwd(), 'data', 'uploads', 'inquiries')
    mkdirSync(destDir, { recursive: true })

    for (const rf of rawFiles) {
      const validated = validateInquiryFile(rf.filename, rf.data)
      const diskName = `${Date.now()}-${randomBytes(6).toString('hex')}${validated.safeExt}`
      writeFileSync(join(destDir, diskName), validated.data)

      savedAttachments.push({
        name: validated.originalName,
        url: `/uploads/inquiries/${diskName}`,
        mimeType: validated.detectedMime,
        size: validated.size,
        diskName
      })
    }
  }

  // 8. Bind Verified LINE Session (from HTTP-only signed cookie)
  const lineSession = getLineProfileCookie(event)
  const lineId = lineSession?.lineId || manualLineId
  const lineUserId = lineSession?.userId || ''
  const lineDisplayName = lineSession?.displayName || ''
  const linePictureUrl = lineSession?.pictureUrl || ''
  const lineVerified = lineSession?.verified || 0

  // 9. Persist into SQLite Database FIRST
  const now = new Date().toISOString()
  const clientIp = getClientIp(event)
  const publicAttachments = savedAttachments.map(({ name: n, url, mimeType, size }) => ({
    name: n,
    url,
    mimeType,
    size
  }))

  const insertRes = db
    .prepare(`
      INSERT INTO inquiries (
        name, phone, email, company, subject, product_name, message,
        line_id, line_user_id, line_display_name, line_picture_url, line_verified,
        attachments_json, pdpa_consent, ip_address,
        status, admin_note, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', '', ?)
    `)
    .run(
      name,
      phone,
      email,
      company,
      subject,
      productName,
      message,
      lineId,
      lineUserId,
      lineDisplayName,
      linePictureUrl,
      lineVerified,
      JSON.stringify(publicAttachments),
      pdpaConsent,
      clientIp,
      now
    )

  const inquiryId = Number(insertRes.lastInsertRowid)

  // 10. Trigger Email & LINE OA Push Notifications
  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const siteOrigin = `${proto}://${host}`

  const notifyPayload = {
    id: inquiryId,
    name,
    phone,
    email,
    company,
    subject,
    productName,
    message,
    lineId,
    lineUserId,
    lineDisplayName,
    lineVerified,
    attachments: savedAttachments.map((a) => ({
      ...a,
      url: signInquiryAttachmentUrl(a.url, sessionSecret)
    })),
    createdAt: now
  }

  const [emailStatus, lineStatus] = await Promise.all([
    sendInquiryEmailNotification(notifyPayload, settings, siteOrigin),
    sendInquiryLineOaNotification(notifyPayload, settings, siteOrigin)
  ])

  db.prepare(
    'UPDATE inquiries SET notify_email_status = ?, notify_line_status = ? WHERE id = ?'
  ).run(emailStatus, lineStatus, inquiryId)

  // Build instant LINE OA handoff URL so customer can also message LINE OA with pre-filled reference
  const oaBasicId = (settings.lineOaBasicId || '').trim()
  const prefilledText =
    `[อ้างอิงใบติดต่อ #${inquiryId}]\n` +
    `ชื่อ: ${name}\nโทร: ${phone}` +
    (lineId ? `\nLINE: ${lineId}` : '') +
    (productName ? `\nสินค้า: ${productName}` : '') +
    `\nรายละเอียด: ${message.slice(0, 250)}`

  const lineOaDirectUrl = oaBasicId.startsWith('@')
    ? `https://line.me/R/oaMessage/${encodeURIComponent(oaBasicId)}/?${encodeURIComponent(prefilledText)}`
    : settings.lineUrl || 'https://line.me/ti/p/RBiGzfFotR'

  return {
    ok: true,
    id: inquiryId,
    attachmentsCount: publicAttachments.length,
    notifications: {
      email: emailStatus,
      lineOa: lineStatus
    },
    lineOaDirectUrl,
    prefilledLineText: prefilledText,
    message: `บันทึกข้อมูลรหัสอ้างอิง #${inquiryId} เรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด`
  }
})
