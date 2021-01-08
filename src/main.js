import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'lib-flexible/flexible'

//导入vant框架的组件
import {
  Icon,
  Tabbar,
  TabbarItem,
  Search,
  NavBar,
  Toast,
  Empty,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Rate,
  Divider,
  Button,

} from 'vant';
// 全局注册
Vue
  .use(Icon)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(NavBar)
  .use(Toast)
  .use(Empty)
  .use(Tab)
  .use(Tabs)
  .use(Swipe)
  .use(SwipeItem)
  .use(Grid)
  .use(GridItem)
  .use(Rate)
  .use(Divider )
  .use(Button )

Vue.config.productionTip = false
// Vue.prototype.axios = axios
Vue.use(VueAxios, axios)
//设置请求的基础路径
axios.defaults.baseURL = 'http://novel.kele8.cn'
//设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')