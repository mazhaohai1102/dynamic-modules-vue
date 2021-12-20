/*
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-12-01 10:38:46
 * @LastEditors: martin
 * @LastEditTime: 2021-12-20 14:40:00
 */


import router, {
  staticRoutes
} from "./router.utils";
import Layout from "@/modules/layout/pages/Layout";
const systemSource = "DynamicModules";
//动态路由数据
const menuData = [{
    path: "/datam",
    name: "Datam"
  },
  {
    path: "/statistics",
    name: "Statistics"
  }
];

let existModulesContextMap = {};
let asyncModuleFactory = null;
router.addRoutes(staticRoutes);

/**
 * dev 获取当前工程下的module，通过require.context方式获取
 */
if (process.env.NODE_ENV === 'development') {
  existModulesContextMap = require('vue-dynamic-modules');
  console.log('existModulesContextMap for dev: ', existModulesContextMap);
}

/**
 * 判断是否为静态路由
 * @param {*} moduleName：模块名字
 * @returns 
 */
const isStaticRoute = (moduleName) => {
  let isStatic = false;
  staticRoutes[0].children.forEach((childRoute) => {
    if (childRoute.name.toLowerCase() === moduleName) {
      isStatic = true;
      return;
    }
  })
  return isStatic;
}

//动态load js模块文件
const loadScript = (path) => new Promise(((resolve, reject) => {
  const script = document.createElement('script');
  try {
    let joinStr = '?r=';
    if (path.indexOf('&') > -1) {
      joinStr = '&r=';
    }
    joinStr += new Date().getTime();
    path += joinStr;
  } catch (e) {
    console.log(e);
  }

  script.src = path;
  script.async = true;
  script.onload = () => {
    resolve();
  };
  script.onerror = () => {
    reject();
  };
  document.body.appendChild(script);
}));

// 注册路由
const registerRouter = (asyncRoutes, modulePath) => {
  const route = {
    path: modulePath,
    component: Layout,
    children: []
  };
  // 如果有子路由，重组子路由
  if (asyncRoutes[0].children) {
    asyncRoutes[0].children.forEach((childRoute) => {
      if (childRoute.path !== '') {
        route.children.push(childRoute);
      }
    });
  }
  // 动态路由模块，点击两次跳转，待解决
  window.setTimeout(() => {
    router.addRoutes([route]);
  }, 200)
};
//注册子路由、store等
const registerModule = (asyncModule, modulePath, moduleName) => {
  // 注册子模块的子路由
  if (asyncModule.childrenRoutes[0] && asyncModule.childrenRoutes[0].children.length > 0) {
    const asyncRoutes = asyncModule.childrenRoutes;
    registerRouter(asyncRoutes, modulePath);
  }
};

// 开发环境模块异步注册
const asyncModuleFactoryForDev = (routerPath, moduleName) => {
  const moduleContext = existModulesContextMap[moduleName];
  if (moduleContext) {
    const asyncModule = moduleContext(moduleContext.keys()[0]).default;
    const matchedComponents = router.getMatchedComponents(`/${moduleName}`);
    if (typeof matchedComponents[1] === 'function') {
      registerModule(asyncModule, routerPath, moduleName);
      module = asyncModule.module;
    } else {
      module = asyncModule.module;
    }
  } else {
    module = {
      functional: true,
      render() {
        return ( <
          div >
          模块:
          <
          h2 > {
            moduleName
          } < /h2>
          不在本工程或者没有编译 <
          /div>
        );
      }
    };
  }
  return Promise.resolve(module);
};

// 生产环境模块异步注册
const asyncModuleFactoryForPub = (routerPath, moduleName) => {
  const modulePath = `/${moduleName}-${systemSource}/` + `${moduleName}AsyncModule.js`;
  // 加载异步组件
  let asyncModule = null;
  // 如果异步模块已经加载，不进行重复加载
  if (window[`${moduleName}AsyncModule`]) {
    asyncModule = window[`${moduleName}AsyncModule`].default;
    registerModule(asyncModule, routerPath, moduleName);
    return Promise.resolve(asyncModule.module);
  } else {
    const loadScriptPromise = loadScript(modulePath);
    return loadScriptPromise.then(() => {
      asyncModule = window[`${moduleName}AsyncModule`].default;
      registerModule(asyncModule, routerPath, moduleName);
      return Promise.resolve(asyncModule.module);
    }).catch((error) => {
      alert(`模块${modulePath}加载失败，请检查是否正确部署此模块！`);
      return Promise.reject();
    });
  }
}

/**
 * route beforEach 全局路由加载判断，登录验证判断等。
 */
 router.beforeEach((to, from, next) => {
  // 全局路由信息判断，如果不存在则进行动态注册
  if(to.matched.length === 0){
    const pathArr = to.fullPath.split('/');
    asyncModuleFactory('/' + pathArr[1], pathArr[1]).then(() => {
      next();
    }).catch((e) => {
      next();
    });
  }else{
    next();
  }
});

/**
 * 系统启动，权限控制，用户登录信息设置，注册初始化路由等等
 */
const startUp = () => {
  const rootRoutes = {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: []
  };
  // 异步组件加载分发，根据不同环境dev or pub
  asyncModuleFactory = process.env.NODE_ENV === 'development' ? asyncModuleFactoryForDev : asyncModuleFactoryForPub;
  // 动态添加子路由
  for (let i = 0; i < menuData.length; i++) {
    menuData[i].component = () => asyncModuleFactory(menuData[i].path, menuData[i].name.toLowerCase());
    rootRoutes.children.push(menuData[i]);
  }
  router.addRoutes([rootRoutes]);
}

export default {
  startUp
};
