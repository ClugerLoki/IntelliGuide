import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let firestore: any = null;
let isFirebaseEnabled = false;

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    // Check if all required environment variables are present
    const requiredVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID', 
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID',
      'FIREBASE_CLIENT_CERT_URL'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log('Firebase environment variables missing:', missingVars.join(', '));
      console.log('Falling back to in-memory storage');
    } else {
      // Clean and format the private key properly
      let privateKey = process.env.FIREBASE_PRIVATE_KEY!;
      
      // Handle different possible formats of the private key
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      // Validate PEM format
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
        throw new Error('Firebase private key must be in proper PEM format with BEGIN and END markers');
      }

      const firebaseConfig = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
      };

      console.log('Initializing Firebase with project:', process.env.FIREBASE_PROJECT_ID);

      initializeApp({
        credential: cert(firebaseConfig as any),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      firestore = getFirestore();
      isFirebaseEnabled = true;
      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    console.log('Falling back to in-memory storage');
    isFirebaseEnabled = false;
  }
}

export { firestore, isFirebaseEnabled };