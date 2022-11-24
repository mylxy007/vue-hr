<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon
      icon-class="fullscreen"
      class="fullscreen"
      v-show="!isFull"
      @click="toggleScreen"
    />
    <svg-icon
      icon-class="exit-fullscreen"
      class="fullscreen"
      v-show="isFull"
      @click="toggleScreen"
    />
  </div>
</template>

<script>
import screenfull from "screenfull";
export default {
  name: "ScreenFull",
  data() {
    return {
      isFull: false,
    };
  },
  created() {
    screenfull.on("change", () => {
      this.isFull = screenfull.isFullscreen;
    });
  },
  methods: {
    // 点击全屏
    toggleScreen() {
      screenfull.toggle();
      this.isFull = !this.isFull;
    },
  },
};
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
