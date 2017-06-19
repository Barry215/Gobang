import * as Vue from 'vue';
import * as VueRouter from 'vue-router';
import App from './src/app';
import routes from './src/routes';
import iView from 'iview';
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
//# sourceMappingURL=build.js.map