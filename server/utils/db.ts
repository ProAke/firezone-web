import { DatabaseSync } from 'node:sqlite'
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
  'turnstileSecretKey'
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
      description TEXT DEFAULT ''
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
      sort_order INTEGER DEFAULT 0
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
      is_active INTEGER DEFAULT 1
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
  // to local /wp-content/uploads/ so Nuxt serves & auto-caches them from https://fz.uarea.in/uploads/
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

export function getAllSettingsMap(db: DatabaseSync): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{ key: string; value: string }>
  const map: Record<string, string> = {}
  for (const r of rows) {
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
  // Tell frontend booleans about configured integrations without leaking secrets
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
