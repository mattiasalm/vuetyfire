import vueFirebase, {
  FirebaseConfig,
  VueFirebase,
  VueFirebaseOptions,
  VueFirestoreConfig,
} from './fractions/firebase';

export * from './fractions/firestore-binding';

// Add extended module declarationm for Vue
declare module 'vue/types/vue' {
  interface Vue {
    $firebase: VueFirebase;
  }
}

export { FirebaseConfig, VueFirebaseOptions, VueFirestoreConfig };

export default {
  install: vueFirebase.installFirebase,
};
