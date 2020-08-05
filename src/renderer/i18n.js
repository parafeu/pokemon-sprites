import VueI18n from "vue-i18n";
import Vue from "vue";

let messages = {};

const files = require.context(__dirname + "/locales", true, /\.json$/i);
files.keys().map((key) => {
  let locale = key.split("/")[1].split(".")[0];
  messages[locale] = files(key);
});

Vue.use(VueI18n);

export default new VueI18n({
  fallbackLocale: "en",
  locale: "fr",
  messages,
});
