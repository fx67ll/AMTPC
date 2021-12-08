<template>
	<div id="app">
		<router-view></router-view>
		<!-- 该方法过于一刀切，先不启用 -->
		<!-- <div id="app-router"><router-view></router-view></div>
		<div id="app-tip">非常抱歉！暂不支持移动端访问！</div> -->
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				firstWidth: null,
				innerWidth: null
			};
		},
		methods: {
			// 获取当前显示界面宽度，并确保用户改变窗口大小能够实时变化应该显示的界面
			getWidth() {
				this.innerWidth = window.innerWidth;
				if (this.innerWidth < this.firstWidth && this.firstWidth > this.$store.state.adaptationInnerWidth && this
					.innerWidth - this.$store.state.adaptationInnerWidth < 0) {
					window.location.reload();
				}
				if (this.innerWidth > this.firstWidth && this.firstWidth < this.$store.state.adaptationInnerWidth && this
					.innerWidth - this.$store.state.adaptationInnerWidth > 0) {
					window.location.reload();
				}
			}
		},
		created() {
			// 获取初次宽度
			this.firstWidth = window.innerWidth;
			this.getWidth();
			
			// 添加监听事件
			window.addEventListener('resize', this.getWidth);
		},
		destroyed() {
			// 移除监听事件
			window.removeEventListener('resize', this.getWidth);
		}
	};
</script>

<style lang="less">
	html,
	body {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		font-family: 'PFRE';
		color: @grey;
	}

	#app {
		width: 100%;
		height: 100%;

		// 该方法过于一刀切，先不启用
		// #app-router{
		// 	width: 100%;
		// 	height: 100%;
		// }

		// #app-tip{
		// 	display: none;
		// }
	}

	// 该方法过于一刀切，先不启用
	// @media screen and (max-width: 960px) {
	// 	#app-router{
	// 		display: none;
	// 	}

	// 	#app-tip{
	// 		display: block !important;
	// 		text-align: center;
	// 		line-height: 15vw;
	// 		font-size: 10vw;
	// 		padding: 20vw 1vw 0 1vw;
	// 	}
	// }
</style>
