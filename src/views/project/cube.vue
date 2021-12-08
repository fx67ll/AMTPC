<template>
	<div class='cube-box'>
		<div id='cube-container' class='three-box'></div>
		<div class='button-panel' v-if='!isMobileDevice'>
			<el-input-number v-model='randomCount' :disabled='isProgress || isNeedReset' />
			<el-button class='random-buttom' icon='el-icon-thumb' @click='randomCube()' :disabled='isNeedReset'>打乱魔方
			</el-button>
			<span class='random-span' v-if='isNeedReset'>{{ recordTextTime }}</span>
			<el-button class='random-buttom' :icon='recordIcon' @click='randomTimeRecord()'>{{ recordText }}</el-button>
			<el-button class='random-buttom' icon='el-icon-timer' @click='randomTimeReset()' v-if='isNeedReset'>重新计时
			</el-button>
		</div>
		<fx67ll-footer />
	</div>
</template>

<script>

	// Threejs主模块
	import * as THREE from 'three/build/three.module.js';
	// Threejs监测器模块
	import Stats from 'three/examples/jsm/libs/stats.module.js';
	// Threejs轨道器模块
	import {
		OrbitControls
	} from 'three/examples/jsm/controls/OrbitControls.js';

	// 数学工具
	import _ from 'underscore';
	// 时间工具
	import moment from 'moment';

	export default {
		name: 'cube',
		data() {
			return {
				// 舞台宽度
				width: null,
				// 舞台高度
				height: null,
				// 相机对象
				camera: null,
				// 场景对象
				scene: null,
				// 渲染器对象
				renderer: null,
				// 状态监测器对象
				stats: null,
				// 视角控制器对象
				controller: null,
				// 魔方数组
				cubeArr: [],
				// 魔方参数
				cubeParmas: {
					x: 0, // 中心点坐标 x
					y: 0, // 中心点坐标 y
					z: 0, // 中心点坐标 z
					num: 3, // 魔方阶数
					len: 50, // 魔方单个方块宽高
					colors: [ // 魔方六面颜色
						'rgba(255,193,37,1)',
						'rgba(0,191,255,1)',
						'rgba(50,205,50,1)',
						'rgba(178,34,34,1)',
						'rgba(255,255,0,1)',
						'rgba(255,255,255,1)'
					],
					dir: { // 魔方转动的六个方向
						xLine: new THREE.Vector3(1, 0, 0), // x轴正方向
						xLineAd: new THREE.Vector3(-1, 0, 0), // x轴负方向
						yLine: new THREE.Vector3(0, 1, 0), // y轴正方向
						yLineAd: new THREE.Vector3(0, -1, 0), // y轴负方向
						zLine: new THREE.Vector3(0, 0, 1), // z轴正方向
						zLineAd: new THREE.Vector3(0, 0, -1) // z轴负方向
					}
				},
				// 初始状态的魔方数组
				cubeOriginArr: [],
				// 魔方是否在转动
				isRotating: false,
				// 碰撞光线检测器
				raycaster: null,
				// 碰撞光线触发的单个元素
				intersect: null,
				// 碰撞光线触发位置
				startPoint: null,
				// 碰撞光线触发元素的移动位置
				movePoint: null,
				// 碰撞平面法向量
				normalize: null,
				// 鼠标坐标或触摸坐标
				mouse: null,
				// 随机旋转的定时器对象
				randomTimer: null,
				// 是否正在单次随机旋转
				isRandom: false,
				// 是否正在随机旋转的过程
				isProgress: false,
				// 随机旋转的时间，小于30会有点小问题
				rotateSpeed: 100,
				// 旋转次数
				randomCount: 50,
				// 旋转次数记录
				randomRecord: 1,
				// 按钮文字
				recordText: '开始计时',
				// 记录时间
				recordTextTime: '',
				// 时间记录按钮icon
				recordIcon: 'el-icon-video-play',
				// 是否正在计时
				isPause: false,
				// 是否需要重置
				isNeedReset: false,
				// 计时开始时间
				recordTimeStart: null,
				// 暂停之前的计时总时间
				recordTimeLast: 0,
				// 总计用时
				recordTimeTotal: 0,
				// 复原魔方的计时器对象
				recordTimer: null,
				// 移动端标识
				isMobileDevice: false
			}
		},
		mounted() {
			// 魔方系统初始化
			this.init();
			// 系统统一提示
			this.showOperationTips();


			if (window.innerWidth >= this.$store.state.adaptationInnerWidth) {
				this.isMobileDevice = false;
				// 本页面特殊提示
				this.showCubeOperationTips();
			} else {
				this.isMobileDevice = true;

				// 移动端添加魔方打乱方法
				this.$message({
					message: '正在打乱魔方，请稍后还原 (๑•̀ㅂ•́)و✧',
					type: 'success',
					offset: 70
				});
				this.randomCount = 30;
				this.randomCube();
			}
		},
		methods: {
			// 魔方操作提示
			showCubeOperationTips() {
				this.$notify({
					title: '魔方操作指南',
					position: 'top-right',
					offset: 190,
					dangerouslyUseHTMLString: true,
					message: `
						<br/>
						<strong><i class='el-icon-coordinate'></i> 三维旋转需用鼠标左键按住空白区域</strong><br/><br/>
						<strong><i class='el-icon-thumb'></i> 点击滑动魔方表面可操作魔方转动</strong><br/><br/>
						<strong><i class='el-icon-refresh'></i> 刷新页面会导致魔方重置</strong><br/><br/>
						<strong><i class='el-icon-male'></i> 会偶现bug无法转动魔方，待后续解决</strong><br/><br/>
						<strong><i class='el-icon-message'></i> 联系邮箱 fx67ll@qq.com，欢迎提交bug</strong><br/><br/>
					`,
					duration: 30000,
					showClose: true
				});
			},
			// 随机旋转打乱魔方
			randomCube() {
				let self = this;

				// 如果正在循环过程中操作无效
				if (this.randomCount) {
					if (!this.isProgress) {
						this.isProgress = true;

						this.randomTimer = setInterval(function() {
							self.randomRotate();
						}, self.rotateSpeed);

						setTimeout(function() {
							// 总时间到了之后要清除计时器
							clearInterval(self.randomTimer);
							self.randomTimer = null;

							self.isProgress = false;
							// 动画时间+间隔时间，所以乘以二
						}, (self.rotateSpeed * self.randomCount * 2));
					} else {
						this.$message.error('正在打乱魔方，请勿重复操作 凸(艹皿艹 )');
					}
				} else {
					this.$message.error('亲~ 打乱次数不能为零哦 (づ￣3￣)づ╭❤～');
				}
			},
			// 单次随机旋转魔方
			randomRotate() {
				let self = this;

				// 随机旋转必须在上一次旋转完成之后才允许操作
				if (!this.isRandom) {
					this.isRandom = true;
					this.randomCount--;
					// console.log(this.randomRecord++);

					// 获取一个随机方向
					let dirArr = [0.1, 1.2, 2.4, 3.3, 0.2, 1.1, 2.3, 3.4, 0.4, 1.3, 4.3, 5.4, 1.4, 0.3, 4.4, 5.3,
						2.2, 3.1,
						4.1, 5.2, 2.1, 3.2, 4.2, 5.1
					];
					let dirArrRandomIndex = _.random(0, dirArr.length - 1);
					let dir = dirArr[dirArrRandomIndex];

					// 获取一个随机方块
					let objRandomIndex = _.random(0, self.cubeArr.length - 1);
					let obj = {
						object: self.cubeArr[objRandomIndex]
					}

					// 执行旋转
					let el = this.getBoxs(obj, dir);
					window.requestAnimationFrame(function(timestamp) {
						self.rotateAnimation(el, dir, self.rotateSpeed, timestamp, 0)
					});

					setTimeout(function() {
						self.isRandom = false;
					}, self.rotateSpeed);
				}
			},
			// 计时还原魔方的操作
			randomTimeRecord() {
				let self = this;
				if (!this.isProgress) {
					if (!this.isPause) {
						// 显示计时文字
						this.recordTimeStart = moment().format('YYYY-MM-DD HH:mm:ss');

						// 区分提示
						if (this.recordTimeLast === 0) {
							this.$message.success('计时开始咯~ 请开始还原魔方吧 (๑•̀ㅂ•́)و✧');
						} else {
							this.$message.success('继续计时咯~ 不能够放弃啊骚年！！！  Σ( ° △ °|||)︴');
						}

						// 设置按钮icon和文字
						this.recordIcon = 'el-icon-loading';
						this.recordText = '暂停计时';

						// 显示重置按钮
						this.isNeedReset = true;

						// 开始计时器
						this.recordTimer = setInterval(function() {
							// 只有重置按钮出现的时候才允许出现计时文字
							if (self.isNeedReset) {
								// 计时器刷新计时，如果暂停过先加上之前的时间
								self.recordTimeTotal = self.recordTimeLast + moment().diff(moment(self
									.recordTimeStart), 'seconds');
								let timeText = '00秒';
								if (self.recordTimeTotal < 60) {
									timeText = moment.utc(self.recordTimeTotal * 1000).format('ss秒');
								} else if (self.recordTimeTotal < 3600) {
									timeText = moment.utc(self.recordTimeTotal * 1000).format('mm分 ss秒');
								} else {
									timeText = moment.utc(self.recordTimeTotal * 1000).format('HH小时 mm分 ss秒');
								}
								self.recordTextTime = `当前已用时：${timeText}`;
								self.isClickPause = false;
							}
						}, 1000);
					} else {
						// 先存储当前计时
						this.recordTimeLast = this.recordTimeTotal;

						// 设置按钮icon和文字
						this.recordIcon = 'el-icon-video-play';
						this.recordText = '继续计时';

						// 暂停的时候也需要清空计时器，但是不清空计时的时间
						clearInterval(this.recordTimer);
						this.recordTimer = null;
					}
					this.isPause = !this.isPause;
				} else {
					this.$message.error('正在打乱魔方，不能计时 ┻━┻︵╰(‵□′)╯︵┻━┻');
				}
			},
			// 重置还原魔方的计时
			randomTimeReset() {
				// 重置按钮icon和文字
				this.recordIcon = 'el-icon-video-play';
				this.recordText = '开始计时';

				// 重置暂停标识和重置标识
				this.isPause = false;
				this.isNeedReset = false;

				// 重置计时文字和时间
				this.recordTimeTotal = 0;
				this.recordTextTime = '';

				// 重置暂停用的计时时间
				this.recordTimeLast = 0;

				// 清空计时器
				clearInterval(this.recordTimer);
				this.recordTimer = null;

				this.$message.success('重置计时成功，下次再努力吧 (o゜▽゜)o☆[BINGO!]');
			},
			// Threejs初始化
			init() {
				let self = this;

				// 画布高度
				this.width = window.innerWidth;
				// 画布宽度
				this.height = window.innerHeight;
				// 画布容器
				const container = document.getElementById('cube-container');

				// 初始化坐标
				this.mouse = new THREE.Vector2();

				// 初始化检测器
				this.raycaster = new THREE.Raycaster();

				// 创建渲染器对象
				this.renderer = new THREE.WebGLRenderer({
					antialias: true
				});
				this.renderer.setSize(this.width, this.height);
				this.renderer.setClearColor(0xFFFFFF, 1.0);
				container.appendChild(this.renderer.domElement);

				// 创建相机对象
				this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
				// 设置相机位置
				if (window.innerWidth >= this.$store.state.adaptationInnerWidth) {
					this.camera.position.set(400, 400, 400);
				} else {
					this.camera.position.set(400, 300, 700);
				}
				// 设置相机在正方向
				this.camera.up.set(0, 1, 0);
				// 设置相机对准中心原点
				this.camera.lookAt(new THREE.Vector3(0, 0, 0));

				// 创建场景对象
				this.scene = new THREE.Scene();

				// 创建光线对象
				const light = new THREE.AmbientLight(0xfefefe);
				this.scene.add(light);

				// 创建xyz坐标轴，测试用
				// this.initAxis();

				// 创建魔方，这里是实体数组
				this.initCube();

				// 引入轨道器模块
				this.controller = new OrbitControls(this.camera, this.renderer.domElement);
				this.controller.target.set(0, 0, 0);
				this.controller.update();

				// 监听窗口变化
				window.addEventListener('resize', this.onWindowResize);

				// 引入监测模块
				this.stats = new Stats();
				container.appendChild(this.stats.dom);

				// 执行动画渲染
				this.animate();

				//监听鼠标事件，mousedown和mouseup在vue中失效，必须使用pointerdown和pointerup
				// https://blog.csdn.net/zps925458125/article/details/113309657
				this.renderer.domElement.addEventListener('pointerdown', self.startCube, false);
				this.renderer.domElement.addEventListener('mousemove', self.moveCube, false);
				this.renderer.domElement.addEventListener('pointerup', self.stopCube, false);
				//监听触摸事件，暂时不开放移动端显示
				this.renderer.domElement.addEventListener('touchstart', self.startCube, false);
				this.renderer.domElement.addEventListener('touchmove', self.moveCube, false);
				this.renderer.domElement.addEventListener('touchend', self.stopCube, false);
			},
			// 创建xyz坐标轴
			initAxis() {
				// x轴
				const xmat = new THREE.LineBasicMaterial({
					color: 0xff0000
				});
				const xgeo = new THREE.Geometry();
				xgeo.vertices.push(
					new THREE.Vector3(0, 0, 0),
					new THREE.Vector3(300, 0, 0)
				);
				const xline = new THREE.Line(xgeo, xmat);
				this.scene.add(xline);

				// y轴
				const ymat = new THREE.LineBasicMaterial({
					color: 0x00ff00
				});
				const ygeo = new THREE.Geometry();
				ygeo.vertices.push(
					new THREE.Vector3(0, 0, 0),
					new THREE.Vector3(0, 300, 0)
				);
				const yline = new THREE.Line(ygeo, ymat);
				this.scene.add(yline);

				// z轴
				const zmat = new THREE.LineBasicMaterial({
					color: 0x0000ff
				});
				const zgeo = new THREE.Geometry();
				zgeo.vertices.push(
					new THREE.Vector3(0, 0, 0),
					new THREE.Vector3(0, 0, 300)
				);
				const zline = new THREE.Line(zgeo, zmat);
				this.scene.add(zline);
			},
			// 创建魔方
			initCube() {
				let self = this;

				// 魔方左上角坐标，距离是正方体高度的一半
				const leftUpX = this.cubeParmas.x - this.cubeParmas.num / 2 * this.cubeParmas.len;
				const leftUpY = this.cubeParmas.y + this.cubeParmas.num / 2 * this.cubeParmas.len;
				const leftUpZ = this.cubeParmas.z + this.cubeParmas.num / 2 * this.cubeParmas.len;

				// 根据颜色生成材质
				let materialArr = [];
				_.each(self.cubeParmas.colors, function(item, key) {
					// 纹理对象
					// https://blog.csdn.net/qq_30100043/article/details/80114794
					const texture = new THREE.Texture(self.drawFace(item));
					texture.needsUpdate = true;

					// 高级材质对象
					// https://blog.csdn.net/qq_30100043/article/details/78047104
					const material = new THREE.MeshLambertMaterial({
						map: texture
					});
					materialArr.push(material);
				});

				// 创建魔方数组
				for (let i = 0; i < self.cubeParmas.num; i++) {
					for (let j = 0; j < (self.cubeParmas.num * self.cubeParmas.num); j++) {
						// 立方体对象
						// https://blog.csdn.net/yangnianbing110/article/details/51306653
						const cubeGeo = new THREE.BoxGeometry(self.cubeParmas.len, self.cubeParmas.len, self
							.cubeParmas
							.len);
						// 立方体网格模型
						const cubeMesh = new THREE.Mesh(cubeGeo, materialArr);

						//  依次计算各个小方块中心点坐标，对各面依次计算，这里没有深入详细分析，纯粹抄了一下坐标算法
						cubeMesh.position.x = (leftUpX + self.cubeParmas.len / 2) + (j % self.cubeParmas.num) *
							self
							.cubeParmas.len;
						cubeMesh.position.y = (leftUpY - self.cubeParmas.len / 2) - parseInt(j / self.cubeParmas
								.num) *
							self.cubeParmas.len;
						cubeMesh.position.z = (leftUpZ - self.cubeParmas.len / 2) - i * self.cubeParmas.len;
						self.cubeArr.push(cubeMesh);
					}
				}

				// 魔方数组的每一面依次添加到场景中
				_.each(this.cubeArr, function(item, key) {

					// 添加魔方的初始数组，应该是为了记录初始坐标
					self.cubeOriginArr.push({
						x: item.position.x,
						y: item.position.y,
						z: item.position.z,
						cubeIndex: item.id
						// 原作者id从9开始，我这里从12开始，所以全员减3，貌似不需要，错误在Math函数里无法访问cubeParams的len参数
						// cubeIndex: item.id - 3
					});
					// 应该是通过对比cubeIndex做些事情
					item.cubeIndex = item.id;
					// 原作者id从9开始，我这里从12开始，所以全员减3，貌似不需要，错误在Math函数里无法访问cubeParams的len参数
					// item.cubeIndex = item.id - 3;

					self.scene.add(item);
				});

				// 创建透明正方体并添加到场景中
				// 创建立方体
				const cubeGeo = new THREE.BoxGeometry(150, 150, 150);
				// 设置十六进制颜色
				let hex = 0x000000;
				_.each(cubeGeo.faces, function(item, key) {
					item.color.setHex(hex);
					// cubeGeo.faces[key + 1].color.setHex(hex);
				});
				// 作者写的和上面的方式没什么区别，所以弃用for循环
				// for (var i = 0; i < cubeGeo.faces.length; i += 2) {
				// 	cubeGeo.faces[i].color.setHex(hex);
				// 	cubeGeo.faces[i + 1].color.setHex(hex);
				// }
				// 创建材质
				const cubeMat = new THREE.MeshBasicMaterial({
					vertexColors: THREE.FaceColors,
					opacity: 0,
					transparent: true
				});
				// 立方体加材质创建立方体网格模型
				const cubeTra = new THREE.Mesh(cubeGeo, cubeMat);
				// 添加属性cubeType
				cubeTra.cubeType = 'coverCube';
				// 添加到场景中
				self.scene.add(cubeTra);
			},
			/**  
			 * @description 创建魔方的每一个面
			 * @param {String} color 每面的颜色，就是rgba信息
			 * @return {Object} canvas对象，也就是每一面
			 * 
			 * 第一次尝试写规范注释
			 * 参考这篇文章：https://blog.csdn.net/tianxintiandisheng/article/details/103764074
			 * 
			 **/
			drawFace(color) {
				let canvas = document.createElement('canvas');
				canvas.width = 256;
				canvas.height = 256;
				let context = canvas.getContext('2d');
				// 返回用于填充的颜色
				context.fillStyle = 'rgba(0, 0, 0, 1)';
				// 绘制已填色的矩形
				context.fillRect(0, 0, 256, 256);
				// 绘制未填色的矩形
				context.rect(16, 16, 224, 224);
				// 当两条线条交汇时，创建圆形边角
				context.lineJoin = 'round';
				// 线条颜色
				context.lineWidth = 16;
				// 返回用于填充的颜色
				context.fillStyle = color;
				// 返回用于笔触的颜色
				context.strokeStyle = color;
				// 绘制一条路径
				context.stroke();
				// 填充当前的图像
				context.fill();
				// 返回canvas对象
				return canvas;
			},
			// 监听窗口变化
			onWindowResize() {
				// 更新相机对象
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();

				// 更新渲染器
				this.renderer.setSize(window.innerWidth, window.innerHeight);
			},
			// 执行动画渲染
			animate() {
				// // 创建时钟对象
				// const clock = new THREE.Clock();
				// // 获得前后两次执行的时间间隔
				// const delta = clock.getDelta();

				// 先清空渲染器
				this.renderer.clear();
				// 执行渲染
				this.renderer.render(this.scene, this.camera);
				// 递归调用动画渲染函数
				window.requestAnimationFrame(this.animate);
				// 更新监测器
				this.stats.update();
			},
			/**
			 * @description 滑动操作魔方
			 * @param {event} e 监听事件
			 *
			 **/
			moveCube(e) {
				let self = this;
				this.getIntersects(e);
				// 判断是否有碰撞光线穿过的元素
				if (this.intersect) {
					// 判断是否在旋转中以及是否有碰撞光线触发位置
					if (!this.isRotating && this.startPoint) {
						// 碰撞光线触发元素的位置
						this.movePoint = this.intersect.point;
						// 起始位置不一样意味着可以获得转动向量
						if (!this.movePoint.equals(this.startPoint)) {
							// 转动标识设置为true
							this.isRotating = true;
							// 计算转动向量
							let sub = this.movePoint.sub(this.startPoint);
							// 获得方向
							let dir = this.getDirection(sub);
							// 获取运动元素数组，核心算法来了，真的看不懂了，先完全抄下来
							let el = this.getBoxs(this.intersect, dir);
							// 获取开始时间，原作者写的这个，好像没卵用啊
							// let startTime = new Date().getTime();
							// 动画渲染
							window.requestAnimationFrame(function(timestamp) {
								self.rotateAnimation(el, dir, 500, timestamp, 0)
							});
						}
					}
				}
				e.preventDefault();
			},
			/**
			 * @description 魔方操作开始
			 * @param {event} e 监听事件
			 *
			 **/
			startCube(e) {
				this.getIntersects(e);
				// 魔方没有处于转动过程中且存在碰撞物体
				if (!this.isRotating && this.intersect) {
					// 开始转动，设置起始点
					this.startPoint = this.intersect.point;
					// 当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
					this.controller.enabled = false;
				} else {
					// 当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
					this.controller.enabled = true;
				}
			},
			// 魔方操作结束
			stopCube() {
				this.intersect = null;
				this.startPoint = null;
			},
			/**
			 * @description 获取操作焦点以及该焦点所在平面的法向量
			 * @param {event} e 监听事件
			 *
			 **/
			getIntersects(e) {
				let self = this;

				// 触摸事件和鼠标事件获取坐标的方式有点区别，这里是为了兼容pc和移动端
				if (e.touches) {
					let touch = event.touches[0];
					this.mouse.x = (touch.clientX / this.width) * 2 - 1;
					this.mouse.y = -(touch.clientY / this.height) * 2 + 1;
				} else {
					this.mouse.x = (e.clientX / this.width) * 2 - 1;
					this.mouse.y = -(e.clientY / this.height) * 2 + 1;
				}

				// 从相机发射一条射线，经过鼠标点击位置
				this.raycaster.setFromCamera(this.mouse, this.camera);

				// Raycaster方式定位选取元素，可能会选取多个，以第一个为准
				let intersectArr = this.raycaster.intersectObjects(this.scene.children);
				if (intersectArr.length) {
					// 这里用到了透明正方体的属性
					if (intersectArr[0].object.cubeType === 'coverCube') {
						this.intersect = intersectArr[1];
						this.normalize = intersectArr[0].face.normal;
					} else {
						this.intersect = intersectArr[0];
						// 这里我会出现异常，但是不影响使用，花点时间排查一下
						try {
							self.normalize = intersectArr[1].face.normal;
						} catch (e) {
							//TODO handle the exception
							// console.log(intersectArr.length);
							console.log(e);
							console.error('非常抱歉！这是暂未解决的bug，请刷新页面后重新操作！');
						}
					}
				}
			},
			/**
			 * @description 获得旋转方向
			 * @param {Object} sub vector3差向量	
			 * @return {Number} 返回旋转方向 
			 *
			 **/
			getDirection(sub) {
				// 判断差向量和xyz轴的夹角
				let xAngle = sub.angleTo(this.cubeParmas.dir.xLine);
				let xAngleAd = sub.angleTo(this.cubeParmas.dir.xLineAd);
				let yAngle = sub.angleTo(this.cubeParmas.dir.yLine);
				let yAngleAd = sub.angleTo(this.cubeParmas.dir.yLineAd);
				let zAngle = sub.angleTo(this.cubeParmas.dir.zLine);
				let zAngleAd = sub.angleTo(this.cubeParmas.dir.zLineAd);

				// 获取最小夹角，直接利用underscore处理
				let minAngle = _.min([xAngle,
					xAngleAd,
					yAngle,
					yAngleAd,
					zAngle,
					zAngleAd
				]);

				// 旋转方向
				let direction = null;

				// 根据最小夹角来判断旋转的方向？这里对上了之前的数值枚举那些值
				// 向x轴正方向旋转90度（要区分是绕z轴还是绕y轴）
				if (minAngle === xAngle) {
					direction = 0;
					if (this.normalize.equals(this.cubeParmas.dir.yLine)) {
						// 绕z轴顺时针
						direction = direction + 0.1;
					} else if (this.normalize.equals(this.cubeParmas.dir.yLineAd)) {
						// 绕z轴逆时针
						direction = direction + 0.2;
					} else if (this.normalize.equals(this.cubeParmas.dir.zLine)) {
						// 绕y轴逆时针
						direction = direction + 0.3;
					} else {
						// 绕y轴顺时针
						direction = direction + 0.4;
					}
				}
				// 向x轴反方向旋转90度
				if (minAngle === xAngleAd) {
					// 向x轴反方向旋转90度
					direction = 1;
					if (this.normalize.equals(this.cubeParmas.dir.yLine)) {
						// 绕z轴逆时针
						direction = direction + 0.1;
					} else if (this.normalize.equals(this.cubeParmas.dir.yLineAd)) {
						// 绕z轴顺时针
						direction = direction + 0.2;
					} else if (this.normalize.equals(this.cubeParmas.dir.zLine)) {
						// 绕y轴顺时针
						direction = direction + 0.3;
					} else {
						// 绕y轴逆时针
						direction = direction + 0.4;
					}
				}
				// 向y轴正方向旋转90度
				if (minAngle === yAngle) {
					// 向y轴正方向旋转90度
					direction = 2;
					if (this.normalize.equals(this.cubeParmas.dir.zLine)) {
						// 绕x轴逆时针
						direction = direction + 0.1;
					} else if (this.normalize.equals(this.cubeParmas.dir.zLineAd)) {
						// 绕x轴顺时针
						direction = direction + 0.2;
					} else if (this.normalize.equals(this.cubeParmas.dir.xLine)) {
						// 绕z轴逆时针
						direction = direction + 0.3;
					} else {
						// 绕z轴顺时针
						direction = direction + 0.4;
					}
				}
				// 向y轴反方向旋转90度
				if (minAngle === yAngleAd) {
					// 向y轴反方向旋转90度
					direction = 3;
					if (this.normalize.equals(this.cubeParmas.dir.zLine)) {
						// 绕x轴顺时针
						direction = direction + 0.1;
					} else if (this.normalize.equals(this.cubeParmas.dir.zLineAd)) {
						// 绕x轴逆时针
						direction = direction + 0.2;
					} else if (this.normalize.equals(this.cubeParmas.dir.xLine)) {
						// 绕z轴顺时针
						direction = direction + 0.3;
					} else {
						// 绕z轴逆时针
						direction = direction + 0.4;
					}
				}
				// 向z轴正方向旋转90度
				if (minAngle === zAngle) {
					// 向z轴正方向旋转90度
					direction = 4;
					if (this.normalize.equals(this.cubeParmas.dir.yLine)) {
						// 绕x轴顺时针
						direction = direction + 0.1;
					} else if (this.normalize.equals(this.cubeParmas.dir.yLineAd)) {
						// 绕x轴逆时针
						direction = direction + 0.2;
					} else if (this.normalize.equals(this.cubeParmas.dir.xLine)) {
						// 绕y轴顺时针
						direction = direction + 0.3;
					} else {
						// 绕y轴逆时针
						direction = direction + 0.4;
					}
				}
				// 向z轴反方向旋转90度
				if (minAngle === zAngleAd) {
					// 向z轴反方向旋转90度
					direction = 5;
					if (this.normalize.equals(this.cubeParmas.dir.yLine)) {
						// 绕x轴逆时针
						direction = direction + 0.1;
					} else if (this.normalize.equals(this.cubeParmas.dir.yLineAd)) {
						// 绕x轴顺时针
						direction = direction + 0.2;
					} else if (this.normalize.equals(this.cubeParmas.dir.xLine)) {
						// 绕y轴逆时针
						direction = direction + 0.3;
					} else {
						// 绕y轴顺时针
						direction = direction + 0.4;
					}
				}

				// 返回方向
				return direction;
			},
			/**
			 * @description 根据触碰元素和方向获得运动元素数组，完全不懂的方法！！！
			 * @param {Object} tar intersect碰触元素
			 * @param {Number} dir 方向 
			 * @return {Array} 运动元素数组
			 *
			 **/
			getBoxs(tar, dir) {
				// 尝试修复mesh.id上的bug，原作者是从9开始，我他妈从12开始，凸(艹皿艹 )
				let meshId = 9;

				let self = this;
				// 注意！！！以下注释全部是猜测，纯感觉

				// 从碰触元素中获取信息
				let tarId = tar.object.cubeIndex;

				// 从魔方初始数组中获取信息
				let ids = [];
				_.each(this.cubeArr, function(item, key) {
					ids.push(item.cubeIndex);
				});

				// 获取index最小的元素
				let minId = _.min(ids);

				// 下面完全不知道什么意思，后面看教程处理吧
				tarId = tarId - minId;
				let numI = parseInt(tarId / 9);
				let numJ = tarId % 9;
				let boxs = [];

				// 虽然我没懂，但是作者说
				// 根据绘制的规律判断 number = i*9+j
				switch (dir) {
					// 作者说：绕z轴
					case 0.1:
					case 0.2:
					case 1.1:
					case 1.2:
					case 2.3:
					case 2.4:
					case 3.3:
					case 3.4:
						_.each(self.cubeArr, function(item, key) {
							// 这里少除了一个9
							// if (numI === parseInt(item.cubeIndex - minId)) {
							if (numI === parseInt((item.cubeIndex - minId) / 9)) {
								boxs.push(item);
							}
						});
						break;
						// 作者说：绕y轴
					case 0.3:
					case 0.4:
					case 1.3:
					case 1.4:
					case 4.3:
					case 4.4:
					case 5.3:
					case 5.4:
						_.each(self.cubeArr, function(item, key) {
							if (parseInt(numJ / 3) === parseInt((item.cubeIndex - minId) % 9 / 3)) {
								boxs.push(item);
							}
						});
						break;
						// 作者说：绕x轴	
					case 2.1:
					case 2.2:
					case 3.1:
					case 3.2:
					case 4.1:
					case 4.2:
					case 5.1:
					case 5.2:
						_.each(self.cubeArr, function(item, key) {
							// 这里多做了一步整型计算
							// if (numJ % 3 === parseInt((item.cubeIndex - minId) % 9 % 3)) {
							if (numJ % 3 === (item.cubeIndex - minId) % 9 % 3) {
								boxs.push(item);
							}
						});
						break;
					default:
						break;
				}

				// 返回盒子数组
				return boxs;
			},
			/**
			 * @description 旋转动画
			 * @param {Array} el elements 元素数组
			 * @param {Number} dir direction 旋转的方向
			 * @param {Number} tt totalTime 旋转动画总时间 
			 * @param {Number} cts currentTimeStamp 旋转动画当前时间戳
			 * @param {Number} sts startTimeStamp 旋转动画开始时间戳
			 * @param {Number} lts lastTimeStamp 旋转动画结束时间戳
			 *  
			 **/
			rotateAnimation(el, dir, tt, cts, sts, lts) {
				let self = this;

				// 转动的总时间，之前作者写死，现在改传入，方便修改动画时间
				// let totalTime = 500;

				// 这里的判断需要再琢磨一下
				if (sts === 0) {
					sts = cts;
					lts = cts;
				}
				if (cts - sts >= tt) {
					cts = sts + tt;
					this.isRotating = false;
					this.startPoint = null;
					this.updateCubeIndex(el);
				}

				// 猜测：这里貌似是通过平面法向量在罗列旋转的情况
				switch (dir) {
					// 绕z轴顺时针
					case 0.1:
					case 1.2:
					case 2.4:
					case 3.3:
						_.each(el, function(item, key) {
							self.rotateAroundWorld('z', item,
								-90 * Math.PI / 180 * (cts - lts) / tt
							)
						});
						break;
						// 绕z轴逆时针
					case 0.2:
					case 1.1:
					case 2.3:
					case 3.4:
						_.each(el, function(item, key) {
							self.rotateAroundWorld('z', item,
								90 * Math.PI / 180 * (cts - lts) / tt
							)
						});
						break;
						// 绕y轴顺时针
					case 0.4:
					case 1.3:
					case 4.3:
					case 5.4:
						_.each(el, function(item, key) {
							self.rotateAroundWorld('y', item,
								-90 * Math.PI / 180 * (cts - lts) / tt
							)
						});
						break;
						// 绕y轴逆时针
					case 1.4:
					case 0.3:
					case 4.4:
					case 5.3:
						_.each(el, function(item, key) {
							self.rotateAroundWorld('y', item,
								90 * Math.PI / 180 * (cts - lts) / tt
							)
						});
						break;
						// 绕x轴顺时针
					case 2.2:
					case 3.1:
					case 4.1:
					case 5.2:
						_.each(el, function(item, key) {
							self.rotateAroundWorld('x', item,
								90 * Math.PI / 180 * (cts - lts) / tt
							)
						});
						break;
						// 绕x轴逆时针
					case 2.1:
					case 3.2:
					case 4.2:
					case 5.1:
						_.each(el, function(item, key) {
							self.rotateAroundWorld('x', item,
								-90 * Math.PI / 180 * (cts - lts) / tt
							)
						});
						break;
					default:
						break;
				}

				// 如果动画现在的时间减去开始时间小于动画总时间，则继续旋转？
				if (cts - sts < tt) {
					window.requestAnimationFrame(function(timestamp) {
						// 这里最后一个参数应该重新传cts而不是lts，传lts导致无法停止
						// self.rotateAnimation(el, dir, timestamp, sts, lts);
						self.rotateAnimation(el, dir, tt, timestamp, sts, cts);
					});
				}
			},
			/**
			 * @description 更新元素的位置索引
			 * @param {Array} el elements 元素数组
			 *
			 **/
			updateCubeIndex(el) {
				let self = this;
				_.each(el, function(item, key) {
					_.each(self.cubeOriginArr, function(obj, index) {
						// fx67ll -- 这里必须接受一下this里的变量，Math函数中貌似无法访问
						let len = self.cubeParmas.len;
						if (Math.abs(item.position.x - obj.x) <= (len / 2) &&
							Math.abs(item.position.y - obj.y) <= (len / 2) &&
							Math.abs(item.position.z - obj.z) <= (len / 2)
						) {
							item.cubeIndex = obj.cubeIndex;
						}
					});
				});
			},
			/**
			 * @description 绕着世界坐标系的某个轴旋转，分别是xyz三个方向
			 * @param {String} dir 旋转所需要绕的轴
			 * @param {Objecty} obj  旋转的对象
			 * @param {Number} rad 旋转的角度
			 * 
			 * 下面是原作者的对于这个旋转的解释说明
			 * 但是我暂时无法理解所谓的四元数
			 * 所以这里先留个坑
			 * 
			 * 因为物体本身的坐标系是随着物体的变化而变化的，
			 * 所以如果使用rotateZ、rotateY、rotateX等方法，
			 * 多次调用后就会出问题，先改为Quaternion实现。
			 * 
			 **/
			rotateAroundWorld(dir, obj, rad) {
				// 对象的初始xyz轴坐标点
				let x0 = obj.position.x;
				let y0 = obj.position.y;
				let z0 = obj.position.z;

				// 四元数对象，咱不理解，先写
				const q = new THREE.Quaternion();

				// xyz分别处理
				if (dir === 'x') {
					// 通过旋转轴axis和旋转角度angle设置四元数数据，过于复杂，暂不理解
					q.setFromAxisAngle(this.cubeParmas.dir.xLine, rad);
					obj.quaternion.premultiply(q);
					// 这里的旋转数学计算后期深入分析整理
					obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0;
					obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0;
				}
				if (dir === 'y') {
					// 通过旋转轴axis和旋转角度angle设置四元数数据，过于复杂，暂不理解
					q.setFromAxisAngle(this.cubeParmas.dir.yLine, rad);
					obj.quaternion.premultiply(q);
					// 这里的旋转数学计算后期深入分析整理
					obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0;
					obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0;
				}
				if (dir === 'z') {
					// 通过旋转轴axis和旋转角度angle设置四元数数据，过于复杂，暂不理解
					q.setFromAxisAngle(this.cubeParmas.dir.zLine, rad);
					obj.quaternion.premultiply(q);
					// 这里的旋转数学计算后期深入分析整理
					obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0;
					obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0;
				}
			}
		}
	}
</script>

<style lang='less' scoped='scoped'>
	.cube-box {
		width: 100%;
		height: 100%;
		overflow: hidden;

		.three-box {
			width: 100%;
			height: 100%;
		}

		.button-panel {
			width: 100%;
			position: absolute;
			bottom: 60px;
			display: flex;
			justify-content: center;

			.random-buttom {
				margin-left: 30px;
			}

			.random-buttom {
				margin-left: 30px;
			}

			.random-span {
				margin-left: 30px;
				line-height: 42px;
				font-size: 20px;
			}
		}
	}
</style>
