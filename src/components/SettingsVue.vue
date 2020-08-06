<template>
  <div>
    <b-navbar variant="dark" class="dragbar text-white p-0 pl-3">
      {{ $t("settings") }}
      <b-navbar-nav class="ml-auto">
        <div class="segoe-icon ml-3" @click="minimize">&#xE921;</div>
        <div class="segoe-icon s-close" @click="close">&#xE894;</div>
      </b-navbar-nav>
    </b-navbar>
    <b-container fluid id="settings" class="my-2">
      <div class="d-flex justify-content-between">
        <b-button @click="setToDefault" class="mb-2">{{
          $t("default_values")
        }}</b-button>
        <div>
          <a
            class="locale"
            :class="locale === 'fr' ? 'active' : ''"
            href="#"
            @click.prevent="locale = 'fr'"
          >
            <img src="../assets/flags/fr.svg" />
          </a>
          <a
            class="locale"
            :class="locale === 'en' ? 'active' : ''"
            href="#"
            @click.prevent="locale = 'en'"
          >
            <img src="../assets/flags/en.svg" />
          </a>
        </div>
      </div>
      <b-form-file
        class="mb-2"
        :placeholder="$t('change_pokeball')"
        :drop-placeholder="$t('change_pokeball_drop')"
        :browse-text="$t('browse')"
        accept="jpg, JPG, png, PNG, svg, SVG"
        v-model="pokeball"
      ></b-form-file>
      <b-form-group :label="$t('pokeball_size')">
        <b-form-input
          v-model="gap"
          type="range"
          min="0"
          max="100"
        ></b-form-input>
      </b-form-group>
      <b-form-group :label="$t('sprites_size')">
        <b-form-input
          v-model="scale"
          type="range"
          min="0"
          max="5"
          step="0.01"
        ></b-form-input>
      </b-form-group>
      <b-form-group :label="$t('gap_between_pokeballs')">
        <b-form-input
          v-model="gridGap"
          type="range"
          min="0"
          max="10"
          step="0.1"
        ></b-form-input>
      </b-form-group>
      <b-form-group :label="$t('padding_around_sprite_zone')">
        <b-form-input
          v-model="padding"
          type="range"
          min="0"
          max="200"
        ></b-form-input>
      </b-form-group>
      <b-form-checkbox v-model="bwSprites">{{
        $t("sprites_5g")
      }}</b-form-checkbox>
      <h5 class="my-4 text-center">{{ $t("display_mode") }}</h5>
      <div class="d-flex justify-content-center modes">
        <a
          class="mx-4"
          href="#"
          :class="mode === '3x2' ? 'selected' : ''"
          @click.prevent="mode = '3x2'"
        >
          <img src="../assets/3x2.svg" />
        </a>
        <a
          class="mx-4"
          href="#"
          :class="mode === '2x3' ? 'selected' : ''"
          @click.prevent="mode = '2x3'"
        >
          <img src="../assets/2x3.svg" />
        </a>
        <a
          class="mx-4"
          href="#"
          :class="mode === '1x6' ? 'selected' : ''"
          @click.prevent="mode = '1x6'"
        >
          <img src="../assets/1x6.svg" />
        </a>
        <a
          class="mx-4"
          href="#"
          :class="mode === '6x1' ? 'selected' : ''"
          @click.prevent="mode = '6x1'"
        >
          <img src="../assets/6x1.svg" />
        </a>
      </div>
    </b-container>
  </div>
</template>

<script>
const remote = require("electron").remote;
const { ipcRenderer } = require("electron");

export default {
  mounted() {
    this.$store.subscribe((mutation) =>
      ipcRenderer.send("vuex-mutation", mutation)
    );
    this.$i18n.locale = this.$store.state.locale;
  },
  computed: {
    pokeball: {
      get() {
        return this.$store.state.pokeball;
      },
      set(value) {
        if (
          value.type === "image/png" ||
          value.type === "image/jpeg" ||
          value.type === "image/svg+xml"
        ) {
        }

        this.$store.commit("setOption", {
          field: "pokeball",
          value: {
            type: value.type,
            path: value.path,
          },
        });
      },
    },
    gap: {
      get() {
        return this.$store.state.gap;
      },
      set(value) {
        this.$i18n.locale = value;
        this.$store.commit("setOption", {
          field: "gap",
          value,
        });
      },
    },
    gridGap: {
      get() {
        return this.$store.state.gridGap;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "gridGap",
          value,
        });
      },
    },
    scale: {
      get() {
        return this.$store.state.scale;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "scale",
          value,
        });
      },
    },
    padding: {
      get() {
        return this.$store.state.padding;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "padding",
          value,
        });
      },
    },
    mode: {
      get() {
        return this.$store.state.mode;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "mode",
          value,
        });
      },
    },
    bwSprites: {
      get() {
        return this.$store.state.bwSprites;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "bwSprites",
          value,
        });
      },
    },
    locale: {
      get() {
        return this.$store.state.locale;
      },
      set(value) {
        this.$store.commit("setLocale", value);
      },
    },
  },
  methods: {
    close() {
      remote.getCurrentWindow().close();
    },
    minimize() {
      remote.getCurrentWindow().minimize();
    },
    setToDefault() {
      this.$store.commit("setToDefault");
    },
  },
};
</script>

<style>
#settings {
  -webkit-app-region: no-drag;
}

input[type="checkbox"] {
  z-index: 99;
}

.modes > a {
  width: 64px;
}

.modes .selected {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5;
}

.locale {
  transition: all 0.2s ease-in-out;
  opacity: 0.5;
}
.locale.active {
  opacity: 1;
}

.locale img {
  width: 2rem;
}
</style>
