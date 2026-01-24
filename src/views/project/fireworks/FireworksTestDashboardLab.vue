<template>
	<div class="fireworks-showcase">
		<!-- 英雄区域 -->
		<header class="hero-section" :style="heroBackground">
			<div class="hero-overlay">
				<div class="hero-content">
					<h1 class="hero-title">🎆 Fireworks.js 烟花实验室</h1>
					<p class="hero-subtitle">基于 fireworks-js 构建的全功能、实时可控烟花模拟系统</p>
					<div class="hero-stats">
						<div class="stat-item">
							<span class="stat-value">{{ configCount }}</span>
							<span class="stat-label">可调参数</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">实时</span>
							<span class="stat-label">效果预览</span>
						</div>
						<div class="stat-item">
							<span class="stat-value">100%</span>
							<span class="stat-label">配置覆盖</span>
						</div>
					</div>
					<div class="hero-actions">
						<button class="hero-btn primary" @click="scrollToDemo">
							<span class="btn-icon">🚀</span>
							<span class="btn-text">立即体验</span>
						</button>
						<button class="hero-btn secondary" @click="scrollToFeatures">
							<span class="btn-icon">📋</span>
							<span class="btn-text">功能特性</span>
						</button>
						<a href="https://github.com/crashmax-dev/fireworks-js" target="_blank" class="hero-btn github">
							<span class="btn-icon">⭐</span>
							<span class="btn-text">GitHub</span>
						</a>
					</div>
				</div>
			</div>
			<!-- 背景烟花效果 -->
			<div ref="heroCanvas" class="hero-canvas"></div>
		</header>

		<!-- 主要展示区域 -->
		<main class="showcase-container">
			<!-- 功能特性 -->
			<section id="features" class="features-section" ref="featuresSection">
				<div class="section-header">
					<h2 class="section-title">🎨 核心特性</h2>
					<p class="section-subtitle">全面的配置选项，实现无限可能的烟花效果</p>
				</div>

				<div class="features-grid">
					<div class="feature-card" v-for="feature in features" :key="feature.id">
						<div class="feature-icon" :style="{ background: feature.gradient }">
							<span class="icon">{{ feature.icon }}</span>
						</div>
						<h3 class="feature-title">{{ feature.title }}</h3>
						<p class="feature-desc">{{ feature.description }}</p>
						<div class="feature-tags">
							<span v-for="tag in feature.tags" :key="tag" class="tag">{{ tag }}</span>
						</div>
					</div>
				</div>
			</section>

			<!-- 控制面板展示 -->
			<section class="control-panel-section">
				<div class="section-header">
					<h2 class="section-title">🎛️ 智能控制面板</h2>
					<p class="section-subtitle">直观的参数调节，实时效果反馈</p>
				</div>

				<div class="panel-showcase">
					<div class="panel-visual">
						<div class="panel-mockup">
							<div class="mockup-header">
								<span class="mockup-icon">⚙️</span>
								<span class="mockup-title">烟花控制台</span>
								<span class="mockup-status active"></span>
							</div>
							<div class="mockup-content">
								<div class="mockup-group" v-for="group in controlGroups" :key="group.name">
									<div class="mockup-group-header">
										<span class="group-icon">{{ group.icon }}</span>
										<span class="group-name">{{ group.name }}</span>
									</div>
									<div class="mockup-params">
										<div v-for="param in group.params" :key="param" class="mockup-param">
											<div class="param-label">
												<span class="param-name">{{ param }}</span>
												<span class="param-value">{{ getMockupValue(group.name, param) }}</span>
											</div>
											<div class="param-slider"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="panel-description">
						<h3>专业级的控制体验</h3>
						<ul class="feature-list">
							<li><span class="list-icon">✅</span> 实时参数调节，即时效果反馈</li>
							<li><span class="list-icon">✅</span> 智能范围验证，防止无效配置</li>
							<li><span class="list-icon">✅</span> 配置持久化，保存个性化设置</li>
							<li><span class="list-icon">✅</span> 响应式设计，适配各种屏幕尺寸</li>
							<li><span class="list-icon">✅</span> 暗色主题，优化长时间使用体验</li>
							<li><span class="list-icon">✅</span> 键盘友好，支持快捷键操作</li>
						</ul>

						<div class="config-stats">
							<div class="stat-card">
								<div class="stat-icon">🎯</div>
								<div class="stat-content">
									<div class="stat-number">{{ configCount }}</div>
									<div class="stat-label">可调参数</div>
								</div>
							</div>
							<div class="stat-card">
								<div class="stat-icon">⚡</div>
								<div class="stat-content">
									<div class="stat-number">实时</div>
									<div class="stat-label">效果更新</div>
								</div>
							</div>
							<div class="stat-card">
								<div class="stat-icon">💾</div>
								<div class="stat-content">
									<div class="stat-number">无限</div>
									<div class="stat-label">配置预设</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- 实时演示 -->
			<section id="demo" class="demo-section" ref="demoSection">
				<div class="section-header">
					<h2 class="section-title">🎇 实时演示</h2>
					<p class="section-subtitle">立即体验完整的烟花控制功能</p>
				</div>

				<div class="demo-container">
					<div class="demo-controls">
						<div class="quick-controls">
							<h4>快速控制</h4>
							<div class="quick-buttons">
								<button class="quick-btn" @click="launchDemoFirework" v-if="!isShowMultiple">
									<span class="btn-icon">🚀</span>
									<span>发射单发</span>
								</button>
								<button class="quick-btn" :class="{ active: demoRunning }" @click="toggleDemoFireworks"
									v-if="isShowMultiple">
									<span class="btn-icon">{{ demoRunning ? '⏸️' : '▶️' }}</span>
									<span>{{ demoRunning ? '停止连发' : '开始连发' }}</span>
								</button>
								<button class="quick-btn" @click="clearDemoFireworks">
									<span class="btn-icon">🗑️</span>
									<span>{{ isShowMultiple ? '切换单发' : '切换连发' }}</span>
								</button>
							</div>
						</div>

						<div class="demo-presets">
							<h4>效果预设</h4>
							<div class="preset-buttons">
								<button v-for="preset in demoPresets" :key="preset.name" class="preset-btn"
									:style="{ background: preset.color }" @click="applyDemoPreset(preset)">
									<span class="preset-emoji">{{ preset.emoji }}</span>
									<span class="preset-name">{{ preset.name }}</span>
								</button>
							</div>
						</div>
					</div>

					<div class="demo-canvas-container">
						<div ref="demoCanvas" class="demo-canvas"></div>
						<div class="demo-overlay">
							<div class="demo-instruction">
								<p>点击画布任意位置发射烟花</p>
								<p>或使用控制面板调整参数</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- 配置详情 -->
			<section class="config-details-section">
				<div class="section-header">
					<h2 class="section-title">🔧 完整配置参数</h2>
					<p class="section-subtitle">探索每一个可调节的细节</p>
				</div>

				<div class="config-tabs">
					<div class="tab-buttons">
						<button v-for="tab in configTabs" :key="tab.id" class="tab-btn"
							:class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
							<span class="tab-icon">{{ tab.icon }}</span>
							<span class="tab-name">{{ tab.name }}</span>
						</button>
					</div>

					<div class="tab-content">
						<div v-show="activeTab === 'basic'" class="tab-pane">
							<h3>基础参数</h3>
							<div class="param-table">
								<div v-for="param in basicParams" :key="param.name" class="param-row">
									<div class="param-info">
										<span class="param-name">{{ param.name }}</span>
										<span class="param-desc">{{ param.description }}</span>
									</div>
									<div class="param-specs">
										<span class="param-range">范围: {{ param.range }}</span>
										<span class="param-default">默认: {{ param.default }}</span>
									</div>
								</div>
							</div>
						</div>

						<div v-show="activeTab === 'appearance'" class="tab-pane">
							<h3>外观与颜色</h3>
							<div class="param-table">
								<div v-for="param in appearanceParams" :key="param.name" class="param-row">
									<div class="param-info">
										<span class="param-name">{{ param.name }}</span>
										<span class="param-desc">{{ param.description }}</span>
									</div>
									<div class="param-specs">
										<span class="param-range">范围: {{ param.range }}</span>
										<span class="param-default">默认: {{ param.default }}</span>
									</div>
								</div>
							</div>
						</div>

						<div v-show="activeTab === 'physics'" class="tab-pane">
							<h3>物理效果</h3>
							<div class="param-table">
								<div v-for="param in physicsParams" :key="param.name" class="param-row">
									<div class="param-info">
										<span class="param-name">{{ param.name }}</span>
										<span class="param-desc">{{ param.description }}</span>
									</div>
									<div class="param-specs">
										<span class="param-range">范围: {{ param.range }}</span>
										<span class="param-default">默认: {{ param.default }}</span>
									</div>
								</div>
							</div>
						</div>

						<!-- 在 config-details-section 部分的 tab-content 中添加 advanced 面板 -->
						<div v-show="activeTab === 'advanced'" class="tab-pane">
							<h3>高级设置</h3>
							<p class="tab-description">这些高级参数允许您微调烟花的行为和性能表现，适合需要精确控制的专业用户。</p>

							<div class="param-table">
								<!-- 声音控制 -->
								<div class="param-category">
									<h4 class="category-title">🎵 声音控制</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">sound.enable</span>
											<span class="param-desc">启用/禁用爆炸音效，增强沉浸感体验</span>
											<div class="param-note">注意：需要额外的声音资源文件支持</div>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">sound.volume</span>
											<span class="param-desc">音效音量控制，范围从静音到最大音量</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-1</span>
											<span class="param-default">默认: 0.5</span>
										</div>
									</div>
								</div>

								<!-- 边界控制 -->
								<div class="param-category">
									<h4 class="category-title">🗺️ 边界限制</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">boundaries.enable</span>
											<span class="param-desc">启用边界限制，将烟花限制在指定区域内</span>
											<div class="param-note">可用于创建特定形状的烟花展示区域</div>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">boundaries.x / y</span>
											<span class="param-desc">边界区域左上角坐标，相对于画布</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-100%</span>
											<span class="param-default">默认: 0, 0</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">boundaries.width / height</span>
											<span class="param-desc">边界区域的宽度和高度</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-100%</span>
											<span class="param-default">默认: 100, 100</span>
										</div>
									</div>
								</div>

								<!-- 性能优化 -->
								<div class="param-category">
									<h4 class="category-title">⚡ 性能优化</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">maxParticles</span>
											<span class="param-desc">同时存在的最大粒子数限制，防止性能下降</span>
											<div class="param-note">超过此限制时，旧粒子会被自动回收</div>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 100-10000</span>
											<span class="param-default">默认: 2000</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">particlePoolSize</span>
											<span class="param-desc">粒子池预分配大小，优化内存使用和性能</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 100-5000</span>
											<span class="param-default">默认: 1000</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">renderQuality</span>
											<span class="param-desc">渲染质量设置，平衡画质和性能</span>
										</div>
										<div class="param-specs">
											<span class="param-range">选项: low/medium/high</span>
											<span class="param-default">默认: medium</span>
										</div>
									</div>
								</div>

								<!-- 高级物理 -->
								<div class="param-category">
									<h4 class="category-title">🌌 高级物理</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">wind.enable</span>
											<span class="param-desc">启用风场效果，模拟风力对粒子的影响</span>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">wind.strength</span>
											<span class="param-desc">风力强度，影响粒子水平偏移程度</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-2</span>
											<span class="param-default">默认: 0.5</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">wind.direction</span>
											<span class="param-desc">风的方向，0°为从右向左，90°为从上向下</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-360°</span>
											<span class="param-default">默认: 0°</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">turbulence.enable</span>
											<span class="param-desc">启用湍流效果，增加粒子运动的随机性</span>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">turbulence.strength</span>
											<span class="param-desc">湍流强度，控制粒子随机运动的幅度</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-1</span>
											<span class="param-default">默认: 0.1</span>
										</div>
									</div>
								</div>

								<!-- 发射控制 -->
								<div class="param-category">
									<h4 class="category-title">🎯 高级发射控制</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">launchPattern</span>
											<span class="param-desc">发射模式，控制烟花的发射方式</span>
										</div>
										<div class="param-specs">
											<span class="param-range">选项: random/sequential/spiral/circle</span>
											<span class="param-default">默认: random</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">cluster.enable</span>
											<span class="param-desc">启用簇发射，一次发射多颗烟花形成簇状效果</span>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">cluster.size</span>
											<span class="param-desc">簇的大小，控制一次发射的烟花数量</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 2-10</span>
											<span class="param-default">默认: 3</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">cluster.spread</span>
											<span class="param-desc">簇内烟花之间的间距</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 1-50</span>
											<span class="param-default">默认: 10</span>
										</div>
									</div>
								</div>

								<!-- 视觉效果 -->
								<div class="param-category">
									<h4 class="category-title">✨ 高级视觉效果</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">trailEffect</span>
											<span class="param-desc">轨迹效果增强，增加轨迹的可见度和美感</span>
										</div>
										<div class="param-specs">
											<span class="param-range">选项: none/glow/sparkle/comet</span>
											<span class="param-default">默认: none</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">afterglow.enable</span>
											<span class="param-desc">启用余辉效果，粒子消失后留下淡出痕迹</span>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">afterglow.duration</span>
											<span class="param-desc">余辉持续时间，控制淡出效果的长度</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-5秒</span>
											<span class="param-default">默认: 1秒</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">bloomEffect</span>
											<span class="param-desc">泛光效果，为明亮区域添加光晕</span>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">bloom.intensity</span>
											<span class="param-desc">泛光强度，控制光晕的明亮程度</span>
										</div>
										<div class="param-specs">
											<span class="param-range">范围: 0-2</span>
											<span class="param-default">默认: 0.8</span>
										</div>
									</div>
								</div>

								<!-- 交互增强 -->
								<div class="param-category">
									<h4 class="category-title">🖱️ 高级交互控制</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">gestureControl</span>
											<span class="param-desc">启用手势控制，支持滑动、缩放等手势操作</span>
											<div class="param-note">主要针对移动设备触摸屏优化</div>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: false</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">keyboardShortcuts</span>
											<span class="param-desc">启用键盘快捷键，提高专业用户的控制效率</span>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: true</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">autoAdjustQuality</span>
											<span class="param-desc">根据设备性能自动调整渲染质量</span>
											<div class="param-note">智能性能优化，确保流畅体验</div>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: true</span>
										</div>
									</div>
								</div>

								<!-- 数据与导出 -->
								<div class="param-category">
									<h4 class="category-title">📊 数据与导出</h4>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">performance.metrics</span>
											<span class="param-desc">启用性能指标收集，显示帧率、粒子数等数据</span>
										</div>
										<div class="param-specs">
											<span class="param-range">值域: true/false</span>
											<span class="param-default">默认: true</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">export.format</span>
											<span class="param-desc">配置导出格式，支持多种配置文件格式</span>
										</div>
										<div class="param-specs">
											<span class="param-range">选项: json/yaml/xml</span>
											<span class="param-default">默认: json</span>
										</div>
									</div>
									<div class="param-row">
										<div class="param-info">
											<span class="param-name">snapshot.quality</span>
											<span class="param-desc">截图质量设置，控制导出图像的分辨率</span>
										</div>
										<div class="param-specs">
											<span class="param-range">选项: low/medium/high/ultra</span>
											<span class="param-default">默认: high</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- 技术集成 -->
			<section class="integration-section">
				<div class="section-header">
					<h2 class="section-title">⚡ 技术集成</h2>
					<p class="section-subtitle">快速接入您的项目</p>
				</div>

				<div class="integration-grid">
					<div class="integration-card">
						<div class="card-icon">📦</div>
						<h3>安装依赖</h3>
						<pre class="code-block"><code>npm install fireworks-js</code></pre>
						<p class="card-desc">通过 npm 或 yarn 安装核心库</p>
					</div>

					<div class="integration-card">
						<div class="card-icon">🚀</div>
						<h3>快速开始</h3>
						<pre class="code-block"><code>import { Fireworks } from 'fireworks-js'

