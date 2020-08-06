import Vue from "vue";
import axios from "axios";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Multiselect from "vue-multiselect";

import "vue-multiselect/dist/vue-multiselect.min.css";
import "./app.scss";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.component("multiselect", Multiselect);

window.axios = axios;