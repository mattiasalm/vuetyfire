import * as firebase from 'firebase';
import { VueConstructor } from 'vue';
import { firestorePlugin } from 'vuefire';

import { firestoreFunctionPath, isEven } from '../util';

interface FirestoreReference {
  key: string;
  path: string;
}

interface FirestoreConfig {
  firestoreReferences: FirestoreReference[];
}

// Create the data object from config
const createMixinData = (config: FirestoreConfig) =>
  config.firestoreReferences.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.key]: isEven(curr.path.split('/').length) ? {} : [],
    }),
    {},
  );

// Create firestore object from config
const createMixinFirestore = (
  config: FirestoreConfig,
  firestoreRef: firebase.firestore.Firestore,
) => {
  return config.firestoreReferences.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.key]: firestoreFunctionPath(curr.path, firestoreRef),
    }),
    {},
  );
};

// Initialize Vuefire and add mixin data to Vue instance
const initVueFire = (
  Vue: VueConstructor,
  firestoreRef: firebase.firestore.Firestore,
  firestoreConfig: FirestoreConfig,
) => {
  Vue.use(firestorePlugin);
  Vue.mixin({
    data() {
      return createMixinData(firestoreConfig);
    },
    firestore: createMixinFirestore(firestoreConfig, firestoreRef),
  });
};

export { FirestoreConfig, firestoreFunctionPath, initVueFire };