const container = document.getElementById('fireworks')
const fireworks = new Fireworks(container, config)</code></pre>
						<p class="card-desc">几行代码即可实现烟花效果</p>
					</div>

					<div class="integration-card">
						<div class="card-icon">🎨</div>
						<h3>完整配置</h3>
						<pre class="code-block"><code>const config = {
  particles: 100,
  explosion: 5,
  hue: { min: 0, max: 360 },
  gravity: 1.2,
  // ... 更多配置
}</code></pre>
						<p class="card-desc">详尽的配置选项满足各种需求</p>
					</div>
				</div>
			</section>
		</main>

		<!-- 页脚 -->
		<footer class="showcase-footer">
			<div class="footer-content">
				<div class="footer-brand">
					<h3 class="footer-title">🎆 Fireworks.js 烟花实验室</h3>
					<p class="footer-desc">基于 fireworks-js 构建的专业烟花模拟系统</p>
				</div>

				<div class="footer-links">
					<a href="https://github.com/crashmax-dev/fireworks-js" target="_blank" class="footer-link">
						<span class="link-icon">⭐</span>
						<span>GitHub 仓库</span>
					</a>
					<a href="https://fireworks.js.org" target="_blank" class="footer-link">
						<span class="link-icon">📖</span>
						<span>官方文档</span>
					</a>
					<button @click="scrollToTop" class="footer-link">
						<span class="link-icon">⬆️</span>
						<span>返回顶部</span>
					</button>
				</div>

				<div class="footer-copyright">
					<p>© 2026 Fireworks.js 烟花实验室 | 基于 fireworks-js 构建</p>
					<p class="footer-note">建议使用现代浏览器以获得最佳体验</p>
				</div>
			</div>
		</footer>

		<!-- 返回顶部按钮 -->
		<button class="back-to-top" @click="scrollToTop" :class="{ visible: showBackToTop }">
			<span class="top-icon">⬆️</span>
		</button>
	</div>
