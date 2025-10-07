// Stack Auth configuration
export const stackConfig = {
  projectId: process.env.STACK_PROJECT_ID!,
  projectUrl: process.env.STACK_PROJECT_URL!,
};

// Mock auth functions for now - replace with real Stack Auth when properly configured
export const signIn = async (email: string, password: string) => {
  // Mock implementation
  console.log('Mock sign in:', email);
  return { success: true };
};

export const signOut = async () => {
  // Mock implementation
  console.log('Mock sign out');
  return { success: true };
};

export const useUser = () => {
  // Mock implementation
  return { user: null, loading: false };
};
