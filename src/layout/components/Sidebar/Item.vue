<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  // vue创建组件的方式有两种：
  // 1. .vue文件 + template模板
  // 2. 选项：render渲染函数方法，创建组件
  render(h, context) {
    // 参数1：createElement用于创建VNode(虚拟DOM)
    // 参数2：context 如果组件是一个函数组件，为没有实例(this)的函数组件提供上下文信息
    // 上下文：运行时环境对象(this)
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      if (icon.includes("el-icon")) {
        vnodes.push(<i class={[icon, "sub-el-icon"]} />);
      } else {
        vnodes.push(<svg-icon icon-class={icon} />);
      }
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>);
    }
    return vnodes;
    // 返回方式1：
    // h()参数1：接收标签名，参数2：接收子标签数组/文字内容
    // return h函数创建出来的虚拟DOM
    // 返回方式2：
    // 直接返回标签数组
  },
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
