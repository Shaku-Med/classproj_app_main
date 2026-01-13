import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { EnvValidator } from '../EnvValidator';

const firebaseConfig = {
  apiKey: EnvValidator(`FIREBASE_API_KEY`) || '',
  authDomain: EnvValidator(`FIREBASE_AUTH_DOMAIN`) || '',
  projectId: EnvValidator(`FIREBASE_PROJECT_ID`) || '',
  storageBucket: EnvValidator(`FIREBASE_STORAGE_BUCKET`) || '',
  messagingSenderId: EnvValidator(`FIREBASE_MESSAGING_SENDER_ID`) || '',
  appId: EnvValidator(`FIREBASE_APP_ID`) || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  const hasRequiredConfig = 
    firebaseConfig.apiKey && 
    firebaseConfig.authDomain && 
    firebaseConfig.projectId;

  if (!hasRequiredConfig) {
    console.warn('Firebase credentials are missing. Using fallback client.');
  } else {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn('Firebase client initialization failed. Using fallback client.', error);
}

const createFirestoreFallback = () => {
  const errorResponse = { data: null, error: new Error('Firebase client not initialized') };
  const errorPromise = Promise.resolve(errorResponse);

  const createCollectionRef = (path: string): any => {
    const collectionRef: any = {
      doc: (docId?: string) => createDocRef(path, docId),
      where: () => createCollectionRef(path),
      orderBy: () => createCollectionRef(path),
      limit: () => createCollectionRef(path),
      get: () => errorPromise,
      add: () => errorPromise,
      onSnapshot: () => () => {},
    };

    collectionRef.then = errorPromise.then.bind(errorPromise);
    collectionRef.catch = errorPromise.catch.bind(errorPromise);
    collectionRef.finally = errorPromise.finally?.bind(errorPromise);

    return collectionRef;
  };

  const createDocRef = (collectionPath: string, docId?: string): any => {
    const docRef: any = {
      get: () => errorPromise,
      set: () => errorPromise,
      update: () => errorPromise,
      delete: () => errorPromise,
      onSnapshot: () => () => {},
      collection: (subPath: string) => createCollectionRef(`${collectionPath}/${docId || 'unknown'}/${subPath}`),
    };

    docRef.then = errorPromise.then.bind(errorPromise);
    docRef.catch = errorPromise.catch.bind(errorPromise);
    docRef.finally = errorPromise.finally?.bind(errorPromise);

    return docRef;
  };

  return {
    collection: (path: string) => createCollectionRef(path),
    doc: (collectionPath: string, docId?: string) => createDocRef(collectionPath, docId),
    batch: () => ({
      set: () => {},
      update: () => {},
      delete: () => {},
      commit: () => errorPromise,
    }),
    runTransaction: () => errorPromise,
  };
};

const createAuthFallback = () => {
  const errorResponse = { user: null, error: new Error('Firebase client not initialized') };
  const errorPromise = Promise.resolve(errorResponse);

  return {
    signInWithEmailAndPassword: () => errorPromise,
    createUserWithEmailAndPassword: () => errorPromise,
    signInWithPopup: () => errorPromise,
    signOut: () => errorPromise,
    onAuthStateChanged: () => () => {},
    currentUser: null,
  };
};

const firebaseClient = {
  app: app || null,
  firestore: db || createFirestoreFallback(),
  auth: auth || createAuthFallback(),
};

export default firebaseClient;
