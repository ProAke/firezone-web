import { getEffectiveSessionSecret } from '../utils/auth'
import { createSpamChallenge, enforceRateLimit } from '../utils/security'

export default defineEventHandler((event) => {
  enforceRateLimit(event, 'contact-challenge', 30, 1000 * 60 * 5)
  setHeader(event, 'Cache-Control', 'no-store')
  return createSpamChallenge(getEffectiveSessionSecret(event))
})
