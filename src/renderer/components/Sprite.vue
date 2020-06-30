<template>
  <div>
    <div class="sprite">
      <div class="sprite-ball" :style="ballStyle"></div>
      <div class="sprite-img">
        <img v-if="sprite" :src="sprite" :style="imgStyle" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["sprite"],
  computed: {
    ballStyle() {
      let ball = require("../assets/pokeball.svg");

      if (
        this.$store.state.pokeball &&
        this.$store.state.pokeball.path &&
        this.$store.state.pokeball.type
      ) {
        try {
          let data = fs.readFileSync(
            this.$store.state.pokeball.path
          );

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
    }
  }
};
</script>

<style>
.sprite {
  position: relative;
  padding-bottom: 100%;
}

.sprite .sprite-ball {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-size: contain !important;
  background-position: center !important;
}

.sprite .sprite-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>