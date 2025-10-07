import { StackAuth } from "@stackframe/stack";

export const stackAuth = new StackAuth({
  projectId: process.env.STACK_PROJECT_ID!,
  projectUrl: process.env.STACK_PROJECT_URL!,
  urls: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
  },
});

export const { signIn, signOut, useUser } = stackAuth;
