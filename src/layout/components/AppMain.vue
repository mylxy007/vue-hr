<template>
  <!-- section原生标签 -->
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- key的作用：新旧虚拟DOM对比的时候，加快对比效率使用标记
      防止路由挂载点不更新（key改变，标签就会重新渲染） -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
