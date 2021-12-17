/*
 * @Description: /**
 * module下的路由配置
 * 1. 每个 module 的默认根路由直接映射到当前 module 下 pages 下的主 module 单文件组件，在startup中配置完成。
 * 2. 此文件只放置 module 下的子路由配置，形式和 vue-router 定制的 route 对象格式保持一致，但是只需要配置children属性即可。供 export.js 导出模块，
 *    系统加载 module 后通过 addRoutes 配置进router系统。
 * 3. 如果当前 module 没有子路由，此文件返回空数组，在 module 导出文件 export.js 中可以直接引入此文件或者不引入。
 *
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-12-07 11:31:14
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 10:50:10
 */

export default [];
