import Vue from "vue"
import Vuex from "vuex"

import { createPersistedState } from "vuex-electron"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    transparent: false,
    pokeball: null,
    gap: 0,
    scale: 1,
    padding: 0,
    sprites: {
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
    }
  },
  mutations: {
    setOption(state, { field, value }) {
        state[field] = value;
    },
    setSprite(state, { key, value }) {
        Vue.set(state.sprites, key, value);
    }
  },
  plugins: [
    createPersistedState({
        whitelist: ["setOption"]
    }),
  ],
})