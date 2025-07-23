import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}

// Export Firebase services
export { app, db, auth, storage };

// Export configuration check
export const isFirebaseConfigured = () => {
  const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  return {
    isConfigured: missingKeys.length === 0,
    missingKeys,
    configuredKeys: requiredKeys.filter(key => process.env[key])
  };
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    const configCheck = isFirebaseConfigured();
    
    if (!configCheck.isConfigured) {
      return {
        success: false,
        error: 'Firebase not configured',
        details: {
          missingKeys: configCheck.missingKeys,
          configuredKeys: configCheck.configuredKeys
        }
      };
    }

    // Test Firestore connection
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(db, 'test', 'connection');
    
    // This will fail if Firestore is not accessible
    await getDoc(testDoc);

    return {
      success: true,
      message: 'Firebase connection successful',
      services: {
        firestore: '✅ Connected',
        auth: '✅ Initialized',
        storage: '✅ Initialized'
      },
      projectId: firebaseConfig.projectId
    };

  } catch (error) {
    return {
      success: false,
      error: 'Firebase connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
