import { requireAdmin } from '../../utils/auth'
import { getAllSettingsMap, getDb } from '../../utils/db'
import { syncAllMissingWpMedia } from '../../utils/wp-media'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event).catch(() => ({}))
  const db = getDb()
  const settings = getAllSettingsMap(db)
  const backupBase = String(
    body?.backupBaseUrl ||
      settings.wpBackupUploadsUrl ||
      process.env.WP_BACKUP_UPLOADS_URL ||
      'https://fz.uarea.in/uploads'
  ).trim()

  const summary = await syncAllMissingWpMedia(db, backupBase)
  return {
    ok: true,
    backupBase,
    ...summary
  }
})
