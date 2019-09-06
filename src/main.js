import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Vant from 'vant';
import 'lib-flexible';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import BaiduMap from 'vue-baidu-map';
import util from './config/util';

import {chatCfgs} from './config/env';

import VueSocketIO from 'vue-socket.io';

import 'swiper/dist/css/swiper.css';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.use(VueAwesomeSwiper);
Vue.use(require('vue-wechat-title'));
Vue.use(BaiduMap, {
    ak: 'nwgCxkX2WKO9Nc2B257e2WK8fG4GoARV'
});

Vue.prototype.isWeixin = util.isWeixin();
Vue.use(new VueSocketIO({
    debug: true,
    connection: util.isLocal() ? chatCfgs.svlocal : chatCfgs.server, 
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    },
    options: {path: "/socket.io/"}
  })
);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
