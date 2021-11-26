<template>
	<div id="app">
		<div id="app-router"><router-view></router-view></div>
		<div id="app-tip">非常抱歉！暂不支持移动端访问！</div>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {};
		},
		methods: {}
	};
</script>

<style lang="less">
	html,
	body {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		font-family: 'PFR';
		color: @grey;
	}

	#app {
		width: 100%;
		height: 100%;
		
		#app-router{
			width: 100%;
			height: 100%;
		}
		
		#app-tip{
			display: none;
		}
	}
	

	@media screen and (max-width: 1020px) {
		#app-router{
			display: none;
		}
		
		#app-tip{
			display: block !important;
			text-align: center;
			line-height: 15vw;
			font-size: 10vw;
			padding: 20vw 1vw 0 1vw;
		}
	}
</style>
