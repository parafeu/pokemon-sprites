<template>
  <div>
    <main-view v-if="!isParam"></main-view>
    <settings-view v-else></settings-view>
  </div>
</template>

<script>
import MainView from "./components/MainView";
import SettingsView from "./components/SettingsVue";

export default {
  name: "pokemon-sprites",
  components: {
    MainView,
    SettingsView
  },
  computed: {
    isParam() {
      let params = new URLSearchParams(window.location.search);
      return params.get('settings')
    }
  }
}
</script>

<style>
</style>
