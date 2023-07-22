<template>
	<div class="three-box">
		<div class="three-box-pc" v-if="!isMobileDevice">
			<div id="index-bg-img" class="three-mask"></div>
			<div class="three-layout">
				<swiper class="swiper" :options="swiperOptions">
					<swiper-slide class="swiper-slide swiper-slide-s">
						<div class="top ani" :swiper-animate-effect="swiperAniConfigS.swiperAnimateEffect"
							:swiper-animate-duration="swiperAniConfigS.swiperAnimateDuration"
							:swiper-animate-delay="swiperAniConfigS.swiperAnimateDelay">
							<div class="item scale weather">
								<div class="weather-box">
									<img class="weather-img" :src="getImg(this.weatherCode)" />
									<span>{{ this.weatherText }}</span>
								</div>
							</div>
							<div class="item scale" @click="goNext('medical')">简易医疗模型实时处理演示</div>
							<div class="item scale">
								<a href="#" @click.prevent="goNext('three-hello')">
									<span>3D</span>
									文字
								</a>
								<a href="#" @click.prevent="goNext('three-miku')">
									<span>Miku</span>
									舞台表演
								</a>
								<a href="#" @click.prevent="goNext('three-fbx')">
									<span>3D</span>
									人体舞蹈
								</a>
							</div>
						</div>
						<div class="bottom ani" :swiper-animate-effect="swiperAniConfigS.swiperAnimateEffect"
							:swiper-animate-duration="swiperAniConfigS.swiperAnimateDuration"
							:swiper-animate-delay="swiperAniConfigS.swiperAnimateDelay">
							<div class="item scale" @click="goNext('cube')">魔方小游戏</div>
							<div class="item">
								<div class="card scale card-bg-img-empty"></div>
								<div class="card scale card-bg-img-empty"></div>
							</div>
							<div class="item">
								<div class="card scale card-bg-img-empty"></div>
								<div class="card scale link">
									<a href="https://fx67ll.com" target="_blank">fx67ll.com</a>
								</div>
							</div>
						</div>
						<div class="title scale ani" :swiper-animate-effect="swiperAniConfigS.swiperAnimateEffect"
							:swiper-animate-duration="swiperAniConfigS.swiperAnimateDuration"
							:swiper-animate-delay="swiperAniConfigS.swiperAnimateDelay">
							fx67ll's Three.js
							<span>作品合集</span>
						</div>
					</swiper-slide>
					<swiper-slide class="swiper-slide swiper-slide-a">
						<div class="top ani" :swiper-animate-effect="swiperAniConfigA.swiperAnimateEffect"
							:swiper-animate-duration="swiperAniConfigA.swiperAnimateDuration"
							:swiper-animate-delay="swiperAniConfigA.swiperAnimateDelay">
							<div class="item scale card-bg-img-empty"></div>
							<div class="item scale card-title-no-link">
								<span>Animated Mesh Lines</span>
								<span>示例合集</span>
							</div>
							<div class="item scale" @click="goNext('fx67ll-Animated-Mesh-Lines', 'energy')">闪电能量</div>
						</div>
						<div class="bottom ani" :swiper-animate-effect="swiperAniConfigA.swiperAnimateEffect"
							:swiper-animate-duration="swiperAniConfigA.swiperAnimateDuration"
							:swiper-animate-delay="swiperAniConfigA.swiperAnimateDelay">
							<div class="item scale" @click="goNext('fx67ll-Animated-Mesh-Lines', 'shootingStars')">流星雨
							</div>
							<div class="item">
								<div class="card scale" @click="goNext('fx67ll-Animated-Mesh-Lines', 'borealSky')">
									<span>宇宙星河</span>
									<span>时空穿梭</span>
								</div>
								<div class="card scale" @click="goNext('fx67ll-Animated-Mesh-Lines', 'colors')">色彩</div>
							</div>
							<div class="item">
								<div class="card scale" @click="goNext('fx67ll-Animated-Mesh-Lines', 'confetti')">五彩纸屑
								</div>
								<div class="card scale card-bg-img-empty"></div>
							</div>
						</div>
					</swiper-slide>
					<swiper-slide class="swiper-slide swiper-slide-b">
						<div class="top ani" :swiper-animate-effect="swiperAniConfigB.swiperAnimateEffect"
							:swiper-animate-duration="swiperAniConfigB.swiperAnimateDuration"
							:swiper-animate-delay="swiperAniConfigB.swiperAnimateDelay">
							<div class="item scale card-bg-img-empty"></div>
							<div class="item scale card-title-no-link">个人作品友情链接</div>
							<div class="item scale card-bg-img-empty">
								<a href="https://uni.fx67ll.com" target="_blank">uni.fx67ll.com</a>
								<a href="https://map.fx67ll.com" target="_blank">map.fx67ll.com</a>
								<a href="https://node.fx67ll.com" target="_blank">node.fx67ll.com</a>
							</div>
						</div>
						<div class="bottom ani" :swiper-animate-effect="swiperAniConfigB.swiperAnimateEffect"
							:swiper-animate-duration="swiperAniConfigB.swiperAnimateDuration"
							:swiper-animate-delay="swiperAniConfigB.swiperAnimateDelay">
							<div class="item scale card-bg-img-empty">
								<a href="https://vue-ui.fx67ll.com" target="_blank">vue-ui</a>
							</div>
							<div class="item">
								<div class="card scale card-bg-img-empty">
									<a href="https://vip.fx67ll.com" target="_blank">vip.fx67ll.com</a>
								</div>
								<div class="card scale card-bg-img-empty">
									<a href="http://404.fx67ll.com" target="_blank">404</a>
								</div>
							</div>
							<div class="item">
								<div class="card scale card-bg-img-empty">
									<a href="https://nav.fx67ll.com" target="_blank">nav.fx67ll.com</a>
								</div>
								<div class="card scale link">
									<a href="https://fx67ll.xyz" target="_blank">fx67ll.xyz</a>
								</div>
							</div>
						</div>
					</swiper-slide>
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper>
			</div>
			<fx67ll-footer fontColor="#ffffff"></fx67ll-footer>
		</div>
		<vueCanvasNest :config="nestConfig" :el="'#vue-canvas-nest'" v-if="isLoadingCompleted && isMobileDevice">
		</vueCanvasNest>
		<div id="vue-canvas-nest" class="three-box-mobile" v-if="isMobileDevice">
			<div class="fx67ll-title">
				<span @click="linktoFx67llBlog()">
					fx67ll's Three.js
					<span>作品合集</span>
				</span>
			</div>
			<div class="fx67ll-link">
				<div class="fx67ll-link-item"><router-link tag="a" target="_blank" to="/cube">魔方小游戏</router-link></div>
				<div class="fx67ll-link-item"><router-link tag="a" target="_blank"
						to="/medical">简易医疗模型操作演示</router-link></div>
				<div class="fx67ll-link-item">
					<span>
						<a href="#" @click.prevent="goNext('three-hello')">
							<span>3D</span>
							文字
						</a>
					</span>
				</div>
				<div class="fx67ll-link-item">
					<span>
						<a href="#" @click.prevent="goNext('three-miku')">
							<span>Miku</span>
							舞台表演
						</a>
					</span>
				</div>
				<div class="fx67ll-link-item">
					<span>
						<a href="#" @click.prevent="goNext('three-fbx')">
							<span>3D</span>
							人体舞蹈
						</a>
					</span>
				</div>
				<div class="fx67ll-link-item">
					<router-link tag="a" target="_blank"
						:to="{ path: '/fx67ll-Animated-Mesh-Lines', query: { fileName: 'energy' } }">运动能量</router-link>
				</div>
				<div class="fx67ll-link-item">
					<router-link tag="a" target="_blank"
						:to="{ path: '/fx67ll-Animated-Mesh-Lines', query: { fileName: 'shootingStars' } }">流星雨</router-link>
				</div>
				<div class="fx67ll-link-item">
					<router-link tag="a" target="_blank"
						:to="{ path: '/fx67ll-Animated-Mesh-Lines', query: { fileName: 'borealSky' } }">宇宙星河</router-link>
				</div>
				<div class="fx67ll-link-item">
					<router-link tag="a" target="_blank"
						:to="{ path: '/fx67ll-Animated-Mesh-Lines', query: { fileName: 'colors' } }">色彩</router-link>
				</div>
				<div class="fx67ll-link-item">
					<router-link tag="a" target="_blank"
						:to="{ path: '/fx67ll-Animated-Mesh-Lines', query: { fileName: 'confetti' } }">五彩纸屑</router-link>
				</div>
			</div>
			<fx67ll-footer />
		</div>
	</div>
