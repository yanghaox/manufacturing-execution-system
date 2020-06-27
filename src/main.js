import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import VueBarcode from '@xkeshi/vue-barcode' // 导入条形码插件
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import Print from 'vue-print-nb'
import { checkPermission } from '@/directive/btn-competence/btn-competence'
import drag from '@/directive/el-drag-dialog/drag'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.component('barcode', VueBarcode) // 声明条形码组件
Vue.directive('permission-key', {
  inserted: function() {
    checkPermission(arguments[0], arguments[1], store.getters.competence)
  }
})
Vue.directive('el-drag-dialog', drag)
Vue.use(Print)
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
