import { createReadStream } from 'node:fs'
import { sendRedirect, sendStream } from 'h3'
import { getAllSettingsMap, getDb } from '../../../utils/db'
import {
  fetchAndCacheWpMedia,
  getWpMimeType,
  resolveLocalWpMediaPath,
  sanitizeWpRelPath
} from '../../../utils/wp-media'

export default defineEventHandler(async (event) => {
  const rawParam = getRouterParam(event, 'path') || ''
  const cleanRel = sanitizeWpRelPath(rawParam)
  if (!cleanRel) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid media path' })
  }

  // 1. Fast path: already cached on local server disk
  const localCheck = resolveLocalWpMediaPath(cleanRel)
  if (!localCheck) {
    throw createError({ statusCode: 404, statusMessage: 'Media not found' })
  }

  if (localCheck.existingPath) {
    setHeader(event, 'Content-Type', getWpMimeType(localCheck.existingPath))
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    setHeader(event, 'Cache-Control', 'public, max-age=2592000, immutable')
    return sendStream(event, createReadStream(localCheck.existingPath))
  }

  // 2. Fetch on-demand from backup server (https://fz.uarea.in/uploads) & cache permanently to disk
  const config = useRuntimeConfig(event)
  const db = getDb()
  const settings = getAllSettingsMap(db)
  const backupBase =
    settings.wpBackupUploadsUrl ||
    config.wpBackupUploadsUrl ||
    process.env.WP_BACKUP_UPLOADS_URL ||
    'https://fz.uarea.in/uploads'

  const outcome = await fetchAndCacheWpMedia(cleanRel, backupBase)

  if (outcome.status === 'cached' && outcome.localPath) {
    setHeader(event, 'Content-Type', getWpMimeType(outcome.localPath))
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    setHeader(event, 'Cache-Control', 'public, max-age=2592000, immutable')
    return sendStream(event, createReadStream(outcome.localPath))
  }

  // 3. Fallback if server outbound network is restricted (e.g. sandbox): let client browser fetch from backup
  if (outcome.status === 'network_error') {
    setHeader(event, 'Cache-Control', 'public, max-age=300')
    return sendRedirect(event, outcome.remoteUrl, 302)
  }

  throw createError({ statusCode: 404, statusMessage: 'Media not found' })
})
