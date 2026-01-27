<template>
    <div id="app">
        <h1>我的网站</h1>
        <p>这是一个带有烟花效果的页面</p>

        <!-- 使用烟花组件 -->
        <fireworks-button :button-config="buttonConfig" :fireworks-config="fireworksConfig" :auto-launch="true"
            :auto-launch-interval="5000" @fireworks-launched="onFireworksLaunched" />
    </div>
</template>

<script>
import FireworksButton from './FireworksButton.vue'

export default {
    name: 'FireworksTestDashboard',
    components: {
        FireworksButton
    },
    data() {
        return {
            // 按钮配置
            buttonConfig: {
                position: {
                    top: 'auto',
                    right: '30px',
                    bottom: '30px',
                    left: 'auto',
                    fixed: true
                },
                style: {
                    size: 'medium',
                    color: 'gradient',
                    rounded: true,
                    shadow: true,
                    emoji: '🎆',
                    text: '发射烟花',
                    showText: true,
                    tooltip: '点击发射烟花效果'
                }
            },

            // 烟花配置
            fireworksConfig: {
                opacity: 0.8,
                particles: 150,
                explosion: 6,
                intensity: 70,
                hue: { min: 0, max: 360 },
                brightness: { min: 70, max: 100 },
                gravity: 1.5,
                traceSpeed: 10,
                flickering: 50,
                lineStyle: 'round',
                mouse: {
                    click: true,
                    move: false,
                    max: 5
                }
            }
        }
    },
    methods: {
        onFireworksLaunched(event) {
            console.log('烟花发射了:', event)
        }
    }
}
</script>