<template>
	<div class="fx67ll-footer" :style="{ '--fontColor': fontColor}">
		Designed & Powered by
		<a href="https://fx67ll.com" target="_blank">fx67ll</a>
		&#12288; Copyright© 2018-{{ this.year }}&#12288;
		<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ this.icpNumber }}</a>
	</div>
</template>

<script>
	import moment from 'moment';
	export default {
		name: 'fx67llFooter',
		props: {
			fontColor: {
				type: String,
				required: false,
				default: '#bababa',
				validator(color) {
					return new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').test(color);
				}
			},
		},
		data() {
			return {
				year: moment().format('YYYY'),
				icpNumber: '皖ICP备18017174号'
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.fx67ll-footer {
		width: 100%;
		padding: 20px 0;
		text-align: center;
		position: absolute;
		bottom: 0;
		user-select: text;
		z-index: 99999;
		color: var(--fontColor);

		a {
			color: var(--fontColor);
		}
		
		a:hover {
			color: #42b983;
		}
	}
</style>
