// Neon Auth (Stack Auth) integration
import { stackServerApp } from './stack'
import { getUserOrCreateByEmail } from './neon-db'

// Helper function to get server-side auth
export async function getServerAuth() {
  try {
    const user = await stackServerApp.getUser()
    return user
  } catch (error) {
    console.error('Error getting server auth:', error)
    return null
  }
}

// Helper function to get current user
export async function getCurrentUser() {
  try {
    const user = await stackServerApp.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to get user from database or create if not exists
export async function getOrCreateUser() {
  try {
    const stackUser = await stackServerApp.getUser()
    if (!stackUser) {
      return null
    }

    // Get user data from Stack Auth
    const email = stackUser.primaryEmail || 'user@example.com'
    const displayName = stackUser.displayName || 'User'
    
    const user = await getUserOrCreateByEmail(email, displayName)
    return user
  } catch (error) {
    console.error('Error getting or creating user:', error)
    return null
  }
}

// Helper function to check if user is admin
export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  return adminEmails.includes(email)
}

// Helper function to require authentication
export async function requireAuth() {
  const user = await stackServerApp.getUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

// Helper function to require admin access
export async function requireAdmin() {
  const user = await stackServerApp.getUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  
  // Check if user email is in admin list
  const email = user.primaryEmail
  if (email && isAdminEmail(email)) {
    return user
  }
  
  throw new Error('Admin access required')
}

// Helper function to get user profile
export async function getUserProfile() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) return null
    
    return {
      id: user.id,
      email: user.primaryEmail || 'user@example.com',
      name: user.displayName || 'User',
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.profileImageUrl,
      createdAt: user.createdAtMillis ? new Date(user.createdAtMillis) : null,
      updatedAt: user.updatedAtMillis ? new Date(user.updatedAtMillis) : null,
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Export Stack Server App for direct use if needed
export { stackServerApp }
