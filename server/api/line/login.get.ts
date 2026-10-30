import { randomBytes } from 'node:crypto'
import { getAllSettingsMap, getDb } from '../../utils/db'

export default defineEventHandler((event) => {
  const db = getDb()
  const settings = getAllSettingsMap(db)
  const channelId = (settings.lineLoginChannelId || process.env.LINE_LOGIN_CHANNEL_ID || '').trim()

  if (!channelId) {
    return sendRedirect(event, '/contact?line_setup_needed=1#quote', 302)
  }

  const proto = getRequestProtocol(event, { xForwardedProto: true })
  const host = getRequestHost(event, { xForwardedHost: true })
  const redirectUri = `${proto}://${host}/api/line/callback`

  const state = randomBytes(16).toString('hex')
  const isHttps = proto === 'https'
  setCookie(event, 'fz_line_oauth_state', state, {
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    path: '/',
    maxAge: 600
  })

  const authUrl = new URL('https://access.line.me/oauth2/v2.1/authorize')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', channelId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('scope', 'profile openid')
  authUrl.searchParams.set('bot_prompt', 'normal')

  return sendRedirect(event, authUrl.toString(), 302)
})
