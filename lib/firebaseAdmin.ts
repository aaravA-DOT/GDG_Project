// Firebase Admin configuration for secure server-side API routes

export interface FirebaseAdminConfig {
  projectId: string;
  clientEmail?: string;
  privateKey?: string;
  isConfigured: boolean;
}

export const adminConfig: FirebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "krishibuddy-ai",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  isConfigured: Boolean(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL),
};

export function getAdminStatus() {
  return {
    ready: adminConfig.isConfigured,
    projectId: adminConfig.projectId,
    mode: adminConfig.isConfigured ? "production_firebase" : "simulated_secure_mode",
  };
}
