<template>
  <div id="app" :class="transparent ? '' : 'bg-white'">
    <b-navbar variant="dark" class="dragbar text-white">
      Pokémon Sprites
      <b-navbar-nav class="ml-auto">
        <b-form-checkbox v-model="transparent" switch>Fond transparent</b-form-checkbox>
      </b-navbar-nav>
    </b-navbar>
    <b-navbar variant="light">
      <b-button class="ml-auto" v-b-toggle.settings>Paramètres</b-button>
    </b-navbar>
    <b-collapse id="settings" class="bg-white p-3">
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
    </b-collapse>
    <b-container fluid class="content">
      <div class="sprites-grid" :style="{ padding: padding + 'px' }">
        <sprite v-for="(sprite, key) in sprites" :key="key" :sprite="sprite"></sprite>
      </div>
    </b-container>
  </div>
</template>

<script>
import Sprite from "./components/Sprite";
export default {
  name: "pokemon-sprites",
  components: {
    Sprite
  },
  computed: {
    pokeball: {
      get() {
        return this.$store.state.pokeball;
      },
      set(value) {
        
        if(value.type === "image/png" || value.type === "image/jpeg" || value.type === "image/svg+xml"){

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
  }
};
</script>

<style>
html,
body {
  background-color: transparent !important;
  overflow: hidden;
}

#settings {
  position: absolute;
  width: 100%;
  background-color: white;
  z-index: 99;
}

.content {
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
}

.dragbar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}

.dragbar .navbar-nav {
  -webkit-app-region: no-drag;
}

.sprites-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.sprites-grid > * {
  position: relative;
  width: 33%;
}
</style>
