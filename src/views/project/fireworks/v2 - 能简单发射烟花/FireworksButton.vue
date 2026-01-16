<template>
    <div class="fireworks-enhanced">
        <!-- 控制面板 -->
        <div class="control-panel" :class="{ 'panel-collapsed': panelCollapsed }">
            <div class="panel-header" @click="togglePanel">
                <span class="panel-title">🎆 烟花控制台</span>
                <span class="collapse-icon">{{ panelCollapsed ? '▶' : '▼' }}</span>
            </div>

            <div class="panel-content" v-show="!panelCollapsed">
                <!-- 烟花类型选择 -->
                <div class="control-group">
                    <h3>烟花类型</h3>
                    <div class="type-grid">
                        <button v-for="type in fireworkTypes" :key="type.id" class="type-btn"
                            :class="{ 'active': currentType === type.id }" @click="selectFireworkType(type.id)">
                            <span class="type-emoji">{{ type.emoji }}</span>
                            <span class="type-name">{{ type.name }}</span>
                        </button>
                    </div>
                </div>

                <!-- 颜色选择 -->
                <div class="control-group">
                    <h3>烟花颜色</h3>
                    <div class="color-palette">
                        <div v-for="color in colorPresets" :key="color.name" class="color-option"
                            :class="{ 'selected': selectedColors.includes(color.value) }"
                            :style="{ backgroundColor: color.value }" @click="toggleColor(color.value)"
                            :title="color.name"></div>
                    </div>
                    <div class="custom-color">
                        <label>自定义颜色:</label>
                        <input type="color" v-model="customColor" @change="addCustomColor">
                        <button @click="addCustomColor" class="small-btn">添加</button>
                    </div>
                    <div class="selected-colors">
                        <div v-for="(color, index) in selectedColors" :key="index" class="selected-color-chip"
                            :style="{ backgroundColor: color }" @click="removeColor(index)">
                            <span class="remove-chip">×</span>
                        </div>
                    </div>
                </div>

                <!-- 参数控制 -->
                <div class="control-group">
                    <h3>参数设置</h3>
                    <div class="param-slider">
                        <label>粒子数量: {{ particleCount }}</label>
                        <input type="range" v-model.number="particleCount" min="50" max="500" step="50">
                    </div>
                    <div class="param-slider">
                        <label>爆炸高度: {{ explosionHeight.toFixed(1) }}</label>
                        <input type="range" v-model.number="explosionHeight" min="5" max="30" step="1">
                    </div>
                    <div class="param-slider">
                        <label>爆炸强度: {{ explosionStrength.toFixed(1) }}</label>
                        <input type="range" v-model.number="explosionStrength" min="0.5" max="5" step="0.1">
                    </div>
                    <div class="param-slider">
                        <label>粒子大小: {{ particleSize.toFixed(1) }}</label>
                        <input type="range" v-model.number="particleSize" min="0.1" max="1.0" step="0.1">
                    </div>
                    <div class="param-slider">
                        <label>重力强度: {{ gravityStrength.toFixed(1) }}</label>
                        <input type="range" v-model.number="gravityStrength" min="0" max="0.2" step="0.01">
                    </div>
                </div>

                <!-- 预设配置 -->
                <div class="control-group">
                    <h3>预设配置</h3>
                    <div class="preset-buttons">
                        <button v-for="preset in presets" :key="preset.name" class="preset-btn"
                            @click="applyPreset(preset)">
                            {{ preset.name }}
                        </button>
                    </div>
                </div>

                <!-- 控制按钮 -->
                <div class="control-buttons">
                    <button @click="launchFirework" :disabled="isLaunching" class="launch-btn">
                        {{ isLaunching ? '🚀 发射中...' : '🎇 发射烟花' }}
                    </button>
                    <button @click="stopFireworks" class="stop-btn">
                        🛑 停止所有
                    </button>
                    <button @click="toggleAutoMode" class="auto-btn" :class="{ 'active': autoMode }">
                        {{ autoMode ? '⏸️ 关闭自动' : '▶️ 自动发射' }}
                    </button>
                    <button @click="clearAll" class="clear-btn">
                        🧹 清空
                    </button>
                </div>
            </div>
        </div>

        <!-- 统计信息 -->
        <div class="stats-panel" v-if="showStats">
            粒子池: {{ activeParticleCount }}/{{ maxParticles }} |
            烟花数量: {{ activeFireworks }} |
            FPS: {{ fps }}
        </div>

        <!-- Three.js容器 -->
        <div ref="canvasContainer" class="canvas-container"></div>

        <!-- 发射按钮（右下角固定） -->
        <button class="launch-button-fixed" @click="launchFirework" :disabled="isLaunching" :style="{
            'background': isLaunching ? 'linear-gradient(45deg, #ff4081, #7b1fa2)' : 'linear-gradient(45deg, #ff6b6b, #ffa726)'
        }">
            <span v-if="isLaunching">🚀</span>
            <span v-else>🎇</span>
            <span class="button-text">{{ isLaunching ? '发射中...' : '发射烟花' }}</span>
        </button>
    </div>
