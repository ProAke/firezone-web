import { getAllSettingsMap, getDb } from '../../utils/db'
import { getLineProfileCookie } from '../../utils/line-session'

export default defineEventHandler((event) => {
  const db = getDb()
  const settings = getAllSettingsMap(db)
  const profile = getLineProfileCookie(event)

  setHeader(event, 'Cache-Control', 'no-store')
  return {
    connected: Boolean(profile),
    oauthConfigured: Boolean(settings.lineLoginChannelId && settings.lineLoginChannelSecret),
    linePushConfigured: Boolean(settings.lineChannelAccessToken && settings.lineNotifyTargetId),
    lineOaUrl: settings.lineUrl || 'https://line.me/ti/p/RBiGzfFotR',
    lineOaBasicId: settings.lineOaBasicId || '',
    profile
  }
})
