import { asyncRoutes, constantRoutes } from '@/router'

function filterAsyncRoutes(routes, powerList) {
  const ret = []
  for (const route of routes) {
    // eslint-disable-next-line no-labels
    inter: for (const power of powerList) {
      // is menu
      if (power.isMenu) {
        // delete /fbi
        const urlIndex = power.url.indexOf('/', 1)
        const urlString = power.url.substring(urlIndex)
        // route.children === undefined / route.children.length === 0
        if (route.path === urlString && (route.children === undefined || route.children.length === 0)) {
          ret.push(route)
          // eslint-disable-next-line no-labels
          break inter
          // 1: path === url, route.children === true
        } else if (route.path === urlString && route.children) {
          const startIndex = 3
          route.children = filterRouteChildren(route.children, powerList, startIndex)
          ret.push(route)
        } else {
          // 2: path !== url, route.children === true
          // 3: path !== url, route.children === false
        }
      } else {
        // no menu
      }
    }
  }
  ret.push({ path: '*', redirect: '/404', hidden: true })
  return ret
}

function filterRouteChildren(routeChildren, powerList, startIndex) {
  const children = []
  for (const child of routeChildren) {
    // eslint-disable-next-line no-labels
    inter: for (const power of powerList) {
      if (power.isMenu) {
        // /fbi/abc/def => ['', 'fbi', 'abc', 'def']
        const urlList = power.url.split('/')
        const urlString = urlList[startIndex]
        if (urlString === undefined) {
          continue
        }
        if (child.path === urlString && (child.children === undefined || child.children.length === 0)) {
          children.push(child)
          // eslint-disable-next-line no-labels
          break inter
        } else if (child.path === urlString && child.children) {
          child.children = filterRouteChildren(child.children, powerList, startIndex + 1)
          children.push(child)
          // eslint-disable-next-line no-labels
          break inter
        }
      }
    }
  }
  return children
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  REMOVE_ROUTES: (state) => {
    state.addRoutes = []
    state.routes = []
  }
}

const actions = {
  generateRoutes({ commit }, powerList) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, powerList)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },

  removeGenerateRoutes({ commit }) {
    commit('REMOVE_ROUTES')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
