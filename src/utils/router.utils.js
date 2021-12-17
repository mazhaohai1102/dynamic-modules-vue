/*
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-12-01 10:38:46
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 10:44:26
 */


import Vue from 'vue';
import Router from 'vue-router';
import DashBoard from '@/modules/dashboard/route';

// 解决路由重复点击报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);
const router = new Router();

const staticRoutes = [
  ...DashBoard
];
export default router;
export {
  staticRoutes
};

