import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // {
  //   path: '/Trending',
  //   component: () => import('@/views/Trending/index'),
  //   hidden: true
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/NeoOps',
    children: [{
      path: 'NeoOps',
      name: 'NeoOps',
      component: () => import('@/views/NeoOps/index'),
      meta: { title: 'NeoOps', icon: 'dashboard' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/Trending',
    component: Layout,
    children: [
      {
        path: 'Trending',
        name: 'TRENDING',
        component: () => import('@/views/Trending/index'),
        meta: { title: 'TRENDING', icon: 'form' }
      }
    ]
  },
  {
    path: '/Pool',
    component: Layout,
    children: [
      {
        path: 'Pool',
        name: 'POOL',
        component: () => import('@/views/Pool/index'),
        meta: { title: 'POOL', icon: 'form' }
      }
    ]
  },
  {
    path: '/Owner',
    component: Layout,
    children: [
      {
        path: 'table',
        name: 'OWNER',
        component: () => import('@/views/Owner/index'),
        meta: { title: 'OWNER', icon: 'form' }
      }
    ]
  },
  {
    path: '/Player',
    component: Layout,
    children: [
      {
        path: 'Player',
        name: 'PLAYER',
        component: () => import('@/views/Player/index'),
        meta: { title: 'PLAYER', icon: 'form' }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
