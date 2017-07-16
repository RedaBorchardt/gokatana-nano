import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'loader',
      component: require('@/components/loader')
    },
    {
      path: '/mainwindow',
      name: 'mainwindow',
      component: require('@/components/mainwindow')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
