import * as THREE from 'three';

export class ParticlePool {
  constructor(options = {}) {
    this.maxParticles = options.maxParticles || 2000;
    this.particleSize = options.particleSize || 0.3;
    this.scene = options.scene;

    // 使用 Points 系统优化性能
    this.pointsGeometry = null;
    this.pointsMaterial = null;
    this.points = null;

    // 粒子状态数组
    this.positions = null;
    this.colors = null;
    this.velocities = null;
    this.lifetimes = null;
    this.decays = null;
    this.gravities = null;
    this.activeFlags = null;
    this.rotationSpeeds = null;

    // 索引管理
    this.freeIndices = [];
    this.usedIndices = new Set();

    // 初始化
    this.initPointsSystem();
  }

  // 初始化 Points 系统
  initPointsSystem() {
    // 创建几何体
    this.pointsGeometry = new THREE.BufferGeometry();

    // 初始化属性数组
    const particleCount = this.maxParticles;

    // 位置属性（每个粒子3个值：x, y, z）
    this.positions = new Float32Array(particleCount * 3);
    this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    // 颜色属性（每个粒子3个值：r, g, b）
    this.colors = new Float32Array(particleCount * 3);
    this.pointsGeometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // 初始化状态数组
    this.velocities = new Array(particleCount);
    this.lifetimes = new Float32Array(particleCount);
    this.decays = new Float32Array(particleCount);
    this.gravities = new Float32Array(particleCount);
    this.rotationSpeeds = new Float32Array(particleCount);
    this.activeFlags = new Uint8Array(particleCount);

    // 初始化所有粒子为未激活状态
    for (let i = 0; i < particleCount; i++) {
      this.freeIndices.push(i);
      this.velocities[i] = { x: 0, y: 0, z: 0 };
      this.activeFlags[i] = 0;

      // 初始位置设置为屏幕外
      this.positions[i * 3] = 0;
      this.positions[i * 3 + 1] = -1000;
      this.positions[i * 3 + 2] = 0;

      // 初始颜色为白色
      this.colors[i * 3] = 1;
      this.colors[i * 3 + 1] = 1;
      this.colors[i * 3 + 2] = 1;
    }

    // 创建材质
    this.pointsMaterial = new THREE.PointsMaterial({
      size: this.particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // 创建 Points 对象
    this.points = new THREE.Points(this.pointsGeometry, this.pointsMaterial);
    this.scene.add(this.points);
  }

  // 获取一个粒子（返回索引）
  getParticle() {
    if (this.freeIndices.length === 0) {
      // 如果没有空闲粒子，重用最早激活的粒子
      if (this.usedIndices.size > 0) {
        const firstIndex = Array.from(this.usedIndices)[0];
        this.releaseParticleByIndex(firstIndex);
      } else {
        console.warn('No particles available in pool');
        return null;
      }
    }

    const index = this.freeIndices.pop();
    this.usedIndices.add(index);
    this.activeFlags[index] = 1;
    this.lifetimes[index] = 1.0;

    return {
      index: index,
      position: (x, y, z) => this.setParticlePosition(index, x, y, z),
      color: color => {
        // 确保颜色格式正确
        const threeColor = new THREE.Color(color);
        this.setParticleColor(index, threeColor);
      },
      setVelocity: (vx, vy, vz) => {
        if (!this.velocities[index]) {
          this.velocities[index] = { x: 0, y: 0, z: 0 };
        }
        this.velocities[index] = { x: vx, y: vy, z: vz };
      },
      setLife: (life, decay) => {
        this.lifetimes[index] = life;
        this.decays[index] = decay || 0.01;
      },
      setGravity: gravity => {
        this.gravities[index] = gravity;
      },
      setRotationSpeed: speed => {
        this.rotationSpeeds[index] = speed;
      },
    };
  }

  // 释放粒子
  releaseParticle(particleInfo) {
    if (!particleInfo || particleInfo.index === undefined) return;
    this.releaseParticleByIndex(particleInfo.index);
  }

  // 通过索引释放粒子
  releaseParticleByIndex(index) {
    if (this.activeFlags[index] === 0) return;

    // 将粒子位置设置为远离屏幕
    this.positions[index * 3] = 0;
    this.positions[index * 3 + 1] = -1000;
    this.positions[index * 3 + 2] = 0;

    // 重置颜色
    this.colors[index * 3] = 1;
    this.colors[index * 3 + 1] = 1;
    this.colors[index * 3 + 2] = 1;

    this.activeFlags[index] = 0;
    this.lifetimes[index] = 0;
    this.usedIndices.delete(index);
    this.freeIndices.push(index);

    // 标记属性需要更新
    this.pointsGeometry.attributes.position.needsUpdate = true;
    this.pointsGeometry.attributes.color.needsUpdate = true;
  }

  // 设置粒子位置
  setParticlePosition(index, x, y, z) {
    this.positions[index * 3] = x;
    this.positions[index * 3 + 1] = y;
    this.positions[index * 3 + 2] = z;
    this.pointsGeometry.attributes.position.needsUpdate = true;
  }

  // 设置粒子颜色（十六进制字符串或THREE.Color）
  setParticleColor(index, color) {
    const threeColor = color instanceof THREE.Color ? color : new THREE.Color(color);
    this.colors[index * 3] = threeColor.r;
    this.colors[index * 3 + 1] = threeColor.g;
    this.colors[index * 3 + 2] = threeColor.b;
    this.pointsGeometry.attributes.color.needsUpdate = true;
  }

  // 设置粒子速度
  setParticleVelocity(index, vx, vy, vz) {
    if (!this.velocities[index]) {
      this.velocities[index] = { x: 0, y: 0, z: 0 };
    }
    this.velocities[index] = { x: vx, y: vy, z: vz };
  }

  // 设置粒子生命周期
  setParticleLife(index, life, decay) {
    this.lifetimes[index] = life;
    this.decays[index] = decay || 0.01;
  }

  // 设置粒子重力
  setParticleGravity(index, gravity) {
    this.gravities[index] = gravity;
  }

  // 设置粒子旋转速度
  setParticleRotationSpeed(index, speed) {
    this.rotationSpeeds[index] = speed;
  }

  // 更新所有粒子
  update() {
    const positions = this.positions;
    const colors = this.colors;
    const usedIndices = this.usedIndices;

    usedIndices.forEach(index => {
      if (this.activeFlags[index] === 0) return;

      // 更新位置
      const velocity = this.velocities[index] || { x: 0, y: 0, z: 0 };
      positions[index * 3] += velocity.x;
      positions[index * 3 + 1] += velocity.y;
      positions[index * 3 + 2] += velocity.z;

      // 应用重力
      if (this.gravities[index]) {
        velocity.y -= this.gravities[index];
      }

      // 更新生命周期
      this.lifetimes[index] -= this.decays[index];

      // 检查生命周期
      const life = this.lifetimes[index];
      if (life <= 0) {
        this.releaseParticleByIndex(index);
        return;
      }

      // 根据生命周期调整透明度（通过颜色亮度模拟）
      const brightness = Math.max(0.1, life * 0.9);
      const baseR = this.colors[index * 3];
      const baseG = this.colors[index * 3 + 1];
      const baseB = this.colors[index * 3 + 2];

      // 保持原始颜色但调整亮度
      colors[index * 3] = baseR * brightness;
      colors[index * 3 + 1] = baseG * brightness;
      colors[index * 3 + 2] = baseB * brightness;
    });

    // 标记属性需要更新
    this.pointsGeometry.attributes.position.needsUpdate = true;
    this.pointsGeometry.attributes.color.needsUpdate = true;
  }

  // 更新粒子大小
  updateParticleSize(newSize) {
    this.particleSize = newSize;
    this.pointsMaterial.size = newSize;
    this.pointsMaterial.needsUpdate = true;
  }

  // 获取活跃粒子数量
  getActiveCount() {
    return this.usedIndices.size;
  }

  // 获取总粒子数量
  getTotalCount() {
    return this.maxParticles;
  }

  // 清理资源
  dispose() {
    if (this.points && this.scene) {
      this.scene.remove(this.points);
    }

    if (this.pointsGeometry) {
      this.pointsGeometry.dispose();
    }

    if (this.pointsMaterial) {
      this.pointsMaterial.dispose();
    }

    this.positions = null;
    this.colors = null;
    this.velocities = null;
    this.lifetimes = null;
    this.decays = null;
    this.gravities = null;
    this.activeFlags = null;
    this.rotationSpeeds = null;

    this.freeIndices = [];
    this.usedIndices.clear();
  }
}
