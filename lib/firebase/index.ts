import { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui';
import vueFirebaseData from '../data';
import vueFirebaseUI from '../firebaseui/vue-firebaseui';
import vueFirebaseFirestore from '../firestore/vue-firebase-firestore';
import vueFirebaseAuthMixin from '../auth/vue-firebase-auth-mixin';
import vueFirebaseAuthGuard from '../auth/vue-firebase-auth-guard';
import vueFirebaseVueFire, {
  VueFirestoreConfig,
} from '../firestore/vue-firebase-vuefire';

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

interface VueFirebaseOptions {
  router: VueRouter;
  firebaseConfig: FirebaseConfig;
  firestoreConfig?: VueFirestoreConfig;
}

// Start and initialize Firebase on app
const initFirebase = (firebaseConfig: FirebaseConfig) =>
  firebase.initializeApp(firebaseConfig);

// Sign out
const signOut = (): Promise<void> => {
  if (vueFirebaseData.hasAuth) {
    return vueFirebaseData.vueFirebase!.App.auth().signOut();
  } else {
    return Promise.resolve();
  }
};

// Install Firebase plugin to Vue
const installFirebase = (Vue: VueConstructor, options: VueFirebaseOptions) => {
  // Init Firestore
  vueFirebaseFirestore.initFirestore();

  // Store all references in data object
  vueFirebaseData.vueFirebase = {
    App: initFirebase(options.firebaseConfig),
    signOut,
    isSignedIn: vueFirebaseData.signedIn,
    currentUser: null,
    initialized: false,
    firebaseUI: vueFirebaseUI.initFirebaseUI(),
    startFirebaseUIAuth: vueFirebaseUI.startFirebaseUIAuth,
    firestore: null,
  };

  // Init VueFire
  vueFirebaseVueFire.initVueFire(
    Vue,
    vueFirebaseData.vueFirebase.firestore!,
    options.firestoreConfig || { firestoreReferences: [] }
  );

  // Add mixin for reactive auth data
  Vue.mixin(vueFirebaseAuthMixin);

  // Add enter guard
  vueFirebaseAuthGuard.addEnterGuard(options.router);
};

export { VueFirebase, FirebaseConfig, VueFirestoreConfig, VueFirebaseOptions };

export default {
  installFirebase,
};
