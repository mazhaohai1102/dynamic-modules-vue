/*
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-09-26 18:59:13
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 10:51:20
 */
import Vue from 'vue'
import App from './App'
import router from '@/utils/router.utils'
import Utils from "@/utils/startup.utils"
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.config.productionTip = false

Vue.use(iView);
Utils.startUp();
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})