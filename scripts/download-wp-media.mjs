#!/usr/bin/env node
/**
 * สคริปต์ดึงไฟล์รูปภาพต้นฉบับทั้งหมดจากเซิร์ฟเวอร์สำรอง (ค่าเริ่มต้น https://fz.uarea.in/uploads)
 * มาเก็บไว้ถาวรในโฟลเดอร์ data/uploads/wp/... บนเซิร์ฟเวอร์ Nuxt ใหม่
 * (หมายเหตุ: เซิร์ฟเวอร์ Nuxt มีระบบดึงและบันทึกไฟล์ให้อัตโนมัติตอนรันอยู่แล้ว สคริปต์นี้ใช้สำหรับสั่งดึงล่วงหน้าผ่าน CLI)
 *
 * วิธีใช้งาน:
 *   npm run mirror:media
 */
import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const BACKUP_UPLOADS_BASE = (
  process.env.WP_BACKUP_UPLOADS_URL || 'https://fz.uarea.in/uploads'
).replace(/\/+$/, '')

const dbPath = join(process.cwd(), 'data', 'firezone.sqlite')

if (!existsSync(dbPath)) {
  console.error('ยังไม่มีไฟล์ฐานข้อมูล data/firezone.sqlite กรุณารันเซิร์ฟเวอร์ 1 ครั้งเพื่อสร้างฐานข้อมูลเริ่มต้นก่อน')
  process.exit(1)
}

const db = new DatabaseSync(dbPath)
const uploadsBase = join(process.cwd(), 'data', 'uploads', 'wp')
mkdirSync(uploadsBase, { recursive: true })

const relSet = new Set([
  '2021/01/banner1.png',
  '2021/02/Banner-2.jpg',
  '2021/02/Banner-3.jpg',
  '2021/02/Banner-4-2.jpg',
  '2021/01/server-2.jpg',
  '2021/02/server-3.jpg',
  '2021/01/bg-homeaboutus.png',
  '2021/01/bg-homefireszone3.png',
  '2021/01/qrcode.png'
])

function collectRelPaths(str) {
  if (!str || typeof str !== 'string') return
  const regex = /(?:https?:\/\/(?:fireszone\.com|fz\.uarea\.in))?\/(?:wp-content\/)?uploads\/([^\s"'\\)\]]+)/g
  let m
  while ((m = regex.exec(str)) !== null) {
    const rawRel = m[1]
    if (!rawRel || rawRel.startsWith('inquiries/') || rawRel.startsWith('wp/')) continue
    const decoded = rawRel
      .split('/')
      .filter(Boolean)
      .map((s) => {
        try {
          return decodeURIComponent(s)
        } catch {
          return s
        }
      })
      .join('/')
    if (decoded && !decoded.includes('..')) relSet.add(decoded)
  }
}

for (const r of db.prepare('SELECT value FROM settings').all()) collectRelPaths(r.value)
for (const r of db.prepare('SELECT image, datasheet_url FROM products').all()) {
  collectRelPaths(r.image)
  collectRelPaths(r.datasheet_url)
}
for (const r of db.prepare('SELECT image, content FROM services').all()) {
  collectRelPaths(r.image)
  collectRelPaths(r.content)
}
for (const r of db.prepare('SELECT image, gallery_json, content FROM posts').all()) {
  collectRelPaths(r.image)
  collectRelPaths(r.gallery_json)
  collectRelPaths(r.content)
}

console.log(`พบไฟล์มีเดียที่อ้างอิงทั้งหมด ${relSet.size} ไฟล์ (ดึงจาก ${BACKUP_UPLOADS_BASE})`)

let downloaded = 0
let cached = 0
let failed = 0

for (const relPath of relSet) {
  const destFile = join(uploadsBase, relPath)
  if (existsSync(destFile)) {
    cached++
    continue
  }

  const encodedRel = relPath.split('/').map(encodeURIComponent).join('/')
  const remoteUrl = `${BACKUP_UPLOADS_BASE}/${encodedRel}`

  try {
    mkdirSync(dirname(destFile), { recursive: true })
    const res = await fetch(remoteUrl)
    const ct = (res.headers.get('content-type') || '').toLowerCase()
    if (!res.ok || ct.includes('text/html')) {
      console.warn(`[ข้าม] ไม่พบไฟล์รูปภาพ (${res.status}): ${remoteUrl}`)
      failed++
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    writeFileSync(destFile, buf)
    downloaded++
    console.log(`[บันทึกสำเร็จ] ${relPath}`)
  } catch (err) {
    failed++
    console.warn(`[ข้อผิดพลาดเครือข่าย] ${remoteUrl}: ${err.message}`)
  }
}

// Normalize DB URLs to clean relative /wp-content/uploads/...
db.exec(`
  UPDATE settings
  SET value = REPLACE(REPLACE(value, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
  WHERE value LIKE '%fireszone.com/wp-content/uploads/%';

  UPDATE products
  SET image = REPLACE(REPLACE(image, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
  WHERE image LIKE '%fireszone.com/wp-content/uploads/%';

  UPDATE services
  SET image = REPLACE(REPLACE(image, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
  WHERE image LIKE '%fireszone.com/wp-content/uploads/%';

  UPDATE posts
  SET
    image = REPLACE(REPLACE(image, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'),
    gallery_json = REPLACE(REPLACE(gallery_json, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
  WHERE image LIKE '%fireszone.com/wp-content/uploads/%'
     OR gallery_json LIKE '%fireszone.com/wp-content/uploads/%';
`)

console.log(`เสร็จสมบูรณ์: มีในเครื่องแล้ว ${cached} ไฟล์, ดาวน์โหลดเพิ่ม ${downloaded} ไฟล์, ข้าม ${failed} ไฟล์`)
