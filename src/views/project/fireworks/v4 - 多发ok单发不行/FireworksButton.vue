<template>
    <div class="fireworks-enhanced">
        <!-- 现代化暗色控制面板 -->
        <div class="control-panel" :class="{ 'panel-collapsed': panelCollapsed }">
            <!-- 面板标题栏 -->
            <div class="panel-header" @click="togglePanel">
                <div class="header-content">
                    <span class="panel-icon">🎛️</span>
                    <span class="panel-title">烟花实验室</span>
                    <span class="panel-subtitle">Fireworks.js 控制台</span>
                </div>
                <div class="header-actions">
                    <span class="status-indicator" :class="{ active: fireworksRunning }"></span>
                    <span class="collapse-icon">{{ panelCollapsed ? '▶' : '▼' }}</span>
                </div>
            </div>

            <!-- 面板内容区域 -->
            <div class="panel-content" v-show="!panelCollapsed">
                <!-- 模式与预设 -->
                <div class="control-section">
                    <div class="section-header">
                        <span class="section-icon">🚀</span>
                        <h3>发射模式</h3>
                    </div>
                    <div class="mode-selector">
                        <button class="mode-btn" :class="{ active: config.mouse.click }" @click="toggleMouseClick">
                            {{ config.mouse.click ? '🎯 点击发射' : '🖱️ 启用点击' }}
                        </button>
                        <button class="mode-btn" @click="toggleFireworks">
                            {{ fireworksRunning ? '⏸️ 暂停连发' : '▶️ 开始连发' }}
                        </button>
                        <button class="mode-btn" @click="launchFirework">🎇 单发试射</button>
                    </div>
                </div>

                <!-- 核心参数分组 -->
                <div class="control-grid">
                    <!-- 颜色与外观 -->
                    <div class="control-card">
                        <div class="card-header">
                            <span class="card-icon">🎨</span>
                            <h4>颜色与外观</h4>
                        </div>
                        <div class="card-body">
                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">色相范围</span>
                                    <span class="label-value">{{ config.hue.min }}° - {{ config.hue.max }}°</span>
                                </label>
                                <div class="range-group">
                                    <input type="range" v-model.number="config.hue.min" min="0" max="360"
                                        class="range-slider" @input="updateFireworksConfig">
                                    <input type="range" v-model.number="config.hue.max" min="0" max="360"
                                        class="range-slider" @input="updateFireworksConfig">
                                </div>
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">亮度范围</span>
                                    <span class="label-value">{{ config.brightness.min }}% - {{ config.brightness.max
                                        }}%</span>
                                </label>
                                <div class="range-group">
                                    <input type="range" v-model.number="config.brightness.min" min="1" max="100"
                                        class="range-slider" @input="updateFireworksConfig">
                                    <input type="range" v-model.number="config.brightness.max" min="1" max="100"
                                        class="range-slider" @input="updateFireworksConfig">
                                </div>
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">透明度</span>
                                    <span class="label-value">{{ (config.opacity * 100).toFixed(0) }}%</span>
                                </label>
                                <input type="range" v-model.number="config.opacity" min="0.1" max="1" step="0.05"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="color-presets">
                                <h5>快速配色</h5>
                                <div class="preset-grid">
                                    <button v-for="preset in colorPresets" :key="preset.name" class="preset-color"
                                        :style="{ background: preset.gradient }" @click="applyColorPreset(preset)">
                                        <span class="preset-emoji">{{ preset.emoji }}</span>
                                        <span class="preset-name">{{ preset.name }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 爆炸效果 -->
                    <div class="control-card">
                        <div class="card-header">
                            <span class="card-icon">💥</span>
                            <h4>爆炸效果</h4>
                        </div>
                        <div class="card-body">
                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">粒子数量</span>
                                    <span class="label-value">{{ config.particles }}</span>
                                </label>
                                <input type="range" v-model.number="config.particles" min="10" max="200"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">爆炸强度</span>
                                    <span class="label-value">{{ config.explosion }}</span>
                                </label>
                                <input type="range" v-model.number="config.explosion" min="1" max="10" step="0.5"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">爆炸范围</span>
                                    <span class="label-value">{{ config.intensity }}</span>
                                </label>
                                <input type="range" v-model.number="config.intensity" min="10" max="100"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">衰减速度</span>
                                    <span class="label-value">{{ config.decay.min.toFixed(3) }} - {{
                                        config.decay.max.toFixed(3) }}</span>
                                </label>
                                <div class="range-group">
                                    <input type="range" v-model.number="config.decay.min" min="0.005" max="0.05"
                                        step="0.001" class="range-slider" @input="updateFireworksConfig">
                                    <input type="range" v-model.number="config.decay.max" min="0.005" max="0.05"
                                        step="0.001" class="range-slider" @input="updateFireworksConfig">
                                </div>
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">闪烁程度</span>
                                    <span class="label-value">{{ config.flickering }}%</span>
                                </label>
                                <input type="range" v-model.number="config.flickering" min="0" max="100"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>
                        </div>
                    </div>

                    <!-- 物理与运动 -->
                    <div class="control-card">
                        <div class="card-header">
                            <span class="card-icon">⚙️</span>
                            <h4>物理与运动</h4>
                        </div>
                        <div class="card-body">
                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">重力强度</span>
                                    <span class="label-value">{{ config.gravity }}</span>
                                </label>
                                <input type="range" v-model.number="config.gravity" min="0.1" max="3" step="0.1"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">加速度</span>
                                    <span class="label-value">{{ config.acceleration }}</span>
                                </label>
                                <input type="range" v-model.number="config.acceleration" min="1" max="1.2" step="0.01"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">摩擦力</span>
                                    <span class="label-value">{{ config.friction }}</span>
                                </label>
                                <input type="range" v-model.number="config.friction" min="0.8" max="1" step="0.01"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">上升速度</span>
                                    <span class="label-value">{{ config.traceSpeed }}</span>
                                </label>
                                <input type="range" v-model.number="config.traceSpeed" min="1" max="20"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">轨迹长度</span>
                                    <span class="label-value">{{ config.traceLength }}</span>
                                </label>
                                <input type="range" v-model.number="config.traceLength" min="1" max="10"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>
                        </div>
                    </div>

                    <!-- 高级设置 -->
                    <div class="control-card">
                        <div class="card-header">
                            <span class="card-icon">🔧</span>
                            <h4>高级设置</h4>
                        </div>
                        <div class="card-body">
                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">发射点高度</span>
                                    <span class="label-value">{{ config.rocketsPoint.min }} - {{ config.rocketsPoint.max
                                        }}%</span>
                                </label>
                                <div class="range-group">
                                    <input type="range" v-model.number="config.rocketsPoint.min" min="20" max="80"
                                        class="range-slider" @input="updateFireworksConfig">
                                    <input type="range" v-model.number="config.rocketsPoint.max" min="20" max="80"
                                        class="range-slider" @input="updateFireworksConfig">
                                </div>
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">发射间隔</span>
                                    <span class="label-value">{{ config.delay.min }} - {{ config.delay.max }}ms</span>
                                </label>
                                <div class="range-group">
                                    <input type="range" v-model.number="config.delay.min" min="10" max="200"
                                        class="range-slider" @input="updateFireworksConfig">
                                    <input type="range" v-model.number="config.delay.max" min="10" max="200"
                                        class="range-slider" @input="updateFireworksConfig">
                                </div>
                            </div>

                            <div class="param-item">
                                <label class="switch-label">
                                    <span class="label-text">线条样式：{{ config.lineStyle === 'round' ? '圆形' : '方形'
                                        }}</span>
                                    <label class="switch">
                                        <input type="checkbox" v-model="config.lineStyle" true-value="round"
                                            false-value="square" @change="updateFireworksConfig">
                                        <span class="slider"></span>
                                    </label>
                                </label>
                            </div>

                            <div class="action-buttons">
                                <button class="action-btn save" @click="saveCurrentConfig">
                                    <span class="btn-icon">💾</span>
                                    <span class="btn-text">保存配置</span>
                                </button>
                                <button class="action-btn reset" @click="resetToDefault">
                                    <span class="btn-icon">🔄</span>
                                    <span class="btn-text">重置默认</span>
                                </button>
                                <button class="action-btn clear" @click="clearFireworks">
                                    <span class="btn-icon">🗑️</span>
                                    <span class="btn-text">清空画布</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 烟花画布容器 -->
        <div ref="canvasContainer" class="canvas-container"></div>

        <!-- 快捷发射按钮 -->
        <button class="quick-launch-btn" @click="launchFirework" :disabled="!fireworksRunning && !config.mouse.click">
            <span class="btn-emoji">🎆</span>
            <span class="btn-text">发射烟花</span>
        </button>

        <!-- 状态提示 -->
        <div v-if="showHint" class="hint-overlay" @click="showHint = false">
            <div class="hint-content">
                <h3>🎉 欢迎使用烟花实验室！</h3>
                <p>点击画布任意位置发射烟花，或使用控制面板调整参数</p>
                <button class="hint-close">我知道了</button>
            </div>
        </div>
    </div>
</template>

<script>
import { Fireworks } from 'fireworks-js'

export default {
    name: 'FireworksButton',
    data() {
        return {
            // 面板状态
            panelCollapsed: false,
            showHint: true,

            // fireworks 实例与状态
            fireworks: null,
            fireworksRunning: false,

            // 配色预设
            colorPresets: [
                { name: '经典红黄', emoji: '🎇', gradient: 'linear-gradient(135deg, #ff0000, #ff9900)', hue: { min: 0, max: 60 } },
                { name: '冷艳蓝紫', emoji: '❄️', gradient: 'linear-gradient(135deg, #0066ff, #cc00ff)', hue: { min: 200, max: 300 } },
                { name: '森林绿意', emoji: '🌿', gradient: 'linear-gradient(135deg, #00cc66, #66ff33)', hue: { min: 100, max: 150 } },
                { name: '梦幻粉紫', emoji: '🌌', gradient: 'linear-gradient(135deg, #ff66cc, #9966ff)', hue: { min: 300, max: 330 } },
                { name: '炽热熔岩', emoji: '🔥', gradient: 'linear-gradient(135deg, #ff3300, #ffcc00)', hue: { min: 10, max: 50 } },
                { name: '霓虹炫彩', emoji: '🌈', gradient: 'linear-gradient(135deg, #ff00ff, #00ffff, #ffff00)', hue: { min: 0, max: 360 } }
            ],

            // 完整配置对象（包含所有 fireworks-js 支持的选项）
            config: {
                autoresize: true,
                opacity: 0.7,
                acceleration: 1.05,
                friction: 0.95,
                gravity: 1.2,
                particles: 100,
                traceLength: 3,
                traceSpeed: 8,
                explosion: 5,
                intensity: 50,
                flickering: 30,
                lineStyle: 'round',
                hue: { min: 0, max: 360 },
                brightness: { min: 60, max: 90 },
                decay: { min: 0.015, max: 0.025 },
                delay: { min: 30, max: 60 },
                rocketsPoint: { min: 50, max: 50 },
                lineWidth: {
                    explosion: { min: 1, max: 3 },
                    trace: { min: 0.5, max: 1 }
                },
                mouse: {
                    click: true,
                    move: false,
                    max: 3
                }
            }
        }
    },
    mounted() {
        this.initFireworks()
        this.loadSavedConfig()
    },
    beforeDestroy() {
        if (this.fireworks) {
            this.fireworks.stop()
        }
    },
    methods: {
        initFireworks() {
            const container = this.$refs.canvasContainer
            if (!container) return

            try {
                this.fireworks = new Fireworks(container, this.config)

                // 监听窗口大小变化
                window.addEventListener('resize', this.handleResize)

                console.log('🎆 Fireworks.js 已初始化')
            } catch (error) {
                console.error('初始化失败:', error)
            }
        },

        handleResize() {
            if (this.fireworks) {
                this.fireworks.updateOptions({ autoresize: true })
            }
        },

        updateFireworksConfig() {
            if (!this.fireworks) return
            this.fireworks.updateOptions(this.config)
        },

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

        toggleMouseClick() {
            this.config.mouse.click = !this.config.mouse.click
            this.updateFireworksConfig()
        },

        launchFirework(count = 1) {
            if (!this.fireworks) return
            this.fireworks.launch(count)
        },

        clearFireworks() {
            if (!this.fireworks) return
            this.fireworks.stop()
            this.fireworksRunning = false

            // 快速重启以清空画布
            setTimeout(() => {
                if (this.fireworksRunning) {
                    this.fireworks.start()
                }
            }, 50)
        },

        applyColorPreset(preset) {
            this.config.hue = { ...preset.hue }
            this.updateFireworksConfig()
        },

        saveCurrentConfig() {
            const configToSave = {
                ...this.config,
                timestamp: new Date().toISOString()
            }
            localStorage.setItem('fireworksLabConfig', JSON.stringify(configToSave))

            // 显示保存反馈
            this.showTempMessage('配置已保存到本地存储')
        },

        loadSavedConfig() {
            const saved = localStorage.getItem('fireworksLabConfig')
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    Object.assign(this.config, parsed)
                    if (this.fireworks) {
                        this.fireworks.updateOptions(this.config)
                    }
                } catch (e) {
                    console.warn('读取保存配置失败:', e)
                }
            }
        },

        resetToDefault() {
            if (confirm('确定要重置所有设置为默认值吗？')) {
                const defaultConfig = {
                    opacity: 0.7,
                    particles: 100,
                    explosion: 5,
                    intensity: 50,
                    gravity: 1.2,
                    traceSpeed: 8,
                    flickering: 30,
                    hue: { min: 0, max: 360 },
                    brightness: { min: 60, max: 90 }
                }

                Object.assign(this.config, defaultConfig)
                this.updateFireworksConfig()
                this.showTempMessage('已重置为默认配置')
            }
        },

        showTempMessage(text) {
            // 可以在这里实现一个临时提示组件
            console.log('提示:', text)
        },

        togglePanel() {
            this.panelCollapsed = !this.panelCollapsed
        }
    }
}
</script>

