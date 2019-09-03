import VueRouter, { Route } from 'vue-router';
import vueFirebaseData from '../data';

// Enter guard for routes
const enterGuard = (to: Route, _: Route, next: any) => {
  // Check if the route can be reached without login
  if (!to.matched.some(record => !!record.meta && record.meta.requiresAuth)) {
    next();
    return;
  }

  // Route requires auth to be reached
  // Check if the user is logged in before trying to reach route
  if (vueFirebaseData.hasAuth) {
    vueFirebaseData
      .vueFirebase!
      .App.auth()
      .onAuthStateChanged((user: firebase.User | null) => {
        // User is logged in
        if (!!user) {
          next();
          return;
        }

        // User not logged in, redirect
        // Or user logged out and should be redirected
        next({
          path: '/login',
        });
      });
  }
};

const addEnterGuard = (router: VueRouter) => router.beforeEach(enterGuard);

export default {
  addEnterGuard,
};
