<template>
    <div class="fireworks-enhanced">
        <!-- 控制面板 (你原有的布局和样式完全保留) -->
        <div class="control-panel" :class="{ 'panel-collapsed': panelCollapsed }">
            <div class="panel-header" @click="togglePanel">
                <span class="panel-title">🎆 烟花控制台 (Fireworks.js)</span>
                <span class="collapse-icon">{{ panelCollapsed ? '▶' : '▼' }}</span>
            </div>
            <div class="panel-content" v-show="!panelCollapsed">
                <!-- 颜色选择 -->
                <div class="control-group">
                    <h3>烟花颜色</h3>
                    <div class="selected-colors">
                        <div v-for="(color, index) in selectedColors" :key="index" class="selected-color-chip"
                            :style="{ backgroundColor: color }" @click="removeColor(index)">
                            <span class="remove-chip">×</span>
                        </div>
                    </div>
                    <div class="custom-color">
                        <label>添加颜色:</label>
                        <input type="color" v-model="customColor">
                        <button @click="addCustomColor" class="small-btn">添加</button>
                    </div>
                    <div class="param-slider">
                        <label>色相范围: {{ hueMin }} - {{ hueMax }}</label>
                        <input type="range" v-model.number="hueMin" min="0" max="360" @input="updateFireworksConfig"> 最小
                        <input type="range" v-model.number="hueMax" min="0" max="360" @input="updateFireworksConfig"> 最大
                    </div>
                </div>

                <!-- 参数控制 -->
                <div class="control-group">
                    <h3>爆炸效果</h3>
                    <div class="param-slider">
                        <label>粒子数量: {{ config.particles }}</label>
                        <input type="range" v-model.number="config.particles" min="10" max="200"
                            @input="updateFireworksConfig">
                    </div>
                    <div class="param-slider">
                        <label>爆炸强度: {{ config.explosion }}</label>
                        <input type="range" v-model.number="config.explosion" min="1" max="10" step="0.5"
                            @input="updateFireworksConfig">
                    </div>
                    <div class="param-slider">
                        <label>爆炸范围: {{ config.intensity }}</label>
                        <input type="range" v-model.number="config.intensity" min="10" max="100"
                            @input="updateFireworksConfig">
                    </div>
                </div>

                <div class="control-group">
                    <h3>物理效果</h3>
                    <div class="param-slider">
                        <label>重力: {{ config.gravity }}</label>
                        <input type="range" v-model.number="config.gravity" min="0.1" max="3" step="0.1"
                            @input="updateFireworksConfig">
                    </div>
                    <div class="param-slider">
                        <label>上升速度: {{ config.traceSpeed }}</label>
                        <input type="range" v-model.number="config.traceSpeed" min="1" max="20"
                            @input="updateFireworksConfig">
                    </div>
                    <div class="param-slider">
                        <label>闪烁程度: {{ config.flickering }}</label>
                        <input type="range" v-model.number="config.flickering" min="0" max="100"
                            @input="updateFireworksConfig">
                    </div>
                </div>

                <!-- 控制按钮 -->
                <div class="control-buttons">
                    <button @click="launchFirework" class="launch-btn">🎇 发射单发</button>
                    <button @click="toggleFireworks" class="auto-btn">
                        {{ fireworksRunning ? '⏸️ 停止' : '▶️ 开始' }}
                    </button>
                    <button @click="clearFireworks" class="clear-btn">🧹 清空</button>
                    <button @click="saveCurrentConfig" class="small-btn">💾 保存配置</button>
                </div>
            </div>
        </div>

        <!-- Three.js容器改为 fireworks-js 容器 -->
        <div ref="canvasContainer" class="canvas-container"></div>

        <!-- 右下角发射按钮 -->
        <button class="launch-button-fixed" @click="launchFirework">
            🎇
            <span class="button-text">发射</span>
        </button>
    </div>
</template>

<script>
// 导入 fireworks-js 库
import { Fireworks } from 'fireworks-js'

