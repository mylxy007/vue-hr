import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // 全局SvgIcon组件，显示svg图形

// register globally
Vue.component('svg-icon', SvgIcon)

//  require.context (是webpack内置api，用于自动化导入模块)
//  场景：从一个文件夹引入很多模块
//  参数1：要读取的文件夹路径
//  参数2: 是否遍历子目录(false不要)
//  参数3: 符合正则的才会导入
//  返回值：一个函数
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
