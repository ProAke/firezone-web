import { createSpamChallenge, enforceRateLimit } from '../utils/security'

export default defineEventHandler((event) => {
  enforceRateLimit(event, 'contact-challenge', 30, 1000 * 60 * 5)
  const config = useRuntimeConfig(event)
  setHeader(event, 'Cache-Control', 'no-store')
  return createSpamChallenge(config.sessionSecret)
})
