import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/sign-in",
    signUp: "/handler/sign-up",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
    afterSignOut: "/",
  },
  // Note: Session persistence is controlled by Stack Auth cookies
  // By default, sessions persist for 30 days
  // For "require sign-in on app reopen" behavior, you would need:
  // 1. Shorter session duration (configure in Stack Auth dashboard)
  // 2. Session cookies instead of persistent cookies
  // 3. Or implement a "require re-auth" check based on last activity
});

export default stackServerApp;
