<template>
  <div :class="transparent ? '' : 'bg-white'">
    <b-navbar variant="dark" class="dragbar text-white p-0 pl-3">
      Pokémon Sprites
      <b-navbar-nav class="ml-auto d-flex align-items-center">
        <b-form-checkbox v-model="transparent" switch>
          {{
          $t("transparent_background")
          }}
        </b-form-checkbox>
        <div class="segoe-icon ml-3" @click="minimize">&#xE921;</div>
        <div class="segoe-icon s-close" @click="close">&#xE894;</div>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar variant="light">
      <multiselect
        :placeholder="$t('add_pokemon')"
        v-if="dex"
        :options="dex"
        track-by="id"
        :custom-label="
          (option) => {
            return (
              ($i18n.locale === 'fr' ? option.lang.fr + ' | ' : '') +
              option.lang.en
            );
          }
        "
        @input="addSprite"
      ></multiselect>
      <b-button class="ml-4 clear-button" @click="clearSprites">
        {{ $t("clear_sprites") }}
        <b-icon-trash class="ml-2"></b-icon-trash>
      </b-button>
      <b-button class="ml-4 settings-button" @click="openSettings">
        {{ $t("settings") }}
        <b-icon-gear class="ml-2"></b-icon-gear>
      </b-button>
    </b-navbar>
    <b-collapse id="settings" class="bg-white p-3 shadow-sm"></b-collapse>
    <b-container fluid class="content">
      <div
        class="sprites-grid"
        :class="mode"
        :style="{ padding: padding + 'px', gridGap: gridGap + '%' }"
      >
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
import Sprite from "../../components/Sprite";

export default {
  name: "main-view",
  components: {
    Sprite,
  },
  mounted() {
    window.axios
      .get(
        "https://gist.githubusercontent.com/parafeu/b9257191b25cfb53f7db77cf90604094/raw/"
      )
      .then((response) => {
        this.dex = response.data;
      });

    window.ipcRenderer.send("vuex-subscribe");

    window.ipcRenderer.on("vuex-mutation", (event, mutation) => {
      this.$store.commit(mutation.type, mutation.payload);
    });

    this.$i18n.locale = this.$store.state.locale;

    this.$store.subscribe((mutation, state) => {
      window.ipcRenderer.send("vuex-change", state);
    });
  },
  data() {
    return {
      dex: null,
      settingsWindow: null,
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
          value: value,
        });
      },
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
      switch (this.$store.state.mode) {
        case "3x2": {
          return "three_two";
        }
        case "2x3": {
          return "two_three";
        }
        case "1x6": {
          return "one_six";
        }
        case "6x1": {
          return "six_one";
        }
      }
      return null;
    },
  },
  methods: {
    addSprite(option) {
      this.$store.commit("addSprite", option.identifier);
    },
    close() {
      window.ipcRenderer.send("main-close");
    },
    minimize() {
      window.ipcRenderer.send("main-minimize");
    },
    openSettings() {
      window.ipcRenderer.send("open-settings");
    },
    clearSprites() {
      this.$store.commit("clearSprites");
    },
  },
};
</script>