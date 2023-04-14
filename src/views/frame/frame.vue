<template>
	<div class="frame-box">
		<iframe v-if="fileName" :src="`https://test.fx67ll.com/fx67ll-Animated-Mesh-Lines/html/${fileName}/${fileName}.html`" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>
	</div>
</template>

<script>
	import {
		getUrlQueryString
	} from '@u/index.js'
	export default {
		name: 'frame',
		data() {
			return {
				fileName: ''
			};
		},
		mounted() {
			this.fileName = getUrlQueryString('fileName');
		},
		methods: {
		}
	};
</script>

<style lang="less" scoped="scoped">
	.frame-box {
		width: 100%;
		height: 100%;
	}
</style>