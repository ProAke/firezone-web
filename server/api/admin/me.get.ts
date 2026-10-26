import { getAdminUser } from '../../utils/auth'

export default defineEventHandler((event) => {
  const user = getAdminUser(event)
  return {
    authenticated: Boolean(user),
    user
  }
})
