import { VueConstructor } from 'vue';
import { firestorePlugin } from 'vuefire';
import firebase from 'firebase';

import { isEven, firestoreFunctionPath } from '../util';

interface FirestoreReference {
  key: string;
  path: string;
}

interface VueFirestoreConfig {
  firestoreReferences: FirestoreReference[];
}

// Create the data object from config
const createMixinData = (config: VueFirestoreConfig) =>
  config.firestoreReferences.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.key]: isEven(curr.path.split('/').length) ? {} : [],
    }),
    {}
  );

// Create firestore object from config
const createMixinFirestore = (
  config: VueFirestoreConfig,
  firestoreRef: firebase.firestore.Firestore
) => {
  return config.firestoreReferences.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.key]: firestoreFunctionPath(curr.path, firestoreRef),
    }),
    {}
  );
};

// Initialize Vuefire and add mixin data to Vue instance
const initVueFire = (
  Vue: VueConstructor,
  firestoreRef: firebase.firestore.Firestore,
  firestoreConfig: VueFirestoreConfig
) => {
  Vue.use(firestorePlugin);
  Vue.mixin({
    data() {
      return createMixinData(firestoreConfig);
    },
    firestore: createMixinFirestore(firestoreConfig, firestoreRef),
  });
};

export { VueFirestoreConfig, firestoreFunctionPath };

export default {
  initVueFire,
};