</template>

<script>
import * as THREE from 'three'
import { ParticlePool } from './ParticlePool'

export default {
    name: 'FireworksButton',
    data() {
        return {
            // 控制面板状态
            panelCollapsed: false,

            // 烟花类型
            currentType: 'spherical',
            fireworkTypes: [
                { id: 'spherical', name: '球形', emoji: '🔴' },
                { id: 'heart', name: '心形', emoji: '❤️' },
                { id: 'star', name: '星形', emoji: '⭐' },
                { id: 'ring', name: '环形', emoji: '⭕' },
                { id: 'fountain', name: '喷泉', emoji: '⛲' },
                { id: 'willow', name: '柳树', emoji: '🌳' }
            ],

            // 颜色管理
            colorPresets: [
                { name: '红色', value: '#ff0000' },
                { name: '绿色', value: '#00ff00' },
                { name: '蓝色', value: '#0000ff' },
                { name: '黄色', value: '#ffff00' },
                { name: '紫色', value: '#ff00ff' },
                { name: '青色', value: '#00ffff' },
                { name: '橙色', value: '#ff8800' },
                { name: '粉色', value: '#ff66aa' },
                { name: '白色', value: '#ffffff' },
                { name: '金色', value: '#ffcc00' }
            ],
            selectedColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
            customColor: '#ff00ff',

            // 参数设置
            particleCount: 150,
            explosionHeight: 15,
            explosionStrength: 2.0,
            particleSize: 0.3,
            gravityStrength: 0.05,

            // 预设配置
            presets: [
                {
                    name: '经典烟花',
                    particleCount: 150,
                    explosionHeight: 15,
                    explosionStrength: 2.0,
                    particleSize: 0.3,
                    gravityStrength: 0.05,
                    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
                    type: 'spherical'
                },
                {
                    name: '浪漫心形',
                    particleCount: 200,
                    explosionHeight: 12,
                    explosionStrength: 1.5,
                    particleSize: 0.2,
                    gravityStrength: 0.03,
                    colors: ['#ff66aa', '#ff00ff', '#ff0088', '#ff66cc'],
                    type: 'heart'
                },
                {
                    name: '盛大星形',
                    particleCount: 250,
                    explosionHeight: 20,
                    explosionStrength: 3.0,
                    particleSize: 0.4,
                    gravityStrength: 0.08,
                    colors: ['#ffcc00', '#ffff00', '#ffaa00', '#ff9900'],
                    type: 'star'
                },
                {
                    name: '梦幻喷泉',
                    particleCount: 180,
                    explosionHeight: 10,
                    explosionStrength: 1.2,
                    particleSize: 0.25,
                    gravityStrength: 0.02,
                    colors: ['#00ffff', '#00aaff', '#0088ff', '#0066ff'],
                    type: 'fountain'
                }
            ],

            // 自动发射模式
            autoMode: false,
            autoInterval: null,

            // Three.js相关
            scene: null,
            camera: null,
            renderer: null,
            particlePool: null,

            // 烟花相关
            activeFireworks: 0,
            fireworkRockets: [], // 存储正在发射的火箭
            isLaunching: false,
            animationId: null,
            clock: null,

            // 统计信息
            fps: 60,
            frameCount: 0,
            lastTime: 0,
            showStats: true,
            maxParticles: 2000,
            activeParticleCount: 0,

            // 发射间隔控制
            lastLaunchTime: 0,
            launchInterval: 1000
        }
    },
    mounted() {
        this.initThree()
        this.animate()
        window.addEventListener('resize', this.handleResize)
        this.lastTime = performance.now()

        // 初始时自动发射一个烟花测试
        setTimeout(() => {
            this.launchFirework()
        }, 1000)
    },
    beforeDestroy() {
        this.stopAnimation()
        if (this.autoInterval) clearInterval(this.autoInterval)
        window.removeEventListener('resize', this.handleResize)

        // 清理Three.js资源
        if (this.particlePool) {
            this.particlePool.dispose()
        }

        if (this.renderer) {
            this.renderer.dispose()
            const canvas = this.renderer.domElement
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas)
            }
        }
    },
    watch: {
        particleSize(newSize) {
            if (this.particlePool) {
                this.particlePool.updateParticleSize(newSize)
            }
        }
    },
    methods: {
        // 初始化Three.js
        initThree() {
            const container = this.$refs.canvasContainer
            if (!container) {
                console.warn('Canvas container not found')
                return
            }

            try {
                // 创建场景
                this.scene = new THREE.Scene()
                this.scene.background = new THREE.Color(0x000022)
                this.scene.fog = new THREE.Fog(0x000022, 10, 50)

                // 创建相机
                this.camera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                )
                this.camera.position.set(0, 8, 20)
                this.camera.lookAt(0, 8, 0)

                // 创建渲染器
                this.renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true
                })
                this.renderer.setSize(window.innerWidth, window.innerHeight)
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                this.renderer.setClearColor(0x000022, 1)

                // 添加到DOM
                container.appendChild(this.renderer.domElement)

                // 添加灯光
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
                this.scene.add(ambientLight)

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
                directionalLight.position.set(10, 20, 15)
                this.scene.add(directionalLight)

                // 添加点缀灯光
                const pointLight = new THREE.PointLight(0xffaa00, 1, 50)
                pointLight.position.set(5, 10, 5)
                this.scene.add(pointLight)

                // 添加一个简单的地面参考
                const groundGeometry = new THREE.PlaneGeometry(50, 50)
                const groundMaterial = new THREE.MeshBasicMaterial({
                    color: 0x001133,
                    transparent: true,
                    opacity: 0.3
                })
                const ground = new THREE.Mesh(groundGeometry, groundMaterial)
                ground.rotation.x = -Math.PI / 2
                ground.position.y = -5
                this.scene.add(ground)

                // 初始化粒子池
                this.particlePool = new ParticlePool({
                    maxParticles: this.maxParticles,
                    particleSize: this.particleSize,
                    scene: this.scene
                })

                console.log('Three.js initialized successfully')
            } catch (error) {
                console.error('Failed to initialize Three.js:', error)
            }
        },

        // 处理窗口大小变化
        handleResize() {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(window.innerWidth, window.innerHeight)
            }
        },

        // 切换控制面板
        togglePanel() {
            this.panelCollapsed = !this.panelCollapsed
        },

        // 选择烟花类型
        selectFireworkType(typeId) {
            this.currentType = typeId
        },

        // 切换颜色选择
        toggleColor(color) {
            const index = this.selectedColors.indexOf(color)
            if (index > -1) {
                this.selectedColors.splice(index, 1)
            } else {
                if (this.selectedColors.length < 6) {
                    this.selectedColors.push(color)
                }
            }
        },

        // 添加自定义颜色
        addCustomColor() {
            if (this.selectedColors.length < 6 && !this.selectedColors.includes(this.customColor)) {
                this.selectedColors.push(this.customColor)
            }
        },

        // 移除颜色
        removeColor(index) {
            this.selectedColors.splice(index, 1)
        },

        // 应用预设配置
        applyPreset(preset) {
            this.particleCount = preset.particleCount
            this.explosionHeight = preset.explosionHeight
            this.explosionStrength = preset.explosionStrength
            this.particleSize = preset.particleSize
            this.gravityStrength = preset.gravityStrength
            this.selectedColors = [...preset.colors]
            this.currentType = preset.type

            if (this.particlePool) {
                this.particlePool.updateParticleSize(this.particleSize)
            }
        },

        // 发射烟花火箭
        launchFirework() {
            if (!this.particlePool) {
                console.warn('Particle pool not initialized')
                return
            }

            // 检查粒子数量限制
            if (this.activeParticleCount > this.maxParticles * 0.7) {
                console.log('Too many particles, skipping...')
                return
            }

            // 检查发射间隔
            const now = Date.now()
            if (now - this.lastLaunchTime < 300) {
                return
            }

            this.isLaunching = true
            this.lastLaunchTime = now

            // 随机选择发射位置
            const startX = (Math.random() - 0.5) * 15
            const startY = -5
            const startZ = (Math.random() - 0.5) * 5

            // 随机选择轨迹颜色
            const trailColor = this.selectedColors[Math.floor(Math.random() * this.selectedColors.length)]

            // 创建火箭（轨迹粒子）
            const rocket = {
                x: startX,
                y: startY,
                z: startZ,
                velocityY: 0.2,
                targetHeight: this.explosionHeight,
                color: trailColor,
                trailParticles: [],
                exploded: false
            }

            // 创建初始轨迹粒子
            for (let i = 0; i < 3; i++) {
                const particleInfo = this.particlePool.getParticle()
                if (!particleInfo) continue

                particleInfo.position(startX, startY + i * 0.5, startZ)
                particleInfo.color(trailColor)
                particleInfo.setVelocity(0, 0.05, 0)
                particleInfo.setLife(0.8, 0.02)
                particleInfo.setGravity(0.01)

                rocket.trailParticles.push({
                    particleInfo,
                    index: particleInfo.index
                })
            }

            this.fireworkRockets.push(rocket)
            this.activeFireworks++

            // 3秒后自动结束发射状态
            setTimeout(() => {
                this.isLaunching = false
            }, 3000)
        },

        // 创建爆炸效果
        createExplosion(x, y, z, rocketColor) {
            if (!this.particlePool) {
                console.warn('Particle pool not initialized')
                return
            }

            // 随机选择爆炸颜色
            const color = rocketColor || this.selectedColors[Math.floor(Math.random() * this.selectedColors.length)]
            const count = Math.min(this.particleCount, 200)

            for (let i = 0; i < count; i++) {
                const particleInfo = this.particlePool.getParticle()
                if (!particleInfo) {
                    console.warn('No particles available for explosion')
                    continue
                }

                // 设置粒子初始位置
                particleInfo.position(x, y, z)
                particleInfo.color(color)

                // 根据烟花类型计算速度
                let vx, vy, vz
                const speed = Math.random() * this.explosionStrength + 0.5

                switch (this.currentType) {
                    case 'heart':
                        // 心形参数方程
                        const t = Math.random() * Math.PI * 2
                        vx = 16 * Math.pow(Math.sin(t), 3) * 0.05 * speed
                        vy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.05 * speed
                        vz = (Math.random() - 0.5) * 0.5 * speed
                        break

                    case 'star':
                        // 星形
                        const angle = Math.random() * Math.PI * 2
                        const radius = 0.8
                        vx = Math.cos(angle) * radius * speed
                        vy = Math.sin(angle) * radius * speed
                        vz = (Math.random() - 0.5) * 0.3 * speed
                        break

                    case 'ring':
                        // 环形
                        const ringAngle = Math.random() * Math.PI * 2
                        const ringRadius = 0.6
                        vx = Math.cos(ringAngle) * ringRadius * speed
                        vy = 0.1 * speed
                        vz = Math.sin(ringAngle) * ringRadius * speed
                        break

                    case 'fountain':
                        // 喷泉状
                        const fountainAngle = Math.random() * Math.PI * 2
                        vx = Math.cos(fountainAngle) * 0.2 * speed
                        vy = speed * 1.5
                        vz = Math.sin(fountainAngle) * 0.2 * speed
                        break

                    case 'willow':
                        // 柳树状
                        const willowAngle = Math.random() * Math.PI * 2
                        vx = Math.cos(willowAngle) * 0.3 * speed
                        vy = -speed * 0.8
                        vz = Math.sin(willowAngle) * 0.3 * speed
                        break

                    default: // spherical
                        // 球状分布（修正了原来的错误）
                        const phi = Math.acos(2 * Math.random() - 1)
                        const theta = Math.random() * Math.PI * 2
                        vx = Math.sin(phi) * Math.cos(theta) * speed
                        vy = Math.sin(phi) * Math.sin(theta) * speed
                        vz = Math.cos(phi) * speed
                }

                // 设置粒子属性
                particleInfo.setVelocity(vx, vy, vz)
                particleInfo.setLife(2 + Math.random(), 0.01)
                particleInfo.setGravity(this.gravityStrength)
            }
        },

        // 更新火箭轨迹
        updateRockets() {
            const now = Date.now()

            for (let i = this.fireworkRockets.length - 1; i >= 0; i--) {
                const rocket = this.fireworkRockets[i]

                if (!rocket) continue

                // 更新火箭位置
                rocket.y += rocket.velocityY
                rocket.velocityY *= 1.02 // 轻微加速

                // 创建新的轨迹粒子
                if (now % 50 < 10) { // 每50ms创建一个新的轨迹粒子
                    const particleInfo = this.particlePool.getParticle()
                    if (particleInfo) {
                        particleInfo.position(rocket.x, rocket.y, rocket.z)
                        particleInfo.color(rocket.color)
                        particleInfo.setVelocity(
                            (Math.random() - 0.5) * 0.05,
                            (Math.random() - 0.5) * 0.05,
                            (Math.random() - 0.5) * 0.05
                        )
                        particleInfo.setLife(0.6, 0.03)
                        particleInfo.setGravity(0.01)

                        rocket.trailParticles.push({
                            particleInfo,
                            index: particleInfo.index
                        })
                    }
                }

                // 检查是否到达爆炸高度
                if (rocket.y >= rocket.targetHeight && !rocket.exploded) {
                    this.createExplosion(rocket.x, rocket.y, rocket.z, rocket.color)
                    rocket.exploded = true

                    // 标记火箭将在轨迹粒子消失后移除
                    setTimeout(() => {
                        const index = this.fireworkRockets.indexOf(rocket)
                        if (index > -1) {
                            // 释放所有轨迹粒子
                            rocket.trailParticles.forEach(trail => {
                                if (trail.particleInfo) {
                                    this.particlePool.releaseParticle(trail.particleInfo)
                                }
                            })
                            this.fireworkRockets.splice(index, 1)
                            this.activeFireworks = Math.max(0, this.activeFireworks - 1)
                        }
                    }, 1000) // 1秒后移除火箭
                }

                // 如果火箭已经爆炸且超出屏幕，直接移除
                if (rocket.y > 50) {
                    const index = this.fireworkRockets.indexOf(rocket)
                    if (index > -1) {
                        rocket.trailParticles.forEach(trail => {
                            if (trail.particleInfo) {
                                this.particlePool.releaseParticle(trail.particleInfo)
                            }
                        })
                        this.fireworkRockets.splice(index, 1)
                        this.activeFireworks = Math.max(0, this.activeFireworks - 1)
                    }
                }
            }
        },

        // 动画循环
        animate() {
            this.animationId = requestAnimationFrame(this.animate)

            if (!this.scene || !this.camera || !this.renderer || !this.particlePool) {
                return
            }

            // 计算时间增量
            const currentTime = performance.now()
            const deltaTime = Math.min((currentTime - (this.lastTime || currentTime)) / 1000, 0.1)
            this.lastTime = currentTime

            // 更新火箭
            this.updateRockets()

            // 更新粒子池
            if (this.particlePool) {
                this.particlePool.update(deltaTime)
                this.activeParticleCount = this.particlePool.getActiveCount()
            }

            // 自动发射模式
            if (this.autoMode) {
                const now = Date.now()
                if (now - this.lastLaunchTime > this.launchInterval &&
                    this.activeParticleCount < this.maxParticles * 0.7) {
                    this.launchFirework()
                    this.lastLaunchTime = now
                }
            }

            // 相机缓慢旋转
            if (this.camera) {
                const time = Date.now() * 0.0001
                this.camera.position.x = Math.sin(time) * 15
                this.camera.position.z = Math.cos(time) * 15 + 10
                this.camera.lookAt(0, 8, 0)
            }

            // 渲染场景
            this.renderer.render(this.scene, this.camera)

            // 计算FPS
            this.frameCount++
            if (currentTime > this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
                this.frameCount = 0
                this.lastTime = currentTime
            }
        },

        // 停止动画
        stopAnimation() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId)
                this.animationId = null
            }
        },

        // 停止所有烟花
        stopFireworks() {
            // 清理所有火箭和轨迹粒子
            this.fireworkRockets.forEach(rocket => {
                rocket.trailParticles.forEach(trail => {
                    if (trail.particleInfo) {
                        this.particlePool.releaseParticle(trail.particleInfo)
                    }
                })
            })
            this.fireworkRockets = []
            this.activeFireworks = 0

            this.isLaunching = false
        },

        // 切换自动发射模式
        toggleAutoMode() {
            this.autoMode = !this.autoMode

            if (this.autoMode) {
                // 开始自动发射
                this.autoInterval = setInterval(() => {
                    if (!this.isLaunching || this.activeParticleCount < this.maxParticles * 0.5) {
                        this.launchFirework()
                    }
                }, 1500)
            } else {
                // 停止自动发射
                if (this.autoInterval) {
                    clearInterval(this.autoInterval)
                    this.autoInterval = null
                }
            }
        },

        // 清空所有
        clearAll() {
            this.stopFireworks()
            if (this.autoMode) {
                this.toggleAutoMode()
            }
        }
    }
}
</script>

