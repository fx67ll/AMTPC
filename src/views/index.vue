<template>
	<div class="three-box">
		<div class="three-box-pc" v-if="!isMobileDevice">
			<div id="index-bg-img" class="three-mask"></div>
			<div class="three-layout">
				<div class="top">
					<div class="item scale">
						<!-- <img class="weather-img" :src="getImg()"> -->
						<!-- {{ this.weatherText }} -->
						<div class="weather-box">
							<img class="weather-img" :src="getImg(this.weatherCode)" />
							<span>{{ this.weatherText }}</span>
						</div>
					</div>
					<div class="item scale" @click="goNext('medical')">简易医疗模型实时处理演示</div>
					<div class="item scale">
						<a href="https://www.ez13.top/#/hellothree" target="_blank">
							<span>3D</span>
							文字
						</a>
						<a href="https://www.ez13.top/#/testthree" target="_blank">
							<span>Miku</span>
							舞台表演
						</a>
						<a href="https://www.ez13.top/#/testthree-FBX" target="_blank">
							<span>3D</span>
							人体舞蹈
						</a>
					</div>
				</div>
				<div class="bottom">
					<div class="item scale" @click="goNext('cube')">魔方小游戏</div>
					<div class="item">
						<div class="card scale card-bg-img-empty"></div>
						<div class="card scale card-bg-img-empty"></div>
					</div>
					<div class="item">
						<div class="card scale card-bg-img-empty"></div>
						<div class="card scale"><a href="https://fx67ll.xyz" target="_blank">fx67ll.xyz</a></div>
					</div>
				</div>
				<div class="title scale" @click="linktoFx67llCom()">
					fx67ll's Three.js
					<span>作品合集</span>
				</div>
			</div>
			<fx67ll-footer fontColor="#ffffff"></fx67ll-footer>
		</div>
		<vueCanvasNest :config="nestConfig" :el="'#vue-canvas-nest'" v-if="isLoadingCompleted"></vueCanvasNest>
		<div id="vue-canvas-nest" class="three-box-mobile" v-if="isMobileDevice">
			<div class="fx67ll-title">
				<span @click="linktoFx67llBlog()">
					fx67ll's Three.js
					<span>作品合集</span>
				</span>
			</div>
			<div class="fx67ll-link">
				<div class="fx67ll-link-item">
					<span><a target="_blank" href="https://ez13.top/#/hellothree">3D文字</a></span>
				</div>
				<div class="fx67ll-link-item">
					<span><a target="_blank" href="https://ez13.top/#/testthree">Miku舞台表演</a></span>
				</div>
				<div class="fx67ll-link-item">
					<span><a target="_blank" href="https://ez13.top/#/testthree-FBX">3D人体舞蹈</a></span>
				</div>
				<div class="fx67ll-link-item"><router-link tag="a" target="_blank" to="/medical">简易医疗模型实时处理演示</router-link></div>
				<div class="fx67ll-link-item"><router-link tag="a" target="_blank" to="/cube">魔方小游戏</router-link></div>
			</div>
			<fx67ll-footer />
		</div>
	</div>
</template>

<script>
import vueCanvasNest from 'vue-canvas-nest';

import _ from 'underscore';
import axios from 'axios';

export default {
	name: 'index',
	components: {
		vueCanvasNest
	},
	data() {
		return {
			// 渲染的随机图url
			randomImgUrl: 'https://api.ixiaowai.cn/api/api.php',
			// 当前位置信息
			location: '',
			// 当前位置的天气信息代码
			weatherCode: '99',
			// 当前位置的天气信息
			weatherText: '暂无数据',
			// 移动端标识
			isMobileDevice: false,
			// 添加背景插件的配置
			nestConfig: {
				color: 'rgb(186, 186, 186)', // the canvas line color, default: '255,0,0'; the color is (R,G,B)
				opacity: 0.7, // the opacity of line (0~1), default: 0.7
				count: 44, // the number of lines, default: 99
				zIndex: -1 // the index of z space, default: -1
			},
			time: 0,
			isLoadingCompleted: false
		};
	},
	mounted() {
		const self = this;
		// 移动端适配
		if (window.innerWidth >= this.$store.state.adaptationInnerWidth) {
			// 非移动端标识
			this.isMobileDevice = false;

			// 获取随机背景图，求职期间暂时关闭，仅填充部分空格子
			// this.getRandomBackGroundImg();
			_.each(document.getElementsByClassName('card-bg-img-empty'), function(item, key) {
				item.style.backgroundImage = `url(${self.randomImgUrl})`;
			});

			// 获取位置信息，暂时关闭，防止浏览器不兼容
			// this.getPosition();

			// 获取天气信息
			this.getWeather('南京');
		} else {
			// 移动端标识
			this.isMobileDevice = true;
		}

		// 部分长宽比的浏览器背景图片下面会有空白条，做了一定适配，但是仅限初次加载，所以也没什么卵用，直接用cover就好了
		// slamdunk.jpg 长宽比 720/533
		// if (window.innerWidth / window.innerHeight <= 720 / 533) {
		// 	document.getElementById("index-bg-img").style.backgroundSize = "100% 100%";
		// }

		let loadingTimer = setTimeout(function() {
			self.isLoadingCompleted = true;
			clearTimeout(loadingTimer);
		}, 100);
		this.showSeconds(1);
	},
	methods: {
		showSeconds(time) {
			let self = this;
			let consoleTimer = setTimeout(function() {
				if (!self.isLoadingCompleted) {
					self.showSeconds(time + 1);
				} else {
					clearTimeout(consoleTimer);
				}
			}, 100);
		},
		// 跳转到个人主页
		linktoFx67llCom() {
			window.open('https://fx67ll.com');
		},
		// 跳转到个人博客
		linktoFx67llBlog() {
			window.open('https://fx67ll.xyz');
		},
		// 获取天气信息 https://seniverse.yuque.com/books/share/e52aa43f-8fe9-4ffa-860d-96c0f3cf1c49/nyiu3t
		getWeather(location) {
			axios.get(`${process.env.VUE_APP_WEATHER_API}?key=SZzSZewGNnCp43FAb&location=${location}&language=zh-Hans&unit=c`).then(res => {
				this.location = res.data.results[0].location.name;
				this.weatherCode = res.data.results[0].now.code;
				this.weatherText = res.data.results[0].now.text;
			});
		},
		// 获取当前天气代码对应的天气图标
		getImg(code) {
			return require(`@a/images/weather/${code}.png`);
		},
		// 获取当前经纬度，异步获取结果之后再请求天气
		getPosition() {
			let self = this;
			let positionPromise = new Promise(function(resolve, reject) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						function(position) {
							resolve(position.coords.latitude + ':' + position.coords.longitude);
						},
						function(error) {
							reject(error.code + '\n' + error.message);
						}
					);
				} else {
					console.log('异常！您当前浏览器不支持或者你取消了获取当前位置信息！');
				}
			});
			positionPromise.then(function(value) {
				self.getWeather(value);
			});
		},
		// 获取随机背景图
		getRandomBackGroundImg() {
			const self = this;
			// document.getElementById("index-bg-img").style.backgroundImage = `url(${self.randomImgUrl})`;
			_.each(document.getElementsByClassName('scale'), function(item, key) {
				item.style.backgroundImage = `url(${self.randomImgUrl})`;
			});
		},
		// 页面跳转
		goNext(path) {
			let routeUrl = this.$router.resolve({
				path: path
			});
			window.open(routeUrl.href, '_blank');
		}
	}
};
</script>

<style lang="less" scoped="scoped">
@import '@a/styles/index.less';
</style>
