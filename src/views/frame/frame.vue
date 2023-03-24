<template>
	<div class="frame-box">
		<iframe
			v-if="fileName"
			:src="`https://test.fx67ll.com/fx67ll-Animated-Mesh-Lines/html/${fileName}/${fileName}.html`"
			width="100%"
			height="100%"
			frameborder="0"
			scrolling="no"
		></iframe>
	</div>
</template>

<script>
export default {
	name: 'frame',
	data() {
		return {
			fileName: ''
		};
	},
	mounted() {
		this.fileName = this.GetQueryString('fileName');
	},
	methods: {
		GetQueryString(name) {
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			// 获取url中"?"符后的字符串并正则匹配
			var r = window.location.search.substr(1).match(reg);
			var context = '';
			if (r != null) context = decodeURIComponent(r[2]);
			reg = null;
			r = null;
			return context == null || context == '' || context == 'undefined' ? '' : context;
		}
	}
};
</script>

<style lang="less" scoped="scoped">
.frame-box {
	width: 100%;
	height: 100%;
}
</style>