export default {
    name: 'FireworksButton',
    data() {
        return {
            // 控制面板状态
            panelCollapsed: false,

            // fireworks-js 实例和运行状态
            fireworks: null,
            fireworksRunning: false,

            // 颜色管理 (适配 fireworks-js 的色相控制)
            selectedColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
            customColor: '#ff00ff',
            hueMin: 0,
            hueMax: 360,

            // fireworks-js 核心配置 [citation:1][citation:9]
            config: {
                autoresize: true,
                opacity: 0.5,
                acceleration: 1.05,
                friction: 0.97,
                gravity: 1.5,
                particles: 50,
                traceLength: 3,
                traceSpeed: 10,
                explosion: 5,
                intensity: 30,
                flickering: 50,
                lineStyle: 'round',
                hue: { min: 0, max: 360 },
                delay: { min: 30, max: 60 },
                rocketsPoint: { min: 50, max: 50 },
                lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
                brightness: { min: 50, max: 80 },
                decay: { min: 0.015, max: 0.03 },
                mouse: { click: false, move: false, max: 1 }
            }
        }
    },
    mounted() {
        // 组件挂载后初始化 fireworks-js
        this.initFireworks()
        // 尝试加载已保存的配置
        this.loadSavedConfig()
    },
    beforeDestroy() {
        // 组件销毁前清理 fireworks 实例
        if (this.fireworks) {
            this.fireworks.stop()
            // 根据库的API，如果需要清理DOM，可以调用 this.fireworks.waitStop(() => {...})
        }
    },
    methods: {
        // 初始化 fireworks-js [citation:1][citation:2]
        initFireworks() {
            const container = this.$refs.canvasContainer
            if (!container) {
                console.warn('Canvas container not found')
                return
            }

            try {
                // 创建 fireworks 实例，传入容器和配置
                this.fireworks = new Fireworks(container, this.config)
                console.log('Fireworks.js initialized successfully')
            } catch (error) {
                console.error('Failed to initialize Fireworks.js:', error)
            }
        },

        // 更新配置并应用到运行的 fireworks 实例
        updateFireworksConfig() {
            if (!this.fireworks) return

            // 动态更新色相配置 [citation:9]
            this.config.hue.min = this.hueMin
            this.config.hue.max = this.hueMax

            // 将新配置应用到 fireworks 实例
            this.fireworks.updateOptions(this.config)
        },

        // 切换烟花发射状态
        toggleFireworks() {
            if (!this.fireworks) return

            if (this.fireworksRunning) {
                this.fireworks.stop()
                this.fireworksRunning = false
            } else {
                this.fireworks.start()
                this.fireworksRunning = true
            }
        },

        // 发射单发烟花
        launchFirework() {
            if (!this.fireworks) return
            // fireworks-js 的 launch() 方法用于发射单发烟花
            this.fireworks.launch(1)
        },

        // 清空当前所有烟花
        clearFireworks() {
            if (!this.fireworks) return
            // 停止当前动画并清空画布
            this.fireworks.stop()
            this.fireworksRunning = false
            // 稍后重新开始（如果之前是运行状态）
            setTimeout(() => {
                if (this.fireworksRunning) {
                    this.fireworks.start()
                }
            }, 100)
        },

        // 保存当前配置到 localStorage
        saveCurrentConfig() {
            const configToSave = {
                ...this.config,
                hueMin: this.hueMin,
                hueMax: this.hueMax,
                selectedColors: this.selectedColors
            }
            localStorage.setItem('fireworksConfig', JSON.stringify(configToSave))
            alert('配置已保存！')
        },

        // 从 localStorage 加载配置
        loadSavedConfig() {
            const saved = localStorage.getItem('fireworksConfig')
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    Object.assign(this.config, parsed)
                    this.hueMin = parsed.hueMin || 0
                    this.hueMax = parsed.hueMax || 360
                    this.selectedColors = parsed.selectedColors || this.selectedColors
                    // 应用加载的配置
                    if (this.fireworks) {
                        this.fireworks.updateOptions(this.config)
                    }
                } catch (e) {
                    console.warn('Failed to load saved config:', e)
                }
            }
        },

        // 颜色管理方法（保留你的原有逻辑）
        addCustomColor() {
            if (this.selectedColors.length < 8 && !this.selectedColors.includes(this.customColor)) {
                this.selectedColors.push(this.customColor)
                // 这里可以扩展逻辑，将自定义颜色映射到色相范围
            }
        },
        removeColor(index) {
            this.selectedColors.splice(index, 1)
        },
        togglePanel() {
            this.panelCollapsed = !this.panelCollapsed
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