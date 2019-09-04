import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { VueConstructor } from 'vue';
import { addEnterGuard } from '../auth';
import { authMixin } from '../auth';
import { vuetyfireData } from '../data';
import { initFirebaseUI, startFirebaseUIAuth } from '../firebaseui';
import { FirestoreConfig, initFirestore, initVueFire } from '../firestore';

interface VueFirebase {
  App: firebase.app.App;
  signOut: () => void;
  isSignedIn: boolean;
  currentUser: firebase.User | null;
  initialized: boolean;
  firebaseUI: firebaseui.auth.AuthUI | null;
  startFirebaseUIAuth: (id: string) => void;
  firestore: firebase.firestore.Firestore | null;
  [key: string]: any;
}

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface FirebaseOptions {
  firebaseConfig: FirebaseConfig;
  firestoreConfig?: FirestoreConfig;
  router?: any;
}

// Start and initialize Firebase on app
const initFirebase = (firebaseConfig: FirebaseConfig) =>
  firebase.initializeApp(firebaseConfig);

// Sign out
const signOut = (): Promise<void> => {
  if (vuetyfireData.hasAuth) {
    return vuetyfireData.firebase!.App.auth().signOut();
  } else {
    return Promise.resolve();
  }
};

// Install Firebase plugin to Vue
const installFirebase = (Vue: VueConstructor, options: FirebaseOptions) => {
  // Init Firestore
  initFirestore();

  // Store all references in data object
  vuetyfireData.firebase = {
    App: initFirebase(options.firebaseConfig),
    currentUser: null,
    firebaseUI: initFirebaseUI(),
    firestore: null,
    initialized: false,
    isSignedIn: vuetyfireData.signedIn,
    signOut,
    startFirebaseUIAuth,
  };

  // Init VueFire
  initVueFire(
    Vue,
    vuetyfireData.firebase.firestore!,
    options.firestoreConfig || { firestoreReferences: [] },
  );

  // Add mixin for reactive auth data
  Vue.mixin(authMixin);

  // Add enter guard
  if (!!options.router) {
    addEnterGuard(options.router);
  }
};

export { VueFirebase, FirebaseConfig, FirebaseOptions, installFirebase };
