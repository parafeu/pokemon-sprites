import Vue from 'vue'
import Main from './Main.vue'
import store from '../../store'
import i18n from '../../locales'

import "../../imports";

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: h => h(Main)
}).$mount('#app')
