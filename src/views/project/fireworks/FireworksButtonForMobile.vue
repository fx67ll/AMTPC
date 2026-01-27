<template>
  <div class="fireworks-box" >
    <!-- 烟花发射按钮 -->
    <button class="fireworks-button" :title="buttonTooltip" :style="buttonStyle" @click="launchFireworks">
      <span class="button-emoji">{{ buttonEmoji }}</span>
      <span v-if="showButtonText" class="button-text">{{ buttonText }}</span>
    </button>

    <!-- 烟花画布容器 -->
    <div ref="canvasContainer" class="canvas-container"></div>

    <!-- 临时提示信息 -->
    <div v-if="showFeedback && isShowTip" class="feedback-message">{{ feedbackText }}</div>
  </div>
</template>

<script>
import { Fireworks } from 'fireworks-js'

export default {
  name: 'FireworksButtonForMobile',

  props: {
    // 按钮配置
    buttonConfig: {
      type: Object,
      default: () => ({
        // 按钮位置
        position: {
          top: 'auto',
          right: '20px',
          bottom: '20px',
          left: 'auto',
          fixed: true, // 是否固定定位
        },
        // 按钮样式
        style: {
          size: 'medium', // small, medium, large
          color: 'gradient', // gradient, primary, secondary, custom
          customColor: null, // 自定义颜色，例如 '#ff3366'
          rounded: true, // 是否圆形按钮
          shadow: true, // 是否有阴影
          emoji: '🎆', // 按钮图标
          text: '发射烟花', // 按钮文字
          showText: true, // 是否显示文字
          tooltip: '点击发射烟花', // 按钮提示
        }
      })
    },

    // 烟花配置
    fireworksConfig: {
      type: Object,
      default: () => ({
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
        autoresize: true,
        boundaries: {
          x: 50,
          y: 50,
          width: 50,
          height: 50
        },
        minHeight: 0,
        maxHeight: 0
      })
    },

    // 自动发射
    autoLaunch: {
      type: Boolean,
      default: false
    },

    // 自动发射间隔(毫秒)
    autoLaunchInterval: {
      type: Number,
      default: 3000
    },

    // 发射数量
    launchCount: {
      type: Number,
      default: 1
    },

    // 是否显示发射tip
    isShowTip: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      fireworks: null,
      fireworksRunning: false,
      showFeedback: false,
      feedbackText: '',
      feedbackTimer: null,
      autoLaunchTimer: null
    }
  },

  computed: {
    // 按钮样式
    buttonStyle() {
      const position = this.buttonConfig.position
      const style = this.buttonConfig.style
      const styles = {}

      // 位置样式
      if (position.fixed) {
        styles.position = 'fixed'
        styles.zIndex = '9999'
      } else {
        styles.position = 'absolute'
      }

      if (position.top !== 'auto') styles.top = position.top
      if (position.right !== 'auto') styles.right = position.right
      if (position.bottom !== 'auto') styles.bottom = position.bottom
      if (position.left !== 'auto') styles.left = position.left

      // 大小样式
      const sizeMap = {
        small: { width: '50px', height: '50px', fontSize: '24px' },
        medium: { width: '70px', height: '70px', fontSize: '28px' },
        large: { width: '90px', height: '90px', fontSize: '32px' }
      }

      const size = sizeMap[style.size] || sizeMap.medium
      Object.assign(styles, size)

      // 颜色样式
      let backgroundColor = ''
      let color = 'white'

      switch (style.color) {
        case 'primary':
          backgroundColor = '#0066ff'
          break
        case 'secondary':
          backgroundColor = '#ff3366'
          break
        case 'custom':
          backgroundColor = style.customColor || '#ff3366'
          break
        case 'gradient':
        default:
          backgroundColor = 'linear-gradient(135deg, #ff3366, #ff6633)'
          break
      }

      styles.background = backgroundColor
      styles.color = color

      // 圆角
      if (style.rounded) {
        styles.borderRadius = '50%'
      } else {
        styles.borderRadius = '12px'
      }

      // 阴影
      if (style.shadow) {
        styles.boxShadow = '0 8px 25px rgba(255, 50, 100, 0.4)'
      }

      return styles
    },

    // 按钮图标
    buttonEmoji() {
      return this.buttonConfig.style.emoji || '🎆'
    },

    // 按钮文字
    buttonText() {
      return this.buttonConfig.style.text || '发射烟花'
    },

    // 是否显示按钮文字
    showButtonText() {
      return this.buttonConfig.style.showText !== false
    },

    // 按钮提示
    buttonTooltip() {
      return this.buttonConfig.style.tooltip || '点击发射烟花'
    }
  },

  mounted() {
    this.initFireworks()

    // 如果启用自动发射，设置定时器
    if (this.autoLaunch) {
      this.startAutoLaunch()
    }
  },

  beforeDestroy() {
    // 清理资源
    if (this.fireworks) {
      this.fireworks.stop()
    }

    if (this.autoLaunchTimer) {
      clearInterval(this.autoLaunchTimer)
    }

    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer)
    }

    window.removeEventListener('resize', this.handleResize)
  },

  watch: {
    // 监听烟花配置变化
    fireworksConfig: {
      deep: true,
      handler(newConfig) {
        if (this.fireworks) {
          this.fireworks.updateOptions(newConfig)
        }
      }
    },

    // 监听自动发射配置变化
    autoLaunch(newVal) {
      if (newVal) {
        this.startAutoLaunch()
      } else {
        this.stopAutoLaunch()
      }
    },

    // 监听自动发射间隔变化
    autoLaunchInterval(newVal) {
      if (this.autoLaunch) {
        this.stopAutoLaunch()
        this.startAutoLaunch()
      }
    }
  },

  methods: {
    // 初始化烟花
    initFireworks() {
      const container = this.$refs.canvasContainer
      if (!container) return

      try {
        this.fireworks = new Fireworks(container, this.fireworksConfig)
        window.addEventListener('resize', this.handleResize)
        console.log('🎆 Fireworks.js 已初始化')
      } catch (error) {
        console.error('烟花初始化失败:', error)
      }
    },

    // 处理窗口大小变化
    handleResize() {
      if (this.fireworks && this.fireworksConfig.autoresize) {
        this.fireworks.updateOptions({ autoresize: true })
      }
    },

    // 发射烟花
    launchFireworks() {
      if (!this.fireworks) return

      this.fireworks.launch(this.launchCount)
      this.showFeedbackMessage('烟花发射！')

      // 触发发射事件
      this.$emit('fireworks-launched', {
        count: this.launchCount,
        timestamp: new Date().toISOString(),
        config: this.fireworksConfig
      })
    },

    // 开始自动发射
    startAutoLaunch() {
      if (this.autoLaunchTimer) {
        clearInterval(this.autoLaunchTimer)
      }

      this.autoLaunchTimer = setInterval(() => {
        this.launchFireworks()
      }, this.autoLaunchInterval)

      this.showFeedbackMessage('自动发射已开启')
    },

    // 停止自动发射
    stopAutoLaunch() {
      if (this.autoLaunchTimer) {
        clearInterval(this.autoLaunchTimer)
        this.autoLaunchTimer = null
        this.showFeedbackMessage('自动发射已停止')
      }
    },

    // 显示反馈消息
    showFeedbackMessage(text) {
      this.feedbackText = text
      this.showFeedback = true

      if (this.feedbackTimer) {
        clearTimeout(this.feedbackTimer)
      }

      this.feedbackTimer = setTimeout(() => {
        this.showFeedback = false
      }, 2000)
    },

    // 开始连续发射
    startFireworks() {
      if (!this.fireworks) return

      this.fireworks.start()
      this.fireworksRunning = true
      this.$emit('fireworks-started')
    },

    // 停止连续发射
    stopFireworks() {
      if (!this.fireworks) return

      this.fireworks.stop()
      this.fireworksRunning = false
      this.$emit('fireworks-stopped')
    },

    // 清空烟花
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

      this.$emit('fireworks-cleared')
    },

    // 更新烟花配置
    updateFireworksConfig(config) {
      if (!this.fireworks) return

      const newConfig = { ...this.fireworksConfig, ...config }
      this.fireworks.updateOptions(newConfig)

      // 触发配置更新事件
      this.$emit('fireworks-config-updated', newConfig)
    }
  }
}
</script>

<style scoped>
.fireworks-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.97);
}

/* 烟花按钮样式 */
.fireworks-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  outline: none;
  user-select: none;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.fireworks-button:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(255, 50, 100, 0.6) !important;
}

.fireworks-button:active {
  transform: scale(0.95);
}

.button-emoji {
  font-size: inherit;
  line-height: 1;
}

.button-text {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

/* 画布容器 */
.canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
  pointer-events: none;
  background: transparent;
}

/* 反馈消息 */
.feedback-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 100, 200, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 10000;
  font-size: 14px;
  animation: fadeInOut 2s ease;
}

/* 动画效果 */
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