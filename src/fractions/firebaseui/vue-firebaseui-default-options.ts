import * as firebase from 'firebase/app';

// DOCS
// https://github.com/firebase/firebaseui-web#configure-email-provider

export default {
  credentialHelper: 'none',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true,
    },
    // {
    //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    // },
  ],
  signInSuccessUrl: 'http://localhost:8080/',
};
