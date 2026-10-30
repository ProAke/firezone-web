import { getAllSettingsMap, getDb } from '../../utils/db'
import { setLineProfileCookie } from '../../utils/line-session'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = String(query.code || '')
  const state = String(query.state || '')
  const savedState = getCookie(event, 'fz_line_oauth_state') || ''

  if (!code || !state || state !== savedState) {
    return sendRedirect(event, '/contact?line_error=invalid_state#quote', 302)
  }

  const db = getDb()
  const settings = getAllSettingsMap(db)
  const channelId = (settings.lineLoginChannelId || process.env.LINE_LOGIN_CHANNEL_ID || '').trim()
  const channelSecret = (
    settings.lineLoginChannelSecret ||
    process.env.LINE_LOGIN_CHANNEL_SECRET ||
    ''
  ).trim()

  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const redirectUri = `${proto}://${host}/api/line/callback`

  try {
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: channelId,
        client_secret: channelSecret
      })
    })

    if (!tokenRes.ok) {
      return sendRedirect(event, '/contact?line_error=token_exchange#quote', 302)
    }

    const tokenData = (await tokenRes.json()) as { access_token: string }
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })

    if (!profileRes.ok) {
      return sendRedirect(event, '/contact?line_error=profile_fetch#quote', 302)
    }

    const profile = (await profileRes.json()) as {
      userId: string
      displayName: string
      pictureUrl?: string
    }

    setLineProfileCookie(event, {
      userId: profile.userId,
      lineId: profile.displayName,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl || '',
      verified: 1
    })

    return sendRedirect(event, '/contact?line_connected=1#quote', 302)
  } catch {
    return sendRedirect(event, '/contact?line_error=network#quote', 302)
  }
})
