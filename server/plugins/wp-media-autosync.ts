import { getAllSettingsMap, getDb } from '../utils/db'
import { syncAllMissingWpMedia } from '../utils/wp-media'

export default defineNitroPlugin(() => {
  // Run non-blocking background sync 2.5s after server boot so all WordPress images
  // from https://fz.uarea.in/uploads/ are permanently mirrored onto local disk automatically.
  setTimeout(async () => {
    try {
      const db = getDb()
      const settings = getAllSettingsMap(db)
      const backupBase =
        settings.wpBackupUploadsUrl ||
        process.env.WP_BACKUP_UPLOADS_URL ||
        'https://fz.uarea.in/uploads'

      const result = await syncAllMissingWpMedia(db, backupBase)
      if (!result.networkOffline && result.downloaded > 0) {
        console.info(
          `[wp-media-autosync] Downloaded ${result.downloaded} media files to data/uploads/wp/ (cached: ${result.alreadyCached + result.downloaded}/${result.total})`
        )
      }
    } catch {
      // Never crash server if background media pre-warming encounters an error
    }
  }, 2500)
})
