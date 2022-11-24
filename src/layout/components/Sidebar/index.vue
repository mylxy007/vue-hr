<template>
  <!-- 左侧侧边栏容器 -->
  <div :class="{ 'has-logo': showLogo }">
    <!-- Logo组件 -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 
      内容容器
      el-scrollbar 是elementUI隐藏的彩蛋（组件-官方文档没有） 
      滚动组件：自带el-scrollbar类名（内部设置超出隐藏，不出现滚动条）
      身上class，会出现在内容容器div身上
      wrap-class类名会出现在此div子标签身上（真正内容标签里）
      mode 菜单排列方式 vertical垂直排列
    -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 菜单组件 
        default-active 当前激活菜单的index  
        collapse 是否水平折叠收起菜单
        unique-opened 是否保持只有一个子菜单展开
      -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      // return this.$router.options.routes;
      console.log(this.$store.state.permission.routes);
      return this.$store.state.permission.routes;
    },
    // 设置默认菜单激活的path值
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    // 是否展示侧边栏顶部logo组件 -> vuex(settings) -> 初始值src/settings.js(true展示)
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    // Collapse折叠
    // 是否折叠
    // 侧边栏打开状态不折叠菜单，关闭状态折叠菜单
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>
