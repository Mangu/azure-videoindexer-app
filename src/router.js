import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Chat from './views/Chat.vue';
import Settings from './views/Settings.vue';
import Details from './views/Details.vue';
import store from './store' 
import { UserAgentApplication } from 'msal';

Vue.use(Router); 



const msalInstance = new UserAgentApplication({
  auth: {
    clientId: process.env.VUE_APP_CLIENT_ID, 
    authority: 'https://login.microsoftonline.com/consumers',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  },
  system: {
    navigateFrameWait: 0
  },
  framework: {
    unprotectedResources: ["https://www.microsoft.com/en-us/"],
    protectedResourceMap: new Map([["https://graph.microsoft.com/v1.0/me", ["user.read"]]])
  }
});

const router = new Router({
  routes: [
    
    { path: '/About', component: About, name: 'About' },
    { path: '/Login', name: 'Login' },
    { path: '/Home', component: Home ,meta: { requiresAuth: false }},
    { path: '/Chat', component: Chat ,meta: { requiresAuth: false }},
    { path: '/Settings', component: Settings ,meta: { requiresAuth: false } },
    { path: '/Details/:id', name: 'Details', component: Details ,meta: { requiresAuth: false } },
  ]
})

;

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err;
    }
  });
};

export default router;