<template>
	<div class="three-box">
		<div id="bg-img" class="three-mask"></div>
		<div class="three-layout">
			<div class="top">
				<div class="item scale">
					<!-- <img class="weather-img" :src="getImg()"> -->
					<!-- {{ this.weatherText }} -->
					<div class="weather-box">
						<img class="weather-img" :src="getImg(this.weatherCode)">
						<span>{{ this.weatherText }}</span>
					</div>
				</div>
				<div class="item scale" @click="goNext('medical')">简易医疗模型实时处理演示</div>
				<div class="item scale">
					<a href="https://www.ez13.top/#/hellothree" target="_blank">学习示例一</a>
					<a href="https://www.ez13.top/#/testthree" target="_blank">学习示例二</a>
					<a href="https://www.ez13.top/#/testthree-FBX" target="_blank">学习示例三</a>
				</div>
			</div>
			<div class="bottom">
				<div class="item scale"><a href="https://fx67ll.com" target="_blank">fx67ll.com</a></div>
				<div class="item">
					<div class="card scale bg-img-empty"></div>
					<div class="card scale bg-img-empty"></div>
				</div>
				<div class="item">
					<div class="card scale bg-img-empty"></div>
					<div class="card scale">
						<a href="https://fx67ll.xyz" target="_blank">fx67ll.xyz</a>
					</div>
				</div>
			</div>
			<div class="title scale">fx67ll's Three.js <span>作品合集</span></div>
		</div>
		<fx67ll-footer fontColor="#ffffff"></fx67ll-footer>
	</div>
</template>

<script>
	import fx67llFooter from "@c/fx67ll-footer/index.vue";
	import _ from "underscore";
	import axios from "axios";

	export default {
		name: "index",
		components: {
			fx67llFooter
		},
		data() {
			return {
				// 当前位置信息
				location: "",
				// 当前位置的天气信息代码
				weatherCode: "99",
				// 当前位置的天气信息
				weatherText: "暂无",
			}
		},
		mounted() {
			this.getRandomBackGroundImg();
			// this.getPosition();
			this.getWeather("南京");
		},
		methods: {
			getWeather(location) {
				axios.get(
						`${process.env.VUE_APP_WEATHER_API}?key=SZzSZewGNnCp43FAb&location=${location}&language=zh-Hans&unit=c`
					)
					.then(res => {
						this.location = res.data.results[0].location.name;
						this.weatherCode = res.data.results[0].now.code;
						this.weatherText = res.data.results[0].now.text;
					});
			},
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
								resolve(position.coords.latitude + ":" + position.coords.longitude);
							},
							function(error) {
								reject(error.code + "\n" + error.message);
							}
						);
					} else {
						console.log("异常！您当前浏览器不支持或者你取消了获取当前位置信息！");
					}
				});
				positionPromise.then(function(value) {
					self.getWeather(value);
				});
			},
			// 获取随机背景图
			getRandomBackGroundImg() {
				console.log(1);
				// document.getElementById("bg-img").style.backgroundImage = "url(https://api.mtyqx.cn/api/random.php)";
				_.each(document.getElementsByClassName("scale"), function(item, key) {
					item.style.backgroundImage = "url(https://api.mtyqx.cn/api/random.php)";
				})
			},
			// 页面跳转
			goNext(path) {
				let routeUrl = this.$router.resolve({
					path: path
				});
				window.open(routeUrl.href, "_blank");
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	// 卡片背景颜色
	@background-color: #2ECC71;
	// 卡片边框颜色
	@border-color: #FFFFFF;
	// 卡片文字颜色
	@text-color: #000000; // #FFFF7F
	// 卡片外链颜色
	@a-color: #000000;
	// 天气卡片颜色
	@weather-color: #989898;
	// 卡片边框宽度
	@border-width: 0.23vw;
	// 卡片间隙距离
	@border-space: 1.4vw;
	// 悬浮动画放大参数
	@scale-number: 1.15;
	// 悬浮动画经过时间
	@scale-time: 0.6s;


	#bg-img {
		background-repeat: no-repeat;
		background-size: 100%;
		background-image: url("~@a/images/slamdunk.jpg");
	}

	.bg-img-empty {
		background-size: auto 150%;
	}

	.scale {
		transform: scale(1.0, 1.0);
		transition: transform @scale-time;
		cursor: pointer;
		color: @text-color;
		text-align: center;
		line-height: 3vw;
		font-size: 1.3vw;
		font-weight: 900;
		border-radius: 0.6vw;
		background-color: @background-color;
		opacity: 0.8;

		a {
			color: @a-color;
			text-decoration: none;
		}

		a:hover {
			color: @border-color;
		}
	}

	.scale:hover {
		color: @border-color;
		transform: scale(@scale-number, @scale-number);
	}

	.three-box {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;

		.three-mask {
			width: 100%;
			height: 100%;
			filter: blur(0.3vw);
			position: absolute;
			top: 0;
			z-index: 0;
		}

		.three-layout {
			width: 60vw;
			height: 32vw;
			margin: 0 auto;
			z-index: 1;
			position: relative;
			top: 1vw;

			.top,
			.bottom {
				width: 100%;
				height:~"calc(50% - @{border-space}/2)";
				display: flex;
				justify-content: space-between;

				.item {
					width:~"calc(25% - @{border-space})";
					height: 100%;
					border: @border-width solid @border-color;
				}

				.item:nth-child(2) {
					width: 50%;
				}
			}

			.top {

				.item:nth-child(1) {
					background-color: @weather-color;
					// color: @border-color;
					color: @text-color;

					.weather-box {
						width: 60%;
						margin: 0 auto;
						position: relative;
						top: 3vw;

						.weather-img {
							width: 5vw;
						}

						span {
							display: block;
							font-size: 2vw;
							font-weight: 500;
							line-height: 3vw;
						}
					}
				}

				.item:nth-child(2) {
					line-height: 14.6vw;
					font-size: 2vw;
					font-weight: 500;
				}

				.item:nth-child(3) {
					a {
						display: block;
						font-size: 1.5vw;
						font-weight: 500;
					}

					a:nth-child(1) {
						margin-top: 3.1vw;
					}
				}
			}

			.bottom {
				margin-top: @border-space;

				.item:nth-child(1) {
					height: 50%;
					line-height: 7.8vw;
					font-size: 2.1vw;
				}

				.item:nth-child(2) {
					display: flex;
					justify-content: space-between;
					border: none;

					.card {
						border: @border-width solid @border-color;
					}

					.card:first-child {
						width:~"calc(70% - @{border-space}/2)";
						height: 90%;
						position: relative;
						right: @border-width;
					}

					.card:last-child {
						width:~"calc(30% - @{border-space}/2)";
						height: 76%;
						position: relative;
						left: @border-width;
					}
				}

				.item:nth-child(3) {
					height: 76%;
					border: @border-width solid transparent;
					position: relative;
					right: @border-width;

					.card {
						border: @border-width solid @border-color;
					}

					.card:first-child {
						width: 100%;
						height:~"calc(70% - @{border-space}/2)";
					}

					.card:last-child {
						width: 65%;
						height:~"calc(30% - @{border-space}/2)";
						margin-top:~"calc(@{border-space}/2)";
						line-height: 2.8vw;
					}
				}
			}

			.title {
				width: 15vw;
				height: 3vw;
				padding: 0 2vw;
				border: @border-width solid @border-color;
				position: relative;
				top:~"calc(-100% - 3vw - @{border-space})";
				left: 5vw;
				// color: @border-color;
				color: @text-color;

				span {
					font-weight: 500;
				}
			}
		}
	}
</style>
