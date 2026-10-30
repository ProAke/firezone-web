import { DatabaseSync } from 'node:sqlite'
import { randomBytes } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  SEED_CATEGORIES,
  SEED_POSTS,
  SEED_PRODUCTS,
  SEED_SERVICES,
  SEED_SETTINGS
} from '../data/seed-data'
import { hashPassword } from './auth'

// Secret keys that MUST NEVER be exposed in public /api/site or /api/home
export const SECRET_SETTING_KEYS = new Set([
  'lineLoginChannelId',
  'lineLoginChannelSecret',
  'lineChannelAccessToken',
  'lineNotifyTargetId',
  'smtpHost',
  'smtpPort',
  'smtpSecure',
  'smtpUser',
  'smtpPass',
  'smtpFrom',
  'notifyEmailTo',
  'notifyEmailEnabled',
  'notifyLineEnabled',
  'turnstileSecretKey',
  'wpBackupUploadsUrl'
])

let dbInstance: DatabaseSync | null = null

export function getDb(): DatabaseSync {
  if (dbInstance) return dbInstance

  const dataDir = join(process.cwd(), 'data')
  mkdirSync(dataDir, { recursive: true })
  const dbPath = join(dataDir, 'firezone.sqlite')

  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA foreign_keys = ON;')

  initSchema(db)
  runMigrations(db)
  seedIfEmpty(db)

  dbInstance = db
  return db
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      parent_id INTEGER,
      sort_order INTEGER DEFAULT 0,
      description TEXT DEFAULT '',
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      seo_keywords TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      legacy_slug TEXT DEFAULT '',
      name TEXT NOT NULL,
      brand TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      datasheet_url TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      seo_keywords TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_categories (
      product_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (product_id, category_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      legacy_slug TEXT DEFAULT '',
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      image TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      seo_keywords TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      legacy_slug TEXT DEFAULT '',
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      image TEXT DEFAULT '',
      gallery_json TEXT DEFAULT '[]',
      published_at TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      seo_keywords TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      image TEXT DEFAULT '',
      is_system INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      seo_keywords TEXT DEFAULT '',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      company TEXT DEFAULT '',
      subject TEXT DEFAULT '',
      product_name TEXT DEFAULT '',
      message TEXT NOT NULL,
      line_id TEXT DEFAULT '',
      line_user_id TEXT DEFAULT '',
      line_display_name TEXT DEFAULT '',
      line_picture_url TEXT DEFAULT '',
      line_verified INTEGER DEFAULT 0,
      attachments_json TEXT DEFAULT '[]',
      pdpa_consent INTEGER DEFAULT 1,
      ip_address TEXT DEFAULT '',
      notify_email_status TEXT DEFAULT '',
      notify_line_status TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      admin_note TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );
  `)
}

function ensureColumn(db: DatabaseSync, table: string, column: string, definition: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
}

function runMigrations(db: DatabaseSync) {
  ensureColumn(db, 'products', 'legacy_slug', "TEXT DEFAULT ''")
  ensureColumn(db, 'products', 'seo_title', "TEXT DEFAULT ''")
  ensureColumn(db, 'products', 'seo_description', "TEXT DEFAULT ''")
  ensureColumn(db, 'products', 'seo_keywords', "TEXT DEFAULT ''")

  ensureColumn(db, 'categories', 'seo_title', "TEXT DEFAULT ''")
  ensureColumn(db, 'categories', 'seo_description', "TEXT DEFAULT ''")
  ensureColumn(db, 'categories', 'seo_keywords', "TEXT DEFAULT ''")

  ensureColumn(db, 'services', 'seo_title', "TEXT DEFAULT ''")
  ensureColumn(db, 'services', 'seo_description', "TEXT DEFAULT ''")
  ensureColumn(db, 'services', 'seo_keywords', "TEXT DEFAULT ''")

  ensureColumn(db, 'posts', 'seo_title', "TEXT DEFAULT ''")
  ensureColumn(db, 'posts', 'seo_description', "TEXT DEFAULT ''")
  ensureColumn(db, 'posts', 'seo_keywords', "TEXT DEFAULT ''")

  ensureColumn(db, 'inquiries', 'line_id', "TEXT DEFAULT ''")
  ensureColumn(db, 'inquiries', 'line_user_id', "TEXT DEFAULT ''")
  ensureColumn(db, 'inquiries', 'line_display_name', "TEXT DEFAULT ''")
  ensureColumn(db, 'inquiries', 'line_picture_url', "TEXT DEFAULT ''")
  ensureColumn(db, 'inquiries', 'line_verified', 'INTEGER DEFAULT 0')
  ensureColumn(db, 'inquiries', 'attachments_json', "TEXT DEFAULT '[]'")
  ensureColumn(db, 'inquiries', 'pdpa_consent', 'INTEGER DEFAULT 1')
  ensureColumn(db, 'inquiries', 'ip_address', "TEXT DEFAULT ''")
  ensureColumn(db, 'inquiries', 'notify_email_status', "TEXT DEFAULT ''")
  ensureColumn(db, 'inquiries', 'notify_line_status', "TEXT DEFAULT ''")
}

function seedDefaultPages(db: DatabaseSync, now: string) {
  const insertPage = db.prepare(`
    INSERT OR IGNORE INTO pages (slug, title, subtitle, excerpt, content, image, is_system, is_active, seo_title, seo_description, seo_keywords, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, 1, '', '', '', ?)
  `)

  insertPage.run(
    'home',
    'บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
    'ABOUT FIRESZONE',
    SEED_SETTINGS.aboutIntro || '',
    `<p>${SEED_SETTINGS.aboutIntro || ''}</p>`,
    '/wp-content/uploads/2021/01/bg-homeaboutus.png',
    now
  )

  insertPage.run(
    'about-us',
    'เกี่ยวกับเรา',
    'ABOUT FIRESZONE',
    SEED_SETTINGS.aboutIntro || '',
    `<p>${SEED_SETTINGS.aboutIntro || ''}</p>
<h3>ขอบเขตการให้บริการหลักของเรา</h3>
<ul>
  <li><strong>จัดจำหน่ายอุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ (Fire Alarm System):</strong> ตู้ควบคุม Conventional &amp; Addressable, Smoke/Heat Detector, Manual Pull Station, Bell &amp; Strobe Light มาตรฐาน UL/FM</li>
  <li><strong>บริการออกแบบ ติดตั้ง ตรวจสอบ และบำรุงรักษาประจำปี:</strong> ตรวจเช็คและทดสอบการทำงานของระบบแจ้งเหตุเพลิงไหม้ พร้อมออกเอกสารรับรองและอบรมการใช้งาน</li>
  <li><strong>พัฒนานวัตกรรมแจ้งเตือนอัคคีภัยผ่าน LINE &amp; Email:</strong> เชื่อมต่อตู้ควบคุมสัญญาณแจ้งเหตุเพลิงไหม้เข้ากับสมาร์ทโฟนเพื่อให้ผู้ดูแลอาคารรับทราบเหตุได้ทันที</li>
  <li><strong>ระบบรักษาความปลอดภัยและระบบอาคาร:</strong> กล้องวงจรปิด (CCTV), ระบบทีวีรวมดิจิตอล (MATV), ถังดับเพลิงเคมีแห้ง / CO2 และไฟฉุกเฉิน</li>
</ul>`,
    '/wp-content/uploads/2021/02/Banner-2.jpg',
    now
  )

  insertPage.run(
    'contact',
    'ติดต่อเรา & ขอใบเสนอราคา',
    'CONTACT US & REQUEST A QUOTE',
    'สอบถามข้อมูลอุปกรณ์แจ้งเหตุเพลิงไหม้ ขอใบเสนอราคาโครงการ นัดสำรวจหน้างาน หรือแนบไฟล์แบบแปลน PDF ให้ทีมวิศวกรประเมินราคาฟรี',
    `<p>ทีมวิศวกรและฝ่ายขาย <strong>บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด</strong> พร้อมให้คำปรึกษา จัดทำใบเสนอราคาอุปกรณ์ระบบแจ้งเหตุเพลิงไหม้ (Fire Alarm), กล้องวงจรปิด (CCTV), ระบบทีวีรวม (MATV) และงานตรวจสอบบำรุงรักษาระบบประจำปี สามารถกรอกแบบฟอร์มพร้อมแนบไฟล์สเปคหรือรูปหน้างานได้สูงสุด 5 ไฟล์</p>`,
    '',
    now
  )

  insertPage.run(
    'privacy-policy',
    'นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
    'PRIVACY POLICY & PDPA',
    'ประกาศนโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA) และการใช้งานคุกกี้ของ บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด',
    `<h2>ประกาศนโยบายความเป็นส่วนตัว (Privacy Notice)</h2>
<p><em>ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Personal Data Protection Act: PDPA)</em></p>
<p><strong>บริษัท ไฟร์โซน แอนด์แมนูแฟคเจอริ่ง จำกัด</strong> ("บริษัทฯ") ให้ความสำคัญสูงสุดต่อการคุ้มครองข้อมูลส่วนบุคคลของลูกค้า คู่ค้า และผู้เข้าชมเว็บไซต์ เอกสารฉบับนี้อธิบายถึงวิธีการเก็บรวบรวม ใช้ เปิดเผย และรักษาความปลอดภัยของข้อมูลส่วนบุคคลของท่าน</p>
<h3>1. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</h3>
<ul>
  <li><strong>ข้อมูลการติดต่อและขอใบเสนอราคา:</strong> ชื่อ-นามสกุล เบอร์โทรศัพท์ อีเมล ชื่อบริษัท/อาคาร/โครงการ และรายละเอียดความต้องการ</li>
  <li><strong>ข้อมูลการเชื่อมต่อบัญชี LINE (Connect LINE):</strong> รหัสอ้างอิงผู้ใช้ LINE (User ID) ชื่อที่แสดง (Display Name) หรือ LINE ID ที่ท่านยินยอมเชื่อมต่อเพื่อรับการติดต่อกลับผ่าน LINE Official Account</li>
  <li><strong>ไฟล์เอกสารและรูปภาพแนบ:</strong> ไฟล์ PDF สเปคงาน แบบแปลน หรือรูปภาพหน้างานที่ท่านแนบผ่านแบบฟอร์มติดต่อ (ไม่เกิน 5 ไฟล์)</li>
  <li><strong>ข้อมูลทางเทคนิคและคุกกี้ (Cookies):</strong> หมายเลข IP Address ข้อมูลเบราว์เซอร์ และสถิติการเข้าชมเว็บไซต์ (เฉพาะกรณีที่ท่านให้ความยินยอมคุกกี้เพื่อการวิเคราะห์หรือการตลาด)</li>
</ul>
<h3>2. วัตถุประสงค์ในการประมวลผลข้อมูล</h3>
<ul>
  <li>เพื่อจัดทำใบเสนอราคา ให้คำปรึกษาทางวิศวกรรม นัดสำรวจหน้างาน และให้บริการติดตั้ง/ตรวจสอบระบบสัญญาณเตือนอัคคีภัย</li>
  <li>เพื่อส่งแจ้งเตือนและติดต่อสื่อสารกับท่านผ่านทางโทรศัพท์ อีเมล หรือ LINE Official Account ตามที่ท่านร้องขอ</li>
  <li>เพื่อป้องกันสแปม การโจมตีทางไซเบอร์ และการรักษาความปลอดภัยของระบบสารสนเทศ</li>
  <li>เพื่อวิเคราะห์สถิติและปรับปรุงคุณภาพเว็บไซต์และบริการ (เมื่อได้รับความยินยอมคุกกี้จากท่าน)</li>
</ul>
<h3>3. ระยะเวลาในการเก็บรักษาข้อมูล</h3>
<p>บริษัทฯ จะเก็บรักษาข้อมูลการติดต่อขอใบเสนอราคาไว้เป็นระยะเวลาประมาณ <strong>365 วัน</strong> หรือตลอดระยะเวลาที่มีนิติสัมพันธ์ตามสัญญาซื้อขาย/สัญญาบริการบำรุงรักษาระบบ และจะลบหรือทำลายข้อมูลเมื่อพ้นกำหนดความจำเป็น</p>
<h3>4. สิทธิของเจ้าของข้อมูลส่วนบุคคลตามกฎหมาย PDPA</h3>
<p>ท่านมีสิทธิตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ได้แก่ สิทธิในการเพิกถอนความยินยอม, สิทธิในการขอเข้าถึงและรับสำเนาข้อมูลส่วนบุคคล, สิทธิในการขอแก้ไขข้อมูลให้ถูกต้องเป็นปัจจุบัน และสิทธิในการขอลบหรือระงับการใช้ข้อมูลส่วนบุคคล</p>`,
    '',
    now
  )
}

function seedIfEmpty(db: DatabaseSync) {
  const now = new Date().toISOString()

  // Seed admin user if none
  const adminCount = db.prepare('SELECT COUNT(*) as c FROM admins').get() as { c: number }
  if (adminCount.c === 0) {
    const config = useRuntimeConfig()
    const username = config.adminUsername || 'admin'
    const password = config.adminPassword || 'firezone2026'
    db.prepare('INSERT INTO admins (username, password_hash, updated_at) VALUES (?, ?, ?)').run(
      username,
      hashPassword(password),
      now
    )
  }

  // Seed settings (insert missing keys without overwriting admin edits)
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)')
  for (const [k, v] of Object.entries(SEED_SETTINGS)) {
    insertSetting.run(k, v)
  }

  // Ensure default Website Pages exist
  seedDefaultPages(db, now)

  // Upgrade legacy remote WordPress logo URLs (or previous default) to bundled local assets
  db.prepare(`
    UPDATE settings
    SET value = '/logosticky-fireszone-2.png'
    WHERE key IN ('logoHeader', 'logoSticky')
      AND (value LIKE '%/wp-content/uploads/%logo%fires%one%' OR value = '/logo-fz.jpg')
  `).run()
  db.prepare(`
    UPDATE settings
    SET value = '/logofooter-firesone.png'
    WHERE key = 'logoFooter'
      AND value LIKE '%/wp-content/uploads/%logofooter%'
  `).run()

  // Seed categories & products if empty
  const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }
  if (catCount.c === 0) {
    const insertCat = db.prepare(
      'INSERT INTO categories (id, name, slug, parent_id, sort_order, description) VALUES (?, ?, ?, ?, ?, ?)'
    )
    for (const c of SEED_CATEGORIES) {
      insertCat.run(c.id, c.name, c.slug, c.parentId, c.sortOrder, c.description)
    }
  }

  const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number }
  if (prodCount.c === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (id, slug, legacy_slug, name, brand, excerpt, description, image, datasheet_url, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const insertProdCat = db.prepare(
      'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)'
    )
    for (const p of SEED_PRODUCTS) {
      insertProd.run(
        p.id,
        p.slug,
        p.legacySlug || '',
        p.name,
        p.brand,
        p.excerpt,
        p.description,
        p.image,
        p.datasheetUrl || '',
        p.isActive,
        now,
        now
      )
      for (const cid of p.categoryIds) {
        insertProdCat.run(p.id, cid)
      }
    }
  } else {
    // Upgrade non-URL-friendly numeric slugs on pre-existing DBs while preserving legacy_slug
    const upgradeSlug = db.prepare(
      'UPDATE products SET slug = ?, legacy_slug = ? WHERE id = ? AND slug = ?'
    )
    for (const p of SEED_PRODUCTS) {
      if (p.legacySlug) {
        upgradeSlug.run(p.slug, p.legacySlug, p.id, p.legacySlug)
      }
    }
  }

  const svcCount = db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number }
  if (svcCount.c === 0) {
    const insertSvc = db.prepare(`
      INSERT INTO services (id, slug, legacy_slug, type, title, excerpt, content, image, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    for (const s of SEED_SERVICES) {
      insertSvc.run(
        s.id,
        s.slug,
        s.legacySlug || '',
        s.type,
        s.title,
        s.excerpt,
        s.content,
        s.image,
        s.sortOrder
      )
    }
  }

  const postCount = db.prepare('SELECT COUNT(*) as c FROM posts').get() as { c: number }
  if (postCount.c === 0) {
    const insertPost = db.prepare(`
      INSERT INTO posts (id, slug, legacy_slug, type, title, excerpt, content, image, gallery_json, published_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `)
    for (const p of SEED_POSTS) {
      insertPost.run(
        p.id,
        p.slug,
        p.legacySlug || '',
        p.type,
        p.title,
        p.excerpt,
        p.content,
        p.image,
        JSON.stringify(p.gallery || []),
        p.publishedAt
      )
    }
  }

  // Normalize any legacy absolute https://fireszone.com/wp-content/uploads/ URLs in pre-existing DBs
  db.exec(`
    UPDATE settings
    SET value = REPLACE(REPLACE(value, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
    WHERE value LIKE '%fireszone.com/wp-content/uploads/%';

    UPDATE products
    SET
      image = REPLACE(REPLACE(image, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'),
      datasheet_url = CASE
        WHEN datasheet_url LIKE '%woocommerce_uploads/2021/03/fdlj_df_2914-xgyf9c.pdf%' THEN ''
        ELSE REPLACE(REPLACE(datasheet_url, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
      END
    WHERE image LIKE '%fireszone.com/wp-content/uploads/%'
       OR datasheet_url LIKE '%fireszone.com/wp-content/uploads/%'
       OR datasheet_url LIKE '%woocommerce_uploads/2021/03/fdlj_df_2914-xgyf9c.pdf%';

    UPDATE services
    SET
      image = REPLACE(REPLACE(image, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'),
      content = REPLACE(REPLACE(content, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
    WHERE image LIKE '%fireszone.com/wp-content/uploads/%'
       OR content LIKE '%fireszone.com/wp-content/uploads/%';

    UPDATE posts
    SET
      image = REPLACE(REPLACE(image, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'),
      gallery_json = REPLACE(REPLACE(gallery_json, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'),
      content = REPLACE(REPLACE(content, 'https://fireszone.com/wp-content/uploads/', '/wp-content/uploads/'), 'http://fireszone.com/wp-content/uploads/', '/wp-content/uploads/')
    WHERE image LIKE '%fireszone.com/wp-content/uploads/%'
       OR gallery_json LIKE '%fireszone.com/wp-content/uploads/%'
       OR content LIKE '%fireszone.com/wp-content/uploads/%';

    UPDATE posts
    SET gallery_json = '["/wp-content/uploads/2021/10/Pro-5.jpg"]'
    WHERE id = 1138 AND gallery_json LIKE '%2021/06/S__304103428.jpg%';
  `)
}