<style scoped>
/* 样式保持不变，与原始代码相同 */
.fireworks-enhanced {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
}

/* 控制面板样式 */
.control-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 320px;
    background: rgba(0, 0, 30, 0.85);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    z-index: 100;
    transition: all 0.3s ease;
    overflow: hidden;
}

.panel-collapsed {
    width: 200px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: rgba(0, 20, 50, 0.9);
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
}

.collapse-icon {
    color: #fff;
    font-size: 14px;
}

.panel-content {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
}

/* 控制组样式 */
.control-group {
    margin-bottom: 25px;
}

.control-group h3 {
    margin: 0 0 15px 0;
    font-size: 14px;
    color: #a0c8ff;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* 烟花类型网格 */
.type-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.type-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 5px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
}

.type-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.type-btn.active {
    background: rgba(66, 133, 244, 0.3);
    border-color: #4285f4;
    box-shadow: 0 0 10px rgba(66, 133, 244, 0.5);
}

.type-emoji {
    font-size: 20px;
    margin-bottom: 5px;
}

.type-name {
    font-size: 12px;
}

/* 颜色调色板 */
.color-palette {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

.color-option {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
}

.color-option:hover {
    transform: scale(1.2);
}

.color-option.selected {
    border-color: #fff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.custom-color {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.custom-color label {
    color: #fff;
    font-size: 12px;
}

.custom-color input {
    width: 40px;
    height: 30px;
    border: none;
    background: transparent;
    cursor: pointer;
}

.small-btn {
    padding: 5px 10px;
    background: rgba(66, 133, 244, 0.7);
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.2s;
}

.small-btn:hover {
    background: rgba(66, 133, 244, 1);
}

.selected-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.selected-color-chip {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.selected-color-chip:hover .remove-chip {
    opacity: 1;
}

.remove-chip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.2s;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
}

/* 参数滑块 */
.param-slider {
    margin-bottom: 15px;
}

.param-slider label {
    display: block;
    margin-bottom: 5px;
    color: #fff;
    font-size: 12px;
}

.param-slider input {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    outline: none;
    -webkit-appearance: none;
}

.param-slider input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #4285f4;
    cursor: pointer;
    border: 2px solid #fff;
}

