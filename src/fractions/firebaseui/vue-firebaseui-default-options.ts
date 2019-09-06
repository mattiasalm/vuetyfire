import * as firebase from 'firebase/app';

// DOCS
// https://github.com/firebase/firebaseui-web#configure-email-provider

const firebaseUIDefaultOptions = {
  credentialHelper: 'none',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
    },
  ],
  signInSuccessUrl: 'http://localhost:8080/',
};

export { firebaseUIDefaultOptions };
