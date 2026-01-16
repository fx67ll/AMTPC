<template>
	<div id="fireworks-test-dashboard">
		<header class="fireworks-test-dashboard-header">
			<h1>🎆 Vue2增强版烟花表演</h1>
			<p class="subtitle">完全可定制的烟花模拟器，支持多种形状、颜色和参数调节</p>
		</header>

		<main class="fireworks-test-dashboard-content">
			<div class="intro-section">
				<h2>功能特性</h2>
				<div class="features-grid">
					<div class="feature-card">
						<div class="feature-icon">🎨</div>
						<h3>6种烟花形状</h3>
						<p>球形、心形、星形、环形、喷泉形、柳树形</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🌈</div>
						<h3>颜色定制</h3>
						<p>从预设颜色选择或使用自定义颜色</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">⚙️</div>
						<h3>参数控制</h3>
						<p>调节粒子数量、高度、大小、强度等</p>
					</div>
					<div class="feature-card">
						<div class="feature-icon">🚀</div>
						<h3>性能优化</h3>
						<p>使用粒子池技术，减少GC开销</p>
					</div>
				</div>
			</div>

			<div class="instructions">
				<h2>使用说明</h2>
				<ol>
					<li>点击左侧控制面板选择烟花类型和颜色</li>
					<li>调节参数滑块设置烟花效果</li>
					<li>点击"发射烟花"按钮或右下角🎇按钮发射烟花</li>
					<li>点击"自动发射"可以观看连续烟花表演</li>
					<li>点击"清空"按钮可以清除所有烟花效果</li>
				</ol>
			</div>
		</main>

		<!-- 烟花组件 -->
		<FireworksButton />

		<footer class="fireworks-test-dashboard-footer">
			<p>使用 Vue2 + Three.js 构建 | 粒子池优化 | 完全响应式设计</p>
		</footer>
	</div>
</template>

<script>
import FireworksButton from './FireworksButton.vue'

export default {
	name: 'FireworksTestDashboard',
	components: {
		FireworksButton
	}
}
</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	/* background: linear-gradient(135deg, #0a0a2a 0%, #1a1a3a 100%); */
	color: #fff;
	min-height: 100vh;
	overflow-x: hidden;
}

#fireworks-test-dashboard {
	min-height: 100vh;
	position: relative;
	z-index: 2;
}

.fireworks-test-dashboard-header {
	text-align: center;
	padding: 40px 20px 30px;
	background: rgba(0, 10, 30, 0.7);
	backdrop-filter: blur(10px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fireworks-test-dashboard-header h1 {
	font-size: 3.5rem;
	margin-bottom: 15px;
	background: linear-gradient(45deg, #ff6b6b, #ffa726, #4285f4, #34a853);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.subtitle {
	font-size: 1.3rem;
	color: #a0c8ff;
	max-width: 800px;
	margin: 0 auto;
	line-height: 1.6;
}

.fireworks-test-dashboard-content {
	max-width: 1200px;
	margin: 0 auto;
	padding: 40px 20px;
}

.intro-section {
	margin-bottom: 50px;
}

.intro-section h2 {
	font-size: 2.2rem;
	margin-bottom: 30px;
	text-align: center;
	color: #fff;
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 25px;
	margin-top: 30px;
}

.feature-card {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 15px;
	padding: 25px;
	text-align: center;
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
	transform: translateY(-10px);
	box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
	border-color: rgba(255, 255, 255, 0.3);
}

.feature-icon {
	font-size: 3rem;
	margin-bottom: 15px;
}

.feature-card h3 {
	font-size: 1.4rem;
	margin-bottom: 10px;
	color: #a0c8ff;
}

.feature-card p {
	color: #b0b0d0;
	line-height: 1.5;
}

.instructions {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 15px;
	padding: 30px;
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	margin-top: 40px;
}

.instructions h2 {
	font-size: 2rem;
	margin-bottom: 20px;
	color: #fff;
}

.instructions ol {
	margin-left: 20px;
	font-size: 1.1rem;
	line-height: 1.8;
}

.instructions li {
	margin-bottom: 12px;
	color: #d0d0f0;
}

.instructions li::marker {
	color: #ff6b6b;
	font-weight: bold;
}

.fireworks-test-dashboard-footer {
	text-align: center;
	padding: 30px 20px;
	color: #8888cc;
	font-size: 0.9rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	margin-top: 50px;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.fireworks-test-dashboard-header h1 {
		font-size: 2.5rem;
	}

	.subtitle {
		font-size: 1.1rem;
	}

	.features-grid {
		grid-template-columns: 1fr;
	}

	.instructions ol {
		font-size: 1rem;
	}
}

@media (max-width: 480px) {
	.fireworks-test-dashboard-header h1 {
		font-size: 2rem;
	}

	.intro-section h2,
	.instructions h2 {
		font-size: 1.8rem;
	}
}
</style>