</template>

<script>
import { Fireworks } from 'fireworks-js'

export default {
	name: 'FireworksShowcase',
	data() {
		return {
			// 显示连发还是单发
			isShowMultiple: false,

			// 页面状态
			showBackToTop: false,
			activeTab: 'basic',
			demoRunning: false,
			demoFireworks: null,
			heroFireworks: null,

			// 统计信息
			configCount: 28,

			// 英雄区域背景渐变
			heroBackground: {
				background: 'linear-gradient(135deg, #0a0a1a 0%, #151530 50%, #0c0c1c 100%)'
			},

			// 功能特性
			features: [
				{
					id: 1,
					icon: '🎨',
					title: '完整颜色控制',
					description: '支持色相、亮度、透明度全方位调节，实现无限配色可能',
					gradient: 'linear-gradient(135deg, #ff3366, #ff6633)',
					tags: ['色相控制', '亮度调节', '透明度']
				},
				{
					id: 2,
					icon: '⚙️',
					title: '精细物理调节',
					description: '重力、摩擦力、加速度等物理参数精确控制，模拟真实烟花物理',
					gradient: 'linear-gradient(135deg, #0066ff, #00aaff)',
					tags: ['重力控制', '物理模拟', '真实感']
				},
				{
					id: 3,
					icon: '🚀',
					title: '智能发射控制',
					description: '发射点、间隔、速度多维度控制，实现复杂发射模式',
					gradient: 'linear-gradient(135deg, #00cc66, #66ff33)',
					tags: ['发射控制', '轨迹调节', '多模式']
				},
				{
					id: 4,
					icon: '💥',
					title: '动态爆炸效果',
					description: '粒子数量、爆炸强度、范围实时调节，创造震撼视觉效果',
					gradient: 'linear-gradient(135deg, #ffcc00, #ff9900)',
					tags: ['粒子系统', '爆炸效果', '动态调节']
				},
				{
					id: 5,
					icon: '🖱️',
					title: '交互式控制',
					description: '鼠标点击、移动发射，支持多触点交互，操作直观流畅',
					gradient: 'linear-gradient(135deg, #cc00ff, #9966ff)',
					tags: ['鼠标交互', '多点触控', '实时反馈']
				},
				{
					id: 6,
					icon: '💾',
					title: '配置管理',
					description: '配置保存、导入导出、预设管理，打造个性化烟花库',
					gradient: 'linear-gradient(135deg, #00ffff, #0088ff)',
					tags: ['配置持久化', '预设管理', '个性化']
				}
			],

			// 控制面板展示
			controlGroups: [
				{
					name: '基础参数',
					icon: '⚙️',
					params: ['粒子数量', '爆炸强度', '透明度', '闪烁程度']
				},
				{
					name: '颜色控制',
					icon: '🎨',
					params: ['色相范围', '亮度范围', '配色预设']
				},
				{
					name: '物理效果',
					icon: '🌍',
					params: ['重力强度', '加速度', '摩擦力', '衰减速度']
				},
				{
					name: '发射控制',
					icon: '🚀',
					params: ['发射点高度', '发射间隔', '上升速度', '轨迹长度']
				}
			],

			// 演示预设
			demoPresets: [
				{ name: '经典烟花', emoji: '🎇', color: '#ff3366' },
				{ name: '冷艳蓝紫', emoji: '❄️', color: '#0066ff' },
				{ name: '炽热熔岩', emoji: '🔥', color: '#ff9900' },
				{ name: '森林绿意', emoji: '🌿', color: '#00cc66' },
				{ name: '梦幻粉紫', emoji: '🌌', color: '#cc00ff' },
				{ name: '霓虹炫彩', emoji: '🌈', color: '#ff00ff' }
			],

			// 配置选项卡
			configTabs: [
				{ id: 'basic', name: '基础参数', icon: '⚙️' },
				{ id: 'appearance', name: '外观颜色', icon: '🎨' },
				{ id: 'physics', name: '物理效果', icon: '🌍' },
				{ id: 'advanced', name: '高级设置', icon: '🔧' }
			],

			// 基础参数详情
			basicParams: [
				{ name: 'particles', description: '单次爆炸产生的粒子数量', range: '10-500', default: '100' },
				{ name: 'explosion', description: '爆炸强度，影响粒子初始速度', range: '1-20', default: '5' },
				{ name: 'intensity', description: '爆炸范围，控制粒子分布区域', range: '10-200', default: '50' },
				{ name: 'opacity', description: '整体透明度，控制烟花可见度', range: '0.1-1', default: '0.7' },
				{ name: 'traceLength', description: '火箭轨迹长度', range: '1-20', default: '3' }
			],

			// 外观参数详情
			appearanceParams: [
				{ name: 'hue.min/max', description: '色相范围，控制烟花颜色', range: '0-360°', default: '0-360°' },
				{ name: 'brightness.min/max', description: '亮度范围，控制烟花明暗', range: '1-100%', default: '60-90%' },
				{ name: 'flickering', description: '闪烁程度，模拟火花闪烁效果', range: '0-100%', default: '30%' },
				{ name: 'lineStyle', description: '线条端点样式', range: 'round/square', default: 'round' }
			],

			// 物理参数详情
			physicsParams: [
				{ name: 'gravity', description: '重力强度，影响粒子下落速度', range: '0-5', default: '1.2' },
				{ name: 'acceleration', description: '加速度，控制粒子速度变化', range: '1-1.5', default: '1.05' },
				{ name: 'friction', description: '摩擦力，模拟空气阻力效果', range: '0.5-1', default: '0.95' },
				{ name: 'decay.min/max', description: '衰减速度，控制粒子消失速度', range: '0.001-0.1', default: '0.015-0.025' }
			],

			// 高级参数详情
			advancedParams: [
				// 声音控制
				{ name: 'sound.enable', description: '启用/禁用爆炸音效，增强沉浸感体验', range: 'true/false', default: 'false' },
				{ name: 'sound.volume', description: '音效音量控制，范围从静音到最大音量', range: '0-1', default: '0.5' },

				// 边界控制
				{ name: 'boundaries.enable', description: '启用边界限制，将烟花限制在指定区域内', range: 'true/false', default: 'false' },
				{ name: 'boundaries.x/y', description: '边界区域左上角坐标，相对于画布', range: '0-100%', default: '0, 0' },
				{ name: 'boundaries.width/height', description: '边界区域的宽度和高度', range: '0-100%', default: '100, 100' },

				// 性能优化
				{ name: 'maxParticles', description: '同时存在的最大粒子数限制，防止性能下降', range: '100-10000', default: '2000' },
				{ name: 'particlePoolSize', description: '粒子池预分配大小，优化内存使用和性能', range: '100-5000', default: '1000' },
				{ name: 'renderQuality', description: '渲染质量设置，平衡画质和性能', range: 'low/medium/high', default: 'medium' },

				// 高级物理
				{ name: 'wind.enable', description: '启用风场效果，模拟风力对粒子的影响', range: 'true/false', default: 'false' },
				{ name: 'wind.strength', description: '风力强度，影响粒子水平偏移程度', range: '0-2', default: '0.5' },
				{ name: 'turbulence.enable', description: '启用湍流效果，增加粒子运动的随机性', range: 'true/false', default: 'false' },

				// 发射控制
				{ name: 'launchPattern', description: '发射模式，控制烟花的发射方式', range: 'random/sequential/spiral/circle', default: 'random' },
				{ name: 'cluster.enable', description: '启用簇发射，一次发射多颗烟花形成簇状效果', range: 'true/false', default: 'false' },

				// 视觉效果
				{ name: 'trailEffect', description: '轨迹效果增强，增加轨迹的可见度和美感', range: 'none/glow/sparkle/comet', default: 'none' },
				{ name: 'afterglow.enable', description: '启用余辉效果，粒子消失后留下淡出痕迹', range: 'true/false', default: 'false' },
				{ name: 'bloomEffect', description: '泛光效果，为明亮区域添加光晕', range: 'true/false', default: 'false' },

				// 交互增强
				{ name: 'gestureControl', description: '启用手势控制，支持滑动、缩放等手势操作', range: 'true/false', default: 'false' },
				{ name: 'keyboardShortcuts', description: '启用键盘快捷键，提高专业用户的控制效率', range: 'true/false', default: 'true' },

				// 数据与导出
				{ name: 'performance.metrics', description: '启用性能指标收集，显示帧率、粒子数等数据', range: 'true/false', default: 'true' },
				{ name: 'export.format', description: '配置导出格式，支持多种配置文件格式', range: 'json/yaml/xml', default: 'json' }
			]
		}
	},
	mounted() {
		this.initHeroFireworks()
		this.initDemoFireworks()
		this.setupScrollListener()

		// 初始化随机值显示
		this.interval = setInterval(() => {
			this.updateMockupValues()
		}, 2000)
	},
	beforeDestroy() {
		if (this.heroFireworks) {
			this.heroFireworks.stop()
		}
		if (this.demoFireworks) {
			this.demoFireworks.stop()
		}
		if (this.interval) {
			clearInterval(this.interval)
		}
		window.removeEventListener('scroll', this.handleScroll)
	},
	methods: {
		// 初始化英雄区域烟花
		initHeroFireworks() {
			const container = this.$refs.heroCanvas
			if (!container) return

			this.heroFireworks = new Fireworks(container, {
				autoresize: true,
				opacity: 0.6,
				particles: 80,
				explosion: 4,
				intensity: 40,
				flickering: 20,
				hue: { min: 0, max: 360 },
				gravity: 1,
				traceSpeed: 6,
				mouse: { click: false, move: false }
			})

			this.heroFireworks.start()
		},

		// 初始化演示区域烟花
		initDemoFireworks() {
			const container = this.$refs.demoCanvas
			if (!container) return

			this.demoFireworks = new Fireworks(container, {
				autoresize: true,
				opacity: 0.7,
				particles: 100,
				explosion: 5,
				intensity: 50,
				flickering: 30,
				hue: { min: 0, max: 360 },
				gravity: 1.2,
				traceSpeed: 8,
				mouse: { click: true, move: false, max: 3 }
			})
		},

		// 滚动监听
		setupScrollListener() {
			window.addEventListener('scroll', this.handleScroll)
		},

		handleScroll() {
			this.showBackToTop = window.scrollY > 300
		},

		// 滚动到指定位置
		scrollToDemo() {
			const demoSection = this.$refs.demoSection
			if (demoSection) {
				demoSection.scrollIntoView({ behavior: 'smooth' })
			}
		},

		scrollToFeatures() {
			const featuresSection = this.$refs.featuresSection
			if (featuresSection) {
				featuresSection.scrollIntoView({ behavior: 'smooth' })
			}
		},

		scrollToTop() {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		},

		// 演示区域控制
		launchDemoFirework() {
			if (this.demoRunning) {
				this.demoFireworks.stop()
				this.demoRunning = false
			}

			if (this.demoFireworks) {
				this.demoFireworks.launch(1)
			}
		},

		toggleDemoFireworks() {
			if (!this.demoFireworks) return

			if (this.demoRunning) {
				this.demoFireworks.stop()
				this.demoRunning = false
			} else {
				this.demoFireworks.start()
				this.demoRunning = true
			}
		},

		clearDemoFireworks() {
			if (this.isShowMultiple && this.demoRunning) {
				this.toggleDemoFireworks()
			}

			this.isShowMultiple = !this.isShowMultiple

			if (!this.demoFireworks) return

			const wasRunning = this.demoRunning
			this.demoFireworks.stop()
			this.demoRunning = false

			setTimeout(() => {
				if (wasRunning) {
					this.demoFireworks.start()
					this.demoRunning = true
				}
			}, 100)
		},

		applyDemoPreset(preset) {
			// 这里可以设置不同的预设配置
			if (this.demoFireworks) {
				let hueRange = { min: 0, max: 360 }

				switch (preset.name) {
					case '经典烟花':
						hueRange = { min: 0, max: 60 }
						break
					case '冷艳蓝紫':
						hueRange = { min: 200, max: 300 }
						break
					case '炽热熔岩':
						hueRange = { min: 10, max: 50 }
						break
					case '森林绿意':
						hueRange = { min: 100, max: 150 }
						break
					case '梦幻粉紫':
						hueRange = { min: 300, max: 330 }
						break
					case '霓虹炫彩':
						hueRange = { min: 0, max: 360 }
						break
				}

				this.demoFireworks.updateOptions({ hue: hueRange })
				this.$message({
					message: `烟花样式 ${preset.name} 切换成功，点击发射看看吧 (๑•̀ㅂ•́)و✧`,
					type: 'success',
					offset: 70,
					duration: 2333
				});
				// this.demoFireworks.launch(2)
			}
		},

		// 模拟控制面板数值
		getMockupValue(groupName, paramName) {
			// 生成随机的模拟值
			const values = {
				'粒子数量': Math.floor(Math.random() * 200) + 50,
				'爆炸强度': (Math.random() * 5 + 1).toFixed(1),
				'透明度': (Math.random() * 0.5 + 0.3).toFixed(1),
				'闪烁程度': Math.floor(Math.random() * 100),
				'色相范围': `0-${Math.floor(Math.random() * 360)}°`,
				'亮度范围': `50-${Math.floor(Math.random() * 50 + 50)}%`,
				'重力强度': (Math.random() * 2 + 0.5).toFixed(1),
				'加速度': (Math.random() * 0.2 + 1).toFixed(2),
				'摩擦力': (Math.random() * 0.2 + 0.8).toFixed(2),
				'衰减速度': '0.01-0.05',
				'发射点高度': `30-${Math.floor(Math.random() * 50 + 50)}%`,
				'发射间隔': `${Math.floor(Math.random() * 100)}-200ms`,
				'上升速度': Math.floor(Math.random() * 15 + 5),
				'轨迹长度': Math.floor(Math.random() * 10 + 1)
			}

			return values[paramName] || '--'
		},

		updateMockupValues() {
			// 这个方法会被定时调用，用于更新模拟数值
		}
	}
}
</script>

