import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store';

import AdminLogin from '@/pages/admin/AdminLogin'
import Backstage from '@/pages/admin/Backstage'
import EditUser from '@/pages/admin/EditUser'

import Ml from '@/pages/admin/Ml'

import ErrorPage from '@/pages/ErrorPage'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    }, {
      path: '/login',
      name: 'AdminLogin',
      component: AdminLogin
    }, {
      path: '/backstage',
      name: 'Backstage',
      redirect: "/backstage/editUser",
      component: Backstage,
      children: [
        {
          path: 'editUser',
          name: 'EditUser',
          component: EditUser,
          meta: {
            requireLogin: true,
          },
        }, {
          path: 'Ml',
          name: 'Ml',
          component: Ml,
          meta: {
            requireLogin: true,
          },
        }
      ]
    }, {//404页面
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
    if (store.state.adminToken) {
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