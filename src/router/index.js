import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('../views/Home.vue')
    }, {
      path: 'ranking',
      name: 'Ranking',
      component: () => import('../views/Ranking.vue')
    }, {
      path: 'bookmail',
      name: 'BookMail',
      component: () => import('../views/BookMail.vue')
    }, {
      path: 'search',
      name: 'Search',
      component: () => import('../views/Search.vue')
    },{
      path: 'my',
      name: 'My',
      component: () => import('../views/My.vue')
    }
  ]
  },{
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },{
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
},
{
    path: '/classchildren',
    name: 'ClassChildren',
    component: () => import('../views/ClassChildren.vue')
},
{
  path:'/classchild',
  name:'ClassChild',
  component:()=>import('../views/ClassChild.vue')
},
{
    path: '/cataloglist',
    name: 'CatalogList',
    component: () => import('../views/CatalogList.vue')
},
{
    path: '/Reader',
    name: 'Reader',
    component: () => import('../views/Reader.vue')
},
{
    path: '/relevant',
    name: 'Relevant',
    component: () => import('../views/Relevant.vue')
},
//重定向
{
  path:'*',
  redirect:{
    name:'BookMail'
  }
}









]

const router = new VueRouter({
  routes
})

export default router