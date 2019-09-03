import Vue from 'vue';
import vueFirebaseData from '../data';

// Mixin with hook to store references to Firebase data object easily
// reachable in Vue components
const mixin = {
  beforeCreate() {
    const _this = this as any;
    _this.$firebase = Vue.observable(vueFirebaseData.vueFirebase);

    // Add event listener to store updated value
    // Make updates reactive in Vue
    vueFirebaseData
      .vueFirebase!.App.auth()
      .onAuthStateChanged((user: firebase.User | null) => {
        Vue.set(_this.$firebase, 'currentUser', user);
        Vue.set(_this.$firebase, 'isSignedIn', !!user);
        Vue.set(_this.$firebase, 'initialized', true);
      });
  },
};

export default mixin;