/* 预设按钮 */
.preset-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.preset-btn {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.preset-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

/* 控制按钮 */
.control-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 20px;
}

.launch-btn,
.stop-btn,
.auto-btn,
.clear-btn {
    padding: 12px 0;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
}

.launch-btn {
    grid-column: 1 / -1;
    background: linear-gradient(45deg, #ff6b6b, #ffa726);
    color: white;
}

.launch-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.launch-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.stop-btn {
    background: linear-gradient(45deg, #f44336, #d32f2f);
    color: white;
}

.stop-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(244, 67, 54, 0.4);
}

.auto-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.auto-btn.active {
    background: rgba(76, 175, 80, 0.3);
    border-color: #4caf50;
}

.auto-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.clear-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.clear-btn:hover {
    background: rgba(255, 193, 7, 0.3);
    border-color: #ffc107;
    transform: translateY(-2px);
}

/* 统计面板 */
.stats-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 15px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 10px;
    color: #fff;
    font-size: 12px;
    z-index: 100;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 右下角发射按钮 */
.launch-button-fixed {
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.launch-button-fixed:hover:not(:disabled) {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 12px 30px rgba(255, 107, 107, 0.7);
}

.launch-button-fixed:active:not(:disabled) {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
}

.launch-button-fixed:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.7);
    }

    70% {
        box-shadow: 0 0 0 15px rgba(255, 64, 129, 0);
    }

    100% {
        box-shadow: 0 0 0 0 rgba(255, 64, 129, 0);
    }
}

.button-text {
    font-size: 10px;
    margin-top: 5px;
    font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .control-panel {
        width: 280px;
        left: 10px;
        top: 10px;
    }

    .panel-collapsed {
        width: 160px;
    }

    .type-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .preset-buttons {
        grid-template-columns: 1fr;
    }

    .launch-button-fixed {
        width: 60px;
        height: 60px;
        right: 20px;
        bottom: 20px;
        font-size: 20px;
    }

    .stats-panel {
        bottom: 10px;
        right: 10px;
        font-size: 10px;
        padding: 8px 12px;
    }
}
</style>