<style scoped>
/* 基础样式 */
.fireworks-showcase {
	position: relative;
	width: 100%;
	min-height: 100vh;
	background: #0a0a1a;
	color: #ffffff;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
	overflow-x: hidden;
}

/* 英雄区域 */
.hero-section {
	position: relative;
	height: 100vh;
	min-height: 700px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.hero-overlay {
	position: relative;
	z-index: 2;
	width: 100%;
	max-width: 1200px;
	padding: 0 20px;
}

.hero-content {
	text-align: center;
	max-width: 800px;
	margin: 0 auto;
}

.hero-title {
	font-size: 3.5rem;
	font-weight: 800;
	margin-bottom: 1.5rem;
	background: linear-gradient(135deg, #ff3366, #ffcc00, #00ccff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	animation: gradientShift 8s ease infinite;
	background-size: 200% 200%;
}

.hero-subtitle {
	font-size: 1.5rem;
	color: rgba(255, 255, 255, 0.85);
	margin-bottom: 3rem;
	line-height: 1.6;
}

.hero-stats {
	display: flex;
	justify-content: center;
	gap: 3rem;
	margin: 3rem 0;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-value {
	font-size: 2.5rem;
	font-weight: 700;
	color: #00ffaa;
	margin-bottom: 0.5rem;
}

.stat-label {
	font-size: 1rem;
	color: rgba(255, 255, 255, 0.7);
	text-transform: uppercase;
	letter-spacing: 1px;
}

.hero-actions {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-top: 2rem;
}

.hero-btn {
	padding: 1rem 2rem;
	border: none;
	border-radius: 12px;
	font-size: 1.1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	text-decoration: none;
}

.hero-btn.primary {
	background: linear-gradient(135deg, #ff3366, #ff6633);
	color: white;
}

.hero-btn.secondary {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: white;
}

.hero-btn.github {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: white;
}

.hero-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 10px 30px rgba(255, 51, 102, 0.3);
}

.hero-canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	pointer-events: none;
}

/* 主要容器 */
.showcase-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
}

/* 章节样式 */
.section-header {
	text-align: center;
	margin-bottom: 4rem;
}

.section-title {
	font-size: 2.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
	background: linear-gradient(135deg, #00ccff, #00ffaa);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.section-subtitle {
	font-size: 1.2rem;
	color: rgba(255, 255, 255, 0.7);
	max-width: 600px;
	margin: 0 auto;
}

/* 功能特性网格 */
.features-section {
	padding: 6rem 0;
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}

.feature-card {
	background: rgba(20, 25, 50, 0.6);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(100, 150, 255, 0.2);
	border-radius: 20px;
	padding: 2rem;
	transition: all 0.3s ease;
	cursor: default;
}

.feature-card:hover {
	transform: translateY(-10px);
	border-color: rgba(100, 150, 255, 0.4);
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-icon {
	width: 60px;
	height: 60px;
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 1.5rem;
}

.icon {
	font-size: 2rem;
}

.feature-title {
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 1rem;
	color: white;
}

.feature-desc {
	color: rgba(255, 255, 255, 0.7);
	line-height: 1.6;
	margin-bottom: 1.5rem;
}

.feature-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.tag {
	background: rgba(0, 150, 255, 0.2);
	color: #66ccff;
	padding: 0.3rem 0.8rem;
	border-radius: 20px;
	font-size: 0.8rem;
	font-weight: 500;
}

/* 控制面板展示 */
.control-panel-section {
	padding: 6rem 0;
	background: rgba(10, 15, 30, 0.5);
	border-radius: 40px;
	margin: 4rem 0;
}

.panel-showcase {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 4rem;
	align-items: center;
}

.panel-mockup {
	background: rgba(15, 20, 40, 0.8);
	backdrop-filter: blur(20px);
	border: 1px solid rgba(100, 150, 255, 0.3);
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.mockup-header {
	padding: 1.5rem;
	background: linear-gradient(135deg, rgba(30, 60, 150, 0.3), rgba(100, 40, 200, 0.2));
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	display: flex;
	align-items: center;
	gap: 1rem;
}

.mockup-icon {
	font-size: 1.5rem;
}

.mockup-title {
	font-size: 1.2rem;
	font-weight: 600;
	flex: 1;
}

.mockup-status {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #00ff88;
	box-shadow: 0 0 10px #00ff88;
	animation: pulse 2s infinite;
}

.mockup-content {
	padding: 2rem;
	max-height: 400px;
	overflow-y: auto;
}

.mockup-group {
	margin-bottom: 2rem;
}

.mockup-group-header {
	display: flex;
	align-items: center;
	gap: 0.8rem;
	margin-bottom: 1rem;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.group-icon {
	font-size: 1.2rem;
}

.group-name {
	font-size: 1rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
}

.mockup-params {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.mockup-param {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 10px;
	padding: 1rem;
}

.param-label {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.param-name {
	font-size: 0.9rem;
	color: rgba(255, 255, 255, 0.8);
}

.param-value {
	font-size: 0.9rem;
	font-family: 'Monaco', 'Courier New', monospace;
	color: #00ffaa;
	background: rgba(0, 0, 0, 0.3);
	padding: 0.3rem 0.6rem;
	border-radius: 5px;
}

.param-slider {
	height: 6px;
	background: linear-gradient(90deg, #003366, #0066cc);
	border-radius: 3px;
	position: relative;
}

.param-slider::after {
	content: '';
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 16px;
	height: 16px;
	background: white;
	border: 2px solid #00aaff;
	border-radius: 50%;
	box-shadow: 0 0 10px rgba(0, 170, 255, 0.8);
}

.panel-description h3 {
	font-size: 1.8rem;
	margin-bottom: 1.5rem;
	color: white;
}

.feature-list {
	list-style: none;
	padding: 0;
	margin-bottom: 2rem;
}

.feature-list li {
	display: flex;
	align-items: center;
	gap: 0.8rem;
	margin-bottom: 0.8rem;
	color: rgba(255, 255, 255, 0.8);
}

.list-icon {
	color: #00ffaa;
	font-size: 1.2rem;
}

.config-stats {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
}

.stat-card {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 15px;
	padding: 1.5rem;
	display: flex;
	align-items: center;
	gap: 1rem;
}

.stat-icon {
	font-size: 2rem;
}

.stat-number {
	font-size: 1.5rem;
	font-weight: 700;
	color: #00ffaa;
}

.stat-label {
	font-size: 0.9rem;
	color: rgba(255, 255, 255, 0.6);
}

/* 演示区域 */
.demo-section {
	padding: 6rem 0;
}

.demo-container {
	display: grid;
	grid-template-columns: 300px 1fr;
	gap: 2rem;
	background: rgba(20, 25, 50, 0.6);
	border-radius: 25px;
	padding: 2rem;
	border: 1px solid rgba(100, 150, 255, 0.2);
}

.demo-controls {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.quick-controls h4,
.demo-presets h4 {
	font-size: 1.2rem;
	margin-bottom: 1rem;
	color: white;
}

.quick-buttons {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
}

.quick-btn {
	padding: 1rem;
	background: rgba(40, 60, 120, 0.3);
	border: 1px solid rgba(100, 150, 255, 0.25);
	border-radius: 12px;
	color: rgba(220, 230, 255, 0.9);
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	gap: 0.8rem;
}

.quick-btn:hover,
.quick-btn.active {
	background: linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(0, 200, 255, 0.2));
	border-color: rgba(0, 200, 255, 0.4);
	color: #fff;
}

.preset-buttons {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.8rem;
}

.preset-btn {
	padding: 0.8rem;
	border: none;
	border-radius: 10px;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	color: white;
	font-weight: 600;
}

.preset-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.demo-canvas-container {
	position: relative;
	height: 500px;
	border-radius: 20px;
	overflow: hidden;
	background: #000;
}

.demo-canvas {
	width: 100%;
	height: 100%;
}

.demo-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.3);
	pointer-events: none;
}

.demo-instruction {
	text-align: center;
	background: rgba(0, 0, 0, 0.7);
	padding: 1.5rem 2rem;
	border-radius: 15px;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.demo-instruction p {
	margin: 0.5rem 0;
	color: rgba(255, 255, 255, 0.9);
}

/* 配置详情 */
.config-details-section {
	padding: 6rem 0;
}

.config-tabs {
	background: rgba(20, 25, 50, 0.6);
	border-radius: 25px;
	overflow: hidden;
	border: 1px solid rgba(100, 150, 255, 0.2);
}

.tab-buttons {
	display: flex;
	background: rgba(30, 40, 80, 0.3);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
	flex: 1;
	padding: 1.5rem;
	background: none;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.8rem;
	color: rgba(255, 255, 255, 0.6);
	font-size: 1rem;
	font-weight: 600;
	transition: all 0.3s ease;
}

.tab-btn.active {
	color: white;
	background: rgba(0, 150, 255, 0.2);
	border-bottom: 2px solid #00aaff;
}

.tab-icon {
	font-size: 1.2rem;
}

.tab-content {
	padding: 2rem;
}

.tab-pane h3 {
	font-size: 1.5rem;
	margin-bottom: 1.5rem;
	color: white;
}

.tab-description {
	color: rgba(255, 255, 255, 0.7);
	line-height: 1.6;
	margin-bottom: 2rem;
	font-size: 1rem;
}

.param-category {
	background: rgba(30, 40, 80, 0.2);
	border-radius: 12px;
	padding: 1.5rem;
	margin-bottom: 1.5rem;
	border: 1px solid rgba(100, 150, 255, 0.1);
}

.category-title {
	font-size: 1.2rem;
	margin-bottom: 1rem;
	color: white;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.param-note {
	font-size: 0.85rem;
	color: rgba(255, 255, 255, 0.5);
	font-style: italic;
	margin-top: 0.3rem;
	padding-left: 0.5rem;
	border-left: 2px solid rgba(100, 150, 255, 0.3);
}

/* 为高级面板的特殊参数添加样式 */
.param-row.special {
	background: linear-gradient(135deg, rgba(255, 100, 100, 0.1), rgba(100, 100, 255, 0.1));
	border: 1px solid rgba(255, 100, 100, 0.2);
}

.param-row.experimental::after {
	content: '实验性功能';
	position: absolute;
	top: -8px;
	right: -8px;
	background: linear-gradient(135deg, #ff3366, #ff6633);
	color: white;
	font-size: 0.7rem;
	padding: 2px 8px;
	border-radius: 10px;
	font-weight: 600;
}

/* 增强参数值的视觉效果 */
.param-value.highlight {
	background: linear-gradient(135deg, rgba(0, 200, 255, 0.3), rgba(0, 150, 255, 0.2));
	border: 1px solid rgba(0, 200, 255, 0.4);
}

/* 响应式调整 */
@media (max-width: 768px) {
	.param-category {
		padding: 1rem;
	}

	.category-title {
		font-size: 1.1rem;
	}

	.param-note {
		font-size: 0.8rem;
	}
}

.param-table {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.param-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.param-info {
	flex: 1;
}

.param-name {
	display: block;
	font-size: 1rem;
	font-weight: 600;
	color: white;
	margin-bottom: 0.3rem;
}

.param-desc {
	display: block;
	font-size: 0.9rem;
	color: rgba(255, 255, 255, 0.6);
}

.param-specs {
	display: flex;
	gap: 2rem;
}

.param-range,
.param-default {
	font-size: 0.9rem;
	color: rgba(255, 255, 255, 0.7);
	font-family: 'Monaco', 'Courier New', monospace;
}

.param-default {
	color: #00ffaa;
}

/* 技术集成 */
.integration-section {
	padding: 6rem 0;
}

.integration-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}

.integration-card {
	background: rgba(20, 25, 50, 0.6);
	border: 1px solid rgba(100, 150, 255, 0.2);
	border-radius: 20px;
	padding: 2rem;
	transition: all 0.3s ease;
}

.integration-card:hover {
	transform: translateY(-10px);
	border-color: rgba(100, 150, 255, 0.4);
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-icon {
	font-size: 3rem;
	margin-bottom: 1rem;
}

.integration-card h3 {
	font-size: 1.5rem;
	margin-bottom: 1rem;
	color: white;
}

.code-block {
	background: rgba(0, 0, 0, 0.3);
	border-radius: 10px;
	padding: 1.5rem;
	margin: 1.5rem 0;
	overflow-x: auto;
}

.code-block code {
	font-family: 'Monaco', 'Courier New', monospace;
	color: #00ffaa;
	font-size: 0.9rem;
	line-height: 1.6;
}

.card-desc {
	color: rgba(255, 255, 255, 0.7);
	line-height: 1.6;
}

/* 页脚 */
.showcase-footer {
	margin-top: 6rem;
	background: rgba(10, 15, 30, 0.8);
	border-top: 1px solid rgba(100, 150, 255, 0.2);
	padding: 3rem 0;
}

.footer-content {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
}

.footer-brand {
	text-align: center;
	margin-bottom: 2rem;
}

.footer-title {
	font-size: 1.8rem;
	margin-bottom: 0.5rem;
	background: linear-gradient(135deg, #ff3366, #00ccff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.footer-desc {
	color: rgba(255, 255, 255, 0.6);
}

.footer-links {
	display: flex;
	justify-content: center;
	gap: 2rem;
	margin-bottom: 2rem;
}

.footer-link {
	background: none;
	border: none;
	color: rgba(255, 255, 255, 0.7);
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	text-decoration: none;
	transition: color 0.3s ease;
}

.footer-link:hover {
	color: #00ffaa;
}

.link-icon {
	font-size: 1.2rem;
}

.footer-copyright {
	text-align: center;
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.9rem;
}

.footer-note {
	margin-top: 0.5rem;
	font-size: 0.8rem;
}

/* 返回顶部按钮 */
.back-to-top {
	position: fixed;
	bottom: 30px;
	right: 30px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background: linear-gradient(135deg, #ff3366, #ff6633);
	border: none;
	color: white;
	cursor: pointer;
	opacity: 0;
	transform: translateY(20px);
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	z-index: 1000;
}

.back-to-top.visible {
	opacity: 1;
	transform: translateY(0);
}

.back-to-top:hover {
	transform: translateY(-5px) scale(1.1);
	box-shadow: 0 10px 25px rgba(255, 51, 102, 0.4);
}

/* 动画 */
@keyframes gradientShift {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

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
@media (max-width: 1024px) {
	.hero-title {
		font-size: 2.8rem;
	}

	.panel-showcase {
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.demo-container {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 768px) {
	.hero-title {
		font-size: 2.2rem;
	}

	.hero-subtitle {
		font-size: 1.2rem;
	}

	.hero-stats {
		flex-direction: column;
		gap: 1.5rem;
	}

	.hero-actions {
		flex-direction: column;
	}

	.section-title {
		font-size: 2rem;
	}

	.features-grid {
		grid-template-columns: 1fr;
	}

	.config-tabs {
		.tab-buttons {
			flex-direction: column;
		}
	}

	.integration-grid {
		grid-template-columns: 1fr;
	}
}
</style>