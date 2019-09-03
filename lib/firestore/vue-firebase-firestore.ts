import 'firebase/firestore';
import vueFirebaseData from '../data';

// Create Firestore instance
const createFirestoreInstance = () => vueFirebaseData.vueFirebase!.App.firestore();

// Initialize Firestore instance and set callback for set function
const initFirestore = () => {
  vueFirebaseData.onceSetFB(() => {
    if (vueFirebaseData.initialized) {
      vueFirebaseData.setVueFirebaseValue('firestore', createFirestoreInstance());
    } else {
      console.debug('VueFirebase: Firebase not initialized.');
    }
  });

};

export default {
  initFirestore,
};
