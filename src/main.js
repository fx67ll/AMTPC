import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router/index.js'
import store from '@/store/index.js'

Vue.config.productionTip = false

import less from 'less'
Vue.use(less)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 每次加载之后添加统一操作提示
Vue.prototype.showOperationTips = function(msg) {
	if (window.innerWidth >= this.$store.state.adaptationInnerWidth) {
		this.$notify({
			title: '操作指南',
			position: 'top-right',
			dangerouslyUseHTMLString: true,
			message: `
			<br/>
			<strong>按住 <i class="el-icon-mouse"></i>鼠标左键 可以三维旋转</strong><br/><br/>
			<strong>按住 <i class="el-icon-mouse"></i>鼠标右键 可以垂直水平方向移动</strong><br/><br/>
			<strong>使用 <i class="el-icon-mouse"></i>鼠标滚轮 可以放大缩小</strong>
		`,
			duration: 30000,
			showClose: true
		});
	} else {
		console.error("非常抱歉！移动端可查看基础模型，但是暂不支持移动端进行复杂操作！");
	}
}

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
