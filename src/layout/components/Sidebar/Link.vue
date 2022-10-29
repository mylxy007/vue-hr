<template>
  <!-- v-bind = {a: 'a', b: 'b'} 快捷绑定自定义属性-->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return "a";
      }
      return "router-link";
    },
  },
  methods: {
    linkProps(to) {
      // link决定跳转目标是否为外链
      if (this.isExternal) {
        return {
          // 3个属性会添加到a标签身上
          href: to, //a标签点击跳转的地址
          target: "_blank", //_blank点击a， 会打开新的标签
          rel: "noopener", //当前文档和跳转目标文档之间的关系（当前文档 对于 下一个页面的关系标识）
        };
      }
      //非外链，给router-link绑定to属性值，就是要跳转的链接
      return {
        to: to,
      };
    },
  },
};
</script>
