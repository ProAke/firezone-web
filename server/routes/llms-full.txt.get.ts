import { getDb, getPublicSettingsMap } from '../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const settings = getPublicSettingsMap(db)
  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const baseUrl = (settings.siteUrl || `${proto}://${host}`).replace(/\/+$/, '')

  const products = db
    .prepare(
      'SELECT slug, name, brand, excerpt, datasheet_url as datasheetUrl FROM products WHERE is_active = 1 ORDER BY id ASC'
    )
    .all() as Array<{
    slug: string
    name: string
    brand: string
    excerpt: string
    datasheetUrl: string
  }>

  const services = db
    .prepare('SELECT slug, type, title, excerpt FROM services ORDER BY sort_order ASC')
    .all() as Array<{ slug: string; type: string; title: string; excerpt: string }>

  const posts = db
    .prepare('SELECT slug, type, title, excerpt, published_at as publishedAt FROM posts WHERE is_active = 1 ORDER BY id DESC')
    .all() as Array<{ slug: string; type: string; title: string; excerpt: string; publishedAt: string }>

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return `# FIRESZONE Full Knowledge Base & Product Catalog (ASEO)

บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด (FIRESZONE & MANUFACTURING CO., LTD.)
ที่อยู่: ${settings.address}
โทร: ${settings.phone1}, ${settings.phone2}, ${settings.phone3}, ${settings.officePhone}
อีเมล: ${settings.email} | LINE ID: ${settings.lineId}

---

## รายการสินค้าและอุปกรณ์ทั้งหมด (${products.length} รุ่น)
${products
  .map(
    (p) =>
      `### ${p.name} (${p.brand || 'Fire Alarm'})\n- URL: ${baseUrl}/product/${p.slug}\n- รายละเอียด: ${p.excerpt}${
        p.datasheetUrl ? `\n- Datasheet PDF: ${p.datasheetUrl}` : ''
      }`
  )
  .join('\n\n')}

---

## บริการและหมวดระบบ (${services.length} รายการ)
${services
  .map((s) => `### ${s.title}\n- URL: ${baseUrl}/service/${s.slug}\n- สรุป: ${s.excerpt}`)
  .join('\n\n')}

---

## ผลงานอ้างอิงและบทความความรู้ (${posts.length} รายการ)
${posts
  .map(
    (p) =>
      `- [${p.title}](${baseUrl}/${p.type === 'news' ? 'news' : 'portfolio'}/${p.slug}) (${p.publishedAt}): ${p.excerpt}`
  )
  .join('\n')}

---

## คำถามที่พบบ่อย (FAQ สำหรับ AI Search & ลูกค้า)
Q: บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด ให้บริการอะไรบ้าง?
A: จัดจำหน่ายอุปกรณ์ระบบสัญญาณเตือนอัคคีภัย (Fire Alarm) มาตรฐาน UL/FM รับออกแบบ ติดตั้ง ตรวจสอบประจำปี ทดสอบระบบ พัฒนาระบบแจ้งเตือนผ่าน LINE & Email รวมถึงติดตั้งระบบกล้องวงจรปิด (CCTV), ระบบทีวีรวมดิจิตอล (MATV) และถังดับเพลิง

Q: ระบบแจ้งเตือน Fire Alarm ผ่าน LINE ของ Fireszone ทำงานอย่างไร?
A: เป็นชุดอุปกรณ์พัฒนาเฉพาะของบริษัทที่เชื่อมต่อเข้ากับตู้ควบคุม Fire Alarm เดิมหรือตู้ใหม่ได้ทุกยี่ห้อ เมื่อเกิดสัญญาณ Alarm ระบบจะส่งข้อความแจ้งเตือนเข้ากลุ่ม LINE และ E-mail ของผู้ดูแลอาคารทันที

Q: มีจำหน่ายตู้ควบคุมและอุปกรณ์ยี่ห้ออะไรบ้าง?
A: จำหน่ายแบรนด์ชั้นนำทั้งระบบ Conventional และ Addressable ได้แก่ NOTIFIER (เช่น NFS-320, NFS-640, SFP-5UD/10UD, RP-2002E), NOHMI (เช่น FAPN202-R-5L/10L, FAPN104N), System Sensor, EDWARDS, CEMEN, AIP, CL และอุปกรณ์กันระเบิด BGM

Q: สามารถขอใบเสนอราคาและส่งแบบแปลนหรือสเปคให้ประเมินราคาได้อย่างไร?
A: สามารถกรอกแบบฟอร์มที่หน้า ${baseUrl}/contact พร้อมแนบไฟล์ PDF หรือรูปภาพหน้างานได้สูงสุด 5 ไฟล์ และกดปุ่ม Connect LINE เพื่อรับการติดต่อผ่าน LINE OA ได้ทันที หรือโทร ${settings.phone1}, ${settings.phone2}
`
})
