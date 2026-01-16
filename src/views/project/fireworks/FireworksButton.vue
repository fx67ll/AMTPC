<template>
    <div class="fireworks-enhanced">
        <!-- 重构后的控制面板 -->
        <div class="control-panel" :class="{ 'panel-collapsed': panelCollapsed }">
            <!-- 面板标题栏 -->
            <div class="panel-header" @click="togglePanel">
                <div class="header-content">
                    <span class="panel-icon">🎛️</span>
                    <span class="panel-title">烟花实验室</span>
                    <span class="status-badge" :class="{ active: fireworksRunning }">
                        {{ fireworksRunning ? '运行中' : '已停止' }}
                    </span>
                </div>
                <div class="header-actions">
                    <span class="collapse-icon">{{ panelCollapsed ? '▶' : '▼' }}</span>
                </div>
            </div>

            <!-- 面板内容区域 -->
            <div class="panel-content" v-show="!panelCollapsed">
                <!-- 模式与快速操作 -->
                <div class="control-section mode-section">
                    <div class="section-header">
                        <span class="section-icon">🚀</span>
                        <h3>发射控制</h3>
                    </div>
                    <div class="mode-actions">
                        <div class="mode-row">
                            <button class="mode-btn primary" @click="launchSingle">
                                <span class="btn-icon">🎆</span>
                                <span class="btn-text">发射单发</span>
                            </button>
                            <button class="mode-btn" :class="{ active: fireworksRunning }" @click="toggleFireworks">
                                <span class="btn-icon">{{ fireworksRunning ? '⏸️' : '▶️' }}</span>
                                <span class="btn-text">{{ fireworksRunning ? '停止连发' : '开始连发' }}</span>
                            </button>
                            <button class="mode-btn danger" @click="clearFireworks">
                                <span class="btn-icon">🗑️</span>
                                <span class="btn-text">清空</span>
                            </button>
                        </div>
                        <div class="mode-row">
                            <button class="mode-btn small" :class="{ active: config.mouse.click }"
                                @click="toggleMouseClick">
                                <span class="btn-icon">🖱️</span>
                                <span class="btn-text">{{ config.mouse.click ? '点击发射: 开' : '点击发射: 关' }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 核心配置卡片 -->
                <div class="cards-container">
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
                                    <div class="range-wrapper">
                                        <span class="range-label">最小</span>
                                        <input type="range" v-model.number="config.hue.min" min="0" max="360"
                                            class="range-slider hue-min" @input="updateFireworksConfig">
                                    </div>
                                    <div class="range-wrapper">
                                        <span class="range-label">最大</span>
                                        <input type="range" v-model.number="config.hue.max" min="0" max="360"
                                            class="range-slider hue-max" @input="updateFireworksConfig">
                                    </div>
                                </div>
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">亮度范围</span>
                                    <span class="label-value">{{ config.brightness.min }}% - {{ config.brightness.max
                                    }}%</span>
                                </label>
                                <div class="range-group">
                                    <div class="range-wrapper">
                                        <span class="range-label">最小</span>
                                        <input type="range" v-model.number="config.brightness.min" min="1" max="100"
                                            class="range-slider" @input="updateFireworksConfig">
                                    </div>
                                    <div class="range-wrapper">
                                        <span class="range-label">最大</span>
                                        <input type="range" v-model.number="config.brightness.max" min="1" max="100"
                                            class="range-slider" @input="updateFireworksConfig">
                                    </div>
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
                                <h5>配色方案</h5>
                                <div class="preset-grid">
                                    <button v-for="preset in colorPresets" :key="preset.name" class="preset-color"
                                        :style="{ background: preset.gradient }" @click="applyColorPreset(preset)"
                                        :title="preset.name">
                                        <span class="preset-emoji">{{ preset.emoji }}</span>
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
                                <input type="range" v-model.number="config.particles" min="20" max="200"
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
                                    <span class="label-text">闪烁程度</span>
                                    <span class="label-value">{{ config.flickering }}%</span>
                                </label>
                                <input type="range" v-model.number="config.flickering" min="0" max="100"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">衰减速度</span>
                                    <span class="label-value">{{ config.decay.min.toFixed(3) }} - {{
                                        config.decay.max.toFixed(3) }}</span>
                                </label>
                                <div class="range-group">
                                    <div class="range-wrapper">
                                        <span class="range-label">慢</span>
                                        <input type="range" v-model.number="config.decay.min" min="0.005" max="0.05"
                                            step="0.001" class="range-slider" @input="updateFireworksConfig">
                                    </div>
                                    <div class="range-wrapper">
                                        <span class="range-label">快</span>
                                        <input type="range" v-model.number="config.decay.max" min="0.005" max="0.05"
                                            step="0.001" class="range-slider" @input="updateFireworksConfig">
                                    </div>
                                </div>
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
                                    <span class="label-value">{{ config.gravity.toFixed(1) }}</span>
                                </label>
                                <input type="range" v-model.number="config.gravity" min="0.1" max="3" step="0.1"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">加速度</span>
                                    <span class="label-value">{{ config.acceleration.toFixed(2) }}</span>
                                </label>
                                <input type="range" v-model.number="config.acceleration" min="1" max="1.2" step="0.01"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">摩擦力</span>
                                    <span class="label-value">{{ config.friction.toFixed(2) }}</span>
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
                                    <span class="label-value">{{ config.rocketsPoint.min }}%</span>
                                </label>
                                <input type="range" v-model.number="config.rocketsPoint.min" min="20" max="80"
                                    class="range-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="param-item">
                                <label class="param-label">
                                    <span class="label-text">发射间隔</span>
                                    <span class="label-value">{{ config.delay.min }} - {{ config.delay.max }}ms</span>
                                </label>
                                <div class="range-group">
                                    <div class="range-wrapper">
                                        <span class="range-label">最小</span>
                                        <input type="range" v-model.number="config.delay.min" min="10" max="200"
                                            class="range-slider" @input="updateFireworksConfig">
                                    </div>
                                    <div class="range-wrapper">
                                        <span class="range-label">最大</span>
                                        <input type="range" v-model.number="config.delay.max" min="10" max="200"
                                            class="range-slider" @input="updateFireworksConfig">
                                    </div>
                                </div>
                            </div>

                            <div class="param-item">
                                <label class="switch-label">
                                    <span class="label-text">圆形线条</span>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 烟花画布容器 -->
        <div ref="canvasContainer" class="canvas-container"></div>

        <!-- 快捷发射按钮 -->
        <button class="quick-launch-btn" @click="launchSingle" :disabled="fireworksRunning">
            <span class="btn-emoji">🎆</span>
            <span class="btn-text">单发发射</span>
        </button>
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

            // 完整配置对象（已验证所有配置项的有效性）
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
        window.removeEventListener('resize', this.handleResize)
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

        // 修复：更新配置方法
        updateFireworksConfig() {
            if (!this.fireworks) return

            // 确保配置值的有效性
            this.validateConfigValues()

            // 应用更新到 fireworks 实例
            this.fireworks.updateOptions(this.config)
        },

        // 验证和修正配置值
        validateConfigValues() {
            // 确保色相范围有效
            if (this.config.hue.min > this.config.hue.max) {
                const temp = this.config.hue.min
                this.config.hue.min = this.config.hue.max
                this.config.hue.max = temp
            }

            // 确保亮度范围有效
            if (this.config.brightness.min > this.config.brightness.max) {
                const temp = this.config.brightness.min
                this.config.brightness.min = this.config.brightness.max
                this.config.brightness.max = temp
            }

            // 确保衰减范围有效
            if (this.config.decay.min > this.config.decay.max) {
                const temp = this.config.decay.min
                this.config.decay.min = this.config.decay.max
                this.config.decay.max = temp
            }

            // 确保延迟范围有效
            if (this.config.delay.min > this.config.delay.max) {
                const temp = this.config.delay.min
                this.config.delay.min = this.config.delay.max
                this.config.delay.max = temp
            }
        },

        // 修复：单发发射方法
        launchSingle() {
            if (!this.fireworks) return

            // 确保连发已停止
            if (this.fireworksRunning) {
                this.fireworks.stop()
                const wasRunning = this.fireworksRunning
                this.fireworksRunning = false

                // 发射单发烟花
                setTimeout(() => {
                    this.fireworks.launch(1)

                    // 如果之前是连发状态，重新启动
                    if (wasRunning) {
                        setTimeout(() => {
                            this.fireworks.start()
                            this.fireworksRunning = true
                        }, 100)
                    }
                }, 50)
            } else {
                // 直接发射单发烟花
                this.fireworks.launch(1)
            }
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

        clearFireworks() {
            if (!this.fireworks) return

            const wasRunning = this.fireworksRunning

            // 停止烟花
            this.fireworks.stop()
            this.fireworksRunning = false

            // 清空画布
            setTimeout(() => {
                if (wasRunning) {
                    this.fireworks.start()
                    this.fireworksRunning = true
                }
            }, 100)
        },

        applyColorPreset(preset) {
            this.config.hue = { ...preset.hue }
            this.updateFireworksConfig()

            // 显示应用成功的视觉反馈
            this.showTempFeedback(`已应用 ${preset.name} 配色`)
        },

        saveCurrentConfig() {
            try {
                const configToSave = {
                    ...this.config,
                    timestamp: new Date().toISOString()
                }
                localStorage.setItem('fireworksLabConfig', JSON.stringify(configToSave))
                this.showTempFeedback('配置已保存到本地')
            } catch (e) {
                console.error('保存配置失败:', e)
                this.showTempFeedback('保存失败，请检查控制台')
            }
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
                    brightness: { min: 60, max: 90 },
                    decay: { min: 0.015, max: 0.025 },
                    delay: { min: 30, max: 60 },
                    rocketsPoint: { min: 50, max: 50 },
                    lineStyle: 'round',
                    mouse: { click: true, move: false, max: 3 }
                }

                Object.assign(this.config, defaultConfig)
                this.updateFireworksConfig()
                this.showTempFeedback('已重置为默认配置')
            }
        },

        showTempFeedback(text) {
            // 创建临时反馈元素
            const feedbackEl = document.createElement('div')
            feedbackEl.className = 'temp-feedback'
            feedbackEl.textContent = text
            feedbackEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 100, 200, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
        font-size: 14px;
        animation: fadeInOut 2s ease;
      `

            document.body.appendChild(feedbackEl)

            setTimeout(() => {
                if (feedbackEl.parentNode) {
                    feedbackEl.parentNode.removeChild(feedbackEl)
                }
            }, 2000)
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
    background: linear-gradient(180deg, #0a0a1a 0%, #151530 30%, #0c0c1c 100%);
    background-image:
        radial-gradient(circle at 20% 30%, rgba(30, 60, 150, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(100, 40, 200, 0.2) 0%, transparent 50%);
}

/* ===== 优化后的控制面板 ===== */
.control-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 420px;
    max-height: 90vh;
    background: rgba(10, 12, 28, 0.92);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    border: 1px solid rgba(100, 150, 255, 0.15);
    box-shadow:
        0 15px 35px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.panel-collapsed {
    width: 60px;
    height: 60px;
}

/* 面板标题栏 */
.panel-header {
    padding: 16px 20px;
    background: rgba(20, 25, 50, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.panel-icon {
    font-size: 22px;
    filter: drop-shadow(0 0 6px rgba(100, 150, 255, 0.5));
}

.panel-title {
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.3px;
}

.status-badge {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 10px;
    background: rgba(255, 50, 50, 0.3);
    color: rgba(255, 200, 200, 0.9);
    font-weight: 600;
}

.status-badge.active {
    background: rgba(0, 200, 100, 0.3);
    color: rgba(200, 255, 220, 0.9);
}

.header-actions {
    display: flex;
    align-items: center;
}

.collapse-icon {
    color: rgba(200, 220, 255, 0.7);
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
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 模式控制区域 */
.mode-section {
    background: rgba(25, 30, 60, 0.5);
    border-radius: 14px;
    border: 1px solid rgba(80, 120, 220, 0.2);
    padding: 18px;
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

.mode-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.mode-row {
    display: flex;
    gap: 10px;
}

.mode-btn {
    flex: 1;
    padding: 12px 16px;
    background: rgba(40, 60, 120, 0.3);
    border: 1px solid rgba(100, 150, 255, 0.25);
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
    background: linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(0, 200, 255, 0.2));
    border-color: rgba(0, 200, 255, 0.4);
    color: #fff;
}

.mode-btn.primary {
    background: linear-gradient(135deg, #0066ff, #0099ff);
    border-color: #00aaff;
    color: #fff;
}

.mode-btn.danger {
    background: rgba(255, 50, 100, 0.2);
    border-color: rgba(255, 50, 100, 0.4);
    color: #ff6688;
}

.mode-btn.small {
    padding: 8px 12px;
    font-size: 13px;
}

.btn-icon {
    font-size: 16px;
}

.btn-text {
    font-weight: 600;
}

/* 卡片容器 */
.cards-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    flex: 1;
    overflow-y: auto;
}

.control-card {
    background: rgba(18, 22, 45, 0.6);
    border-radius: 14px;
    border: 1px solid rgba(80, 120, 220, 0.15);
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.control-card:hover {
    border-color: rgba(100, 150, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.card-header {
    padding: 16px;
    background: rgba(30, 40, 80, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
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
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
}

/* 参数控件样式 */
.param-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.param-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.label-text {
    font-size: 13px;
    color: rgba(200, 220, 255, 0.9);
    font-weight: 500;
}

.label-value {
    font-size: 12px;
    font-family: 'Monaco', 'Courier New', monospace;
    color: #00ffaa;
    background: rgba(0, 0, 0, 0.3);
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: 600;
}

/* 滑块样式 */
.range-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #003366, #0066cc);
    outline: none;
    -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #00aaff;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(0, 170, 255, 0.8);
    transition: all 0.2s ease;
}

.range-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 12px rgba(0, 170, 255, 1);
}

/* 特殊色相滑块 */
.hue-min::-webkit-slider-thumb {
    border-color: #ff3300;
    box-shadow: 0 0 8px rgba(255, 50, 0, 0.8);
}

.hue-max::-webkit-slider-thumb {
    border-color: #ff00ff;
    box-shadow: 0 0 8px rgba(255, 0, 255, 0.8);
}

.range-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.range-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.range-label {
    font-size: 11px;
    color: rgba(150, 180, 255, 0.8);
    min-width: 35px;
}

/* 颜色预设 */
.color-presets h5 {
    margin: 0 0 10px 0;
    font-size: 13px;
    color: rgba(200, 220, 255, 0.9);
    font-weight: 600;
}

.preset-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
}

.preset-color {
    aspect-ratio: 1;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    overflow: hidden;
}

.preset-color:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4);
}

.preset-emoji {
    font-size: 14px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7));
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
    width: 46px;
    height: 22px;
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
    background-color: rgba(100, 150, 255, 0.2);
    border-radius: 22px;
    transition: .3s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .3s;
}

input:checked+.slider {
    background: linear-gradient(90deg, #0066ff, #00aaff);
}

input:checked+.slider:before {
    transform: translateX(24px);
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 10px;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.action-btn {
    flex: 1;
    padding: 10px 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
}

.action-btn.save {
    background: linear-gradient(135deg, rgba(0, 150, 255, 0.2), rgba(0, 200, 255, 0.1));
    color: #66ccff;
    border: 1px solid rgba(0, 200, 255, 0.3);
}

.action-btn.reset {
    background: rgba(255, 180, 0, 0.1);
    color: #ffcc00;
    border: 1px solid rgba(255, 180, 0, 0.3);
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
}

/* 快捷发射按钮 */
.quick-launch-btn {
    position: fixed;
    bottom: 25px;
    right: 25px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #ff3366, #ff6633);
    color: white;
    cursor: pointer;
    z-index: 100;
    box-shadow:
        0 8px 25px rgba(255, 50, 100, 0.4),
        0 0 0 4px rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.quick-launch-btn:hover:not(:disabled) {
    transform: scale(1.1) translateY(-5px);
    box-shadow:
        0 12px 35px rgba(255, 50, 100, 0.6),
        0 0 0 6px rgba(255, 255, 255, 0.12);
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
    letter-spacing: 0.5px;
}

/* 临时反馈动画 */
@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    20% {
        opacity: 1;
        transform: translateY(0);
    }

    80% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-10px);
    }
}

/* 响应式设计 */
@media (max-width: 1400px) {
    .control-panel {
        width: 380px;
    }

    .cards-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .control-panel {
        width: 340px;
        left: 10px;
        top: 10px;
    }

    .mode-row {
        flex-wrap: wrap;
    }

    .mode-btn {
        min-width: calc(50% - 5px);
    }

    .preset-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .quick-launch-btn {
        width: 60px;
        height: 60px;
        right: 15px;
        bottom: 15px;
    }
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
    width: 6px;
}

.panel-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
    background: rgba(100, 150, 255, 0.3);
    border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 150, 255, 0.5);
}
</style>