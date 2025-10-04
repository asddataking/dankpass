export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
  return adminEmails.includes(email)
}

export async function requireAdmin(userEmail: string) {
  if (!isAdminEmail(userEmail)) {
    throw new Error('Admin access required')
  }
}

export function getAdminEmails(): string[] {
  return process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
}
