import nodemailer from 'nodemailer'
import { join } from 'node:path'

export interface InquiryRecordForNotify {
  id: number
  name: string
  phone: string
  email: string
  company: string
  subject: string
  productName: string
  message: string
  lineId: string
  lineUserId: string
  lineDisplayName: string
  lineVerified: number
  attachments: Array<{ name: string; url: string; mimeType: string; size: number; diskName?: string }>
  createdAt: string
}

export async function sendInquiryEmailNotification(
  inquiry: InquiryRecordForNotify,
  settings: Record<string, string>,
  siteOrigin: string
): Promise<string> {
  const smtpHost = (settings.smtpHost || process.env.SMTP_HOST || '').trim()
  const smtpPort = Number(settings.smtpPort || process.env.SMTP_PORT || 587)
  const smtpSecure = (settings.smtpSecure || process.env.SMTP_SECURE || '0') === '1' || smtpPort === 465
  const smtpUser = (settings.smtpUser || process.env.SMTP_USER || '').trim()
  const smtpPass = settings.smtpPass || process.env.SMTP_PASS || ''
  const toEmail = (settings.notifyEmailTo || settings.email || 'fire_zone@hotmail.com').trim()
  const fromEmail = (settings.smtpFrom || smtpUser || 'noreply@fireszone.com').trim()

  if (settings.notifyEmailEnabled === '0') {
    return 'disabled'
  }
  if (!smtpHost || !smtpUser || !smtpPass) {
    return 'skipped:no_smtp_config'
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })

    const lineBadge =
      inquiry.lineVerified === 1
        ? `ยืนยันผ่าน LINE OAuth แล้ว (${inquiry.lineDisplayName || inquiry.lineId})`
        : inquiry.lineId
          ? `${inquiry.lineId}${inquiry.lineDisplayName ? ` (${inquiry.lineDisplayName})` : ''}`
          : '-'

    const attachmentsHtml = inquiry.attachments.length
      ? `<ul>${inquiry.attachments
          .map(
            (a) =>
              `<li><a href="${siteOrigin}${a.url}" target="_blank" rel="noopener">${escapeHtml(a.name)}</a> (${Math.round(a.size / 1024)} KB)</li>`
          )
          .join('')}</ul>`
      : '<p>ไม่มีไฟล์แนบ</p>'

    const mailAttachments = inquiry.attachments
      .filter((a) => a.diskName)
      .map((a) => ({
        filename: a.name,
        path: join(process.cwd(), 'data', 'uploads', 'inquiries', a.diskName!)
      }))

    await transporter.sendMail({
      from: `"FIRESZONE Website" <${fromEmail}>`,
      to: toEmail,
      replyTo: inquiry.email || undefined,
      subject: `[FIRESZONE #${inquiry.id}] ติดต่อสอบถาม/ขอใบเสนอราคา: ${inquiry.subject || inquiry.productName || inquiry.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 640px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background: #e31e24; color: #fff; padding: 16px 20px;">
            <h2 style="margin: 0; font-size: 18px;">รายการติดต่อ / ขอใบเสนอราคาใหม่ #${inquiry.id}</h2>
          </div>
          <div style="padding: 20px; color: #1f2937; font-size: 14px; line-height: 1.6;">
            <p><strong>ชื่อผู้ติดต่อ:</strong> ${escapeHtml(inquiry.name)}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> ${escapeHtml(inquiry.phone)}</p>
            <p><strong>อีเมล:</strong> ${escapeHtml(inquiry.email || '-')}</p>
            <p><strong>บริษัท / โครงการ:</strong> ${escapeHtml(inquiry.company || '-')}</p>
            <p><strong>LINE ลูกค้า:</strong> ${escapeHtml(lineBadge)}</p>
            <p><strong>หัวข้อ / รุ่นสินค้า:</strong> ${escapeHtml([inquiry.subject, inquiry.productName].filter(Boolean).join(' — ') || '-')}</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p><strong>รายละเอียด:</strong></p>
            <div style="background: #f9fafb; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(inquiry.message)}</div>
            <p style="margin-top: 16px;"><strong>ไฟล์แนบ (${inquiry.attachments.length} ไฟล์):</strong></p>
            ${attachmentsHtml}
            <p style="margin-top: 20px;">
              <a href="${siteOrigin}/admin/inquiries" style="background: #151922; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 4px; display: inline-block;">เปิดดูในระบบหลังบ้าน CMS</a>
            </p>
          </div>
        </div>
      `,
      attachments: mailAttachments
    })

    return 'sent'
  } catch (err: any) {
    return `failed:${String(err?.message || 'smtp_error').slice(0, 120)}`
  }
}

