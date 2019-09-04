# Vuetyfire

Connect [Vue](https://vuejs.org/) with [Firebase](https://firebase.google.com/) easily with only a few lines of code. Adds on to your Vue app as a plugin. Helps you set up authentication and [Firestore](https://firebase.google.com/products/firestore/) with reactive one way binding reflecting the current state of the database. Comes out of the box with support for building a authentication flow using [FirebaseUI](https://github.com/firebase/firebaseui-web).

## Prerequisites

Needed to set up the usage of Vuetyfire is basically a Vue app - with or without Typescript.

### Authentication and route guards

To enable the use of route guards and authentication for your app _Vue Router_ is needed. Follow the installation instructions on the [Vue Router](https://router.vuejs.org/) page.

## Installation

Add package using `npm install --save vuetyfire`.

## Setup

In your apps `main` file import the plugin and add the config object from Firebase. The config object can be copied directly from the [Firebase Console](https://console.firebase.google.com/). Then tell Vue to use `vuetyfire` as a plugin.

**main.ts**
```typescript
import vuetyfire, { FirebaseConfig } from 'vuetyfire';

const firebaseConfig: FirebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

Vue.use(vuetyfire, { firebaseConfig });
```

On initialization the instances of Firebase and Firestore are mounted to the global scope as `this.$firebase`.

```typescript
const firebaseInstance = this.$firebase.App;

const firestoreInstance = this.$firebase.firestore;
```

The instances can also be reached by importing the data object from Vuetyfire.

```typescript
import { vuetyfireData } 'vuetyfire';

const firebaseInstance = vuetyfireData.firebase.App;

const firestoreInstance = vuetyfireData.firebase.firestore;
```

### Add support for auth guards and routing

Provide the Vue Router configuration object `router` in the options object to the plugin.

**main.ts**
```typescript
Vue.use(vuetyfire, { firebaseConfig, router });
```

When the Vue app is trying to reach a route the auth guard will check the authentication status and if the route can be reached. To protect a route and require that only signed in users can reach it provide `meta` information in the route configuration. If a route is protected and no user is signed in the guard will redirect the user to the path `/login`.

Add the protection meta information in your Vue Router configuration as the example below:

**router.ts**
```typescript
routes: [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
]
```

## Authentication using FirebaseUI

Vuetyfire comes with support for building a sign in flow using FirebaseUI making it easy to create an authentication form and get started. The example below is all what is needed to show a signin form in the referenced HTML element.

By default it shows a sign in/registration form with **email / password** authentication. 

**Make sure to enable your choice of authentication method in the Firebase Console**.

**Login.vue**
```vue
<template>
  <div id="firebaseui-auth-container"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  // Call the start method when the component is fully mounted
  mounted() {
    this.$firebase.startFirebaseUIAuth('firebaseui-auth-container');
  }
}
</script>
```

## Configuration

### Global Firestore Bindings

### FirebaseUI options

## Data binding

### Document

### Collection

## Data modification

### Add document

### Set/update document

### Delete document