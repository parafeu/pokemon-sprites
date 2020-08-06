import Vue from 'vue'
import Settings from './Settings.vue'
import store from '../../store'
import i18n from '../../locales'

Vue.config.productionTip = false

import "../../imports";

new Vue({
  store,
  i18n,
  render: h => h(Settings)
}).$mount('#app')
