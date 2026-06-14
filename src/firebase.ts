import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfigFromJson from "../firebase-applet-config.json";

// Dynamic configuration supporting both Next-style credentials and auto-provisioned studio settings
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.NEXT_PUBLIC_FIREBASE_API_KEY || metaEnv.VITE_FIREBASE_API_KEY || firebaseConfigFromJson.apiKey,
  authDomain: metaEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigFromJson.authDomain,
  projectId: metaEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID || metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfigFromJson.projectId,
  storageBucket: metaEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || metaEnv.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigFromJson.storageBucket,
  messagingSenderId: metaEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigFromJson.messagingSenderId,
  appId: metaEnv.NEXT_PUBLIC_FIREBASE_APP_ID || metaEnv.VITE_FIREBASE_APP_ID || firebaseConfigFromJson.appId
};

const app = initializeApp(firebaseConfig);

// Task 2, 3, 4, 8, 9: Ensure Firebase initialization uses getFirestore(app) (default database)
// Remove any custom or old AI Studio generated Firestore database ID arguments to prevent connection failures.
let firestoreInstance;
let resolvedDbName = "(default)";

try {
  firestoreInstance = getFirestore(app);
} catch (error) {
  console.warn("Firestore default initialization failed, attempting fallback:", error);
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const firebaseMetadata = {
  projectId: firebaseConfig.projectId || "organic-gamma-m6m9v",
  databaseName: resolvedDbName
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
