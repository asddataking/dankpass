export const DANKPASS_APP_BASE_URL = "https://www.thedanknetwork.com/rewards";

export const APP_ROUTES = {
  LAUNCH: DANKPASS_APP_BASE_URL,
  SIGNIN: DANKPASS_APP_BASE_URL, // Sign in redirects to rewards page
  UPLOAD: DANKPASS_APP_BASE_URL, // Upload functionality is on rewards page
  REWARDS: DANKPASS_APP_BASE_URL,
  PERKS: DANKPASS_APP_BASE_URL, // Perks/redeem functionality is on rewards page
  PREMIUM: DANKPASS_APP_BASE_URL, // Premium upgrade is on rewards page
  DASHBOARD: DANKPASS_APP_BASE_URL, // Dashboard is the rewards page
  PROFILE: DANKPASS_APP_BASE_URL, // Profile functionality is on rewards page
} as const;

export const ECOSYSTEM_LINKS = {
  DAILY_DISPODEALS: "https://www.dailydispodeals.com",
  DANKNDEVOUR: "https://www.dankndevour.com",
  DANK_NETWORK: "https://www.thedanknetwork.com",
} as const;
