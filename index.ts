import vueFirebase, {
  VueFirebase,
  FirebaseConfig,
  VueFirebaseOptions,
  VueFirestoreConfig,
} from './lib/firebase';

export * from './lib/firestore-binding';

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
