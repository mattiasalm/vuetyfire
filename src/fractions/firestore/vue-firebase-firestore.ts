import 'firebase/firestore';
import { vuetyfireData } from '../data';

// Create Firestore instance
const createFirestoreInstance = () => vuetyfireData.firebase!.App.firestore();

// Initialize Firestore instance and set callback for set function
export const initFirestore = () => {
  vuetyfireData.onceSetFB(() => {
    if (vuetyfireData.initialized) {
      vuetyfireData.setVueFirebaseValue('firestore', createFirestoreInstance());
    }
  });
};
