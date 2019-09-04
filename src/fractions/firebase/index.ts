import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { VueConstructor } from 'vue';
import vueFirebaseAuthGuard from '../auth/vue-firebase-auth-guard';
import vueFirebaseAuthMixin from '../auth/vue-firebase-auth-mixin';
import vueFirebaseData from '../data';
import vueFirebaseUI from '../firebaseui/vue-firebaseui';
import vueFirebaseFirestore from '../firestore/vue-firebase-firestore';
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
  firebaseConfig: FirebaseConfig;
  firestoreConfig?: VueFirestoreConfig;
  router?: any;
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
    currentUser: null,
    firebaseUI: vueFirebaseUI.initFirebaseUI(),
    firestore: null,
    initialized: false,
    isSignedIn: vueFirebaseData.signedIn,
    signOut,
    startFirebaseUIAuth: vueFirebaseUI.startFirebaseUIAuth,
  };

  // Init VueFire
  vueFirebaseVueFire.initVueFire(
    Vue,
    vueFirebaseData.vueFirebase.firestore!,
    options.firestoreConfig || { firestoreReferences: [] },
  );

  // Add mixin for reactive auth data
  Vue.mixin(vueFirebaseAuthMixin);

  // Add enter guard
  if (!!options.router) {
    vueFirebaseAuthGuard.addEnterGuard(options.router);
  }
};

export { VueFirebase, FirebaseConfig, VueFirestoreConfig, VueFirebaseOptions };

export default {
  installFirebase,
};
