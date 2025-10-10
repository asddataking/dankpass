import * as Sentry from '@sentry/nextjs';

let initialized = false;

export function initSentryServer() {
  if (initialized) return;
  
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!dsn) {
    return;
  }
  
  Sentry.init({
    dsn: dsn,
    debug: process.env.NODE_ENV === 'development',
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
  });
  
  initialized = true;
}

