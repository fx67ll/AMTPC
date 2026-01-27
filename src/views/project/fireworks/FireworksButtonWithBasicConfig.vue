<template>
    <div class="fireworks-box">
        <!-- 重构后的侧边控制面板 -->
        <div class="control-sidebar" :class="{ 'sidebar-collapsed': panelCollapsed }">
            <!-- 侧边栏头部 -->
            <div class="sidebar-header">
                <div class="header-main">
                    <span class="header-icon" v-if="!panelCollapsed">🚽</span>
                    <transition name="fade">
                        <span v-if="!panelCollapsed" class="header-title" @click="goToConfigPage">简易烟花控制台</span>
                    </transition>
                </div>
                <div class="header-status" @click="togglePanel">
                    <div class="status-indicator" :class="{ active: fireworksRunning }" v-if="isShowMultiple"></div>
                    <span class="collapse-icon">{{ panelCollapsed ? '▶' : '◀' }}</span>
                </div>
            </div>

            <!-- 侧边栏内容 -->
            <div class="sidebar-content" v-show="!panelCollapsed">
                <!-- 快速操作区 -->
                <div class="quick-actions">
                    <button class="action-btn launch-btn" @click="launchSingle" v-if="!isShowMultiple">
                        <span class="btn-icon">🎇</span>
                        <span class="btn-text">发射单发</span>
                    </button>
                    <button class="action-btn toggle-btn" :class="{ active: fireworksRunning }" @click="toggleFireworks"
                        v-if="isShowMultiple">
                        <span class="btn-icon">{{ fireworksRunning ? '⏸️' : '▶️' }}</span>
                        <span class="btn-text">{{ fireworksRunning ? '停止连发' : '开始连发' }}</span>
                    </button>
                    <!-- <button class="action-btn clear-btn" @click="clearFireworks">
                        <span class="btn-icon">🗑️</span>
                        <span class="btn-text">{{ isShowMultiple ? '切换单发' : '切换连发' }}</span>
                    </button> -->
                    <button class="action-btn toggle-btn" @click="clearFireworks">
                        <span class="btn-icon">⚙️</span>
                        <span class="btn-text">{{ isShowMultiple ? '切换单发' : '切换连发' }}</span>
                    </button>
                </div>

                <!-- 配置分组 -->
                <div class="config-groups">
                    <!-- 基础设置 -->
                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">⚙️</span>
                            <h4 class="group-title">基础设置</h4>
                        </div>
                        <div class="group-content">
                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">粒子数量</span>
                                    <span class="label-value">{{ config.particles }}</span>
                                </label>
                                <input type="range" v-model.number="config.particles" min="20" max="200"
                                    class="config-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">爆炸强度</span>
                                    <span class="label-value">{{ config.explosion }}</span>
                                </label>
                                <input type="range" v-model.number="config.explosion" min="1" max="10" step="0.5"
                                    class="config-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">重力强度</span>
                                    <span class="label-value">{{ config.gravity.toFixed(1) }}</span>
                                </label>
                                <input type="range" v-model.number="config.gravity" min="0.1" max="3" step="0.1"
                                    class="config-slider" @input="updateFireworksConfig">
                            </div>
                        </div>
                    </div>

                    <!-- 颜色设置 -->
                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">🎨</span>
                            <h4 class="group-title">颜色设置</h4>
                        </div>
                        <div class="group-content">
                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">色相范围</span>
                                    <span class="label-value">{{ config.hue.min }}° - {{ config.hue.max }}°</span>
                                </label>
                                <div class="dual-slider">
                                    <div class="slider-wrapper">
                                        <input type="range" v-model.number="config.hue.min" min="0" max="360"
                                            class="config-slider hue-min" @input="updateFireworksConfig">
                                        <div class="slider-label">最小</div>
                                    </div>
                                    <div class="slider-wrapper">
                                        <input type="range" v-model.number="config.hue.max" min="0" max="360"
                                            class="config-slider hue-max" @input="updateFireworksConfig">
                                        <div class="slider-label">最大</div>
                                    </div>
                                </div>
                            </div>

                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">透明度</span>
                                    <span class="label-value">{{ (config.opacity * 100).toFixed(0) }}%</span>
                                </label>
                                <input type="range" v-model.number="config.opacity" min="0.1" max="1" step="0.05"
                                    class="config-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="color-presets">
                                <div class="presets-title">快速配色</div>
                                <div class="presets-grid">
                                    <button v-for="preset in colorPresets" :key="preset.name" class="preset-item"
                                        :style="{ background: preset.gradient }" @click="applyColorPreset(preset)"
                                        :title="preset.name">
                                        <span class="preset-emoji">{{ preset.emoji }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 高级设置 -->
                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">🔧</span>
                            <h4 class="group-title">高级设置</h4>
                        </div>
                        <div class="group-content">
                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">闪烁程度</span>
                                    <span class="label-value">{{ config.flickering }}%</span>
                                </label>
                                <input type="range" v-model.number="config.flickering" min="0" max="100"
                                    class="config-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">上升速度</span>
                                    <span class="label-value">{{ config.traceSpeed }}</span>
                                </label>
                                <input type="range" v-model.number="config.traceSpeed" min="1" max="20"
                                    class="config-slider" @input="updateFireworksConfig">
                            </div>

                            <div class="config-item">
                                <label class="switch-item">
                                    <span class="switch-label">点击发射</span>
                                    <label class="switch">
                                        <input type="checkbox" v-model="config.mouse.click"
                                            @change="updateFireworksConfig">
                                        <span class="slider"></span>
                                    </label>
                                </label>
                            </div>

                            <div class="config-item">
                                <label class="switch-item">
                                    <span class="switch-label">圆形线条</span>
                                    <label class="switch">
                                        <input type="checkbox" v-model="config.lineStyle" true-value="round"
                                            false-value="square" @change="updateFireworksConfig">
                                        <span class="slider"></span>
                                    </label>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- 配置管理 -->
                    <div class="config-group">
                        <div class="group-header">
                            <span class="group-icon">💾</span>
                            <h4 class="group-title">配置管理</h4>
                        </div>
                        <div class="group-actions">
                            <button class="manage-btn save-btn" @click="saveCurrentConfig">
                                <span class="btn-icon">📁</span>
                                <span class="btn-text">保存配置</span>
                            </button>
                            <button class="manage-btn reset-btn" @click="resetToDefault">
                                <span class="btn-icon">🔄</span>
                                <span class="btn-text">重置默认</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 收起状态下的快捷工具栏 -->
            <div class="sidebar-collapsed-tools" v-show="panelCollapsed">
                <button class="collapsed-btn" @click="launchSingle" title="发射单发" v-if="!isShowMultiple">
                    <span class="btn-icon">🎇</span>
                </button>
                <button class="collapsed-btn" @click="toggleFireworks" :class="{ active: fireworksRunning }"
                    :title="fireworksRunning ? '停止连发' : '开始连发'" v-if="isShowMultiple">
                    <span class="btn-icon">{{ fireworksRunning ? '⏸️' : '▶️' }}</span>
                </button>
                <button class="collapsed-btn" @click="clearFireworks" title="切换模式">
                    <span class="btn-icon">⚙️</span>
                </button>
                <!-- <button class="collapsed-btn" @click="clearFireworks" title="切换模式">
                    <span class="btn-icon">🗑️</span>
                </button>
                <button class="collapsed-btn" @click="togglePanel" title="展开面板">
                    <span class="btn-icon">⚙️</span>
                </button> -->
            </div>
        </div>

        <!-- 烟花画布容器 -->
        <div ref="canvasContainer" class="canvas-container"></div>

        <!-- 浮动发射按钮（仅在收起状态显示） -->
        <button class="floating-launch-btn" @click="launchSingle" v-if="panelCollapsed || !isShowMultiple">
            <span class="btn-emoji">🎆</span>
        </button>
    </div>
</template>

<script>
import { Fireworks } from 'fireworks-js'

export default {
    name: 'FireworksButton',
    data() {
        return {
            // 显示连发还是单发
            isShowMultiple: false,

            panelCollapsed: false,
            fireworks: null,
            fireworksRunning: false,
            colorPresets: [
                { name: '经典红黄', emoji: '🎇', gradient: 'linear-gradient(135deg, #ff0000, #ff9900)', hue: { min: 0, max: 60 } },
                { name: '冷艳蓝紫', emoji: '❄️', gradient: 'linear-gradient(135deg, #0066ff, #cc00ff)', hue: { min: 200, max: 300 } },
                { name: '森林绿意', emoji: '🌿', gradient: 'linear-gradient(135deg, #00cc66, #66ff33)', hue: { min: 100, max: 150 } },
                { name: '梦幻粉紫', emoji: '🌌', gradient: 'linear-gradient(135deg, #ff66cc, #9966ff)', hue: { min: 300, max: 330 } },
                { name: '炽热熔岩', emoji: '🔥', gradient: 'linear-gradient(135deg, #ff3300, #ffcc00)', hue: { min: 10, max: 50 } },
                { name: '霓虹炫彩', emoji: '🌈', gradient: 'linear-gradient(135deg, #ff00ff, #00ffff, #ffff00)', hue: { min: 0, max: 360 } }
            ],
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
        goToConfigPage() {
            this.$router.push({ path: '/fireworks-complete-config-test' })
        },

        initFireworks() {
            const container = this.$refs.canvasContainer
            if (!container) return

            try {
                this.fireworks = new Fireworks(container, this.config)
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
            this.validateConfigValues()
            this.fireworks.updateOptions(this.config)
        },

        validateConfigValues() {
            if (this.config.hue.min > this.config.hue.max) {
                const temp = this.config.hue.min
                this.config.hue.min = this.config.hue.max
                this.config.hue.max = temp
            }
        },

        launchSingle() {
            if (this.fireworksRunning) {
                this.fireworks.stop()
                this.fireworksRunning = false
            }

            if (this.fireworks) {
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

        clearFireworks() {
            if (this.isShowMultiple && this.fireworksRunning) {
                this.toggleFireworks()
            }

            this.isShowMultiple = !this.isShowMultiple

            if (!this.fireworks) return

            const wasRunning = this.fireworksRunning
            this.fireworks.stop()
            this.fireworksRunning = false

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
.fireworks-box {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.95);
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

/* ===== 侧边栏布局 ===== */
.control-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 380px;
    height: 100vh;
    background: rgba(15, 18, 35, 0.95);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(100, 150, 255, 0.15);
    box-shadow:
        5px 0 30px rgba(0, 0, 0, 0.4),
        inset -1px 0 0 rgba(255, 255, 255, 0.05);
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-collapsed {
    width: 70px;
}

/* 侧边栏头部 */
.sidebar-header {
    padding: 24px 20px;
    background: linear-gradient(135deg, rgba(30, 60, 150, 0.3), rgba(100, 40, 200, 0.2));
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.header-main {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.header-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.header-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header-status {
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
    color: rgba(200, 220, 255, 0.8);
    font-size: 14px;
    transition: transform 0.3s ease;
}

/* 侧边栏内容 */
.sidebar-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* 快速操作区 */
.quick-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 10px;
}

.action-btn {
    padding: 14px 16px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: white;
}

.launch-btn {
    background: linear-gradient(135deg, #ff3366, #ff6633);
}

.toggle-btn {
    background: rgba(40, 60, 120, 0.3);
    border: 1px solid rgba(100, 150, 255, 0.25);
    color: rgba(220, 230, 255, 0.9);
}

.toggle-btn.active {
    background: linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(0, 200, 255, 0.2));
    border-color: rgba(0, 200, 255, 0.4);
    color: #fff;
}

.clear-btn {
    background: rgba(255, 50, 100, 0.15);
    border: 1px solid rgba(255, 50, 100, 0.3);
    color: #ff6688;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-icon {
    font-size: 16px;
}

.btn-text {
    font-weight: 600;
}

/* 配置分组 */
.config-groups {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.config-group {
    background: rgba(20, 25, 50, 0.4);
    border-radius: 14px;
    border: 1px solid rgba(80, 120, 220, 0.2);
    overflow: hidden;
}

.group-header {
    padding: 16px 20px;
    background: rgba(30, 40, 80, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    display: flex;
    align-items: center;
    gap: 10px;
}

.group-icon {
    font-size: 18px;
}

.group-title {
    margin: 0;
    font-size: 15px;
    color: #fff;
    font-weight: 600;
}

.group-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 配置项样式 */
.config-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.config-label {
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
    padding: 4px 8px;
    border-radius: 10px;
    font-weight: 600;
}

/* 滑块样式 */
.config-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, #003366, #0066cc);
    outline: none;
    -webkit-appearance: none;
    margin-top: 5px;
}

.config-slider::-webkit-slider-thumb {
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

.config-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 15px rgba(0, 170, 255, 1);
}

.hue-min::-webkit-slider-thumb {
    border-color: #ff3300;
    box-shadow: 0 0 10px rgba(255, 50, 0, 0.8);
}

.hue-max::-webkit-slider-thumb {
    border-color: #ff00ff;
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.8);
}

.dual-slider {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.slider-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}

.slider-label {
    font-size: 11px;
    color: rgba(150, 180, 255, 0.8);
    min-width: 35px;
    text-align: right;
}

/* 颜色预设 */
.color-presets {
    margin-top: 10px;
}

.presets-title {
    font-size: 13px;
    color: rgba(200, 220, 255, 0.9);
    margin-bottom: 12px;
    font-weight: 600;
}

.presets-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
}

.preset-item {
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

.preset-item:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
}

.preset-emoji {
    font-size: 14px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7));
}

/* 开关控件 */
.switch-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.switch-label {
    font-size: 13px;
    color: rgba(200, 220, 255, 0.9);
    font-weight: 500;
}

.switch {
    position: relative;
    display: inline-block;
    width: 48px;
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
    background-color: rgba(100, 150, 255, 0.2);
    border-radius: 24px;
    transition: .3s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
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

/* 配置管理 */
.group-actions {
    display: flex;
    gap: 10px;
    padding: 10px 0;
}

.manage-btn {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
}

.save-btn {
    background: linear-gradient(135deg, rgba(0, 150, 255, 0.2), rgba(0, 200, 255, 0.1));
    color: #66ccff;
    border: 1px solid rgba(0, 200, 255, 0.3);
}

.reset-btn {
    background: rgba(255, 180, 0, 0.1);
    color: #ffcc00;
    border: 1px solid rgba(255, 180, 0, 0.3);
}

.manage-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
}

/* 收起状态工具栏 */
.sidebar-collapsed-tools {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.collapsed-btn {
    width: 45px;
    height: 45px;
    border-radius: 12px;
    border: none;
    background: rgba(40, 60, 120, 0.3);
    border: 1px solid rgba(100, 150, 255, 0.25);
    color: rgba(220, 230, 255, 0.9);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.collapsed-btn:hover {
    background: rgba(60, 100, 200, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 100, 255, 0.2);
}

.collapsed-btn.active {
    background: linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(0, 200, 255, 0.2));
    border-color: rgba(0, 200, 255, 0.4);
    color: #fff;
}

/* 浮动发射按钮 */
.floating-launch-btn {
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
        0 8px 25px rgba(255, 50, 100, 0.4),
        0 0 0 4px rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
}

.floating-launch-btn:hover {
    transform: scale(1.1) translateY(-5px);
    box-shadow:
        0 12px 35px rgba(255, 50, 100, 0.6),
        0 0 0 6px rgba(255, 255, 255, 0.12);
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(100, 150, 255, 0.3);
    border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 150, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 1400px) {
    .control-sidebar {
        width: 350px;
    }

    .sidebar-collapsed {
        width: 60px;
    }
}

@media (max-width: 768px) {
    .control-sidebar {
        width: 320px;
    }

    .sidebar-collapsed {
        width: 50px;
    }

    .presets-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .floating-launch-btn {
        width: 60px;
        height: 60px;
        right: 20px;
        bottom: 20px;
    }

    .collapsed-btn {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }
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
</style>