<style scoped>
/* ===== 基础布局 ===== */
.fireworks-enhanced {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.canvas-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: linear-gradient(180deg, #0a0a2a 0%, #1a1a3a 50%, #0c0c1c 100%);
}

/* ===== 现代化控制面板 ===== */
.control-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 380px;
    max-height: 90vh;
    background: rgba(10, 10, 30, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(100, 150, 255, 0.2);
    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.panel-collapsed {
    width: 60px;
    height: 60px;
}

/* 面板标题栏 */
.panel-header {
    padding: 18px 24px;
    background: linear-gradient(135deg, rgba(30, 60, 150, 0.4), rgba(100, 40, 200, 0.2));
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.panel-icon {
    font-size: 24px;
    filter: drop-shadow(0 0 8px rgba(100, 150, 255, 0.5));
}

.panel-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
}

.panel-subtitle {
    font-size: 11px;
    color: rgba(200, 220, 255, 0.6);
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 8px;
    border-radius: 10px;
    margin-left: 8px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 50, 50, 0.5);
    transition: all 0.3s ease;
}

.status-indicator.active {
    background: #00ff88;
    box-shadow: 0 0 10px #00ff88;
    animation: pulse 2s infinite;
}

.collapse-icon {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    transition: transform 0.3s ease;
}

.panel-collapsed .collapse-icon {
    transform: rotate(-90deg);
}

/* 面板内容区域 */
.panel-content {
    padding: 20px;
    overflow-y: auto;
    max-height: calc(90vh - 80px);
}

/* 控制区域分组 */
.control-section {
    margin-bottom: 24px;
    padding: 16px;
    background: rgba(20, 25, 50, 0.4);
    border-radius: 16px;
    border: 1px solid rgba(100, 150, 255, 0.15);
}

.section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
}

