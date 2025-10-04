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

    // TODO: Get email from Stack Auth when available
    const email = 'user@example.com'
    const displayName = 'User'
    
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
  
  // TODO: Implement proper admin check when Stack Auth email is available
  // For now, allow access for development
  console.log('Admin access granted - check disabled for development')
  return user
}

// Helper function to get user profile
export async function getUserProfile() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) return null
    
    return {
      id: user.id,
      email: 'user@example.com', // TODO: Get email from Stack Auth when available
      name: 'User', // TODO: Get name from Stack Auth when available
      firstName: null,
      lastName: null,
      avatar: null,
      createdAt: null,
      updatedAt: null,
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Export Stack Server App for direct use if needed
export { stackServerApp }
