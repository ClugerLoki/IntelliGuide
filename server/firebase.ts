import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from '../config.js';

let firestore: any = null;
let isFirebaseEnabled = false;
let isInitialized = false;

function initializeFirebase() {
  if (isInitialized) return;
  isInitialized = true;

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

      const missingVars = requiredVars.filter(varName => {
        const envValue = process.env[varName];
        const configValue = config.FIREBASE[varName.replace('FIREBASE_', '')];
        return !envValue && (!configValue || configValue === `your_firebase_${varName.toLowerCase().replace('firebase_', '')}`);
      });
      if (missingVars.length > 0) {
        console.log('Firebase environment variables missing:', missingVars.join(', '));
        console.log('Falling back to in-memory storage');
      } else {
        // Clean and format the private key properly
        let privateKey = process.env.FIREBASE_PRIVATE_KEY || config.FIREBASE.PRIVATE_KEY;
        
        // Remove any surrounding quotes
        privateKey = privateKey.replace(/^["']|["']$/g, '');
        
        // Replace escaped newlines with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
        
        // If the key doesn't have PEM headers, it means only the key content was provided
        // We need to add the headers and format it properly
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
          // Key content only - add headers and format
          const keyContent = privateKey.trim();
          privateKey = `-----BEGIN PRIVATE KEY-----\n${keyContent}\n-----END PRIVATE KEY-----`;
        } else {
          // Key has headers but might need formatting
          privateKey = privateKey
            .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
            .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----')
            .replace(/\n\n+/g, '\n'); // Remove multiple newlines
        }
        
        // Final validation
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
          console.log('Unable to format private key. Key preview:', privateKey.substring(0, 100) + '...');
          throw new Error('Could not create valid PEM format from provided private key');
        }

        const firebaseConfig = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID || config.FIREBASE.PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || config.FIREBASE.PRIVATE_KEY_ID,
          private_key: privateKey,
          client_email: process.env.FIREBASE_CLIENT_EMAIL || config.FIREBASE.CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID || config.FIREBASE.CLIENT_ID,
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || config.FIREBASE.CLIENT_CERT_URL
        };

        console.log('Initializing Firebase with project:', process.env.FIREBASE_PROJECT_ID || config.FIREBASE.PROJECT_ID);

        initializeApp({
          credential: cert(firebaseConfig as any),
          projectId: process.env.FIREBASE_PROJECT_ID || config.FIREBASE.PROJECT_ID,
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
}

export { firestore, isFirebaseEnabled, initializeFirebase };