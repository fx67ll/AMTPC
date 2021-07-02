<template>
	<div class="progress-box">
		<div class="progress-tip">资源加载中...... {{ progress }}</div>
		<div class="progress progress-striped" :style="{ '--progress': progress }"><div class="progress-bar"></div></div>
	</div>
</template>

<script>
export default {
	name: 'loadingProgress',
	props: {
		progress: {
			type: String,
			required: true,
			default: '0%',
			validator(str) {
				var isPer = str.substr(str.length - 1, 1) === '%';
				// var isNum = new RegExp('^(([1-9][0-9]|[1-9])(\.\d{1,2})?|0\.\d{1,2}|100)$').test(Number(str.substr(0, str.length - 1)));
				// var isNum = new RegExp('^(100)$|^((\d|[1-9]\d)(\.\d{1,2})?)$').test(Number(str.substr(0, str.length - 1)));
				var isNum = new RegExp('^(([1-9][0-9]|[1-9])(\.\d{1,2})?|0\.\d{1,2}|100)$').test(parseInt(str.substr(0, str.length - 1)))
				return isPer && isNum;
			}
		}
	},
	// mounted() {
	// 	console.log(new RegExp('^(([1-9][0-9]|[1-9])(\.\d{1,2})?|0\.\d{1,2}|100)$').test(88.88));
	// }
};
</script>

<style lang="less" scoped="scoped">
.progress-box {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	background-color: #2c303a;
	z-index: 99999;
	position: absolute;

	.progress-tip {
		width: 40%;
		margin: 0 auto;
		text-align: center;
		position: relative;
		top: calc(50% - 55px);
	}

	.progress {
		width: 40%;
		padding: 6px;
		margin: 0 auto;
		position: relative;
		top: 50%;
		margin-top: -40px;
		background: rgba(0, 0, 0, 0.25);
		border-radius: 6px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px rgba(255, 255, 255, 0.08);
	}

	.progress-bar {
		height: 18px;
		background-color: #ee303c;
		border-radius: 4px;
		transition: 0.4s linear;
		transition-property: width, background-color;
	}

	.progress-striped .progress-bar {
		background-color: #fcbc51;
		width: var(--progress);
		background-image: linear-gradient(45deg, #fca311 25%, transparent 25%, transparent 50%, #fca311 50%, #fca311 75%, transparent 75%, transparent);
	}
}
</style>
