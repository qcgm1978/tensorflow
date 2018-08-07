import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store';


import ErrorPage from '@/pages/ErrorPage';

import TF from '@/pages/client/TF'
import Formula from '@/pages/client/Formula'
import Start from '@/pages/client/Start';
import RNN from '@/pages/client/RNN'
Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/tf"
    }, {
      path: '/tf',
      name: 'tf',
      component: TF,
      redirect: '/tf/start',
      children: [
        {
          path: 'start',
          component: Start
        },
        {
          path: 'formula',
          // name: 'Formula',
          component: Formula,
        },
        {
          path: 'addition-rnn',
          component: RNN
        }
      ]
    }, {
      path: '*',
      name: 'ErrorPage',
      component: ErrorPage
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

//登录拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin) {
    if (store.state.clientToken) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next();
  }
});

export default router;
