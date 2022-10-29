<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 移动端并且侧边栏打开，黑色半透明蒙层 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 自定义-左侧侧边栏导航 -->
    <sidebar class="sidebar-container" />
    <!-- 右侧容器 -->
    <div class="main-container">
      <!-- 右侧-头部导航 -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <!-- 右侧-主体区域 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  mixins: [ResizeMixin],
  computed: {
    // 侧边栏状态
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    // 设备类型
    device() {
      return this.$store.state.app.device;
    },
    // 头部是否固定
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    // 整个layout页面容器样式
    // 当布尔值为true的时候，类名就会生效在最外层div身上
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    // 移动端，点击蒙层关闭侧边栏
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
