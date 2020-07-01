import Vue from 'vue'
import axios from 'axios'
import App from './App'

import fs from "fs";

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Multiselect from "vue-multiselect";

import store from "./store";

import "./app.scss";
import "vue-multiselect/dist/vue-multiselect.min.css";

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.component('multiselect', Multiselect)

window.axios = axios;
window.fs = fs;

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
  store
}).$mount('#app')