.section-icon {
    font-size: 20px;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    color: #fff;
    font-weight: 600;
}

/* 模式选择器 */
.mode-selector {
    display: flex;
    gap: 10px;
}

.mode-btn {
    flex: 1;
    padding: 12px 16px;
    background: rgba(40, 60, 120, 0.3);
    border: 1px solid rgba(100, 150, 255, 0.3);
    border-radius: 12px;
    color: rgba(220, 230, 255, 0.9);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.mode-btn:hover {
    background: rgba(60, 100, 200, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 100, 255, 0.2);
}

.mode-btn.active {
    background: linear-gradient(135deg, #0066ff, #0099ff);
    border-color: #00aaff;
    color: #fff;
    box-shadow: 0 0 20px rgba(0, 150, 255, 0.4);
}

/* 网格布局控制卡 */
.control-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 20px;
}

.control-card {
    background: rgba(15, 20, 40, 0.6);
    border-radius: 16px;
    border: 1px solid rgba(80, 120, 220, 0.2);
    overflow: hidden;
    transition: all 0.3s ease;
}

.control-card:hover {
    border-color: rgba(100, 150, 255, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.card-header {
    padding: 16px;
    background: rgba(30, 40, 80, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
}

.card-icon {
    font-size: 18px;
}

.card-header h4 {
    margin: 0;
    font-size: 15px;
    color: #fff;
    font-weight: 600;
}

.card-body {
    padding: 16px;
}

/* 参数控件样式 */
.param-item {
    margin-bottom: 20px;
}

.param-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.label-text {
    font-size: 13px;
    color: rgba(200, 220, 255, 0.9);
}

.label-value {
    font-size: 12px;
    font-family: 'Courier New', monospace;
    color: #00ffaa;
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 8px;
    border-radius: 10px;
}

.range-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #0066ff, #00aaff);
    outline: none;
    -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #00aaff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 170, 255, 0.8);
    transition: all 0.2s ease;
}

.range-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(0, 170, 255, 1);
}

.range-group {
    display: flex;
    gap: 10px;
}

.range-group .range-slider {
    flex: 1;
}

/* 配色预设 */
.color-presets {
    margin-top: 20px;
}

.color-presets h5 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: rgba(200, 220, 255, 0.9);
}

.preset-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.preset-color {
    padding: 8px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: white;
    font-size: 11px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.preset-color:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.preset-emoji {
    font-size: 16px;
}

.preset-name {
    font-weight: 600;
}

/* 开关控件 */
.switch-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(100, 150, 255, 0.3);
    border-radius: 24px;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
}

input:checked+.slider {
    background: linear-gradient(90deg, #0066ff, #00aaff);
}

input:checked+.slider:before {
    transform: translateX(26px);
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.action-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
}

.action-btn.save {
    background: linear-gradient(135deg, #0066ff, #0099ff);
    color: white;
}

.action-btn.reset {
    background: rgba(255, 150, 0, 0.2);
    color: #ffaa00;
    border: 1px solid rgba(255, 150, 0, 0.4);
}

.action-btn.clear {
    background: rgba(255, 50, 100, 0.2);
    color: #ff6688;
    border: 1px solid rgba(255, 50, 100, 0.4);
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-icon {
    font-size: 14px;
}

/* 快捷发射按钮 */
.quick-launch-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #ff3366, #ff6633);
    color: white;
    cursor: pointer;
    z-index: 100;
    box-shadow:
        0 10px 30px rgba(255, 50, 100, 0.4),
        0 0 0 5px rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.quick-launch-btn:hover {
    transform: scale(1.1) translateY(-5px);
    box-shadow:
        0 15px 40px rgba(255, 50, 100, 0.6),
        0 0 0 8px rgba(255, 255, 255, 0.15);
}

.quick-launch-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.btn-emoji {
    font-size: 24px;
}

.btn-text {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
}

/* 提示覆盖层 */
.hint-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hint-content {
    background: rgba(20, 25, 50, 0.95);
    padding: 30px;
    border-radius: 20px;
    border: 1px solid rgba(100, 150, 255, 0.3);
    max-width: 400px;
    text-align: center;
}

.hint-content h3 {
    color: #fff;
    margin-bottom: 15px;
}

.hint-content p {
    color: rgba(200, 220, 255, 0.8);
    margin-bottom: 20px;
    line-height: 1.5;
}

.hint-close {
    padding: 10px 30px;
    background: linear-gradient(90deg, #0066ff, #0099ff);
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    font-weight: 600;
}

/* 动画效果 */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .control-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .control-panel {
        width: 320px;
        left: 10px;
        top: 10px;
    }

    .control-grid {
        gap: 12px;
    }

    .quick-launch-btn {
        width: 60px;
        height: 60px;
        right: 20px;
        bottom: 20px;
    }
}
</style>