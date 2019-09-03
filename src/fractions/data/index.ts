import { VueFirebase } from '../firebase';

// Class data interface
interface FB {
  vueFirebase: VueFirebase | null;
  initialized: boolean;
  hasAuth: boolean;
  hasFirebaseUI: boolean;
  onceSetFB: (callback: () => any) => void;
}

// Interal storage data interface
interface _FB {
  vueFirebase: VueFirebase | null;
  setFBCallbacks: (() => any)[];
}

// Initial data
const _data: _FB = {
  vueFirebase: null,
  setFBCallbacks: [],
};

// Data storage class
class FirebaseData implements FB {
  // Get value
  get vueFirebase() {
    return _data.vueFirebase;
  }

  // Set value and run all callbacks 
  set vueFirebase(newFB: VueFirebase | null) {
    _data.vueFirebase = newFB;
    _data.setFBCallbacks.forEach(callback => callback());
    _data.setFBCallbacks = [];
  }

  // Set specific value in data object
  setVueFirebaseValue(key: string, value: any) {
    if (!!_data.vueFirebase) {
      _data.vueFirebase[key] = value;
    }
  }

  // Get if Firebase app has been initialized
  get initialized() {
    return !!_data.vueFirebase && !!_data.vueFirebase.App;
  }

  // Set callback for set function
  onceSetFB(callback: () => any) {
    _data.setFBCallbacks.push(callback);
  }

  // Get if the app have auth
  get hasAuth() {
    return this.initialized && !!_data.vueFirebase!.App.auth;
  }

  // Get if the app have user signed in
  get signedIn() {
    return this.hasAuth && !!_data.vueFirebase!.App.auth().currentUser;
  }

  // Get if the app have FirebaseUI
  get hasFirebaseUI() {
    return this.initialized && !!_data.vueFirebase!.firebaseUI;
  }
}

const instance = new FirebaseData();
Object.freeze(instance);

export default instance;
