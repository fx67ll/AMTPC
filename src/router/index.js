import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 修复路由重复报错
// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

import store from '@/store/index.js'

export const fx67llRoutes = [{
		path: '/',
		name: 'index',
		component: () => import('@v/index.vue') // 首页
	},
	{
		path: '/medical',
		name: 'medical',
		component: () => import('@v/project/medical/medical.vue') // 医疗模型
	},
	{
		path: '/cube',
		name: 'cube',
		component: () => import('@v/project/cube/cube.vue') // 魔方模型
	},
	{
		path: '/fireworks',
		name: 'fireworks',
		component: () => import('@v/project/fireworks/FireworksTestDashboardLab.vue') // 烟花
	},
	{
		path: '/three-hello',
		name: 'threeHello',
		component: () => import('@v/demo/three-hello.vue') // Threejs 官方示例 Hello World
	},
	{
		path: '/three-miku',
		name: 'threeMiku',
		component: () => import('@v/demo/three-miku.vue') // Threejs 官方示例 Miku MMD 加载
	},
	{
		path: '/three-fbx',
		name: 'threeFBX',
		component: () => import('@v/demo/three-fbx.vue') // Threejs 官方示例 FBX 加载
	},
	{
		path: '/fx67ll-Animated-Mesh-Lines',
		name: 'fx67ll-Animated-Mesh-Lines',
		component: () => import('@v/frame/frame.vue') // 魔方模型
	},
	{
		path: '/fx67ll-vue-ui-index',
		name: 'fx67llVueUiIndex',
		component: () => import('@v/other/index-for-fvu-mobile.vue') // 为了适配fx67ll Vue UI 组件库移动端演示
	},
	{
		path: '/fx67ll-vue-ui-footer',
		name: 'fx67llVueUiFooter',
		component: () => import('@v/other/fx67ll-vue-ui/footer.vue') // fx67ll Vue UI 组件库网站页脚展示
	},
	{
		path: '/fx67ll-vue-ui-progress',
		name: 'fx67llVueUiProgress',
		component: () => import('@v/other/fx67ll-vue-ui/progress.vue') // fx67ll Vue UI 组件库进度条演示
	},
	{
		path: '/fx67ll-vue-ui-avatar',
		name: 'fx67llVueUiAvatar',
		component: () => import('@v/other/fx67ll-vue-ui/avatar.vue') // fx67ll Vue UI 组件库随机马赛克头像演示
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@v/404.vue') //404
	},
	{
		path: '*', //不存在的地址则重定向页面地址
		redirect: '/404'
	}
]

const router = new Router({
	mode: 'history', // history模式，去掉url中的#
	scrollBehavior: () => ({
		y: 0
	}),
	routes: fx67llRoutes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
	next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
})

export default router