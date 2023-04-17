<template>
	<loading-progress :progressNum="progressNum" :isFinished="false" :styleType="styleType" :bgColor="bgColor" :isShowText="isShowText"></loading-progress>
</template>

<script>
	import {
		getUrlQueryString
	} from '@u/index.js'
	export default {
		name: 'fx67llVueUIProgress',
		data() {
			return {
				timer: null,
				progressNum: 0,
				styleType: 'striped',
				bgColor: '#2c303a',
				isShowText: true,
				deadLine: 2333,
			};
		},
		mounted() {
			this.setProgressnumber(true, 0);
			this.styleType = getUrlQueryString('styleType') || 'striped';
			this.bgColor = getUrlQueryString('bgColor') || '#2c303a';
			this.isShowText = getUrlQueryString('isShowText') ? JSON.parse(getUrlQueryString('isShowText')) : true;
			if (window.innerWidth < this.$store.state.adaptationInnerWidth) {
				this.deadLine = 233;
			}
		},
		beforeDestroy() {
			clearTimeout(this.timer);
			this.timer = null;
		},
		methods: {
			setProgressnumber(isFirst, nextNumber) {
				const self = this;
				const randomTempNum = Math.random() * (1 - 0) + 0;
				if (isFirst) {
					this.progressNum = nextNumber;
					this.timer = setTimeout(() => {
						self.setProgressnumber(false, randomTempNum);
					}, 1);
				} else {
					nextNumber += randomTempNum;
					this.progressNum = Math.floor((nextNumber / this.deadLine) * 100);
					if (nextNumber > this.deadLine) {
						this.timer = setTimeout(() => {
							self.setProgressnumber(true, 0);
						}, 1);
					} else {
						this.timer = setTimeout(() => {
							self.setProgressnumber(false, nextNumber);
						}, 1);
					}
				}
			}
		}
	};
</script>

<style>
</style>