import store from '@/store'

const {
  body
} = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default { // 导出的对象，混入到vue文件配置项中，组件使用的时候执行
  watch: {
    $route(route) { // 当路由页面切换的时候，此函数自动执行
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', {
          withoutAnimation: false
        }) // 移动端+侧边栏打开
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', {
        withoutAnimation: true
      })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect() //获取body大小
      return rect.width - 1 < WIDTH //小于992，就返回true(判定为移动设备)
      //注意：有的浏览器分辨率不是100%，而是125%，宽度就会有小数误差，所以-1
    },
    // 重置vuex里设备标识和从 pc->移动端 关闭侧边栏导航
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', {
            withoutAnimation: true
          })
        }
      }
    }
  }
}
