import Vue from 'vue';
import vueFirebaseData from '../data';

// Mixin with hook to store references to Firebase data object easily
// reachable in Vue components
const mixin = {
  beforeCreate() {
    const localThis = this as any;
    localThis.$firebase = Vue.observable(vueFirebaseData.vueFirebase);

    // Add event listener to store updated value
    // Make updates reactive in Vue
    vueFirebaseData
      .vueFirebase!.App.auth()
      .onAuthStateChanged((user: firebase.User | null) => {
        Vue.set(localThis.$firebase, 'currentUser', user);
        Vue.set(localThis.$firebase, 'isSignedIn', !!user);
        Vue.set(localThis.$firebase, 'initialized', true);
      });
  },
};

export default mixin;