let cachedInternalSecret = ''

export function getOrCreateInternalSessionSecret(db?: DatabaseSync): string {
  if (cachedInternalSecret) return cachedInternalSecret
  const conn = db || getDb()
  const existing = conn
    .prepare("SELECT value FROM settings WHERE key = '_internalSessionSecret'")
    .get() as { value: string } | undefined

  if (existing?.value && existing.value.length >= 48) {
    cachedInternalSecret = existing.value
    return cachedInternalSecret
  }

  const generated = randomBytes(32).toString('hex')
  conn
    .prepare(
      "INSERT INTO settings (key, value) VALUES ('_internalSessionSecret', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(generated)
  cachedInternalSecret = generated
  return cachedInternalSecret
}

export function getAllSettingsMap(db: DatabaseSync): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{ key: string; value: string }>
  const map: Record<string, string> = {}
  for (const r of rows) {
    // Internal system secrets (prefixed with _) are never exposed to API consumers
    if (r.key.startsWith('_')) continue
    map[r.key] = r.value
  }
  return map
}

export function getPublicSettingsMap(db: DatabaseSync): Record<string, string> {
  const all = getAllSettingsMap(db)
  const pub: Record<string, string> = {}
  for (const [k, v] of Object.entries(all)) {
    if (!SECRET_SETTING_KEYS.has(k)) {
      pub[k] = v
    }
  }
  pub.lineOauthConfigured = Boolean(all.lineLoginChannelId && all.lineLoginChannelSecret) ? '1' : '0'
  pub.linePushConfigured = Boolean(all.lineChannelAccessToken && all.lineNotifyTargetId) ? '1' : '0'
  return pub
}

export function slugifyText(input: string): string {
  const cleaned = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\/_,\s]+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-|-$/g, '')
  return cleaned || `item-${Date.now()}`
}
