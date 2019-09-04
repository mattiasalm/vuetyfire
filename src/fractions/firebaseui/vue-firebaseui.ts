import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { vuetyfireData } from '../data';
import { firebaseUIDefaultOptions } from './vue-firebaseui-default-options';

// Start Firebase UI in element with provied ID
const startFirebaseUIAuth = (id: string) => {
  if (vuetyfireData.hasFirebaseUI) {
    vuetyfireData.firebase!.firebaseUI!.start(
      `#${id}`,
      firebaseUIDefaultOptions,
    );
  }
};

// Initialize Firebase UI on app
const initFirebaseUI = () => new firebaseui.auth.AuthUI(firebase.auth());

export { initFirebaseUI, startFirebaseUIAuth };
