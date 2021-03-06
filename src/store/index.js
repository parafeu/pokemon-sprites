import Vue from 'vue'
import Vuex from 'vuex'

import i18n from "../locales";

Vue.use(Vuex)

export default new Vuex.Store({
  state: Object.assign({
    transparent: false,
    pokeball: null,
    gap: 50,
    gridGap: 0,
    scale: 2.5,
    padding: 100,
    bwSprites: false,
    sprites: [],
    mode: "3x2",
    locale: navigator.language.split("-")[0],
  }, window.state ? window.state : {}),
  mutations: {
    setOption(state, { field, value }) {
      Vue.set(state, field, value)
    },
    addSprite(state, value) {
      if (state.sprites.length < 6) {
        Vue.set(state.sprites, state.sprites.length, value);
      }
    },
    toLeftSprite(state, index) {
      let newSprites = Array.from(state.sprites);
      let b = newSprites[index - 1];
      newSprites[index - 1] = newSprites[index];
      newSprites[index] = b;

      Vue.set(state, "sprites", newSprites);
    },
    toRightSprite(state, index) {
      let newSprites = Array.from(state.sprites);
      let b = newSprites[index + 1];
      newSprites[index + 1] = newSprites[index];
      newSprites[index] = b;

      Vue.set(state, "sprites", newSprites);
    },
    deleteSprite(state, index) {
      let newSprites = Array.from(state.sprites);
      newSprites.splice(index, 1);
      Vue.set(state, "sprites", newSprites);
    },
    setToDefault(state) {
      let defaultState = {
        transparent: false,
        pokeball: null,
        gap: 50,
        gridGap: 0,
        scale: 2.5,
        padding: 100,
        bwSprites: false,
        mode: "3x2",
        locale: navigator.language.split("-")[0],
      };
      i18n.locale = navigator.language.split("-")[0];
      Object.keys(defaultState).forEach((key) => {
        Vue.set(state, key, defaultState[key]);
      });
    },
    clearSprites(state) {
      Vue.set(state, "sprites", []);
    },
    setLocale(state, lang) {
      i18n.locale = lang;
      Vue.set(state, "locale", lang);
    },
  },
})
