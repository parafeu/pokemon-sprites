<template>
  <div :class="transparent ? '' : 'bg-white'">
    <b-navbar variant="dark" class="dragbar text-white p-0 pl-3">
      Pokémon Sprites
      <b-navbar-nav class="ml-auto d-flex align-items-center">
        <b-form-checkbox v-model="transparent" switch>Fond transparent</b-form-checkbox>
        <div class="segoe-icon ml-3" @click="minimize">&#xE921;</div>
        <div class="segoe-icon s-close" @click="close">&#xE894;</div>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar variant="light">
      <multiselect
        placeholder="Ajouter un pokémon"
        v-if="dex"
        :options="dex"
        track-by="id"
        :custom-label="(option) => {return option.lang.fr + ' | ' + option.lang.en}"
        @input="addSprite"
      ></multiselect>
      <b-button class="ml-4 settings-button" @click="openSettings">
        Paramètres
        <b-icon-gear class="ml-2"></b-icon-gear>
      </b-button>
    </b-navbar>
    <b-collapse id="settings" class="bg-white p-3 shadow-sm"></b-collapse>
    <b-container fluid class="content">
      <div class="sprites-grid" :class="mode" :style="{ padding: padding + 'px', gridGap: gridGap + '%' }">
        <sprite :index="0" :sprite="sprites[0]"></sprite>
        <sprite :index="1" :sprite="sprites[1]"></sprite>
        <sprite :index="2" :sprite="sprites[2]"></sprite>
        <sprite :index="3" :sprite="sprites[3]"></sprite>
        <sprite :index="4" :sprite="sprites[4]"></sprite>
        <sprite :index="5" :sprite="sprites[5]"></sprite>
      </div>
    </b-container>
  </div>
</template>

<script>
import Sprite from "./Sprite";

const remote = require("electron").remote;
const { BrowserWindow } = remote;
const { ipcRenderer } = require("electron");

export default {
  name: "main-view",
  components: {
    Sprite
  },
  mounted() {
    axios
      .get(
        "https://gist.githubusercontent.com/parafeu/b9257191b25cfb53f7db77cf90604094/raw/"
      )
      .then(response => {
        this.dex = response.data;
      });
    ipcRenderer.send("vuex-subscribe");

    ipcRenderer.on("vuex-mutation", (event, mutation) => {
      this.$store.commit(mutation.type, mutation.payload);
    });
  },
  data() {
    return {
      dex: null,
      settingsWindow: null
    };
  },
  computed: {
    transparent: {
      get() {
        return this.$store.state.transparent;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "transparent",
          value: value
        });
      }
    },
    gap() {
      return this.$store.state.gap;
    },
    gridGap() {
      return this.$store.state.gridGap;
    },
    scale() {
      return this.$store.state.scale;
    },
    padding() {
      return this.$store.state.padding;
    },
    sprites() {
      return this.$store.state.sprites;
    },
    mode() {
      switch(this.$store.state.mode){
        case "3x2": {
          return "three_two"
        }
        case "2x3": {
          return "two_three"
        }
        case "1x6": {
          return "one_six"
        }
        case "6x1": {
          return "six_one"
        }
      }
    }
  },
  methods: {
    addSprite(option) {
      this.$store.commit("addSprite", option.identifier);
    },
    close() {
      remote.getCurrentWindow().close();
    },
    minimize() {
      remote.getCurrentWindow().minimize();
    },
    openSettings() {
      if (!this.settingsWindow) {
        this.settingsWindow = new BrowserWindow({
          width: 800,
          useContentSize: true,
          frame: false,
          height: 600
        });
        this.settingsWindow.loadURL(window.location.href + "?settings=true");
        this.settingsWindow.on("close", () => (this.settingsWindow = null));

        remote
          .getCurrentWindow()
          .on("close", () => this.settingsWindow.close());
      } else {
        this.settingsWindow.focus();
      }
    }
  }
};
</script>

<style>
</style>
