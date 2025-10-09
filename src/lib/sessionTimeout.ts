/**
 * Session timeout management
 * Requires re-authentication after period of inactivity
 */

const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours
const LAST_ACTIVITY_KEY = 'dankpass_last_activity';

/**
 * Check if session has timed out due to inactivity
 */
export function isSessionExpired(): boolean {
  if (typeof window === 'undefined') return false;
  
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  
  if (!lastActivity) return true;
  
  const lastActivityTime = parseInt(lastActivity, 10);
  const now = Date.now();
  
  return (now - lastActivityTime) > SESSION_TIMEOUT_MS;
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

/**
 * Clear session activity tracking
 */
export function clearSessionActivity(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

/**
 * Initialize activity tracking
 * Call this in your root layout or when user logs in
 */
export function initActivityTracking(): void {
  if (typeof window === 'undefined') return;
  
  // Update on page load
  updateLastActivity();
  
  // Update on user interactions
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  let timeoutId: NodeJS.Timeout;
  const throttledUpdate = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(updateLastActivity, 1000); // Throttle to once per second
  };
  
  events.forEach(event => {
    window.addEventListener(event, throttledUpdate);
  });
}

