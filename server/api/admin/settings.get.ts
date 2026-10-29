import { requireAdmin } from '../../utils/auth'
import { getAllSettingsMap, getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = getDb()
  const settings = getAllSettingsMap(db)
  return { settings }
})
