/* eslint-disable */
import Vue from 'vue';
import { createApp } from './app';
import { axios } from './config/index';
import queryString from 'querystring';
Vue.prototype.$http = axios;
import './assets/font-awesome/scss/font-awesome.scss';
import './assets/bootstrap.min.css';
import './assets/style.scss';

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp(context);
    const queryParam = queryString.parse(context.url.replace(/.+\?/, ''));
    console.log('queryParam -> ', queryParam);
    router.push(context.url);
    router.beforeEach((to, from, next) => {
      console.log(' router.beforeEach-> ', to);
    });

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      console.log('++matchedComponents -> ', matchedComponents.map(item => item.name));

      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }
      // 对所有匹配的路由组件调用 `asyncData()`
      // TODO 优化这种情况
      // 渲染之前确保分类列表数据也请求好，当前该请求数据的组件并不在路由matchedComponents里面
      Promise.all(
        [...matchedComponents.map((Component) => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
              query: queryParam,
            });
          }
        }), store.dispatch('_getAllCategories')],
      )
        .then((result) => {
          // 在所有预取钩子(preFetch hook) resolve 后，
          // 我们的 store 现在已经填充入渲染应用程序所需的状态。
          // 当我们将状态附加到上下文，
          // 并且 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
          context.state = store.state;
          // Promise 应该 resolve 应用程序实例，以便它可以渲染
          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
};