export async function sendInquiryLineOaNotification(
  inquiry: InquiryRecordForNotify,
  settings: Record<string, string>,
  siteOrigin: string
): Promise<string> {
  const accessToken = (
    settings.lineChannelAccessToken ||
    process.env.LINE_CHANNEL_ACCESS_TOKEN ||
    ''
  ).trim()
  const targetId = (settings.lineNotifyTargetId || process.env.LINE_NOTIFY_TARGET_ID || '').trim()

  if (settings.notifyLineEnabled === '0') {
    return 'disabled'
  }
  if (!accessToken) {
    return 'skipped:no_line_token'
  }

  const results: string[] = []

  // 1. Push rich notification to Admin / LINE OA Group
  if (targetId) {
    try {
      const attachmentText = inquiry.attachments.length
        ? `\nไฟล์แนบ (${inquiry.attachments.length}):\n` +
          inquiry.attachments.map((a, idx) => `${idx + 1}. ${siteOrigin}${a.url}`).join('\n')
        : ''

      const flexContents = {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#E31E24',
          contents: [
            {
              type: 'text',
              text: `แจ้งเตือนลูกค้าติดต่อ #${inquiry.id}`,
              color: '#FFFFFF',
              weight: 'bold',
              size: 'md'
            },
            {
              type: 'text',
              text: inquiry.subject || inquiry.productName || 'ขอใบเสนอราคา / สอบถามข้อมูล',
              color: '#FEE2E2',
              size: 'xs',
              wrap: true
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: `คุณ ${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ''}`,
              weight: 'bold',
              size: 'sm',
              wrap: true
            },
            {
              type: 'text',
              text: `โทร: ${inquiry.phone}${inquiry.email ? ` | ${inquiry.email}` : ''}`,
              size: 'xs',
              color: '#4B5563',
              wrap: true
            },
            {
              type: 'text',
              text: `LINE: ${
                inquiry.lineVerified === 1
                  ? `✓ ยืนยันแล้ว (${inquiry.lineDisplayName || inquiry.lineId})`
                  : inquiry.lineId || '-'
              }`,
              size: 'xs',
              color: '#06C755',
              weight: 'bold',
              wrap: true
            },
            { type: 'separator', margin: 'md' },
            {
              type: 'text',
              text: (inquiry.message + attachmentText).slice(0, 1800),
              size: 'xs',
              color: '#1F2937',
              margin: 'md',
              wrap: true
            }
          ]
        }
      }

      const res = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          to: targetId,
          messages: [
            {
              type: 'flex',
              altText: `[FIRESZONE #${inquiry.id}] ลูกค้าติดต่อ: ${inquiry.name} (${inquiry.phone})`,
              contents: flexContents
            }
          ]
        })
      })

      if (!res.ok) {
        const errBody = await res.text()
        results.push(`admin_failed:${res.status}:${errBody.slice(0, 80)}`)
      } else {
        results.push('admin_sent')
      }
    } catch (err: any) {
      results.push(`admin_err:${String(err?.message || '').slice(0, 60)}`)
    }
  } else {
    results.push('admin_skipped:no_target_id')
  }

  // 2. If customer connected LINE via OAuth (real U... userId), send instant receipt message via LINE OA!
  if (inquiry.lineUserId && /^U[0-9a-f]{32}$/i.test(inquiry.lineUserId)) {
    try {
      const custRes = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          to: inquiry.lineUserId,
          messages: [
            {
              type: 'text',
              text:
                `สวัสดีคุณ ${inquiry.lineDisplayName || inquiry.name}\n` +
                `บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด ได้รับข้อมูลติดต่อของคุณเรียบร้อยแล้ว (รหัสอ้างอิง #${inquiry.id})\n` +
                `หัวข้อ: ${inquiry.subject || inquiry.productName || 'สอบถามข้อมูล/ขอใบเสนอราคา'}\n` +
                `เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด หรือสามารถพิมพ์ข้อความพูดคุยผ่านแชท LINE OA นี้ได้ทันทีครับ`
            }
          ]
        })
      })
      results.push(custRes.ok ? 'customer_sent' : `customer_status_${custRes.status}`)
    } catch {
      results.push('customer_err')
    }
  }

  return results.join(',')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
