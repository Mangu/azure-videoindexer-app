import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Chat from './views/Chat.vue';
import Settings from './views/Settings.vue';
import Details from './views/Details.vue';

Vue.use(Router); 

const router = new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/About', component: About },
    { path: '/Home', component: Home },
    { path: '/Chat', component: Chat },
    { path: '/Settings', component: Settings },
    { path: '/Details/:id', name: 'Details', component: Details },
  ]
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      throw err;
    }
  });
};

export default router;