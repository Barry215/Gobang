import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import App from './src/app'
import routes from './src/routes'
import iView from 'iview';
import store from './src/store/store';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(VueRouter);


const router = new VueRouter({
  routes: routes
});

const app = new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app');

//不知道这样可不可以
// el字段，同index.html中的id为“app”的div标签关联起来，即指定了vue生成的dom的挂载点
// render,就是把Vue的代码渲染成dom元素
// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// });
