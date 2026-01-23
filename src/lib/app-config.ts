export const DANKPASS_APP_BASE_URL = "https://www.thedanknetwork.com/dankpass";

export const APP_ROUTES = {
  LAUNCH: DANKPASS_APP_BASE_URL,
  SIGNIN: `${DANKPASS_APP_BASE_URL}/signin`,
  UPLOAD: `${DANKPASS_APP_BASE_URL}/upload`,
  REWARDS: `${DANKPASS_APP_BASE_URL}/rewards`,
  PERKS: `${DANKPASS_APP_BASE_URL}/perks`,
  PREMIUM: `${DANKPASS_APP_BASE_URL}/premium`,
  DASHBOARD: `${DANKPASS_APP_BASE_URL}/dashboard`,
  PROFILE: `${DANKPASS_APP_BASE_URL}/profile`,
} as const;

export const ECOSYSTEM_LINKS = {
  DAILY_DISPODEALS: "https://www.dailydispodeals.com",
  DANKNDEVOUR: "https://www.dankndevour.com",
  DANK_NETWORK: "https://www.thedanknetwork.com",
} as const;
