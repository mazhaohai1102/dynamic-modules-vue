/*
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-12-07 11:32:24
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 10:46:25
 */

export default [{
  path: '/',
  name: 'layout',
  component: () => import( /* webpackChunkName: "layout" */ '@/modules/layout/pages/Layout'),
  redirect: '/dashboard',
  // meta: { title: '战果' },
  children: [{
    path: "/dashboard",
    name: "Dashboard",
    component: () => import( /* webpackChunkName: "dashboard" */ './pages/Dashboard.vue')
  }]
}];
