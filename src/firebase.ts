import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Safely access process.env in a browser/micro-service environment
const safeProcessEnv = typeof process !== "undefined" && process.env ? process.env : {} as Record<string, string>;
const safeMetaEnv = (import.meta as any).env || {};

export const isDevMode = safeMetaEnv.DEV === true || safeProcessEnv.NODE_ENV === "development" || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"));

// Use environment variables only. Prioritize VITE_ keys, fallback to NEXT_PUBLIC_ keys
const firebaseConfig = {
  apiKey: safeMetaEnv.VITE_FIREBASE_API_KEY || safeMetaEnv.NEXT_PUBLIC_FIREBASE_API_KEY || safeProcessEnv.NEXT_PUBLIC_FIREBASE_API_KEY || safeProcessEnv.VITE_FIREBASE_API_KEY || "",
  authDomain: safeMetaEnv.VITE_FIREBASE_AUTH_DOMAIN || safeMetaEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || safeProcessEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || safeProcessEnv.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: safeMetaEnv.VITE_FIREBASE_PROJECT_ID || safeMetaEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID || safeProcessEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID || safeProcessEnv.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: safeMetaEnv.VITE_FIREBASE_STORAGE_BUCKET || safeMetaEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || safeProcessEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || safeProcessEnv.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: safeMetaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || safeMetaEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || safeProcessEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || safeProcessEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: safeMetaEnv.VITE_FIREBASE_APP_ID || safeMetaEnv.NEXT_PUBLIC_FIREBASE_APP_ID || safeProcessEnv.NEXT_PUBLIC_FIREBASE_APP_ID || safeProcessEnv.VITE_FIREBASE_APP_ID || "",
};

// Startup Validation
const missingVars: string[] = [];
if (!firebaseConfig.apiKey) missingVars.push("VITE_FIREBASE_API_KEY / NEXT_PUBLIC_FIREBASE_API_KEY");
if (!firebaseConfig.authDomain) missingVars.push("VITE_FIREBASE_AUTH_DOMAIN / NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
if (!firebaseConfig.projectId) missingVars.push("VITE_FIREBASE_PROJECT_ID / NEXT_PUBLIC_FIREBASE_PROJECT_ID");
if (!firebaseConfig.storageBucket) missingVars.push("VITE_FIREBASE_STORAGE_BUCKET / NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
if (!firebaseConfig.messagingSenderId) missingVars.push("VITE_FIREBASE_MESSAGING_SENDER_ID / NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
if (!firebaseConfig.appId) missingVars.push("VITE_FIREBASE_APP_ID / NEXT_PUBLIC_FIREBASE_APP_ID");

export const firebaseEnvError = missingVars.length > 0
  ? `Missing required Firebase Environment Variables:\n${missingVars.map(v => `- ${v}`).join("\n")}`
  : null;

if (firebaseEnvError) {
  console.error("Firebase Configuration Error on Startup:\n" + firebaseEnvError);
} else {
  console.log("Using Default Firestore Database");
  console.log(`Active Firebase Project ID: ${firebaseConfig.projectId}`);
  console.log("Firestore Database Name: (default)");
}

// To prevent React app compile/boot crash if variables are not yet injected,
// we supply dummy values when keys are missing.
const finalConfig = firebaseEnvError ? {
  apiKey: "dummy-api-key",
  authDomain: "dummy-auth-domain",
  projectId: "dummy-project-id",
  storageBucket: "dummy-storage-bucket",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:dummy"
} : firebaseConfig;

const app = initializeApp(finalConfig);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const firebaseMetadata = {
  projectId: finalConfig.projectId || "organic-gamma-m6m9v",
  databaseName: "(default)"
};

export const auth = getAuth(app);
export const storage = getStorage(app);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error Detailed Payload: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation Connection Check on Boot (per skill directive)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test_connection", "ping"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase Offline Mode Detected. Checking connection payload.");
    }
  }
}
testConnection();
