import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import firebaseUIOptions from './vue-firebaseui-default-options';
import vueFirebaseData from '../data';

// Start Firebase UI in element with provied ID
const startFirebaseUIAuth = (id: string) => {
  if (vueFirebaseData.hasFirebaseUI) {
    vueFirebaseData.vueFirebase!.firebaseUI!.start(`#${id}`, firebaseUIOptions);
  } else {
    console.debug('VueFirebase: FirebaseUI not initialized.')
  }
};

// Initialize Firebase UI on app
const initFirebaseUI = () => new firebaseui.auth.AuthUI(firebase.auth());

export default {
  initFirebaseUI,
  startFirebaseUIAuth,
};