</template>

<script>
	import vueCanvasNest from 'vue-canvas-nest';
	import {
		swiper,
		swiperSlide
	} from 'vue-awesome-swiper';
	import 'swiper/dist/css/swiper.css';

	import _ from 'underscore';
	import axios from 'axios';

	export default {
		name: 'index',
		components: {
			vueCanvasNest,
			swiper,
			swiperSlide
		},
		data() {
			let self = this;
			return {
				// 渲染的随机图url，博文备用的地址：https://api.paugram.com/wallpaper/
				randomImgUrl: 'https://api.likepoems.com/img/pc',
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
					count: 22, // the number of lines, default: 99
					zIndex: -1 // the index of z space, default: -1
				},
				// 背景插件加载flag
				isLoadingCompleted: false,
				// Swiper 属性
				swiperOptions: {
					initialSlide: 0, // 设定初始化时slide的索引。Swiper默认初始化时显示第一个slide，如果想在初始化时直接显示其他slide，可以做此设置。
					speed: 200, // 切换速度，即slider自动滑动开始到结束的时间（单位ms），也是触摸滑动时释放至贴合的时间。
					grabCursor: true, // 该选项给Swiper 使用者提供小小的贴心应用，设置为true 时，鼠标覆盖Swiper 时指针会变成手掌形状，拖动时指针会变成抓手形状。（根据浏览器形状有所不同）
					loop: false, // 设置为 true 则开启循环(loop)模式。loop模式：会在原本slide 前后复制若干个slide (默认一个)并在合适的时候切换，让Swiper看起来像是循环的。
					// 设置为 true 启动自动切换，并使用默认的切换设置。
					autoplay: {
						delay: 233333, // 自动切换的时间间隔，单位ms
						disableOnInteraction: false // 用户操作swiper之后，是否禁止autoplay。默认为true：停止。如果设置为false，用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay。
					},
					// 开启鼠标滚轮控制Swiper切换。可设置鼠标选项，或true使用默认值。
					mousewheel: true,
					// 使用分页器导航。分页器可使用小圆点样式（默认）、分式样式或进度条样式。
					pagination: {
						el: '.swiper-pagination',
						type: 'fraction'
					},
					// 事件监听
					on: {
						// 事件函数，初始化后执行。
						init: function() {
							self.$swiperAnimateCache(this); // 隐藏动画元素
							self.$swiperAnimate(this); // 初始化完成开始动画
						},
						// 事件函数，在当前Slide切换到另一个Slide时执行(activeIndex发生改变)，一般是在点击控制组件、释放滑动的时间点。
						slideChange: function() {
							self.$swiperAnimate(this); // 每个slide切换结束时也运行当前slide动画
							// self.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); // 动画只展现一次，去除ani类名
						}
					}
				},
				// Swiper 动画配置
				swiperAniConfigS: {
					swiperAnimateEffect: 'rubberBand', // 动画效果
					swiperAnimateDuration: '1.2s', // 动画持续时间
					swiperAnimateDelay: '0.3s' // 动画延迟时间
				},
				swiperAniConfigA: {
					swiperAnimateEffect: 'bounceInDown', // 动画效果
					swiperAnimateDuration: '0.9s', // 动画持续时间
					swiperAnimateDelay: '0.1s' // 动画延迟时间
				},
				swiperAniConfigB: {
					swiperAnimateEffect: 'rotateInUpRight', // 动画效果
					swiperAnimateDuration: '0.7s', // 动画持续时间
					swiperAnimateDelay: '0.2s' // 动画延迟时间
				}
			};
		},
		mounted() {
			const self = this;
			// 移动端适配
			if (window.innerWidth >= this.$store.state.adaptationInnerWidth) {
				// 非移动端标识
				this.isMobileDevice = false;

				// 获取随机背景图，求职期间暂时关闭，仅填充部分空格子
				this.getRandomBackGroundImg();

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
			// 跳转到个人主页，废弃使用
			linktoFx67llCom() {
				window.open('https://fx67ll.com');
			},
			// 跳转到个人博客
			linktoFx67llBlog() {
				window.open('https://fx67ll.xyz');
			},
			// 获取天气信息 https://seniverse.yuque.com/books/share/e52aa43f-8fe9-4ffa-860d-96c0f3cf1c49/nyiu3t
			getWeather(location) {
				axios.get(
					`${process.env.VUE_APP_WEATHER_API}?key=SZzSZewGNnCp43FAb&location=${location}&language=zh-Hans&unit=c`
				).then(res => {
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
				// 页面背景
				// document.getElementById("index-bg-img").style.backgroundImage = `url(${self.randomImgUrl})`;

				// 所有方块背景
				// _.each(document.getElementsByClassName('scale'), function(item, key) {
				// 	item.style.backgroundImage = `url(${self.randomImgUrl})`;
				// });

				// 空白区域
				_.each(document.getElementsByClassName('card-bg-img-empty'), function(item, key) {
					if (self.randomImgUrl) {
						item.style.backgroundImage = `url(${self.randomImgUrl})`;
					} else {
						item.style.backgroundImage = `url(${require('@a/images/defaultBackgroundImage.jpg')})`;
					}
				});
			},
			// 页面跳转
			goNext(path, fileName) {
				let routeUrl = this.$router.resolve({
					path: path,
					query: {
						fileName: fileName
					}
				});
				window.open(routeUrl.href, '_blank');
			}
		}
	};
</script>

<style lang="less" scoped="scoped">
	@import '@a/styles/index/index.less';
</style>