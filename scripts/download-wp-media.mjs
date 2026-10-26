#!/usr/bin/env node
/**
 * สคริปต์ดึงไฟล์รูปภาพและเอกสาร PDF ทั้งหมดจาก https://fireszone.com/wp-content/uploads/...
 * มาเก็บไว้ในโฟลเดอร์ data/uploads/wp/... บนเซิร์ฟเวอร์ใหม่ และอัปเดตฐานข้อมูล SQLite อัตโนมัติ
 * เพื่อให้สามารถปิดโฮสติ้ง WordPress เดิมได้ 100% โดยรูปภาพไม่หาย
 *
 * วิธีใช้งานบนเครื่องหรือเซิร์ฟเวอร์ที่ออกอินเทอร์เน็ตได้:
 *   npm run mirror:media
 */
import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const WP_PREFIX = 'https://fireszone.com/wp-content/uploads/'
const dbPath = join(process.cwd(), 'data', 'firezone.sqlite')

if (!existsSync(dbPath)) {
  console.error('ยังไม่มีไฟล์ฐานข้อมูล data/firezone.sqlite กรุณารันเซิร์ฟเวอร์ 1 ครั้งเพื่อสร้างฐานข้อมูลเริ่มต้นก่อน')
  process.exit(1)
}

const db = new DatabaseSync(dbPath)
const uploadsBase = join(process.cwd(), 'data', 'uploads', 'wp')
mkdirSync(uploadsBase, { recursive: true })

const urlSet = new Set()

function collectUrls(str) {
  if (!str || typeof str !== 'string') return
  const matches = str.match(/https?:\/\/fireszone\.com\/wp-content\/uploads\/[^\s"'\\)\]]+/g)
  if (matches) {
    for (const m of matches) urlSet.add(m)
  }
}

for (const r of db.prepare('SELECT value FROM settings').all()) collectUrls(r.value)
for (const r of db.prepare('SELECT image, datasheet_url FROM products').all()) {
  collectUrls(r.image)
  collectUrls(r.datasheet_url)
}
for (const r of db.prepare('SELECT image FROM services').all()) collectUrls(r.image)
for (const r of db.prepare('SELECT image, gallery_json FROM posts').all()) {
  collectUrls(r.image)
  collectUrls(r.gallery_json)
}

console.log(`พบไฟล์มีเดียจาก fireszone.com ทั้งหมด ${urlSet.size} ไฟล์`)

const urlMap = new Map()
for (const remoteUrl of urlSet) {
  const relPath = decodeURIComponent(remoteUrl.replace(/^https?:\/\/fireszone\.com\/wp-content\/uploads\//, ''))
  const destFile = join(uploadsBase, relPath)
  const localUrl = `/uploads/wp/${relPath.split('/').map(encodeURIComponent).join('/')}`

  if (existsSync(destFile)) {
    urlMap.set(remoteUrl, localUrl)
    continue
  }

  try {
    mkdirSync(dirname(destFile), { recursive: true })
    const res = await fetch(remoteUrl)
    if (!res.ok) {
      console.warn(`[ข้าม] ดาวน์โหลดไม่สำเร็จ (${res.status}): ${remoteUrl}`)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    writeFileSync(destFile, buf)
    urlMap.set(remoteUrl, localUrl)
    console.log(`[สำเร็จ] ${relPath}`)
  } catch (err) {
    console.warn(`[ข้อผิดพลาด] ${remoteUrl}: ${err.message}`)
  }
}

function replaceAllMapped(str) {
  if (!str) return str
  let out = str
  for (const [remote, local] of urlMap.entries()) {
    out = out.split(remote).join(local)
  }
  return out
}

for (const r of db.prepare('SELECT key, value FROM settings').all()) {
  db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(replaceAllMapped(r.value), r.key)
}
for (const r of db.prepare('SELECT id, image, datasheet_url FROM products').all()) {
  db.prepare('UPDATE products SET image = ?, datasheet_url = ? WHERE id = ?').run(
    replaceAllMapped(r.image),
    replaceAllMapped(r.datasheet_url),
    r.id
  )
}
for (const r of db.prepare('SELECT id, image FROM services').all()) {
  db.prepare('UPDATE services SET image = ? WHERE id = ?').run(replaceAllMapped(r.image), r.id)
}
for (const r of db.prepare('SELECT id, image, gallery_json FROM posts').all()) {
  db.prepare('UPDATE posts SET image = ?, gallery_json = ? WHERE id = ?').run(
    replaceAllMapped(r.image),
    replaceAllMapped(r.gallery_json),
    r.id
  )
}

console.log(`อัปเดตฐานข้อมูลให้ชี้มายังไฟล์ในเครื่องเรียบร้อยแล้ว (${urlMap.size} ไฟล์)`)
