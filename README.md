# Vuetyfire

Connect [Vue](https://vuejs.org/) with [Firebase](https://firebase.google.com/) easily with only a few lines of code. Adds on to your Vue app as a plugin. Helps you set up authentication and [Firestore](https://firebase.google.com/products/firestore/) with reactive one way binding reflecting the current state of the database. Comes out of the box with support for building a authentication flow using [FirebaseUI](https://github.com/firebase/firebaseui-web).

## Prerequisites

Needed to set up the usage of Vuetyfire is basically a Vue app - with or without Typescript.

### Authentication and route guards

To enable the use of route guards and authentication for your app **Vue Router** is needed. Follow the installation instructions on the [Vue Router](https://router.vuejs.org/) page.

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
  <div id="firebaseui-auth-container" />
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

Additional configuration can be added to the global initization of the plugin. These are provided as options to the plugin in the `main` file.

### Global Firestore Bindings

Vuetyfire can already on initization bind specific paths in the Firestore database to variables on the global Vue scope. These will have a reactive binding and will update on any changes in the remote data. The paths and corresponding global variable are configured as an array in the `main` file like the example below.

Binding collections and documents from Firestore is done in the same way. Collections will always be an array and documents an object.

**main.ts**

```typescript
const firestoreConfig: VueFirestoreConfig = {
  firestoreReferences: [
    {
      // The variable name to bind the collection to
      // reached on: this.myCollection
      key: 'myCollection',
      // The full path to your collection
      path: 'path/to/your/collection',
    },
  ],
};

Vue.use(vuetyfire, { firebaseConfig, firestoreConfig });
```

### FirebaseUI options

It is possible to modify the behaviour of FirebaseUI by providing a configuration object into the plugin options object. All configuration is done according to the [FirebaseUI](https://github.com/firebase/firebaseui-web) documentation.

**main.ts**

```typescript
const firebaseUIOptions = {
  signInSuccessUrl: 'http://localhost:8080/sign-in-success',
};

Vue.use(vuetyfire, { firebaseConfig, firebaseUIOptions });
```

## Data binding

Paths in the Firestore database can be bound to a variable in the local scope of a component in your Vue application whenever needed. These will create a reactive one way binding to the data on the provided path.

### Document

Documents are **objects** and needs to be initialized as objects in the component before trying to bind data to it.

Call the binding function on the **created** hook in Vue.

```vue
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { bindFirestorePath } from 'vuetyfire';

  @Component
  export default class extends Vue {
    myDocument = {};

    created() {
      bindFirestorePath({
        vm: this,
        key: 'myDocument',
        path: 'path/to/my/collection/document',
      });
    }
  }
</script>
```

### Collection

Collections are **arrays** and needs to be initialized as arrays in the component before trying to bind data to it.

Call the binding function on the **created** hook in Vue.

```vue
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { bindFirestorePath } from 'vuetyfire';

  @Component
  export default class extends Vue {
    myCollection = [];

    created() {
      bindFirestorePath({
        vm: this,
        key: 'myCollection',
        path: 'path/to/my/collection',
      });
    }
  }
</script>
```

## Data modification

To keep data reactive changes to the data should be sent directly to the Firestore database to set the changes and let the bindings on relevant paths reflect it down again to the app.

### Add document

Whenever a document needs to be created in a collection where a unique ID is needed to be set to it the **add** function should be used.

```typescript
import { addFirestoreDocument} from 'vuetyfire';

addFirestoreDocument({ data: { something: 1 }, path: 'path/to/your/collection' });
```

### Set/update document

To update/set data to a document the **set** commnand should be used. It can be an empty document, additions to a document or a completely new document.

```typescript
import { setFirestoreDocument} from 'vuetyfire';

// Set new data
setFirestoreDocument({ data: { something: 1 }, path: 'path/to/document' });

// Merge new data into existing document
setFirestoreDocument({ data: { another: '' }, path: 'path/to/document' , merge: true});
```

### Delete document

Delete document data with the **delete** command.

```typescript
import { deleteFirestoreDocument} from 'vuetyfire';

deleteFirestoreDocument({ path: 'path/to/document' });

```