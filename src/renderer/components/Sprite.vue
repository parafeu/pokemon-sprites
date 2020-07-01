<template>
  <div :key="sprite">
    <div class="sprite">
      <div class="sprite-ball" :style="ballStyle"></div>
      <template v-if="sprite">
        <div class="sprite-img">
          <template v-if="bwSprites">
            <img
              v-if="!bwError"
              :src="'https://play.pokemonshowdown.com/sprites/gen5ani/' + sprite + '.gif'"
              :style="imgStyle"
              @error="bwError = true"
            />
            <img
              v-else
              :src="'https://play.pokemonshowdown.com/sprites/gen5/' + sprite + '.png'"
              :style="imgStyle"
              @error="bwError = true"
            />
          </template>
          <img
            v-else
            :src="'https://play.pokemonshowdown.com/sprites/ani/' + sprite + '.gif'"
            :style="imgStyle"
          />
        </div>
        <b-button-group size="sm" class="toolbar rounded-circle">
          <b-button @click="toLeft" v-if="index > 0" class="rounded-left-pill">
            <b-icon-chevron-left class="py-1"></b-icon-chevron-left>
          </b-button>
          <b-button
            @click="toRight"
            v-if="index < (spritesLength-1)"
            :class="index > 0 ? '' : 'rounded-left-pill'"
          >
            <b-icon-chevron-right class="py-1"></b-icon-chevron-right>
          </b-button>
          <b-button
            @click="deleteSprite"
            variant="danger"
            class="rounded-right-pill"
            :class="spritesLength > 1 ? '' : 'rounded-left-pill'"
          >
            <b-icon-x></b-icon-x>
          </b-button>
        </b-button-group>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ["index", "sprite"],
  data() {
    return {
      bwError: false
    };
  },
  methods: {
    toLeft() {
      this.$store.commit("toLeftSprite", this.index);
    },
    toRight() {
      this.$store.commit("toRightSprite", this.index);
    },
    deleteSprite() {
      this.$store.commit("deleteSprite", this.index);
    }
  },
  computed: {
    bwSprites() {
      return this.$store.state.bwSprites;
    },
    ballStyle() {
      let ball = require("../assets/pokeball.svg");

      if (
        this.$store.state.pokeball &&
        this.$store.state.pokeball.path &&
        this.$store.state.pokeball.type
      ) {
        try {
          let data = fs.readFileSync(this.$store.state.pokeball.path);

          ball = `data:${
            this.$store.state.pokeball.type
          };base64,${data.toString("base64")}`;
        } catch (e) {}
      }

      return {
        margin: this.$store.state.gap / 2 + "%",
        background: `url("${ball}") no-repeat`
      };
    },
    imgStyle() {
      return {
        transform: `scale(${this.$store.state.scale})`
      };
    },
    spritesLength() {
      return this.$store.state.sprites.length;
    }
  }
};
</script>

<style lang="scss">
.sprite {
  position: relative;
  padding-bottom: 100%;

  .sprite-ball {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-size: contain !important;
    background-position: center !important;
  }

  .sprite-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toolbar {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    visibility: hidden;
  }

  &:hover {
    .toolbar {
      visibility: visible;
    }
  }

  .btn-group-sm .btn {
    padding: 0 0.2rem !important;
  }

  .rounded-left-pill {
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }

  .rounded-right-pill {
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }
}
</style>