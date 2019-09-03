import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import vueFirebaseData from '../data';
import firebaseUIOptions from './vue-firebaseui-default-options';

// Start Firebase UI in element with provied ID
const startFirebaseUIAuth = (id: string) => {
  if (vueFirebaseData.hasFirebaseUI) {
    vueFirebaseData.vueFirebase!.firebaseUI!.start(`#${id}`, firebaseUIOptions);
  }
};

// Initialize Firebase UI on app
const initFirebaseUI = () => new firebaseui.auth.AuthUI(firebase.auth());

export default {
  initFirebaseUI,
  startFirebaseUIAuth,
};
