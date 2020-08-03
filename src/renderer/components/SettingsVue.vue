<template>
  <div>
    <b-navbar variant="dark" class="dragbar text-white p-0 pl-3">
      Paramètres
      <b-navbar-nav class="ml-auto">
        <div class="segoe-icon ml-3" @click="minimize">&#xE921;</div>
        <div class="segoe-icon s-close" @click="close">&#xE894;</div>
      </b-navbar-nav>
    </b-navbar>
    <b-container fluid id="settings" class="my-2">
      <b-button @click="setToDefault" class="mb-2">Valeurs par défault</b-button>
      <b-form-file
        class="mb-2"
        placeholder="Choisir un fichier pour changer le fond pokéball (png, jpg, svg)"
        drop-placeholder="Choisir un fichier pour changer le fond pokéball (png, jpg, svg)"
        browse-text="Parcourir"
        accept="jpg, JPG, png, PNG, svg, SVG"
        v-model="pokeball"
      ></b-form-file>
      <b-form-group label="Taille du fond pokéball">
        <b-form-input v-model="gap" type="range" min="0" max="100"></b-form-input>
      </b-form-group>
      <b-form-group label="Taille des sprites">
        <b-form-input v-model="scale" type="range" min="0" max="5" step="0.01"></b-form-input>
      </b-form-group>
      <b-form-group label="Espacement entre les pokéballs">
        <b-form-input v-model="gridGap" type="range" min="0" max="10" step="0.1"></b-form-input>
      </b-form-group>
      <b-form-group label="Espacement autour de la zone des sprites ( pour éviter les coupures )">
        <b-form-input v-model="padding" type="range" min="0" max="200"></b-form-input>
      </b-form-group>
      <b-form-checkbox v-model="bwSprites">Sprites 5G</b-form-checkbox>
      <h5 class="my-4 text-center">Mode d'affichage</h5>
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
    this.$store.subscribe(mutation =>
      ipcRenderer.send("vuex-mutation", mutation)
    );
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
            path: value.path
          }
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
    gridGap: {
      get() {
        return this.$store.state.gridGap;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "gridGap",
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
    mode: {
      get() {
        return this.$store.state.mode;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "mode",
          value
        });
      }
    },
    bwSprites: {
      get() {
        return this.$store.state.bwSprites;
      },
      set(value) {
        this.$store.commit("setOption", {
          field: "bwSprites",
          value
        });
      }
    }
  },
  methods: {
    close() {
      remote.getCurrentWindow().close();
    },
    minimize() {
      remote.getCurrentWindow().minimize();
    },
    setToDefault() {
      this.$store.commit('setToDefault')
    }
  }
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

.modes .selected{
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5;
}
</style>