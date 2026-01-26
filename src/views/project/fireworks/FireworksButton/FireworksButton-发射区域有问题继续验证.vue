<template>
    <div class="fireworks-box">
        <!-- 全功能侧边栏 -->
        <div class="control-sidebar" :class="{ 'sidebar-collapsed': panelCollapsed }">
            <!-- 侧边栏头部 -->
            <div class="sidebar-header" @click="togglePanel">
                <div class="header-main">
                    <span class="header-icon">🎆</span>
                    <transition name="fade">
                        <span v-if="!panelCollapsed" class="header-title">全功能烟花控制台</span>
                    </transition>
                </div>
                <div class="header-status">
                    <div class="status-indicator" :class="{ active: fireworksRunning }"></div>
                    <span class="collapse-icon">{{ panelCollapsed ? '▶' : '◀' }}</span>
                </div>
            </div>

            <!-- 侧边栏内容 -->
            <div class="sidebar-content" v-show="!panelCollapsed">
                <!-- 核心控制区 -->
                <div class="core-controls">
                    <button class="core-btn launch-btn" @click="launchSingle">
                        <span class="btn-icon">🎇</span>
                        <span class="btn-text">发射单发</span>
                    </button>
                    <button class="core-btn toggle-btn" :class="{ active: fireworksRunning }" @click="toggleFireworks">
                        <span class="btn-icon">{{ fireworksRunning ? '⏸️' : '▶️' }}</span>
                        <span class="btn-text">{{ fireworksRunning ? '停止连发' : '开始连发' }}</span>
                    </button>
                    <button class="core-btn clear-btn" @click="clearFireworks">
                        <span class="btn-icon">🗑️</span>
                        <span class="btn-text">清空</span>
                    </button>
                </div>

                <!-- 配置折叠面板 -->
                <div class="accordion-container">
                    <!-- 基础参数 -->
                    <div class="accordion-group" :class="{ expanded: expandedGroup === 'basic' }">
                        <div class="accordion-header" @click="toggleGroup('basic')">
                            <span class="group-icon">⚙️</span>
                            <span class="group-title">基础参数</span>
                            <span class="expand-icon">{{ expandedGroup === 'basic' ? '▼' : '▶' }}</span>
                        </div>
                        <div class="accordion-content" v-show="expandedGroup === 'basic'">
                            <div class="config-grid">
                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">粒子数量</span>
                                        <span class="label-value">{{ config.particles }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.particles" min="10" max="500"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">爆炸强度</span>
                                        <span class="label-value">{{ config.explosion }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.explosion" min="1" max="20" step="0.5"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">爆炸范围</span>
                                        <span class="label-value">{{ config.intensity }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.intensity" min="10" max="200"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">透明度</span>
                                        <span class="label-value">{{ (config.opacity * 100).toFixed(0) }}%</span>
                                    </label>
                                    <input type="range" v-model.number="config.opacity" min="0.1" max="1" step="0.05"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 颜色与外观 -->
                    <div class="accordion-group" :class="{ expanded: expandedGroup === 'color' }">
                        <div class="accordion-header" @click="toggleGroup('color')">
                            <span class="group-icon">🎨</span>
                            <span class="group-title">颜色与外观</span>
                            <span class="expand-icon">{{ expandedGroup === 'color' ? '▼' : '▶' }}</span>
                        </div>
                        <div class="accordion-content" v-show="expandedGroup === 'color'">
                            <div class="config-grid">
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
                                        <span class="label-text">亮度范围</span>
                                        <span class="label-value">{{ config.brightness.min }}% - {{
                                            config.brightness.max }}%</span>
                                    </label>
                                    <div class="dual-slider">
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.brightness.min" min="1" max="100"
                                                class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最小</div>
                                        </div>
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.brightness.max" min="1" max="100"
                                                class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最大</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">闪烁程度</span>
                                        <span class="label-value">{{ config.flickering }}%</span>
                                    </label>
                                    <input type="range" v-model.number="config.flickering" min="0" max="100"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>
                            </div>

                            <div class="color-presets">
                                <div class="presets-title">配色预设</div>
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

                    <!-- 物理效果 -->
                    <div class="accordion-group" :class="{ expanded: expandedGroup === 'physics' }">
                        <div class="accordion-header" @click="toggleGroup('physics')">
                            <span class="group-icon">🌍</span>
                            <span class="group-title">物理效果</span>
                            <span class="expand-icon">{{ expandedGroup === 'physics' ? '▼' : '▶' }}</span>
                        </div>
                        <div class="accordion-content" v-show="expandedGroup === 'physics'">
                            <div class="config-grid">
                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">重力强度</span>
                                        <span class="label-value">{{ config.gravity.toFixed(1) }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.gravity" min="0" max="5" step="0.1"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">加速度</span>
                                        <span class="label-value">{{ config.acceleration.toFixed(2) }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.acceleration" min="1" max="1.5"
                                        step="0.01" class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">摩擦力</span>
                                        <span class="label-value">{{ config.friction.toFixed(2) }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.friction" min="0.5" max="1" step="0.01"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">衰减速度</span>
                                        <span class="label-value">{{ config.decay.min.toFixed(3) }} - {{
                                            config.decay.max.toFixed(3) }}</span>
                                    </label>
                                    <div class="dual-slider">
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.decay.min" min="0.001" max="0.1"
                                                step="0.001" class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">慢</div>
                                        </div>
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.decay.max" min="0.001" max="0.1"
                                                step="0.001" class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">快</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 发射控制 -->
                    <div class="accordion-group" :class="{ expanded: expandedGroup === 'launch' }">
                        <div class="accordion-header" @click="toggleGroup('launch')">
                            <span class="group-icon">🚀</span>
                            <span class="group-title">发射控制</span>
                            <span class="expand-icon">{{ expandedGroup === 'launch' ? '▼' : '▶' }}</span>
                        </div>
                        <div class="accordion-content" v-show="expandedGroup === 'launch'">
                            <div class="config-grid">
                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">发射点高度</span>
                                        <span class="label-value">{{ config.rocketsPoint.min }}% - {{
                                            config.rocketsPoint.max }}%</span>
                                    </label>
                                    <div class="dual-slider">
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.rocketsPoint.min" min="0"
                                                max="100" class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最小</div>
                                        </div>
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.rocketsPoint.max" min="0"
                                                max="100" class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最大</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">发射间隔</span>
                                        <span class="label-value">{{ config.delay.min }} - {{ config.delay.max
                                            }}ms</span>
                                    </label>
                                    <div class="dual-slider">
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.delay.min" min="10" max="500"
                                                class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最小</div>
                                        </div>
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.delay.max" min="10" max="500"
                                                class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最大</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">上升速度</span>
                                        <span class="label-value">{{ config.traceSpeed }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.traceSpeed" min="1" max="30"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">轨迹长度</span>
                                        <span class="label-value">{{ config.traceLength }}</span>
                                    </label>
                                    <input type="range" v-model.number="config.traceLength" min="1" max="20"
                                        class="config-slider" @input="updateFireworksConfig">
                                </div>

                                <!-- 新增：发射区域控制 -->
                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">自定义发射区域</span>
                                        <label class="switch small">
                                            <input type="checkbox" v-model="config.boundaries.enabled"
                                                @change="updateBoundariesConfig">
                                            <span class="slider"></span>
                                        </label>
                                    </label>
                                </div>

                                <!-- 当启用自定义发射区域时显示详细设置 -->
                                <template v-if="config.boundaries.enabled">
                                    <div class="config-item">
                                        <label class="config-label">
                                            <span class="label-text">水平位置</span>
                                            <span class="label-value">{{ config.boundaries.x }}%</span>
                                        </label>
                                        <input type="range" v-model.number="config.boundaries.x" min="0" max="100"
                                            class="config-slider" @input="updateBoundariesConfig">
                                        <div class="slider-helper">左← →右</div>
                                    </div>

                                    <div class="config-item">
                                        <label class="config-label">
                                            <span class="label-text">垂直位置</span>
                                            <span class="label-value">{{ config.boundaries.y }}%</span>
                                        </label>
                                        <input type="range" v-model.number="config.boundaries.y" min="0" max="100"
                                            class="config-slider" @input="updateBoundariesConfig">
                                        <div class="slider-helper">上↑ ↓下</div>
                                    </div>

                                    <div class="config-item">
                                        <label class="config-label">
                                            <span class="label-text">区域宽度</span>
                                            <span class="label-value">{{ config.boundaries.width }}%</span>
                                        </label>
                                        <input type="range" v-model.number="config.boundaries.width" min="1" max="100"
                                            class="config-slider" @input="updateBoundariesConfig">
                                    </div>

                                    <div class="config-item">
                                        <label class="config-label">
                                            <span class="label-text">区域高度</span>
                                            <span class="label-value">{{ config.boundaries.height }}%</span>
                                        </label>
                                        <input type="range" v-model.number="config.boundaries.height" min="1" max="100"
                                            class="config-slider" @input="updateBoundariesConfig">
                                    </div>

                                    <div class="switch-group">
                                        <label class="switch-item">
                                            <span class="switch-label">区域内随机发射</span>
                                            <label class="switch small">
                                                <input type="checkbox" v-model="config.boundaries.random"
                                                    @change="updateBoundariesConfig">
                                                <span class="slider"></span>
                                            </label>
                                        </label>

                                        <label class="switch-item">
                                            <span class="switch-label">跟随鼠标位置</span>
                                            <label class="switch small">
                                                <input type="checkbox" v-model="config.boundaries.followMouse"
                                                    @change="updateBoundariesConfig">
                                                <span class="slider"></span>
                                            </label>
                                        </label>
                                    </div>
                                </template>

                                <!-- 快捷位置预设 -->
                                <div class="launch-presets" v-if="config.boundaries.enabled">
                                    <div class="presets-title">快捷位置</div>
                                    <div class="presets-buttons">
                                        <button class="preset-position-btn" @click="setBoundaryPreset('center')"
                                            :class="{ active: currentPreset === 'center' }">
                                            居中
                                        </button>
                                        <button class="preset-position-btn" @click="setBoundaryPreset('left')"
                                            :class="{ active: currentPreset === 'left' }">
                                            左侧
                                        </button>
                                        <button class="preset-position-btn" @click="setBoundaryPreset('right')"
                                            :class="{ active: currentPreset === 'right' }">
                                            右侧
                                        </button>
                                        <button class="preset-position-btn" @click="setBoundaryPreset('top')"
                                            :class="{ active: currentPreset === 'top' }">
                                            上方
                                        </button>
                                        <button class="preset-position-btn" @click="setBoundaryPreset('bottom')"
                                            :class="{ active: currentPreset === 'bottom' }">
                                            下方
                                        </button>
                                        <button class="preset-position-btn" @click="setBoundaryPreset('random')"
                                            :class="{ active: currentPreset === 'random' }">
                                            随机
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 线条样式 -->
                    <div class="accordion-group" :class="{ expanded: expandedGroup === 'lines' }">
                        <div class="accordion-header" @click="toggleGroup('lines')">
                            <span class="group-icon">📏</span>
                            <span class="group-title">线条样式</span>
                            <span class="expand-icon">{{ expandedGroup === 'lines' ? '▼' : '▶' }}</span>
                        </div>
                        <div class="accordion-content" v-show="expandedGroup === 'lines'">
                            <div class="config-grid">
                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">爆炸线条宽度</span>
                                        <span class="label-value">{{ config.lineWidth.explosion.min }} - {{
                                            config.lineWidth.explosion.max }}px</span>
                                    </label>
                                    <div class="dual-slider">
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.lineWidth.explosion.min"
                                                min="0.1" max="10" step="0.1" class="config-slider"
                                                @input="updateFireworksConfig">
                                            <div class="slider-label">最小</div>
                                        </div>
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.lineWidth.explosion.max"
                                                min="0.1" max="10" step="0.1" class="config-slider"
                                                @input="updateFireworksConfig">
                                            <div class="slider-label">最大</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">轨迹线条宽度</span>
                                        <span class="label-value">{{ config.lineWidth.trace.min }} - {{
                                            config.lineWidth.trace.max }}px</span>
                                    </label>
                                    <div class="dual-slider">
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.lineWidth.trace.min" min="0.1"
                                                max="5" step="0.1" class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最小</div>
                                        </div>
                                        <div class="slider-wrapper">
                                            <input type="range" v-model.number="config.lineWidth.trace.max" min="0.1"
                                                max="5" step="0.1" class="config-slider" @input="updateFireworksConfig">
                                            <div class="slider-label">最大</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="switch-group">
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
                    </div>

                    <!-- 鼠标控制 -->
                    <div class="accordion-group" :class="{ expanded: expandedGroup === 'mouse' }">
                        <div class="accordion-header" @click="toggleGroup('mouse')">
                            <span class="group-icon">🖱️</span>
                            <span class="group-title">鼠标控制</span>
                            <span class="expand-icon">{{ expandedGroup === 'mouse' ? '▼' : '▶' }}</span>
                        </div>
                        <div class="accordion-content" v-show="expandedGroup === 'mouse'">
                            <div class="switch-group">
                                <label class="switch-item">
                                    <span class="switch-label">点击发射</span>
                                    <label class="switch">
                                        <input type="checkbox" v-model="config.mouse.click"
                                            @change="updateFireworksConfig">
                                        <span class="slider"></span>
                                    </label>
                                </label>

                                <label class="switch-item">
                                    <span class="switch-label">移动发射</span>
                                    <label class="switch">
                                        <input type="checkbox" v-model="config.mouse.move"
                                            @change="updateFireworksConfig">
                                        <span class="slider"></span>
                                    </label>
                                </label>
                            </div>

                            <div class="config-item">
                                <label class="config-label">
                                    <span class="label-text">最大发射数</span>
                                    <span class="label-value">{{ config.mouse.max }}</span>
                                </label>
                                <input type="range" v-model.number="config.mouse.max" min="1" max="10"
                                    class="config-slider" @input="updateFireworksConfig">
                            </div>
                        </div>
                    </div>

                    <!-- 高级设置 -->
                    <div class="accordion-group" :class="{ expanded: expandedGroup === 'advanced' }">
                        <div class="accordion-header" @click="toggleGroup('advanced')">
                            <span class="group-icon">🔧</span>
                            <span class="group-title">高级设置</span>
                            <span class="expand-icon">{{ expandedGroup === 'advanced' ? '▼' : '▶' }}</span>
                        </div>
                        <div class="accordion-content" v-show="expandedGroup === 'advanced'">
                            <div class="config-grid">
                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">自动调整大小</span>
                                        <label class="switch small">
                                            <input type="checkbox" v-model="config.autoresize"
                                                @change="updateFireworksConfig">
                                            <span class="slider"></span>
                                        </label>
                                    </label>
                                </div>

                                <div class="config-item">
                                    <label class="config-label">
                                        <span class="label-text">声音效果</span>
                                        <label class="switch small">
                                            <input type="checkbox" v-model="config.sound"
                                                @change="updateFireworksConfig">
                                            <span class="slider"></span>
                                        </label>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 配置管理 -->
                <div class="config-management">
                    <button class="manage-btn save-btn" @click="saveCurrentConfig">
                        <span class="btn-icon">💾</span>
                        <span class="btn-text">保存配置</span>
                    </button>
                    <button class="manage-btn reset-btn" @click="resetToDefault">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">重置默认</span>
                    </button>
                    <button class="manage-btn import-btn" @click="importConfig">
                        <span class="btn-icon">📂</span>
                        <span class="btn-text">导入配置</span>
                    </button>
                </div>
            </div>

            <!-- 收起状态工具栏 -->
            <div class="sidebar-collapsed-tools" v-show="panelCollapsed">
                <button class="collapsed-btn" @click="launchSingle" title="发射单发">
                    <span class="btn-icon">🎇</span>
                </button>
                <button class="collapsed-btn" @click="toggleFireworks" :class="{ active: fireworksRunning }"
                    :title="fireworksRunning ? '停止连发' : '开始连发'">
                    <span class="btn-icon">{{ fireworksRunning ? '⏸️' : '▶️' }}</span>
                </button>
                <button class="collapsed-btn" @click="togglePanel" title="展开面板">
                    <span class="btn-icon">⚙️</span>
                </button>
            </div>
        </div>

        <!-- 烟花画布容器 -->
        <div ref="canvasContainer" class="canvas-container"></div>

        <!-- 发射区域预览 -->
        <div class="boundaries-preview" v-if="config.boundaries.enabled && !panelCollapsed" :style="{
            left: `${config.boundaries.x}%`,
            top: `${config.boundaries.y}%`,
            width: `${config.boundaries.width}%`,
            height: `${config.boundaries.height}%`
        }">
            <div class="preview-label">发射区域</div>
        </div>

        <!-- 浮动发射按钮 -->
        <button class="floating-launch-btn" @click="launchSingle" v-if="panelCollapsed">
            <span class="btn-emoji">🎆</span>
        </button>

        <!-- 统计面板 -->
        <div class="stats-panel" v-if="showStats">
            <div class="stats-item">
                <span class="stats-label">活跃粒子:</span>
                <span class="stats-value">{{ activeParticles }}</span>
            </div>
            <div class="stats-item">
                <span class="stats-label">帧率:</span>
                <span class="stats-value">{{ fps }} FPS</span>
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
            panelCollapsed: false,
            expandedGroup: 'basic', // 默认展开基础参数组
            fireworks: null,
            fireworksRunning: false,
            showStats: true,
            activeParticles: 0,
            fps: 60,
            lastTime: 0,
            frameCount: 0,
            currentPreset: 'center', // 当前预设位置
            statsAnimationId: null,

            colorPresets: [
                { name: '经典红黄', emoji: '🎇', gradient: 'linear-gradient(135deg, #ff0000, #ff9900)', hue: { min: 0, max: 60 } },
                { name: '冷艳蓝紫', emoji: '❄️', gradient: 'linear-gradient(135deg, #0066ff, #cc00ff)', hue: { min: 200, max: 300 } },
                { name: '森林绿意', emoji: '🌿', gradient: 'linear-gradient(135deg, #00cc66, #66ff33)', hue: { min: 100, max: 150 } },
                { name: '梦幻粉紫', emoji: '🌌', gradient: 'linear-gradient(135deg, #ff66cc, #9966ff)', hue: { min: 300, max: 330 } },
                { name: '炽热熔岩', emoji: '🔥', gradient: 'linear-gradient(135deg, #ff3300, #ffcc00)', hue: { min: 10, max: 50 } },
                { name: '霓虹炫彩', emoji: '🌈', gradient: 'linear-gradient(135deg, #ff00ff, #00ffff, #ffff00)', hue: { min: 0, max: 360 } }
            ],

            // 边界预设配置
            boundaryPresets: {
                center: { x: 50, y: 50, width: 30, height: 30 },
                left: { x: 25, y: 50, width: 20, height: 40 },
                right: { x: 75, y: 50, width: 20, height: 40 },
                top: { x: 50, y: 25, width: 40, height: 20 },
                bottom: { x: 50, y: 75, width: 40, height: 20 },
                random: { x: Math.random() * 100, y: Math.random() * 100, width: 20, height: 20 }
            },

            // 完整的 fireworks-js 配置对象（包含所有支持的选项）
            config: {
                // 基础参数
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

                // 颜色与外观
                hue: { min: 0, max: 360 },
                brightness: { min: 60, max: 90 },
                lineStyle: 'round',

                // 物理效果
                decay: { min: 0.015, max: 0.025 },

                // 发射控制
                delay: { min: 30, max: 60 },
                rocketsPoint: { min: 50, max: 50 },

                // 发射区域配置 - 新增详细配置
                boundaries: {
                    enabled: false,      // 是否启用自定义发射区域
                    x: 50,              // 水平位置 (0-100)
                    y: 50,              // 垂直位置 (0-100)
                    width: 50,          // 区域宽度 (0-100)
                    height: 50,         // 区域高度 (0-100)
                    random: true,       // 是否在区域内随机发射
                    followMouse: false  // 是否跟随鼠标
                },

                // 线条样式
                lineWidth: {
                    explosion: { min: 1, max: 3 },
                    trace: { min: 0.5, max: 1 }
                },

                // 鼠标控制
                mouse: {
                    click: true,
                    move: false,
                    max: 3
                },

                // 高级设置
                sound: false,
                soundVolume: 0.5,
                minHeight: 0,
                maxHeight: 0
            }
        }
    },
    mounted() {
        this.initFireworks()
        this.loadSavedConfig()
        this.startStatsUpdate()
        this.lastTime = performance.now()

        // 初始化发射区域
        this.initBoundaries()
    },
    beforeDestroy() {
        if (this.fireworks) {
            this.fireworks.stop()
        }
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('mousemove', this.handleMouseMoveForBoundaries)
        if (this.statsAnimationId) {
            cancelAnimationFrame(this.statsAnimationId)
        }
    },
    methods: {
        initFireworks() {
            const container = this.$refs.canvasContainer
            if (!container) return

            try {
                // 初始化配置
                const initialConfig = { ...this.config }

                // 如果启用了自定义发射区域，则应用boundaries配置
                if (this.config.boundaries.enabled) {
                    const bounds = this.calculateBoundariesPixels()
                    if (bounds) {
                        initialConfig.boundaries = bounds
                    }
                }

                this.fireworks = new Fireworks(container, initialConfig)
                window.addEventListener('resize', this.handleResize)
                console.log('🎆 Fireworks.js 已初始化 - 全功能模式')
            } catch (error) {
                console.error('初始化失败:', error)
            }
        },

        handleResize() {
            if (this.fireworks && this.config.autoresize) {
                this.fireworks.updateOptions({ autoresize: true })

                // 重新计算发射区域
                if (this.config.boundaries.enabled) {
                    this.updateBoundariesConfig()
                }
            }
        },

        // 计算边界像素值
        calculateBoundariesPixels() {
            const container = this.$refs.canvasContainer
            if (!container) return null

            const rect = container.getBoundingClientRect()
            const bounds = this.config.boundaries

            // 转换为 fireworks-js 需要的像素值格式
            return {
                x: (rect.width * bounds.x / 100) - (rect.width * bounds.width / 100 / 2),
                y: (rect.height * bounds.y / 100) - (rect.height * bounds.height / 100 / 2),
                width: rect.width * bounds.width / 100,
                height: rect.height * bounds.height / 100
            }
        },

        updateBoundariesConfig() {
            if (!this.fireworks || !this.config.boundaries.enabled) return

            const bounds = this.calculateBoundariesPixels()
            if (bounds) {
                // 更新配置
                this.fireworks.updateOptions({ boundaries: bounds })

                // 处理鼠标跟随
                if (this.config.boundaries.followMouse) {
                    this.setupMouseFollowing()
                } else {
                    window.removeEventListener('mousemove', this.handleMouseMoveForBoundaries)
                }
            }
        },

        updateFireworksConfig() {
            if (!this.fireworks) return
            this.validateConfigValues()

            // 合并配置，优先使用boundaries配置
            const updatedConfig = { ...this.config }

            // 如果启用了自定义发射区域，则应用boundaries配置
            if (this.config.boundaries.enabled) {
                const bounds = this.calculateBoundariesPixels()
                if (bounds) {
                    updatedConfig.boundaries = bounds
                }
            }

            this.fireworks.updateOptions(updatedConfig)
        },

        validateConfigValues() {
            // 确保范围值的有效性
            const ranges = [
                ['hue', 0, 360],
                ['brightness', 1, 100],
                ['decay', 0.001, 0.1],
                ['delay', 10, 500],
                ['rocketsPoint', 0, 100],
                ['lineWidth.explosion', 0.1, 10],
                ['lineWidth.trace', 0.1, 5]
            ]

            ranges.forEach(([key, minVal, maxVal]) => {
                const keys = key.split('.')
                if (keys.length === 2) {
                    const obj = this.config[keys[0]]
                    if (obj[keys[1]].min > obj[keys[1]].max) {
                        const temp = obj[keys[1]].min
                        obj[keys[1]].min = obj[keys[1]].max
                        obj[keys[1]].max = temp
                    }
                } else if (this.config[key].min > this.config[key].max) {
                    const temp = this.config[key].min
                    this.config[key].min = this.config[key].max
                    this.config[key].max = temp
                }
            })

            // 确保数值在有效范围内
            this.config.particles = Math.max(10, Math.min(500, this.config.particles))
            this.config.explosion = Math.max(1, Math.min(20, this.config.explosion))
            this.config.intensity = Math.max(10, Math.min(200, this.config.intensity))
            this.config.opacity = Math.max(0.1, Math.min(1, this.config.opacity))
            this.config.gravity = Math.max(0, Math.min(5, this.config.gravity))
            this.config.acceleration = Math.max(1, Math.min(1.5, this.config.acceleration))
            this.config.friction = Math.max(0.5, Math.min(1, this.config.friction))
            this.config.flickering = Math.max(0, Math.min(100, this.config.flickering))
            this.config.traceSpeed = Math.max(1, Math.min(30, this.config.traceSpeed))
            this.config.traceLength = Math.max(1, Math.min(20, this.config.traceLength))
            this.config.mouse.max = Math.max(1, Math.min(10, this.config.mouse.max))

            // 确保边界值在有效范围内
            if (this.config.boundaries) {
                this.config.boundaries.x = Math.max(0, Math.min(100, this.config.boundaries.x))
                this.config.boundaries.y = Math.max(0, Math.min(100, this.config.boundaries.y))
                this.config.boundaries.width = Math.max(1, Math.min(100, this.config.boundaries.width))
                this.config.boundaries.height = Math.max(1, Math.min(100, this.config.boundaries.height))
            }
        },

        startStatsUpdate() {
            const updateStats = () => {
                this.statsAnimationId = requestAnimationFrame(updateStats)

                // 更新帧率
                const currentTime = performance.now()
                this.frameCount++

                if (currentTime > this.lastTime + 1000) {
                    this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
                    this.frameCount = 0
                    this.lastTime = currentTime

                    // 这里可以添加获取活跃粒子数的逻辑
                    // 由于 fireworks-js 不直接提供这个API，我们可以估算
                    if (this.fireworksRunning) {
                        this.activeParticles = Math.floor(Math.random() * 100) + 50 // 模拟值
                    } else {
                        this.activeParticles = 0
                    }
                }
            }
            updateStats()
        },

        launchSingle() {
            if (!this.fireworks) return
            this.fireworks.launch(1)
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

        toggleGroup(group) {
            this.expandedGroup = this.expandedGroup === group ? null : group
        },

        applyColorPreset(preset) {
            this.config.hue = { ...preset.hue }
            this.updateFireworksConfig()
            this.showTempFeedback(`已应用 ${preset.name} 配色`)
        },

        // 设置边界预设
        setBoundaryPreset(presetName) {
            this.currentPreset = presetName
            const preset = this.boundaryPresets[presetName]

            // 如果是随机预设，每次点击都重新生成随机位置
            if (presetName === 'random') {
                preset.x = Math.random() * 100
                preset.y = Math.random() * 100
            }

            Object.assign(this.config.boundaries, preset)
            this.updateBoundariesConfig()
            this.showTempFeedback(`已设置发射位置: ${presetName}`)
        },

        // 初始化边界设置
        initBoundaries() {
            if (this.config.boundaries.enabled) {
                this.updateBoundariesConfig()
                if (this.config.boundaries.followMouse) {
                    this.setupMouseFollowing()
                }
            }
        },

        // 设置鼠标跟随
        setupMouseFollowing() {
            if (!this.config.boundaries.followMouse) return

            const container = this.$refs.canvasContainer
            if (!container) return

            window.addEventListener('mousemove', this.handleMouseMoveForBoundaries)
        },

        // 处理鼠标移动事件（用于边界跟随）
        handleMouseMoveForBoundaries(event) {
            if (!this.config.boundaries.followMouse || !this.fireworks) return

            const container = this.$refs.canvasContainer
            if (!container) return

            const rect = container.getBoundingClientRect()

            // 计算鼠标相对位置 (百分比)
            const xPercent = ((event.clientX - rect.left) / rect.width) * 100
            const yPercent = ((event.clientY - rect.top) / rect.height) * 100

            // 更新发射位置
            this.config.boundaries.x = Math.max(0, Math.min(100, xPercent))
            this.config.boundaries.y = Math.max(0, Math.min(100, yPercent))

            this.updateBoundariesConfig()
        },

        saveCurrentConfig() {
            try {
                const configToSave = {
                    ...this.config,
                    timestamp: new Date().toISOString()
                }
                localStorage.setItem('fireworksFullConfig', JSON.stringify(configToSave))
                this.showTempFeedback('完整配置已保存到本地')
            } catch (e) {
                console.error('保存配置失败:', e)
                this.showTempFeedback('保存失败，请检查控制台')
            }
        },

        loadSavedConfig() {
            const saved = localStorage.getItem('fireworksFullConfig')
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

        importConfig() {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.json'
            input.onchange = (e) => {
                const file = e.target.files[0]
                if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        try {
                            const config = JSON.parse(e.target.result)
                            Object.assign(this.config, config)
                            this.updateFireworksConfig()
                            this.showTempFeedback('配置导入成功')
                        } catch (error) {
                            this.showTempFeedback('配置文件格式错误')
                        }
                    }
                    reader.readAsText(file)
                }
            }
            input.click()
        },

        resetToDefault() {
            if (confirm('确定要重置所有设置为默认值吗？')) {
                const defaultConfig = {
                    // 基础参数
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

                    // 颜色与外观
                    hue: { min: 0, max: 360 },
                    brightness: { min: 60, max: 90 },
                    lineStyle: 'round',

                    // 物理效果
                    decay: { min: 0.015, max: 0.025 },

                    // 发射控制
                    delay: { min: 30, max: 60 },
                    rocketsPoint: { min: 50, max: 50 },

                    // 发射区域配置
                    boundaries: {
                        enabled: false,
                        x: 50,
                        y: 50,
                        width: 50,
                        height: 50,
                        random: true,
                        followMouse: false
                    },

                    // 线条样式
                    lineWidth: {
                        explosion: { min: 1, max: 3 },
                        trace: { min: 0.5, max: 1 }
                    },

                    // 鼠标控制
                    mouse: {
                        click: true,
                        move: false,
                        max: 3
                    },

                    // 高级设置
                    sound: false
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

/* ===== 全功能侧边栏 ===== */
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
    padding: 20px;
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
    gap: 20px;
}

/* 核心控制区 */
.core-controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 10px;
}

.core-btn {
    padding: 14px 0;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
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

.core-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-icon {
    font-size: 16px;
}

.btn-text {
    font-weight: 600;
}

/* 折叠面板容器 */
.accordion-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.accordion-group {
    background: rgba(20, 25, 50, 0.4);
    border-radius: 12px;
    border: 1px solid rgba(80, 120, 220, 0.2);
    overflow: hidden;
    transition: all 0.3s ease;
}

.accordion-group.expanded {
    background: rgba(20, 25, 50, 0.6);
    border-color: rgba(100, 150, 255, 0.4);
}

.accordion-header {
    padding: 16px 20px;
    background: rgba(30, 40, 80, 0.2);
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
}

.accordion-header:hover {
    background: rgba(30, 40, 80, 0.3);
}

.group-icon {
    font-size: 18px;
    margin-right: 12px;
}

.group-title {
    font-size: 15px;
    color: #fff;
    font-weight: 600;
    flex: 1;
}

.expand-icon {
    color: rgba(200, 220, 255, 0.7);
    font-size: 12px;
    transition: transform 0.3s ease;
}

.accordion-group.expanded .expand-icon {
    transform: rotate(90deg);
}

.accordion-content {
    padding: 20px;
    background: rgba(10, 15, 35, 0.3);
}

/* 配置网格布局 */
.config-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.config-item {
    grid-column: span 2;
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
    width: 16px;
    height: 16px;
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

/* 双滑块布局 */
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

/* 滑块辅助文字 */
.slider-helper {
    font-size: 11px;
    color: rgba(150, 180, 255, 0.7);
    text-align: center;
    margin-top: 5px;
}

/* 颜色预设 */
.color-presets {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
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

/* 发射位置预设 */
.launch-presets {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.presets-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 10px;
}

.preset-position-btn {
    padding: 8px 5px;
    border: 1px solid rgba(100, 150, 255, 0.3);
    background: rgba(40, 60, 120, 0.2);
    border-radius: 8px;
    color: rgba(200, 220, 255, 0.9);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 11px;
    text-align: center;
}

.preset-position-btn:hover {
    background: rgba(60, 100, 200, 0.3);
    transform: translateY(-1px);
}

.preset-position-btn.active {
    background: linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(0, 200, 255, 0.2));
    border-color: rgba(0, 200, 255, 0.4);
    color: #fff;
}

/* 开关组 */
.switch-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px 0;
}

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

.switch.small {
    width: 40px;
    height: 20px;
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

.switch.small .slider {
    border-radius: 20px;
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

.switch.small .slider:before {
    height: 14px;
    width: 14px;
}

input:checked+.slider {
    background: linear-gradient(90deg, #0066ff, #00aaff);
}

input:checked+.slider:before {
    transform: translateX(24px);
}

.switch.small input:checked+.slider:before {
    transform: translateX(20px);
}

/* 配置管理 */
.config-management {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.manage-btn {
    padding: 12px 0;
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

.import-btn {
    background: rgba(100, 255, 100, 0.1);
    color: #66ff66;
    border: 1px solid rgba(100, 255, 100, 0.3);
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

/* 发射区域预览 */
.boundaries-preview {
    position: absolute;
    border: 2px dashed rgba(0, 200, 255, 0.7);
    background: rgba(0, 150, 255, 0.1);
    pointer-events: none;
    z-index: 10;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.boundaries-preview:hover {
    border-color: rgba(0, 255, 200, 0.9);
    background: rgba(0, 200, 255, 0.15);
}

.preview-label {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 100, 200, 0.9);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    white-space: nowrap;
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

/* 统计面板 */
.stats-panel {
    position: fixed;
    bottom: 30px;
    left: 400px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px 20px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stats-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.stats-label {
    font-size: 12px;
    color: rgba(200, 220, 255, 0.8);
}

.stats-value {
    font-size: 13px;
    font-weight: 600;
    color: #00ffaa;
    font-family: 'Monaco', 'Courier New', monospace;
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
    .control-sidebar {
        width: 350px;
    }

    .sidebar-collapsed {
        width: 60px;
    }

    .config-grid {
        grid-template-columns: 1fr;
    }

    .config-item {
        grid-column: span 1;
    }

    .stats-panel {
        left: 370px;
    }
}

@media (max-width: 768px) {
    .control-sidebar {
        width: 320px;
    }

    .sidebar-collapsed {
        width: 50px;
    }

    .core-controls {
        grid-template-columns: 1fr;
    }

    .config-management {
        grid-template-columns: 1fr;
    }

    .presets-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .presets-buttons {
        grid-template-columns: repeat(2, 1fr);
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

    .stats-panel {
        left: 20px;
        bottom: 100px;
        width: calc(100% - 40px);
        max-width: 300px;
    }

    .boundaries-preview {
        display: none;
        /* 在移动端隐藏预览区域 */
    }
}
</style>