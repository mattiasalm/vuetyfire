import {
  FirebaseConfig,
  FirebaseOptions,
  installFirebase,
  VueFirebase,
} from './fractions/firebase';
import { FirestoreConfig } from './fractions/firestore';

export * from './fractions/firestore-binding';
export * from './fractions/data';

// Add extended module declarationm for Vue
declare module 'vue/types/vue' {
  interface Vue {
    $firebase: VueFirebase;
  }
}

export { FirebaseConfig, FirebaseOptions, FirestoreConfig };

export default {
  install: installFirebase,
};
