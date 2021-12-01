<template>
	<div class='cube-box'>
		<div id='cube-container' class='three-box'></div>
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
	export default {
		name: 'cube',
		data() {
			return {
				// 相机对象
				camera: null,
				// 场景对象
				scene: null,
				// 渲染器对象
				renderer: null,
				// 状态对象
				stats: null,
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
					]
				}
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			// Threejs初始化
			init() {
				// 画布高度
				const width = window.innerWidth;
				// 画布宽度
				const height = window.innerHeight;
				// 画布容器
				const container = document.getElementById('cube-container');

				// 创建渲染器对象
				this.renderer = new THREE.WebGLRenderer({
					antialias: true
				});
				this.renderer.setSize(width, height);
				this.renderer.setClearColor(0xFFFFFF, 1.0);
				container.appendChild(this.renderer.domElement);

				// 创建相机对象
				this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
				this.camera.position.set(200, 400, 600);
				this.camera.up.set(0, 1, 0);
				this.camera.lookAt(new THREE.Vector3(0, 0, 0));

				// 创建场景对象
				this.scene = new THREE.Scene();

				// 创建光线对象
				const light = new THREE.AmbientLight(0xfefefe);
				this.scene.add(light);

				// 创建xyz坐标轴，测试用
				// this.initAxis();

				// 创建魔方
				this.initCube();

				// 引入轨道器模块
				const controls = new OrbitControls(this.camera, this.renderer.domElement);
				controls.target.set(0, 0, 0);
				controls.update();

				// 监听窗口变化
				window.addEventListener('resize', this.onWindowResize);

				// 引入监测模块
				this.stats = new Stats();
				container.appendChild(this.stats.dom);

				// 执行动画渲染
				this.animate();
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
				let leftUpX = this.cubeParmas.x - this.cubeParmas.num / 2 * this.cubeParmas.len;
				let leftUpY = this.cubeParmas.y + this.cubeParmas.num / 2 * this.cubeParmas.len;
				let leftUpZ = this.cubeParmas.z + this.cubeParmas.num / 2 * this.cubeParmas.len;
			
				// 根据颜色生成材质
				let materialArr = [];
				_.each(self.cubeParmas.colors, function(item, key) {
					// 纹理对象
					// https://blog.csdn.net/qq_30100043/article/details/80114794
					let texture = new THREE.Texture(self.drawFace(item));
					texture.needsUpdate = true;
			
					// 高级材质对象
					// https://blog.csdn.net/qq_30100043/article/details/78047104
					let material = new THREE.MeshLambertMaterial({
						map: texture
					});
					materialArr.push(material);
				});
			
				// 创建魔方数组
				for (var i = 0; i < self.cubeParmas.num; i++) {
					for (var j = 0; j < self.cubeParmas.num * self.cubeParmas.num; j++) {
						// 立方体对象
						// https://blog.csdn.net/yangnianbing110/article/details/51306653
						let cubeGeo = new THREE.BoxGeometry(self.cubeParmas.len, self.cubeParmas.len, self.cubeParmas.len);
						// 立方体网格模型
						let cubeMesh = new THREE.Mesh(cubeGeo, materialArr);
			
						//  依次计算各个小方块中心点坐标，对各面依次计算
						cubeMesh.position.x = (leftUpX + self.cubeParmas.len / 2) + (j % self.cubeParmas.num) * self
							.cubeParmas.len;
						cubeMesh.position.y = (leftUpY - self.cubeParmas.len / 2) - parseInt(j / self.cubeParmas.num) *
							self.cubeParmas.len;
						cubeMesh.position.z = (leftUpZ - self.cubeParmas.len / 2) - i * self.cubeParmas.len;
						self.cubeArr.push(cubeMesh);
					}
				}
			
				// 依次添加到场景中
				_.each(this.cubeArr, function(item, key) {
					self.scene.add(item);
				});
			},
			// canvas绘制魔方的每一面
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
				// 递归调用
				requestAnimationFrame(this.animate);
				// 创建时钟对象
				const clock = new THREE.Clock();
				// 获得前后两次执行的时间间隔
				const delta = clock.getDelta();
				// 执行渲染
				this.renderer.render(this.scene, this.camera);
				// 更新监测器
				this.stats.update();
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
	}
</style>
