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
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
    affix: Boolean                if set true, item will always show in tagview(default is false)
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/table-demo',
    alwaysShow: true, // will always show the root menu
    name: 'Demo',
    hidden: true,
    children: [
      {
        path: 'table-demo',
        component: () => import('@/views/demo/demo'),
        hidden: true
      },
      {
        path: 'form-demo',
        component: () => import('@/views/demo/formDemo'),
        hidden: true
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/personal-center',
    children: [
      // {
      //   path: 'dashboard',
      //   name: 'Dashboard',
      //   component: () => import('@/views/dashboard/index'),
      //   meta: { title: '工作台', icon: 'dashboard', affix: true }
      // },
      {
        path: 'personal-center',
        name: 'PersonalCenter',
        component: () => import('@/views/personalCenter'),
        hidden: true,
        meta: { title: '个人中心' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/produce',
    component: Layout,
    redirect: '/produce/work-order',
    alwaysShow: true,
    name: 'Produce',
    meta: {
      title: '生产管理',
      icon: 'shengchan'
    },
    children: [
      {
        path: 'work-order',
        name: 'WorkOrder',
        component: () => import('@/views/produce/workOrder'),
        meta: { title: '工单管理' }
      },
      {
        path: 'batch',
        name: 'Batch',
        component: () => import('@/views/produce/batch'),
        meta: { title: '批次管理' }
      },
      {
        path: 'burden',
        name: 'Burden',
        component: () => import('@/views/produce/burden'),
        meta: { title: '配料管理' }
      },
      {
        path: 'type',
        name: 'Type',
        component: () => import('@/views/produce/type'),
        meta: { title: '工作类型管理' }
      },
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/produce/index'),
        meta: { title: '批次甘特图(模板)' }
      }
    ]
  },
  {
    path: '/stock',
    component: Layout,
    redirect: '/stock/material',
    alwaysShow: true, // will always show the root menu
    name: 'Stock',
    meta: {
      title: '仓储管理',
      icon: 'cangchu'
    },
    children: [
      {
        path: 'material',
        component: () => import('@/views/stock/material'),
        name: 'Material',
        meta: {
          title: '原料仓'
        }
      },
      {
        path: 'package',
        component: () => import('@/views/stock/package'),
        name: 'Package',
        meta: {
          title: '包材仓'
        }
      },
      {
        path: 'wip',
        component: () => import('@/views/stock/wip'),
        name: 'Wip',
        meta: {
          title: '半成品仓'
        }
      },
      {
        path: 'product',
        component: () => import('@/views/stock/product'),
        name: 'Product',
        meta: {
          title: '成品仓'
        }
      }
    ]
  },
  {
    path: '/formula',
    component: Layout,
    redirect: '/formula/material',
    alwaysShow: true, // will always show the root menu
    name: 'Formula',
    meta: {
      title: '配方管理',
      icon: 'formula'
    },
    children: [
      {
        path: 'material',
        component: () => import('@/views/formula/material'),
        name: 'Material',
        meta: {
          title: '原料信息维护'
        }
      },
      {
        path: 'package',
        component: () => import('@/views/formula/package'),
        name: 'Package',
        meta: {
          title: '包材信息维护'
        }
      },
      {
        path: 'wip',
        component: () => import('@/views/formula/wip'),
        name: 'Wip',
        meta: {
          title: '半成品信息维护'
        }
      },
      {
        path: 'product',
        component: () => import('@/views/formula/product'),
        name: 'Product',
        meta: {
          title: '成品信息维护'
        }
      },
      {
        path: 'bom-wip',
        component: () => import('@/views/formula/bomWip'),
        name: 'BomWip',
        meta: {
          title: '半成品BOM管理'
        }
      },
      {
        path: 'bom-product',
        component: () => import('@/views/formula/bomProduct'),
        name: 'BomProduct',
        meta: {
          title: '成品BOM管理'
        }
      },
      {
        path: 'error',
        component: () => import('@/views/formula/error'),
        name: 'Error',
        meta: {
          title: '误差管理'
        }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/attribute',
    alwaysShow: true, // will always show the root menu
    name: 'Device',
    meta: {
      title: '设备管理',
      icon: 'device'
    },
    children: [
      {
        path: 'attribute',
        component: () => import('@/views/device/attribute'),
        name: 'Attribute',
        meta: {
          title: '设备属性'
        }
      },
      {
        path: 'method',
        component: () => import('@/views/device/method'),
        name: 'Method',
        meta: {
          title: '设备方式'
        }
      },
      {
        path: 'function',
        component: () => import('@/views/device/function'),
        name: 'Function',
        meta: {
          title: '设备功能'
        }
      },
      {
        path: 'type',
        component: () => import('@/views/device/type'),
        name: 'Type',
        meta: {
          title: '设备类型'
        }
      },
      {
        path: 'pipeline',
        component: () => import('@/views/device/pipeline'),
        name: 'Pipeline',
        meta: {
          title: '设备管道'
        }
      },
      {
        path: 'unit',
        component: () => import('@/views/device/unit'),
        name: 'Unit',
        meta: {
          title: '设备单元'
        }
      },
      {
        path: 'group',
        component: () => import('@/views/device/group'),
        name: 'Group',
        meta: {
          title: '设备组'
        }
      }
    ]
  },
  {
    path: '/work-location',
    component: Layout,
    redirect: '/work-location/work-shop',
    alwaysShow: true, // will always show the root menu
    name: 'WorkLocation',
    meta: {
      title: '车间管理',
      icon: 'chejian'
    },
    children: [
      {
        path: 'work-shop',
        component: () => import('@/views/workLocation/workShop'),
        name: 'WorkShop',
        meta: {
          title: '车间信息'
        }
      },
      {
        path: 'work-location',
        component: () => import('@/views/workLocation/workLocation'),
        name: 'WorkLocation',
        meta: {
          title: '工位信息'
        }
      },
      {
        path: 'storage-location',
        component: () => import('@/views/workLocation/storageLocation'),
        name: 'StorageLocation',
        meta: {
          title: '库位信息'
        }
      }
    ]
  },
  {
    path: '/tech',
    component: Layout,
    redirect: '/tech/info',
    alwaysShow: true,
    name: 'Technology',
    meta: {
      title: '工艺管理',
      icon: 'gongyi'
    },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/technology/info'),
        meta: {
          title: '工艺编写'
        }
      }
      // {
      //   path: 'type',
      //   name: 'Type',
      //   component: () => import('@/views/technology/type'),
      //   meta: {
      //     title: '工艺类型'
      //   }
      // }
    ]
  },
  {
    path: '/security',
    component: Layout,
    redirect: '/security/department-postion',
    alwaysShow: true, // will always show the root menu
    name: 'Security',
    meta: {
      title: '安全管理',
      icon: 'security'
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/security/role'),
        name: 'Role',
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'postion',
        component: () => import('@/views/security/postion'),
        name: 'Postion',
        meta: {
          title: '岗位管理'
        }
      },
      {
        path: 'department-postion',
        component: () => import('@/views/security/departPostion'),
        name: 'DepartPostion',
        meta: {
          title: '部门岗位管理'
        }
      },
      {
        path: 'department-postion-user',
        component: () => import('@/views/security/departPostionUser'),
        name: 'DepartPostionUser',
        meta: {
          title: '部门岗位员工管理'
        }
      },
      {
        path: 'user',
        component: () => import('@/views/security/user'),
        name: 'User',
        meta: {
          title: '管理全部员工'
        }
      }
    ]
  }
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
