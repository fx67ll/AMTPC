<template>
  <div class="fireworks-box" :style="containerStyle">
    <!-- 自定义按钮插槽 -->
    <slot name="button" :launchFireworks="launchFireworks" :fireworksRunning="fireworksRunning">
      <!-- 默认按钮 -->
      <button class="fireworks-button" :title="buttonTooltip" :style="buttonStyle" @click="handleButtonClick"
        @touchstart="handleTouchStart" @touchend="handleTouchEnd" v-if="isShowLaunchBtn" ref="fireworksButton">
        <span class="button-emoji">{{ buttonEmoji }}</span>
        <span v-if="showButtonText" class="button-text">{{ buttonText }}</span>

        <!-- 点击波纹效果 -->
        <span class="ripple-effect" v-if="rippleActive" :style="rippleStyle"></span>

        <!-- 点击发光效果 -->
        <span class="glow-effect" v-if="glowActive" :style="glowStyle"></span>
      </button>
    </slot>

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
    // 容器背景配置
    background: {
      type: [String, Object],
      default: () => ({
        color: 'rgba(0, 0, 0, 0.97)', // 背景颜色
        image: '', // 背景图片URL
        gradient: '', // 渐变色
        blur: false, // 是否模糊背景
        opacity: 1, // 背景透明度
      })
    },

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
          fixed: false, // 是否固定定位
        },
        // 按钮样式
        style: {
          size: 'medium', // small, medium, large, custom
          width: null, // 自定义宽度
          height: null, // 自定义高度
          color: 'gradient', // gradient, primary, secondary, custom, transparent
          customColor: null, // 自定义颜色，例如 '#ff3366'
          rounded: true, // 是否圆形按钮
          shadow: true, // 是否有阴影
          emoji: '✨', // 按钮图标，🎆
          text: '', // 按钮文字
          showText: true, // 是否显示文字
          tooltip: '', // 按钮提示，点击发射烟花
          border: false, // 是否显示边框
          borderColor: 'rgba(255, 255, 255, 0.2)', // 边框颜色
          hoverEffect: true, // 是否启用悬停效果
          pulse: false, // 是否启用脉冲动画
          clickEffect: 'ripple', // 点击效果: ripple(波纹), glow(发光), bounce(弹跳), combined(组合效果)
          rippleColor: 'rgba(255, 255, 255, 0.5)', // 波纹颜色
          clickScale: 0.92, // 点击时缩放比例
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
      default: 2333
    },

    // 发射数量
    launchCount: {
      type: Number,
      default: 1
    },

    // 是否显示发射按钮
    isShowLaunchBtn: {
      type: Boolean,
      default: true
    },

    // 是否显示发射tip
    isShowTip: {
      type: Boolean,
      default: false
    },

    // 是否启用防缩放功能
    preventZoom: {
      type: Boolean,
      default: true
    },
  },

  data() {
    return {
      fireworks: null,
      fireworksRunning: false,
      showFeedback: false,
      feedbackText: '',
      feedbackTimer: null,
      autoLaunchTimer: null,
      zoomEventHandlers: [],
      rippleActive: false,
      glowActive: false,
      rippleStyle: {},
      glowStyle: {},
      clickTimeout: null,
      isTouching: false,
      touchStartTime: 0
    }
  },

  computed: {
    // 容器样式
    containerStyle() {
      const style = {}

      // 处理不同类型的背景
      if (typeof this.background === 'string') {
        // 如果是字符串，直接作为背景色
        style.background = this.background
      } else if (typeof this.background === 'object') {
        // 如果是对象，处理各种背景配置
        const bg = this.background

        if (bg.gradient) {
          style.background = bg.gradient
        } else if (bg.image) {
          style.backgroundImage = `url(${bg.image})`
          style.backgroundSize = 'cover'
          style.backgroundPosition = 'center'
          style.backgroundRepeat = 'no-repeat'
        } else if (bg.color) {
          style.backgroundColor = bg.color
        }

        if (bg.blur) {
          style.backdropFilter = 'blur(10px)'
          style.webkitBackdropFilter = 'blur(10px)'
        }

        if (bg.opacity !== undefined) {
          style.opacity = bg.opacity
        }
      }

      return style
    },

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
      if (style.width && style.height) {
        styles.width = style.width
        styles.height = style.height
      } else {
        const sizeMap = {
          small: { width: '44px', height: '44px', fontSize: '20px' },
          medium: { width: '56px', height: '56px', fontSize: '24px' },
          large: { width: '68px', height: '68px', fontSize: '28px' },
          xlarge: { width: '80px', height: '80px', fontSize: '32px' }
        }

        const size = sizeMap[style.size] || sizeMap.medium
        Object.assign(styles, size)
      }

      // 颜色样式
      let backgroundColor = ''
      let color = 'white'

      switch (style.color) {
        case 'primary':
          backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          break
        case 'secondary':
          backgroundColor = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          break
        case 'custom':
          backgroundColor = style.customColor || 'linear-gradient(135deg, #ff3366, #ff6633)'
          break
        case 'transparent':
          backgroundColor = 'rgba(255, 255, 255, 0.1)'
          color = '#fff'
          break
        case 'gradient':
        default:
          backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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

      // 边框
      if (style.border) {
        styles.border = `2px solid ${style.borderColor || 'rgba(255, 255, 255, 0.2)'}`
      }

      // 阴影
      if (style.shadow) {
        if (style.color === 'transparent') {
          styles.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        } else {
          styles.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)'
        }
      }

      // 添加平滑过渡
      styles.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'

      // 移动端点击高亮透明
      styles.WebkitTapHighlightColor = 'transparent'
      styles.tapHighlightColor = 'transparent'

      return styles
    },

    // 按钮图标
    buttonEmoji() {
      return this.buttonConfig.style.emoji || '✨'
    },

    // 按钮文字
    buttonText() {
      return this.buttonConfig.style.text || ''
    },

    // 是否显示按钮文字
    showButtonText() {
      return this.buttonConfig.style.showText !== false
    },

    // 按钮提示
    buttonTooltip() {
      return this.buttonConfig.style.tooltip || ''
    },

    // 点击效果类型
    clickEffectType() {
      return this.buttonConfig.style.clickEffect || 'ripple'
    }
  },

  mounted() {
    this.initFireworks()

    if (this.preventZoom) {
      this.disableZoom()
    }

    // 如果启用自动发射，设置定时器
    if (this.autoLaunch) {
      this.startAutoLaunch()
    }

    // 如果启用了脉冲动画
    if (this.buttonConfig.style.pulse) {
      this.addPulseAnimation()
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

    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout)
    }

    // 移除防缩放事件监听
    this.removeZoomPrevention()

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
        console.log('✨ Fireworks.js 已初始化')
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

    // 处理按钮点击
    handleButtonClick(event) {
      // 触发点击动画效果
      this.triggerClickEffect(event)

      // 延迟执行烟花发射，让动画先完成
      this.clickTimeout = setTimeout(() => {
        this.launchFireworks()
      }, 300)
    },

    // 处理触摸开始（移动端）
    handleTouchStart(event) {
      this.isTouching = true
      this.touchStartTime = Date.now()

      // 防止移动端触摸时触发hover效果
      const button = this.$refs.fireworksButton
      if (button) {
        button.classList.add('touch-active')
      }

      // 触发点击效果，传递触摸位置
      const touch = event.touches[0]
      const rect = event.currentTarget.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      this.triggerClickEffect({ offsetX: x, offsetY: y })
    },

    // 处理触摸结束（移动端）
    handleTouchEnd(event) {
      this.isTouching = false

      // 移除触摸激活类
      const button = this.$refs.fireworksButton
      if (button) {
        button.classList.remove('touch-active')
      }

      // 触摸持续时间
      const touchDuration = Date.now() - this.touchStartTime

      // 如果是短触摸（类似点击），发射烟花
      if (touchDuration < 300) {
        this.clickTimeout = setTimeout(() => {
          this.launchFireworks()
        }, 200)
      }
    },

    // 触发点击效果
    triggerClickEffect(event) {
      const effectType = this.clickEffectType
      const button = this.$refs.fireworksButton

      if (!button) return

      // 获取点击位置
      let x, y
      if (event.offsetX !== undefined) {
        x = event.offsetX
        y = event.offsetY
      } else if (event.touches && event.touches[0]) {
        const touch = event.touches[0]
        const rect = event.currentTarget.getBoundingClientRect()
        x = touch.clientX - rect.left
        y = touch.clientY - rect.top
      } else {
        const rect = button.getBoundingClientRect()
        x = rect.width / 2
        y = rect.height / 2
      }

      // 根据效果类型执行不同的动画
      switch (effectType) {
        case 'ripple':
          this.showRippleEffect(x, y)
          break
        case 'glow':
          this.showGlowEffect(x, y)
          break
        case 'bounce':
          this.showBounceEffect()
          break
        case 'combined':
          this.showRippleEffect(x, y)
          this.showGlowEffect(x, y)
          this.showBounceEffect()
          break
        default:
          this.showRippleEffect(x, y)
      }

      // 添加缩放效果
      this.showScaleEffect()
    },

    // 显示波纹效果
    showRippleEffect(x, y) {
      const button = this.$refs.fireworksButton
      if (!button) return

      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)

      this.rippleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x - size / 2}px`,
        top: `${y - size / 2}px`,
        backgroundColor: this.buttonConfig.style.rippleColor || 'rgba(255, 255, 255, 0.5)'
      }

      this.rippleActive = true

      setTimeout(() => {
        this.rippleActive = false
      }, 600)
    },

    // 显示发光效果
    showGlowEffect(x, y) {
      const button = this.$refs.fireworksButton
      if (!button) return

      this.glowStyle = {
        left: `${x}px`,
        top: `${y}px`
      }

      this.glowActive = true

      setTimeout(() => {
        this.glowActive = false
      }, 800)
    },

    // 显示弹跳效果
    showBounceEffect() {
      const button = this.$refs.fireworksButton
      if (!button) return

      button.classList.add('bounce-animation')

      setTimeout(() => {
        button.classList.remove('bounce-animation')
      }, 300)
    },

    // 显示缩放效果
    showScaleEffect() {
      const button = this.$refs.fireworksButton
      if (!button) return

      const scale = this.buttonConfig.style.clickScale || 0.92

      button.classList.add('scale-animation')
      button.style.setProperty('--click-scale', scale)

      setTimeout(() => {
        button.classList.remove('scale-animation')
        button.style.removeProperty('--click-scale')
      }, 200)
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
    },

    // 禁止双击缩放
    disableZoom() {
      // 阻止双击放大
      const handleTouchEnd = (event) => {
        const now = Date.now();
        if (now - this.lastTouchEnd <= 300) {
          event.preventDefault();
        }
        this.lastTouchEnd = now;
      };

      // 阻止多点触控（双指缩放）
      const handleMultiTouch = (event) => {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      };

      // 阻止PC端双击
      const handleDoubleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
      };

      // 阻止键盘快捷键缩放
      const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) &&
          (event.key === '+' || event.key === '-' || event.key === '=' ||
            event.key === '0' || event.keyCode === 187 || event.keyCode === 189 ||
            event.keyCode === 48)) {
          event.preventDefault();
        }
      };

      // 阻止鼠标滚轮缩放
      const handleWheel = (event) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
        }
      };

      // 初始化时间戳
      this.lastTouchEnd = 0;

      // 添加事件监听
      const events = [
        { event: 'touchend', handler: handleTouchEnd, options: { passive: false } },
        { event: 'touchstart', handler: handleMultiTouch, options: { passive: false } },
        { event: 'touchmove', handler: handleMultiTouch, options: { passive: false } },
        { event: 'dblclick', handler: handleDoubleClick, options: { passive: false } },
        { event: 'keydown', handler: handleKeyDown, options: false },
        { event: 'wheel', handler: handleWheel, options: { passive: false } }
      ];

      events.forEach(({ event, handler, options }) => {
        document.addEventListener(event, handler, options);
        this.zoomEventHandlers.push({ event, handler });
      });
    },

    // 移除防缩放事件监听
    removeZoomPrevention() {
      this.zoomEventHandlers.forEach(({ event, handler }) => {
        document.removeEventListener(event, handler);
      });
      this.zoomEventHandlers = [];
    },

    // 添加脉冲动画
    addPulseAnimation() {
      const button = document.querySelector('.fireworks-button');
      if (button) {
        button.classList.add('pulse-animation');
      }
    },

    // 移除脉冲动画
    removePulseAnimation() {
      const button = document.querySelector('.fireworks-button');
      if (button) {
        button.classList.remove('pulse-animation');
      }
    },

    // 设置背景
    setBackground(config) {
      if (typeof config === 'string') {
        this.background = config;
      } else {
        this.background = { ...this.background, ...config };
      }
    }
  }
}
</script>

<style scoped>
.fireworks-box {
  position: relative;
  width: 100%;
  height: 100%;
  -webkit-tap-highlight-color: transparent;
  /* tap-highlight-color: transparent; */
}

/* 默认按钮样式 */
.fireworks-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform, box-shadow;
  /* 移动端点击高亮透明 */
  -webkit-tap-highlight-color: transparent;
  /* tap-highlight-color: transparent; */
  /* 防止长按菜单 */
  -webkit-touch-callout: none;
  /* 禁用文字选择 */
  -webkit-user-drag: none;
  /* user-drag: none; */
}

/* 悬停效果 */
.fireworks-button:hover:not(.touch-active) {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2) !important;
}

/* 触摸激活状态 */
.fireworks-button.touch-active {
  transform: scale(0.95);
  transition-duration: 0.1s;
}

/* 缩放动画 */
.fireworks-button.scale-animation {
  animation: scaleClick 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleClick {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(var(--click-scale, 0.92));
  }

  100% {
    transform: scale(1);
  }
}

/* 弹跳动画 */
.fireworks-button.bounce-animation {
  animation: bounceClick 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceClick {

  0%,
  100% {
    transform: scale(1);
  }

  30% {
    transform: scale(0.9);
  }

  60% {
    transform: scale(1.05);
  }

  80% {
    transform: scale(0.98);
  }
}

.fireworks-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fireworks-button:hover:not(.touch-active)::before {
  opacity: 1;
}

.button-emoji {
  font-size: inherit;
  line-height: 1;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  pointer-events: none;
}

.button-text {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
  pointer-events: none;
}

/* 波纹效果 */
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

/* 发光效果 */
.glow-effect {
  position: absolute;
  width: 0;
  height: 0;
  border-radius: 50%;
  box-shadow: 0 0 30px 15px rgba(255, 255, 255, 0.7);
  animation: glow 0.8s ease-out;
  pointer-events: none;
}

@keyframes glow {
  0% {
    transform: scale(0.1);
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 画布容器 */
.canvas-container {
  /* position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; */
  width: 100%;
  height: 100%;
  z-index: 9998;
  pointer-events: none;
  background: transparent;
}

/* 反馈消息 */
.feedback-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, rgba(0, 100, 200, 0.95), rgba(0, 80, 160, 0.95));
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 10000;
  font-size: 14px;
  animation: fadeInOut 2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* 脉冲动画 */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }

  70% {
    box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

/* 动画效果 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }

  20% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  80% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

/* 移动端优化 */
@media (hover: none) and (pointer: coarse) {
  .fireworks-button {
    /* 增大触摸目标 */
    min-width: 44px;
    min-height: 44px;
  }

  .fireworks-button:hover:not(.touch-active) {
    /* 移动端禁用悬停效果 */
    transform: none;
    box-shadow: inherit !important;
  }
}

/* 防止iOS长按菜单 */
.fireworks-button {
  -webkit-touch-callout: none;
}

/* 防止文字选择 */
.fireworks-button,
.button-emoji,
.button-text {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>