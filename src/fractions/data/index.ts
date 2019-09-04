import { VueFirebase } from '../firebase';

// Class data interface
interface FB {
  firebase: VueFirebase | null;
  initialized: boolean;
  hasAuth: boolean;
  hasFirebaseUI: boolean;
  onceSetFB: (callback: () => any) => void;
}

// Interal storage data interface
interface InternalData {
  firebase: VueFirebase | null;
  setFBCallbacks: Array<() => any>;
}

// Initial data
const internalData: InternalData = {
  firebase: null,
  setFBCallbacks: [],
};

// Data storage class
class VuetyfireData implements FB {
  // Get value
  public get firebase() {
    return internalData.firebase;
  }

  // Set value and run all callbacks
  public set firebase(newFB: VueFirebase | null) {
    internalData.firebase = newFB;
    internalData.setFBCallbacks.forEach(callback => callback());
    internalData.setFBCallbacks = [];
  }

  // Set specific value in data object
  public setVueFirebaseValue(key: string, value: any) {
    if (!!internalData.firebase) {
      internalData.firebase[key] = value;
    }
  }

  // Get if Firebase app has been initialized
  public get initialized() {
    return !!internalData.firebase && !!internalData.firebase.App;
  }

  // Set callback for set function
  public onceSetFB(callback: () => any) {
    internalData.setFBCallbacks.push(callback);
  }

  // Get if the app have auth
  public get hasAuth() {
    return this.initialized && !!internalData.firebase!.App.auth;
  }

  // Get if the app have user signed in
  public get signedIn() {
    return this.hasAuth && !!internalData.firebase!.App.auth().currentUser;
  }

  // Get if the app have FirebaseUI
  public get hasFirebaseUI() {
    return this.initialized && !!internalData.firebase!.firebaseUI;
  }
}

const vuetyfireData = new VuetyfireData();
Object.freeze(vuetyfireData);

export { vuetyfireData };
