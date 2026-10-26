import { requireAdmin } from '../../utils/auth'
import { getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = getDb()

  const productsCount = (db.prepare('SELECT COUNT(*) as c FROM products').get() as { c: number }).c
  const categoriesCount = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }).c
  const portfolioCount = (
    db.prepare("SELECT COUNT(*) as c FROM posts WHERE type = 'portfolio'").get() as { c: number }
  ).c
  const newsCount = (
    db.prepare("SELECT COUNT(*) as c FROM posts WHERE type = 'news'").get() as { c: number }
  ).c
  const servicesCount = (db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number }).c
  const newInquiriesCount = (
    db.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'new'").get() as { c: number }
  ).c
  const totalInquiriesCount = (
    db.prepare('SELECT COUNT(*) as c FROM inquiries').get() as { c: number }
  ).c

  const recentInquiries = db
    .prepare(
      `SELECT id, name, phone, email, subject, product_name as productName, message, status, created_at as createdAt
       FROM inquiries ORDER BY id DESC LIMIT 5`
    )
    .all()

  const recentProducts = db
    .prepare(
      `SELECT id, slug, name, brand, image, is_active as isActive, updated_at as updatedAt
       FROM products ORDER BY id DESC LIMIT 6`
    )
    .all()

  return {
    counts: {
      products: productsCount,
      categories: categoriesCount,
      portfolio: portfolioCount,
      news: newsCount,
      services: servicesCount,
      newInquiries: newInquiriesCount,
      totalInquiries: totalInquiriesCount
    },
    recentInquiries,
    recentProducts
  }
})
