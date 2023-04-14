<template>
	<loading-progress :progressNum="progressNum" :isFinished="false" :styleType="styleType" :bgColor="bgColor"></loading-progress>
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
			};
		},
		mounted() {
			this.setProgressnumber(true, 0);
			this.styleType = getUrlQueryString('styleType');
			this.bgColor = getUrlQueryString('bgColor');
		},
		beforeDestroy() {
			clearTimeout(this.timer);
			this.timer = null;
		},
		methods: {
			setProgressnumber(isFirst, nextNumber) {
				const self = this;
				const deadLine = 2333;
				const randomTempNum = Math.random() * (1 - 0) + 0;
				if (isFirst) {
					this.progressNum = nextNumber;
					this.timer = setTimeout(() => {
						self.setProgressnumber(false, randomTempNum);
					}, 1);
				} else {
					nextNumber += randomTempNum;
					this.progressNum = Math.floor((nextNumber / deadLine) * 100);
					if (nextNumber > deadLine) {
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