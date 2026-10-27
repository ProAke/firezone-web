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
      status TEXT DEFAULT 'new',
      admin_note TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );
  `)
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
      INSERT INTO products (id, slug, name, brand, excerpt, description, image, datasheet_url, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const insertProdCat = db.prepare(
      'INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)'
    )
    for (const p of SEED_PRODUCTS) {
      insertProd.run(
        p.id,
        p.slug,
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
}

export function getAllSettingsMap(db: DatabaseSync): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{ key: string; value: string }>
  const map: Record<string, string> = {}
  for (const r of rows) {
    map[r.key] = r.value
  }
  return map
}

export function slugifyText(input: string): string {
  const cleaned = input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-|-$/g, '')
  return cleaned || `item-${Date.now()}`
}
