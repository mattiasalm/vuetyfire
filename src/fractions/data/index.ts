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
interface InternalData {
  vueFirebase: VueFirebase | null;
  setFBCallbacks: Array<() => any>;
}

// Initial data
const internalData: InternalData = {
  setFBCallbacks: [],
  vueFirebase: null,
};

// Data storage class
class FirebaseData implements FB {
  // Get value
  public get vueFirebase() {
    return internalData.vueFirebase;
  }

  // Set value and run all callbacks
  public set vueFirebase(newFB: VueFirebase | null) {
    internalData.vueFirebase = newFB;
    internalData.setFBCallbacks.forEach(callback => callback());
    internalData.setFBCallbacks = [];
  }

  // Set specific value in data object
  public setVueFirebaseValue(key: string, value: any) {
    if (!!internalData.vueFirebase) {
      internalData.vueFirebase[key] = value;
    }
  }

  // Get if Firebase app has been initialized
  public get initialized() {
    return !!internalData.vueFirebase && !!internalData.vueFirebase.App;
  }

  // Set callback for set function
  public onceSetFB(callback: () => any) {
    internalData.setFBCallbacks.push(callback);
  }

  // Get if the app have auth
  public get hasAuth() {
    return this.initialized && !!internalData.vueFirebase!.App.auth;
  }

  // Get if the app have user signed in
  public get signedIn() {
    return this.hasAuth && !!internalData.vueFirebase!.App.auth().currentUser;
  }

  // Get if the app have FirebaseUI
  public get hasFirebaseUI() {
    return this.initialized && !!internalData.vueFirebase!.firebaseUI;
  }
}

const instance = new FirebaseData();
Object.freeze(instance);

export default instance;
