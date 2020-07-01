<template>
  <div :class="transparent ? '' : 'bg-white'">
    <b-navbar variant="dark" class="dragbar text-white">
      Pokémon Sprites
      <b-navbar-nav class="ml-auto">
        <b-form-checkbox v-model="transparent" switch>Fond transparent</b-form-checkbox>
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
      <div class="sprites-grid" :style="{ padding: padding + 'px' }">
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
    gap: {
      get() {
        return this.$store.state.gap;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "gap",
          value
        });
      }
    },
    scale: {
      get() {
        return this.$store.state.scale;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "scale",
          value
        });
      }
    },
    padding: {
      get() {
        return this.$store.state.padding;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "padding",
          value
        });
      }
    },
    sprites() {
      return this.$store.state.sprites;
    }
  },
  methods: {
    addSprite(option) {
      this.$store.commit("addSprite", option.identifier);
    },
    openSettings() {
      if (!this.settingsWindow) {
        this.settingsWindow = new BrowserWindow({
          width: 800,
          useContentSize: true,
          frame: false,
          height: 500
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
