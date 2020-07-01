<template>
  <div>
    <b-navbar variant="dark" class="dragbar text-white">
      Paramètres
      <b-navbar-nav class="ml-auto">
        <b-button-close class="text-white mb-2" @click="close"></b-button-close>
      </b-navbar-nav>
    </b-navbar>
    <b-container fluid id="settings" class="my-2">
      <b-form-file
        class="mb-2"
        placeholder="Choisir un fichier pour changer le fond pokéball (png, jpg, svg)"
        drop-placeholder="Choisir un fichier pour changer le fond pokéball (png, jpg, svg)"
        browse-text="Parcourir"
        accept="jpg, JPG, png, PNG, svg, SVG"
        v-model="pokeball"
      ></b-form-file>
      <b-form-group label="Espacement entre chaque ball">
        <b-form-input v-model="gap" type="range" min="0" max="100"></b-form-input>
      </b-form-group>
      <b-form-group label="Taille des sprites">
        <b-form-input v-model="scale" type="range" min="0" max="5" step="0.01"></b-form-input>
      </b-form-group>
      <b-form-group label="Espacement autour de la zone des sprites ( pour éviter les coupures )">
        <b-form-input v-model="padding" type="range" min="0" max="200"></b-form-input>
      </b-form-group>
      <b-form-checkbox v-model="bwSprites">Sprites 5G</b-form-checkbox>
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
    test(value) {
      console.log(value);
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
</style>