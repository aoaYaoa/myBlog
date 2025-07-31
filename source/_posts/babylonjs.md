---
title: BabylonJS
date: 2025-07-31
tags:
  - BabylonJS
cover: /img/babylonjs.png
---
# BabylonJS 完整离线开发指南

## 📋 目录

- [BabylonJS 完整离线开发指南](#babylonjs-完整离线开发指南)
  - [📋 目录](#-目录)
  - [🚀 BabylonJS 简介](#-babylonjs-简介)
  - [💻 离线环境配置](#-离线环境配置)
  - [🎯 核心概念](#-核心概念)
  - [🎬 Engine 引擎详解](#-engine-引擎详解)
  - [🎭 Scene 场景详解](#-scene-场景详解)
  - [📷 Camera 相机系统详解](#-camera-相机系统详解)
  - [💡 Light 光照系统详解](#-light-光照系统详解)
  - [🎨 Material 材质系统详解](#-material-材质系统详解)
  - [🎭 Mesh 网格系统详解](#-mesh-网格系统详解)
  - [🎬 Animation 动画系统详解](#-animation-动画系统详解)
  - [🎆 ParticleSystem 粒子系统详解](#-particlesystem-粒子系统详解)
  - [🔊 Audio 音频系统详解](#-audio-音频系统详解)
  - [🎮 Input 输入系统详解](#-input-输入系统详解)
  - [🔧 Asset 资源管理详解](#-asset-资源管理详解)
  - [⚡ Performance 性能优化详解](#-performance-性能优化详解)
  - [🎯 最佳实践](#-最佳实践)

## 🚀 BabylonJS 简介

BabylonJS 是一个强大的 3D JavaScript 引擎，用于在浏览器中创建令人惊叹的 3D 体验。它支持 WebGL、WebGPU 和 WebXR，为开发者提供了完整的 3D 开发工具链。

### 核心特性

- **跨平台支持** - Web、移动端、桌面应用
- **现代渲染** - WebGL 2.0、WebGPU 支持
- **完整工具链** - 编辑器、调试器、优化工具
- **丰富生态** - 插件系统、社区资源
- **高性能** - 优化的渲染管线和内存管理

## 💻 离线环境配置

### Vite 配置

```javascript
// vite.config.js - BabylonJS离线开发配置
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  define: {
    BABYLON_BASE_URL: JSON.stringify('/babylon/'),
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      external: [],
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  optimizeDeps: {
    include: [
      '@babylonjs/core',
      '@babylonjs/loaders',
      '@babylonjs/materials',
      '@babylonjs/post-processes',
    ],
  },
  worker: {
    format: 'es',
  },
})
```

### 项目结构

```
project/
├── public/
│   ├── models/          # 3D模型文件
│   ├── textures/        # 纹理贴图
│   ├── sounds/          # 音频文件
│   └── environments/    # 环境贴图
├── src/
│   ├── babylon/
│   │   ├── engine.js    # 引擎配置
│   │   ├── scene.js     # 场景管理
│   │   ├── cameras.js   # 相机控制
│   │   ├── lights.js    # 光照设置
│   │   ├── materials.js # 材质管理
│   │   ├── meshes.js    # 网格操作
│   │   └── animations.js # 动画控制
│   └── main.js
└── package.json
```

### 依赖安装

```json
{
  "dependencies": {
    "@babylonjs/core": "^6.0.0",
    "@babylonjs/loaders": "^6.0.0",
    "@babylonjs/materials": "^6.0.0",
    "@babylonjs/post-processes": "^6.0.0",
    "@babylonjs/procedural-textures": "^6.0.0",
    "@babylonjs/serializers": "^6.0.0",
    "@babylonjs/node-geometry-editor": "^6.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0"
  }
}
```

### 基础初始化

```javascript
// main.js - BabylonJS基础初始化
import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, MeshBuilder } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

// 离线环境配置
window.BABYLON_BASE_URL = '/babylon/'

class BabylonApp {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.engine = null
    this.scene = null

    this.init()
  }

  async init() {
    // 创建引擎
    this.engine = new Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    })

    // 创建场景
    this.scene = new Scene(this.engine)

    // 设置基础场景
    await this.createScene()

    // 启动渲染循环
    this.startRenderLoop()

    // 处理窗口大小变化
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }

  async createScene() {
    // 创建相机
    const camera = new FreeCamera('camera', new Vector3(0, 5, -10), this.scene)
    camera.setTarget(Vector3.Zero())
    camera.attachControls(this.canvas, true)

    // 创建光源
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7

    // 创建基础几何体
    const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, this.scene)
    sphere.position.y = 1

    const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, this.scene)
  }

  startRenderLoop() {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  dispose() {
    this.scene?.dispose()
    this.engine?.dispose()
  }
}

// 启动应用
const app = new BabylonApp('babylonCanvas')
```

## 🎯 核心概念

### 坐标系统

```javascript
// BabylonJS坐标系统详解
class CoordinateSystem {
  constructor(scene) {
    this.scene = scene
  }

  // 右手坐标系
  // X轴: 向右为正
  // Y轴: 向上为正
  // Z轴: 向前为正（朝向观察者）
  createCoordinateAxes() {
    const axisLength = 5

    // X轴 - 红色
    const xAxis = MeshBuilder.CreateCylinder(
      'xAxis',
      {
        height: axisLength,
        diameterTop: 0.1,
        diameterBottom: 0.1,
      },
      this.scene,
    )
    xAxis.rotation.z = -Math.PI / 2
    xAxis.position.x = axisLength / 2
    xAxis.material = this.createAxisMaterial('red')

    // Y轴 - 绿色
    const yAxis = MeshBuilder.CreateCylinder(
      'yAxis',
      {
        height: axisLength,
        diameterTop: 0.1,
        diameterBottom: 0.1,
      },
      this.scene,
    )
    yAxis.position.y = axisLength / 2
    yAxis.material = this.createAxisMaterial('green')

    // Z轴 - 蓝色
    const zAxis = MeshBuilder.CreateCylinder(
      'zAxis',
      {
        height: axisLength,
        diameterTop: 0.1,
        diameterBottom: 0.1,
      },
      this.scene,
    )
    zAxis.rotation.x = Math.PI / 2
    zAxis.position.z = axisLength / 2
    zAxis.material = this.createAxisMaterial('blue')

    return { xAxis, yAxis, zAxis }
  }

  createAxisMaterial(color) {
    const material = new StandardMaterial(`${color}Material`, this.scene)
    material.diffuseColor = Color3.FromHexString(
      color === 'red' ? '#ff0000' : color === 'green' ? '#00ff00' : '#0000ff',
    )
    material.emissiveColor = material.diffuseColor.clone()
    return material
  }

  // 位置变换
  transformPosition() {
    // 本地坐标到世界坐标
    const mesh = MeshBuilder.CreateBox('box', { size: 1 }, this.scene)
    const localPosition = new Vector3(1, 0, 0)
    const worldPosition = Vector3.TransformCoordinates(localPosition, mesh.getWorldMatrix())

    // 世界坐标到本地坐标
    const worldToLocal = Vector3.TransformCoordinates(
      worldPosition,
      Matrix.Invert(mesh.getWorldMatrix()),
    )

    console.log('Local:', localPosition)
    console.log('World:', worldPosition)
    console.log('Back to Local:', worldToLocal)

    return { localPosition, worldPosition, worldToLocal }
  }

  // 旋转变换
  transformRotation() {
    const mesh = MeshBuilder.CreateBox('rotatedBox', { size: 1 }, this.scene)

    // 欧拉角设置
    mesh.rotation = new Vector3(Math.PI / 4, Math.PI / 6, 0)

    // 四元数设置
    mesh.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 4, Math.PI / 6, 0)

    // 从一个方向旋转到另一个方向
    const fromDirection = Vector3.Forward()
    const toDirection = new Vector3(1, 1, 0).normalize()
    const rotation = Quaternion.FromLookRotation(toDirection, Vector3.Up())
    mesh.rotationQuaternion = rotation

    return mesh
  }

  // 缩放变换
  transformScale() {
    const mesh = MeshBuilder.CreateBox('scaledBox', { size: 1 }, this.scene)

    // 统一缩放
    mesh.scaling = new Vector3(2, 2, 2)

    // 非统一缩放
    mesh.scaling = new Vector3(2, 1, 0.5)

    return mesh
  }
}
```

### 数学工具

```javascript
// BabylonJS数学工具集
class MathUtils {
  // Vector3 详解
  static vector3Examples() {
    // 创建向量
    const v1 = new Vector3(1, 2, 3)
    const v2 = Vector3.Zero() // (0, 0, 0)
    const v3 = Vector3.One() // (1, 1, 1)
    const v4 = Vector3.Up() // (0, 1, 0)
    const v5 = Vector3.Forward() // (0, 0, 1)
    const v6 = Vector3.Right() // (1, 0, 0)

    // 向量运算
    const sum = v1.add(v2) // 向量加法
    const diff = v1.subtract(v2) // 向量减法
    const scaled = v1.scale(2) // 标量乘法
    const dot = Vector3.Dot(v1, v2) // 点积
    const cross = Vector3.Cross(v1, v2) // 叉积

    // 向量属性
    const length = v1.length() // 向量长度
    const lengthSq = v1.lengthSquared() // 长度平方
    const normalized = v1.normalize() // 单位向量
    const distance = Vector3.Distance(v1, v2) // 两点距离

    // 向量插值
    const lerp = Vector3.Lerp(v1, v2, 0.5) // 线性插值
    const slerp = Vector3.Slerp(v1, v2, 0.5) // 球面插值
    const hermite = Vector3.Hermite(v1, v2, v3, v4, 0.5) // Hermite插值

    return { v1, v2, sum, diff, scaled, dot, cross, length, normalized, lerp }
  }

  // Matrix 详解
  static matrixExamples() {
    // 创建矩阵
    const identity = Matrix.Identity() // 单位矩阵
    const translation = Matrix.Translation(1, 2, 3) // 平移矩阵
    const rotationX = Matrix.RotationX(Math.PI / 4) // X轴旋转
    const rotationY = Matrix.RotationY(Math.PI / 4) // Y轴旋转
    const rotationZ = Matrix.RotationZ(Math.PI / 4) // Z轴旋转
    const scaling = Matrix.Scaling(2, 2, 2) // 缩放矩阵

    // 复合变换
    const trs = Matrix.Compose(
      new Vector3(2, 2, 2), // 缩放
      Quaternion.FromEulerAngles(0, Math.PI / 4, 0), // 旋转
      new Vector3(1, 2, 3), // 平移
    )

    // 矩阵运算
    const multiplied = translation.multiply(rotationY)
    const inverted = Matrix.Invert(trs)
    const transposed = Matrix.Transpose(trs)

    // 从矩阵提取信息
    const decomposed = trs.decompose()
    const { scaling: s, rotation: r, translation: t } = decomposed

    return { identity, translation, trs, multiplied, inverted, decomposed }
  }

  // Quaternion 详解
  static quaternionExamples() {
    // 创建四元数
    const identity = Quaternion.Identity() // 单位四元数
    const fromEuler = Quaternion.FromEulerAngles(Math.PI / 4, Math.PI / 6, 0)
    const fromAxis = Quaternion.RotationAxis(Vector3.Up(), Math.PI / 4)
    const fromYawPitchRoll = Quaternion.RotationYawPitchRoll(Math.PI / 4, Math.PI / 6, 0)

    // 四元数运算
    const multiplied = fromEuler.multiply(fromAxis)
    const conjugate = Quaternion.Conjugate(fromEuler)
    const inverse = Quaternion.Inverse(fromEuler)

    // 四元数插值
    const slerp = Quaternion.Slerp(fromEuler, fromAxis, 0.5)

    // 转换
    const toEuler = fromEuler.toEulerAngles()
    const toMatrix = fromEuler.toRotationMatrix()

    // 方向计算
    const forward = Vector3.Forward()
    const rotatedForward = forward.applyRotationQuaternion(fromEuler)

    return { identity, fromEuler, multiplied, slerp, toEuler, rotatedForward }
  }

  // Color 详解
  static colorExamples() {
    // 创建颜色
    const red = Color3.Red() // (1, 0, 0)
    const green = Color3.Green() // (0, 1, 0)
    const blue = Color3.Blue() // (0, 0, 1)
    const white = Color3.White() // (1, 1, 1)
    const black = Color3.Black() // (0, 0, 0)
    const custom = new Color3(0.5, 0.7, 0.9) // 自定义RGB

    // 从十六进制创建
    const fromHex = Color3.FromHexString('#ff6600')

    // 从HSV创建
    const fromHSV = Color3.FromHSV(120, 0.8, 0.9) // 色相、饱和度、明度

    // 颜色运算
    const added = red.add(green) // 颜色加法
    const scaled = red.scale(0.5) // 颜色缩放
    const lerp = Color3.Lerp(red, blue, 0.5) // 颜色插值

    // Color4 (带透明度)
    const transparent = new Color4(1, 0, 0, 0.5) // 半透明红色
    const fromColor3 = new Color4(red.r, red.g, red.b, 1.0)

    // 颜色转换
    const toHex = red.toHexString() // 转为十六进制
    const toHSV = red.toHSV() // 转为HSV

    return { red, fromHex, fromHSV, added, lerp, transparent, toHex }
  }
}
```

## 🎬 Engine 引擎详解

```javascript
// Engine 引擎系统完整配置
class EngineManager {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.engine = null
    this.engineOptions = this.getDefaultOptions(options)

    this.init()
  }

  getDefaultOptions(userOptions) {
    return Object.assign(
      {
        // antialias: boolean - 抗锯齿
        antialias: true,

        // preserveDrawingBuffer: boolean - 保留绘制缓冲区
        preserveDrawingBuffer: true,

        // stencil: boolean - 启用模板缓冲区
        stencil: true,

        // alpha: boolean - 启用透明度
        alpha: false,

        // premultipliedAlpha: boolean - 预乘透明度
        premultipliedAlpha: false,

        // powerPreference: string - GPU功耗偏好
        powerPreference: 'high-performance', // 'default', 'high-performance', 'low-power'

        // failIfMajorPerformanceCaveat: boolean - 性能警告时失败
        failIfMajorPerformanceCaveat: false,

        // doNotHandleContextLost: boolean - 不处理上下文丢失
        doNotHandleContextLost: false,

        // audioEngine: boolean - 启用音频引擎
        audioEngine: true,

        // disableWebGL2Support: boolean - 禁用WebGL2
        disableWebGL2Support: false,

        // xrCompatible: boolean - WebXR兼容
        xrCompatible: false,

        // useHighPrecisionFloats: boolean - 使用高精度浮点数
        useHighPrecisionFloats: false,
      },
      userOptions,
    )
  }

  init() {
    try {
      // 创建引擎
      this.engine = new Engine(this.canvas, this.engineOptions.antialias, this.engineOptions)

      // 设置引擎属性
      this.configureEngine()

      // 绑定事件
      this.bindEvents()

      console.log('BabylonJS Engine 初始化成功')
      console.log('WebGL版本:', this.engine.webGLVersion)
      console.log('GPU信息:', this.getGPUInfo())
    } catch (error) {
      console.error('引擎初始化失败:', error)
      this.handleInitError(error)
    }
  }

  configureEngine() {
    // 设置渲染精度
    // 作用: 控制渲染精度，影响性能和质量
    this.engine.setHardwareScalingLevel(1.0) // 1.0 = 原生分辨率，0.5 = 一半分辨率

    // 设置视口
    // 作用: 定义渲染区域
    this.engine.setViewport(new Viewport(0, 0, 1, 1))

    // 启用自适应设备像素比
    // 作用: 自动适配高DPI显示器
    this.engine.enableAdaptiveDevicePixelRatio = true

    // 设置最大纹理大小
    // 作用: 限制纹理大小，防止内存溢出
    this.engine.getCaps().maxTextureSize = Math.min(this.engine.getCaps().maxTextureSize, 4096)

    // 启用深度测试
    // 作用: 正确处理物体前后关系
    this.engine.setDepthFunction(Engine.LEQUAL)

    // 设置默认材质
    // 作用: 为没有材质的网格提供默认材质
    this.engine.createDefaultRenderingPipeline = true
  }

  bindEvents() {
    // 上下文丢失事件
    this.engine.onContextLostObservable.add(() => {
      console.warn('WebGL上下文丢失')
      this.handleContextLost()
    })

    // 上下文恢复事件
    this.engine.onContextRestoredObservable.add(() => {
      console.log('WebGL上下文已恢复')
      this.handleContextRestored()
    })

    // 开始渲染事件
    this.engine.onBeginFrameObservable.add(() => {
      this.onBeginFrame()
    })

    // 结束渲染事件
    this.engine.onEndFrameObservable.add(() => {
      this.onEndFrame()
    })

    // 窗口大小变化
    window.addEventListener('resize', () => {
      this.handleResize()
    })

    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange()
    })
  }

  // 渲染循环管理
  startRenderLoop(scene) {
    this.engine.runRenderLoop(() => {
      if (scene.activeCamera) {
        scene.render()
      }
    })
  }

  stopRenderLoop() {
    this.engine.stopRenderLoop()
  }

  // 性能监控
  enablePerformanceMonitoring() {
    // FPS监控
    const fpsCounter = document.createElement('div')
    fpsCounter.style.position = 'absolute'
    fpsCounter.style.top = '10px'
    fpsCounter.style.left = '10px'
    fpsCounter.style.color = 'white'
    fpsCounter.style.fontFamily = 'monospace'
    fpsCounter.style.backgroundColor = 'rgba(0,0,0,0.5)'
    fpsCounter.style.padding = '5px'
    document.body.appendChild(fpsCounter)

    this.engine.onEndFrameObservable.add(() => {
      const fps = this.engine.getFps()
      const deltaTime = this.engine.getDeltaTime()
      fpsCounter.textContent = `FPS: ${fps.toFixed(1)} | Delta: ${deltaTime.toFixed(2)}ms`
    })

    // 性能分析
    this.engine.enablePerformanceMonitoring = true
  }

  // 获取引擎信息
  getEngineInfo() {
    const caps = this.engine.getCaps()

    return {
      // 基础信息
      webGLVersion: this.engine.webGLVersion,
      isWebGL2: this.engine.isWebGL2,

      // 硬件信息
      maxTextureSize: caps.maxTextureSize,
      maxCubeTextureSize: caps.maxCubeTextureSize,
      maxRenderTextureSize: caps.maxRenderTextureSize,
      maxVertexAttribs: caps.maxVertexAttribs,
      maxVaryingVectors: caps.maxVaryingVectors,
      maxFragmentUniformVectors: caps.maxFragmentUniformVectors,
      maxVertexUniformVectors: caps.maxVertexUniformVectors,

      // 扩展支持
      standardDerivatives: caps.standardDerivatives,
      textureFloat: caps.textureFloat,
      textureHalfFloat: caps.textureHalfFloat,
      textureAnisotropicFilterExtension: caps.textureAnisotropicFilterExtension,
      instancedArrays: caps.instancedArrays,
      uintIndices: caps.uintIndices,

      // 渲染信息
      hardwareScalingLevel: this.engine.getHardwareScalingLevel(),
      loadedTexturesCache: this.engine.getLoadedTexturesCache().length,
      activeRenderLoops: this.engine.activeRenderLoops.length,
    }
  }

  // GPU信息
  getGPUInfo() {
    const gl = this.engine._gl
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')

    if (debugInfo) {
      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      }
    }

    return {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
    }
  }

  // 事件处理
  handleContextLost() {
    // 停止渲染循环
    this.stopRenderLoop()

    // 显示加载提示
    this.showContextLostMessage()
  }

  handleContextRestored() {
    // 隐藏加载提示
    this.hideContextLostMessage()

    // 重新开始渲染
    if (this.scene) {
      this.startRenderLoop(this.scene)
    }
  }

  handleResize() {
    // 延迟执行，避免频繁调用
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      this.engine.resize()
    }, 100)
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // 页面隐藏时暂停渲染
      this.engine.stopRenderLoop()
    } else {
      // 页面显示时恢复渲染
      if (this.scene) {
        this.startRenderLoop(this.scene)
      }
    }
  }

  handleInitError(error) {
    // 显示错误信息
    const errorDiv = document.createElement('div')
    errorDiv.innerHTML = `
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: rgba(255,0,0,0.8); color: white; padding: 20px; border-radius: 10px;">
        <h3>BabylonJS 初始化失败</h3>
        <p>错误信息: ${error.message}</p>
        <p>请检查浏览器是否支持WebGL</p>
      </div>
    `
    document.body.appendChild(errorDiv)
  }

  onBeginFrame() {
    // 每帧开始时的处理
    // 可以在这里进行性能统计、资源管理等
  }

  onEndFrame() {
    // 每帧结束时的处理
    // 可以在这里进行清理工作、统计信息更新等
  }

  showContextLostMessage() {
    const messageDiv = document.createElement('div')
    messageDiv.id = 'context-lost-message'
    messageDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h3>连接丢失</h3>
          <p>正在尝试重新连接...</p>
          <div class="spinner" style="margin: 10px auto; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 2s linear infinite;"></div>
        </div>
      </div>
    `
    document.body.appendChild(messageDiv)
  }

  hideContextLostMessage() {
    const messageDiv = document.getElementById('context-lost-message')
    if (messageDiv) {
      messageDiv.remove()
    }
  }

  // 资源清理
  dispose() {
    // 停止渲染循环
    this.stopRenderLoop()

    // 移除事件监听
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)

    // 清理引擎
    if (this.engine) {
      this.engine.dispose()
      this.engine = null
    }
  }
}

// 使用示例
const canvas = document.getElementById('babylonCanvas')
const engineManager = new EngineManager(canvas, {
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance',
})

// 启用性能监控
engineManager.enablePerformanceMonitoring()

// 获取引擎信息
console.log('引擎信息:', engineManager.getEngineInfo())
```

## 🎭 Scene 场景详解

```javascript
// Scene 场景系统完整管理
class SceneManager {
  constructor(engine) {
    this.engine = engine
    this.scene = null
    this.sceneOptions = {}

    this.init()
  }

  init() {
    // 创建场景
    this.scene = new Scene(this.engine)

    // 配置场景
    this.configureScene()

    // 设置环境
    this.setupEnvironment()

    // 绑定事件
    this.bindEvents()
  }

  configureScene() {
    // 物理引擎配置
    // 作用: 启用物理模拟
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin())

    // 碰撞检测
    // 作用: 启用网格间碰撞检测
    this.scene.collisionsEnabled = true

    // 重力设置
    // 作用: 设置场景重力
    this.scene.gravity = new Vector3(0, -0.9, 0)

    // 动画速度
    // 作用: 控制动画播放速度倍率
    this.scene.animationTimeScale = 1.0

    // 渲染组
    // 作用: 控制渲染顺序
    this.scene.setRenderingOrder(
      0, // opaque sorting
      1, // alpha test sorting
      2,
    ) // transparent sorting

    // 自动清理
    // 作用: 自动清理未使用的资源
    this.scene.autoClear = true
    this.scene.autoClearDepthAndStencil = true

    // LOD (Level of Detail) 配置
    // 作用: 距离相关的细节层次
    this.scene.lodGenerationOffset = 0.5
    this.scene.lodGenerationTransitionTime = 250
  }

  setupEnvironment() {
    // 环境纹理
    this.setupEnvironmentTexture()

    // 雾效
    this.setupFog()

    // 天空盒
    this.setupSkybox()

    // 全局光照
    this.setupGlobalIllumination()
  }

  setupEnvironmentTexture() {
    // HDR环境纹理
    // 作用: 提供真实的环境光照和反射
    const hdrTexture = CubeTexture.CreateFromPrefilteredData(
      '/environments/environment.dds',
      this.scene,
    )
    hdrTexture.name = 'environmentTexture'
    hdrTexture.gammaSpace = false

    this.scene.environmentTexture = hdrTexture
    this.scene.createDefaultSkybox(hdrTexture, true, 1000)

    // 环境强度
    this.scene.environmentIntensity = 1.0

    // IBL (Image Based Lighting)
    this.scene.imageProcessingConfiguration.exposure = 1.0
    this.scene.imageProcessingConfiguration.contrast = 1.0
    this.scene.imageProcessingConfiguration.toneMappingEnabled = true
    this.scene.imageProcessingConfiguration.toneMappingType =
      ImageProcessingConfiguration.TONEMAPPING_ACES
  }

  setupFog() {
    // 雾效类型
    // FOG_NONE: 无雾
    // FOG_EXP: 指数雾
    // FOG_EXP2: 二次指数雾
    // FOG_LINEAR: 线性雾
    this.scene.fogMode = Scene.FOGMODE_LINEAR

    // 雾的颜色
    this.scene.fogColor = new Color3(0.9, 0.9, 0.85)

    // 线性雾参数
    this.scene.fogStart = 20.0 // 雾开始距离
    this.scene.fogEnd = 60.0 // 雾结束距离

    // 指数雾参数（当使用指数雾时）
    this.scene.fogDensity = 0.01 // 雾密度
  }

  setupSkybox() {
    // 程序化天空盒
    const skybox = MeshBuilder.CreateSphere('skyBox', { diameter: 1000 }, this.scene)
    const skyboxMaterial = new StandardMaterial('skyBox', this.scene)

    // 天空盒材质配置
    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.reflectionTexture = new CubeTexture('/textures/skybox/skybox', this.scene)
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
    skyboxMaterial.specularColor = new Color3(0, 0, 0)

    skybox.material = skyboxMaterial
    skybox.infiniteDistance = true

    return skybox
  }

  setupGlobalIllumination() {
    // 图像处理配置
    const imageProcessing = this.scene.imageProcessingConfiguration

    // 色调映射
    imageProcessing.toneMappingEnabled = true
    imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES

    // 曝光度
    imageProcessing.exposure = 1.0

    // 对比度
    imageProcessing.contrast = 1.0

    // 色彩平衡
    imageProcessing.colorGradingEnabled = true
    imageProcessing.colorGradingTexture = new Texture('/textures/colorgrading_lut.png', this.scene)

    // Bloom效果
    imageProcessing.vignetteEnabled = true
    imageProcessing.vignetteWeight = 1.5
    imageProcessing.vignetteStretch = 0.5
    imageProcessing.vignetteCameraFov = 0.5
    imageProcessing.vignetteColor = new Color4(0, 0, 0, 0)
  }

  bindEvents() {
    // 场景准备就绪
    this.scene.onReadyObservable.add(() => {
      console.log('场景准备就绪')
      this.onSceneReady()
    })

    // 渲染前事件
    this.scene.onBeforeRenderObservable.add(() => {
      this.onBeforeRender()
    })

    // 渲染后事件
    this.scene.onAfterRenderObservable.add(() => {
      this.onAfterRender()
    })

    // 相机变化事件
    this.scene.onActiveCameraChanged.add(() => {
      this.onActiveCameraChanged()
    })

    // 新网格添加事件
    this.scene.onNewMeshAddedObservable.add((mesh) => {
      this.onNewMeshAdded(mesh)
    })

    // 网格移除事件
    this.scene.onMeshRemovedObservable.add((mesh) => {
      this.onMeshRemoved(mesh)
    })

    // 指针事件
    this.scene.actionManager = new ActionManager(this.scene)
    this.setupPointerEvents()
  }

  setupPointerEvents() {
    // 鼠标点击事件
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          this.onPointerDown(pointerInfo)
          break
        case PointerEventTypes.POINTERUP:
          this.onPointerUp(pointerInfo)
          break
        case PointerEventTypes.POINTERMOVE:
          this.onPointerMove(pointerInfo)
          break
        case PointerEventTypes.POINTERWHEEL:
          this.onPointerWheel(pointerInfo)
          break
      }
    })

    // 拾取信息
    this.scene.onPointerPick = (evt, pickInfo) => {
      if (pickInfo.hit) {
        console.log('拾取到网格:', pickInfo.pickedMesh?.name)
        this.onMeshPicked(pickInfo.pickedMesh, pickInfo.pickedPoint)
      }
    }
  }

  // 场景优化
  optimizeScene() {
    // 合并网格
    this.mergeMeshes()

    // 设置渲染组
    this.setupRenderingGroups()

    // 启用实例化
    this.enableInstancing()

    // 设置LOD
    this.setupLevelOfDetail()

    // 冻结变换矩阵
    this.freezeTransformMatrices()
  }

  mergeMeshes() {
    // 合并静态网格以减少绘制调用
    const staticMeshes = this.scene.meshes.filter(
      (mesh) => mesh.name.startsWith('static_') && !mesh.skeleton,
    )

    if (staticMeshes.length > 1) {
      const merged = Mesh.MergeMeshes(staticMeshes, true, true, undefined, false, true)
      if (merged) {
        merged.name = 'merged_static_meshes'
        console.log(`合并了 ${staticMeshes.length} 个静态网格`)
      }
    }
  }

  setupRenderingGroups() {
    // 渲染组：0-不透明物体，1-透明物体，2-UI元素
    this.scene.meshes.forEach((mesh) => {
      if (mesh.material && mesh.material.alpha < 1.0) {
        mesh.renderingGroupId = 1 // 透明物体
      } else {
        mesh.renderingGroupId = 0 // 不透明物体
      }
    })
  }

  enableInstancing() {
    // 为重复的网格启用实例化
    const trees = this.scene.meshes.filter((mesh) => mesh.name.includes('tree'))
    if (trees.length > 1) {
      const sourceMesh = trees[0]
      const instances = []

      for (let i = 1; i < trees.length; i++) {
        const instance = sourceMesh.createInstance(`tree_instance_${i}`)
        instance.position = trees[i].position
        instance.rotation = trees[i].rotation
        instance.scaling = trees[i].scaling
        instances.push(instance)

        // 移除原始网格
        trees[i].dispose()
      }

      console.log(`创建了 ${instances.length} 个树木实例`)
    }
  }

  setupLevelOfDetail() {
    // 为大型网格设置LOD
    this.scene.meshes.forEach((mesh) => {
      if (mesh.getTotalVertices() > 1000) {
        // 创建简化版本
        const lod1 = mesh.clone(`${mesh.name}_lod1`)
        const lod2 = mesh.clone(`${mesh.name}_lod2`)

        // 这里应该使用简化算法创建低模
        // 示例：可以集成第三方简化库

        // 设置LOD距离
        mesh.addLODLevel(50, lod1)
        mesh.addLODLevel(100, lod2)
        mesh.addLODLevel(200, null) // 完全隐藏
      }
    })
  }

  freezeTransformMatrices() {
    // 冻结不再移动的网格的变换矩阵
    this.scene.meshes.forEach((mesh) => {
      if (mesh.name.includes('static_') || mesh.name.includes('building_')) {
        mesh.freezeWorldMatrix()
        mesh.doNotSyncBoundingInfo = true
      }
    })
  }

  // 场景序列化和加载
  serializeScene() {
    // 序列化场景为JSON
    const serializedScene = SceneSerializer.Serialize(this.scene)

    // 保存到本地存储
    localStorage.setItem('babylonjs_scene', JSON.stringify(serializedScene))

    return serializedScene
  }

  async loadScene(sceneData) {
    // 从序列化数据加载场景
    if (typeof sceneData === 'string') {
      sceneData = JSON.parse(sceneData)
    }

    // 清理当前场景
    this.scene.dispose()

    // 创建新场景
    this.scene = new Scene(this.engine)

    // 导入序列化数据
    await SceneLoader.ImportMeshAsync('', '', sceneData, this.scene)

    // 重新配置场景
    this.configureScene()
    this.bindEvents()
  }

  // 事件回调
  onSceneReady() {
    // 场景准备就绪后的处理
    this.optimizeScene()
  }

  onBeforeRender() {
    // 每帧渲染前的处理
    // 可以在这里更新动画、物理等
  }

  onAfterRender() {
    // 每帧渲染后的处理
    // 可以在这里进行后处理、UI更新等
  }

  onActiveCameraChanged() {
    // 相机切换时的处理
    console.log('活动相机已切换:', this.scene.activeCamera?.name)
  }

  onNewMeshAdded(mesh) {
    // 新网格添加时的处理
    console.log('新网格已添加:', mesh.name)

    // 自动设置物理属性
    if (mesh.name.includes('physics_')) {
      mesh.physicsImpostor = new PhysicsImpostor(
        mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 1 },
        this.scene,
      )
    }
  }

  onMeshRemoved(mesh) {
    // 网格移除时的处理
    console.log('网格已移除:', mesh.name)
  }

  onPointerDown(pointerInfo) {
    // 鼠标按下事件处理
  }

  onPointerUp(pointerInfo) {
    // 鼠标释放事件处理
  }

  onPointerMove(pointerInfo) {
    // 鼠标移动事件处理
  }

  onPointerWheel(pointerInfo) {
    // 鼠标滚轮事件处理
  }

  onMeshPicked(mesh, pickPoint) {
    // 网格拾取事件处理
    if (mesh) {
      // 高亮被拾取的网格
      mesh.renderOutline = true
      mesh.outlineColor = Color3.Red()
      mesh.outlineWidth = 0.02

      // 取消其他网格的高亮
      this.scene.meshes.forEach((m) => {
        if (m !== mesh) {
          m.renderOutline = false
        }
      })
    }
  }

  // 资源清理
  dispose() {
    if (this.scene) {
      this.scene.dispose()
      this.scene = null
    }
  }
}

// 使用示例
const sceneManager = new SceneManager(engine)

// 序列化场景
const sceneData = sceneManager.serializeScene()

// 加载场景
// sceneManager.loadScene(sceneData)
```

## 📷 Camera 相机系统详解

```javascript
// Camera 相机系统完整管理
class CameraManager {
  constructor(scene) {
    this.scene = scene
    this.cameras = new Map()
    this.activeCamera = null

    this.setupDefaultCameras()
  }

  setupDefaultCameras() {
    // 自由相机 - 第一人称视角
    this.createFreeCamera('freeCamera', new Vector3(0, 5, -10))

    // 弧形旋转相机 - 第三人称视角
    this.createArcRotateCamera('arcCamera', new Vector3(0, 0, 0), 10)

    // 通用相机 - 混合模式
    this.createUniversalCamera('universalCamera', new Vector3(0, 5, -10))

    // 设置默认相机
    this.setActiveCamera('arcCamera')
  }

  // 自由相机 (FreeCamera)
  createFreeCamera(name, position) {
    const camera = new FreeCamera(name, position, this.scene)

    // 基础配置
    camera.setTarget(Vector3.Zero())

    // 移动速度配置
    // speed: number - 移动速度
    camera.speed = 0.5

    // angularSensibility: number - 鼠标灵敏度
    camera.angularSensibility = 2000

    // 键盘控制配置
    camera.keysUp = [87] // W键
    camera.keysDown = [83] // S键
    camera.keysLeft = [65] // A键
    camera.keysRight = [68] // D键

    // 惯性配置
    // inertia: number - 惯性系数 (0-1)
    camera.inertia = 0.9

    // 碰撞检测
    camera.checkCollisions = true
    camera.collisionRadius = new Vector3(0.5, 1.8, 0.5)

    // 重力
    camera.applyGravity = true
    camera.needMoveForGravity = true

    // 椭球体碰撞
    camera.ellipsoid = new Vector3(0.5, 1, 0.5)

    // 跳跃
    camera.setUpVector = new Vector3(0, 1, 0)

    this.cameras.set(name, camera)
    return camera
  }

  // 弧形旋转相机 (ArcRotateCamera)
  createArcRotateCamera(name, target, radius) {
    // alpha: 水平角度 (弧度)
    // beta: 垂直角度 (弧度)
    // radius: 距离目标的距离
    const camera = new ArcRotateCamera(
      name,
      -Math.PI / 2,
      Math.PI / 2.5,
      radius,
      target,
      this.scene,
    )

    // 角度限制
    camera.lowerAlphaLimit = -Math.PI * 2 // 水平最小角度
    camera.upperAlphaLimit = Math.PI * 2 // 水平最大角度
    camera.lowerBetaLimit = 0.1 // 垂直最小角度
    camera.upperBetaLimit = Math.PI - 0.1 // 垂直最大角度

    // 距离限制
    camera.lowerRadiusLimit = 2 // 最小距离
    camera.upperRadiusLimit = 50 // 最大距离

    // 平移限制
    camera.lowerTargetOffsetLimit = new Vector3(-10, -10, -10)
    camera.upperTargetOffsetLimit = new Vector3(10, 10, 10)

    // 鼠标控制配置
    camera.angularSensibilityX = 1000 // 水平灵敏度
    camera.angularSensibilityY = 1000 // 垂直灵敏度
    camera.wheelDeltaPercentage = 0.01 // 滚轮缩放速度
    camera.pinchDeltaPercentage = 0.01 // 触摸缩放速度

    // 惯性
    camera.inertia = 0.9
    camera.panningInertia = 0.9

    // 自动旋转
    camera.useAutoRotationBehavior = false
    if (camera.useAutoRotationBehavior) {
      camera.autoRotationBehavior.idleRotationSpeed = 0.2
      camera.autoRotationBehavior.idleRotationWaitTime = 2000
      camera.autoRotationBehavior.idleRotationSpinupTime = 2000
    }

    // 边界行为
    camera.useBouncingBehavior = true
    if (camera.useBouncingBehavior) {
      camera.bouncingBehavior.transitionDuration = 450
      camera.bouncingBehavior.lowerRadiusTransitionRange = 2
      camera.bouncingBehavior.upperRadiusTransitionRange = -2
    }

    // 框选行为
    camera.useFramingBehavior = true
    if (camera.useFramingBehavior) {
      camera.framingBehavior.mode = FramingBehavior.FitFrustumSidesMode
      camera.framingBehavior.radiusScale = 1.0
      camera.framingBehavior.positionScale = 0.5
      camera.framingBehavior.defaultElevation = 0.3
      camera.framingBehavior.elevationReturnTime = 1500
      camera.framingBehavior.elevationReturnWaitTime = 1000
    }

    this.cameras.set(name, camera)
    return camera
  }

  // 通用相机 (UniversalCamera)
  createUniversalCamera(name, position) {
    const camera = new UniversalCamera(name, position, this.scene)

    // 继承自FreeCamera的所有属性
    camera.setTarget(Vector3.Zero())
    camera.speed = 0.5
    camera.angularSensibility = 2000

    // 触摸控制 (移动设备)
    camera.touchAngularSensibility = 20000
    camera.touchMoveSensibility = 250

    // 游戏手柄支持
    camera.gamepadAngularSensibility = 200
    camera.gamepadMoveSensibility = 40

    this.cameras.set(name, camera)
    return camera
  }

  // VR相机
  createVRCamera(name, position) {
    const camera = new WebVRFreeCamera(name, position, this.scene)

    // VR设备检测
    camera.deviceOrientationCamera.angularSensibility = 2000
    camera.deviceOrientationCamera.moveSensibility = 50

    this.cameras.set(name, camera)
    return camera
  }

  // 跟随相机 (FollowCamera)
  createFollowCamera(name, target) {
    const camera = new FollowCamera(name, Vector3.Zero(), this.scene)

    // 跟随目标
    camera.lockedTarget = target

    // 跟随参数
    camera.radius = 10 // 跟随距离
    camera.heightOffset = 5 // 高度偏移
    camera.rotationOffset = 0 // 旋转偏移
    camera.cameraAcceleration = 0.05 // 加速度
    camera.maxCameraSpeed = 20 // 最大速度

    this.cameras.set(name, camera)
    return camera
  }

  // 设置活动相机
  setActiveCamera(cameraName) {
    const camera = this.cameras.get(cameraName)
    if (camera) {
      this.scene.activeCamera = camera
      this.activeCamera = camera

      // 附加控制
      camera.attachControls(this.scene.getEngine().getRenderingCanvas(), true)

      // 取消其他相机的控制
      this.cameras.forEach((cam, name) => {
        if (name !== cameraName) {
          cam.detachControls(this.scene.getEngine().getRenderingCanvas())
        }
      })

      console.log(`切换到相机: ${cameraName}`)
    }
  }

  // 相机动画
  animateCameraTo(targetPosition, targetTarget, duration = 2000) {
    if (!this.activeCamera) return

    const camera = this.activeCamera

    // 位置动画
    const positionAnimation = Animation.CreateAndStartAnimation(
      'cameraPosition',
      camera,
      'position',
      30, // FPS
      (duration / 1000) * 30, // 总帧数
      camera.position.clone(),
      targetPosition,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    // 如果是FreeCamera或UniversalCamera，也要动画目标
    if (camera instanceof FreeCamera) {
      const targetAnimation = Animation.CreateAndStartAnimation(
        'cameraTarget',
        camera,
        'target',
        30,
        (duration / 1000) * 30,
        camera.getTarget().clone(),
        targetTarget,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )
    }

    // 如果是ArcRotateCamera，需要计算alpha、beta、radius
    if (camera instanceof ArcRotateCamera) {
      const direction = targetPosition.subtract(targetTarget)
      const radius = direction.length()
      const alpha = Math.atan2(direction.x, direction.z)
      const beta = Math.acos(direction.y / radius)

      Animation.CreateAndStartAnimation(
        'cameraAlpha',
        camera,
        'alpha',
        30,
        (duration / 1000) * 30,
        camera.alpha,
        alpha,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )
      Animation.CreateAndStartAnimation(
        'cameraBeta',
        camera,
        'beta',
        30,
        (duration / 1000) * 30,
        camera.beta,
        beta,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )
      Animation.CreateAndStartAnimation(
        'cameraRadius',
        camera,
        'radius',
        30,
        (duration / 1000) * 30,
        camera.radius,
        radius,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )
      Animation.CreateAndStartAnimation(
        'cameraTarget',
        camera,
        'target',
        30,
        (duration / 1000) * 30,
        camera.target.clone(),
        targetTarget,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )
    }
  }

  // 相机聚焦到网格
  focusOnMesh(mesh, offset = new Vector3(0, 5, -10)) {
    if (!this.activeCamera || !mesh) return

    const boundingInfo = mesh.getBoundingInfo()
    const center = boundingInfo.boundingBox.centerWorld
    const size = boundingInfo.boundingBox.extendSizeWorld

    // 计算合适的距离
    const maxSize = Math.max(size.x, size.y, size.z)
    const distance = maxSize * 2.5

    const targetPosition = center.add(offset.normalize().scale(distance))

    this.animateCameraTo(targetPosition, center)
  }

  // 保存相机状态
  saveCameraState(cameraName) {
    const camera = this.cameras.get(cameraName)
    if (!camera) return null

    const state = {
      name: cameraName,
      type: camera.getClassName(),
      position: camera.position.clone(),
      target: camera.getTarget().clone(),
      upVector: camera.upVector.clone(),
    }

    // ArcRotateCamera额外状态
    if (camera instanceof ArcRotateCamera) {
      state.alpha = camera.alpha
      state.beta = camera.beta
      state.radius = camera.radius
      state.target = camera.target.clone()
    }

    return state
  }

  // 恢复相机状态
  restoreCameraState(state) {
    const camera = this.cameras.get(state.name)
    if (!camera) return

    camera.position = state.position.clone()
    camera.upVector = state.upVector.clone()

    if (camera instanceof ArcRotateCamera && state.alpha !== undefined) {
      camera.alpha = state.alpha
      camera.beta = state.beta
      camera.radius = state.radius
      camera.target = state.target.clone()
    } else if (camera instanceof FreeCamera) {
      camera.setTarget(state.target.clone())
    }
  }

  // 相机摇晃效果
  addShakeEffect(intensity = 0.1, duration = 1000) {
    if (!this.activeCamera) return

    const camera = this.activeCamera
    const originalPosition = camera.position.clone()
    const shakeAnimation = new Animation(
      'cameraShake',
      'position',
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = []
    const frameCount = (duration / 1000) * 30

    for (let i = 0; i <= frameCount; i++) {
      const progress = i / frameCount
      const shakeIntensity = intensity * (1 - progress) // 逐渐减弱

      const shake = new Vector3(
        (Math.random() - 0.5) * shakeIntensity,
        (Math.random() - 0.5) * shakeIntensity,
        (Math.random() - 0.5) * shakeIntensity,
      )

      keys.push({
        frame: i,
        value: originalPosition.add(shake),
      })
    }

    // 最后回到原位置
    keys.push({
      frame: frameCount,
      value: originalPosition,
    })

    shakeAnimation.setKeys(keys)

    const animatable = this.scene.beginDirectAnimation(
      camera,
      [shakeAnimation],
      0,
      frameCount,
      false,
    )
    return animatable
  }

  // 第一人称射击游戏相机设置
  setupFPSCamera(cameraName = 'fpsCamera') {
    const camera = this.createFreeCamera(cameraName, new Vector3(0, 1.8, 0))

    // FPS专用设置
    camera.speed = 0.2
    camera.angularSensibility = 1500
    camera.minZ = 0.1 // 近裁剪面
    camera.maxZ = 1000 // 远裁剪面

    // 跳跃设置
    camera.jumpSpeed = 0.3
    camera.gravity = 0.9

    // 鼠标锁定
    camera.attachControls(this.scene.getEngine().getRenderingCanvas(), true)

    // 武器摇摆效果
    this.setupWeaponSway(camera)

    return camera
  }

  setupWeaponSway(camera) {
    let swayTime = 0
    const swaySpeed = 0.005
    const swayAmount = 0.002

    this.scene.onBeforeRenderObservable.add(() => {
      if (camera === this.scene.activeCamera) {
        swayTime += this.scene.getEngine().getDeltaTime() * swaySpeed

        // 计算摇摆偏移
        const swayX = Math.sin(swayTime * 2) * swayAmount
        const swayY = Math.sin(swayTime) * swayAmount * 0.5

        // 应用到相机
        camera.position.x += swayX
        camera.position.y += swayY
      }
    })
  }

  // 电影级相机运动
  createCinematicPath(waypoints, duration = 10000) {
    if (waypoints.length < 2) return

    // 创建路径
    const path = []
    waypoints.forEach((waypoint) => {
      path.push(waypoint.position)
    })

    // 创建平滑曲线
    const curve = Curve3.CreateCatmullRomSpline(path, path.length * 10, true)
    const curvePoints = curve.getPoints()

    // 创建动画
    const positionAnimation = new Animation(
      'cinematicPosition',
      'position',
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )
    const targetAnimation = new Animation(
      'cinematicTarget',
      'target',
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    const totalFrames = (duration / 1000) * 30
    const positionKeys = []
    const targetKeys = []

    for (let i = 0; i <= totalFrames; i++) {
      const progress = i / totalFrames
      const pointIndex = Math.floor(progress * (curvePoints.length - 1))
      const nextPointIndex = Math.min(pointIndex + 1, curvePoints.length - 1)
      const localProgress = progress * (curvePoints.length - 1) - pointIndex

      // 插值位置
      const position = Vector3.Lerp(
        curvePoints[pointIndex],
        curvePoints[nextPointIndex],
        localProgress,
      )

      // 计算目标（向前看）
      const lookAheadIndex = Math.min(pointIndex + 5, curvePoints.length - 1)
      const target = curvePoints[lookAheadIndex]

      positionKeys.push({ frame: i, value: position })
      targetKeys.push({ frame: i, value: target })
    }

    positionAnimation.setKeys(positionKeys)
    targetAnimation.setKeys(targetKeys)

    return [positionAnimation, targetAnimation]
  }

  // 获取相机信息
  getCameraInfo(cameraName) {
    const camera = this.cameras.get(cameraName)
    if (!camera) return null

    const info = {
      name: cameraName,
      type: camera.getClassName(),
      position: camera.position.clone(),
      target: camera.getTarget(),
      fov: camera.fov,
      minZ: camera.minZ,
      maxZ: camera.maxZ,
      isActive: camera === this.scene.activeCamera,
    }

    if (camera instanceof ArcRotateCamera) {
      info.alpha = camera.alpha
      info.beta = camera.beta
      info.radius = camera.radius
    }

    return info
  }

  // 资源清理
  dispose() {
    this.cameras.forEach((camera) => {
      camera.dispose()
    })
    this.cameras.clear()
  }
}

// 使用示例
const cameraManager = new CameraManager(scene)

// 切换相机
cameraManager.setActiveCamera('arcCamera')

// 聚焦到网格
cameraManager.focusOnMesh(someMesh)

// 添加摇晃效果
cameraManager.addShakeEffect(0.2, 2000)

// 设置FPS相机
const fpsCamera = cameraManager.setupFPSCamera()
```

## 💡 Light 光照系统详解

```javascript
// Light 光照系统完整管理
class LightManager {
  constructor(scene) {
    this.scene = scene
    this.lights = new Map()
    this.shadowGenerators = new Map()

    this.setupDefaultLighting()
  }

  setupDefaultLighting() {
    // 环境光
    this.createHemisphericLight('ambientLight', Vector3.Up(), 0.3)

    // 主光源
    this.createDirectionalLight('sunLight', new Vector3(-1, -1, -1), 1.0)

    // 补光
    this.createSpotLight('fillLight', new Vector3(5, 10, 5), new Vector3(-1, -1, 0), 0.5)
  }

  // 半球光 (HemisphericLight) - 环境光
  createHemisphericLight(name, direction, intensity = 1.0) {
    const light = new HemisphericLight(name, direction, this.scene)

    // 基础属性
    light.intensity = intensity

    // 颜色配置
    // diffuse: Color3 - 漫反射颜色
    light.diffuse = new Color3(1, 1, 1)

    // specular: Color3 - 镜面反射颜色
    light.specular = new Color3(1, 1, 1)

    // groundColor: Color3 - 地面颜色（半球光特有）
    light.groundColor = new Color3(0.2, 0.2, 0.3)

    // 影响范围
    light.range = Number.MAX_VALUE

    // 包含/排除网格
    light.includedOnlyMeshes = [] // 只影响指定网格
    light.excludedMeshes = [] // 排除指定网格

    this.lights.set(name, light)
    return light
  }

  // 方向光 (DirectionalLight) - 太阳光
  createDirectionalLight(name, direction, intensity = 1.0) {
    const light = new DirectionalLight(name, direction, this.scene)

    light.intensity = intensity
    light.diffuse = new Color3(1, 0.9, 0.7) // 暖白色
    light.specular = new Color3(1, 1, 0.8)

    // 方向光特有属性
    // direction: Vector3 - 光照方向
    light.direction = direction.normalize()

    // 阴影配置
    this.setupShadowGenerator(name, light, {
      mapSize: 2048,
      useExponentialShadowMap: true,
      useBlurExponentialShadowMap: true,
      blurScale: 2,
      blurBoxOffset: 1,
    })

    this.lights.set(name, light)
    return light
  }

  // 点光源 (PointLight)
  createPointLight(name, position, intensity = 1.0) {
    const light = new PointLight(name, position, this.scene)

    light.intensity = intensity
    light.diffuse = new Color3(1, 0.8, 0.4) // 温暖的橙色
    light.specular = new Color3(1, 1, 1)

    // 点光源特有属性
    // range: number - 光照范围
    light.range = 50

    // 衰减函数: intensity / (1 + linear * d + quadratic * d^2)
    // 其中 d 是距离

    // 线性衰减
    light.diffuseLinearAttenuation = 0.1
    light.specularLinearAttenuation = 0.1

    // 二次衰减
    light.diffuseQuadraticAttenuation = 0.01
    light.specularQuadraticAttenuation = 0.01

    // 阴影配置（可选）
    this.setupShadowGenerator(name, light, {
      mapSize: 1024,
      useExponentialShadowMap: true,
    })

    this.lights.set(name, light)
    return light
  }

  // 聚光灯 (SpotLight)
  createSpotLight(name, position, direction, intensity = 1.0) {
    // angle: 聚光灯锥角（弧度）
    // exponent: 边缘衰减指数
    const light = new SpotLight(name, position, direction, Math.PI / 3, 2, this.scene)

    light.intensity = intensity
    light.diffuse = new Color3(1, 1, 0.9)
    light.specular = new Color3(1, 1, 1)

    // 聚光灯特有属性
    // angle: number - 锥角（弧度）
    light.angle = Math.PI / 3 // 60度

    // exponent: number - 边缘衰减
    light.exponent = 2

    // 方向
    light.direction = direction.normalize()

    // 内角和外角（用于平滑过渡）
    light.innerAngle = Math.PI / 6 // 30度
    light.outerAngle = Math.PI / 3 // 60度

    // 距离衰减
    light.range = 100
    light.diffuseLinearAttenuation = 0.05
    light.diffuseQuadraticAttenuation = 0.005

    // 阴影配置
    this.setupShadowGenerator(name, light, {
      mapSize: 1024,
      useExponentialShadowMap: true,
      useCloseExponentialShadowMap: true,
    })

    this.lights.set(name, light)
    return light
  }

  // 阴影生成器配置
  setupShadowGenerator(lightName, light, options = {}) {
    if (!light.canGenerateShadows) return null

    const defaultOptions = {
      mapSize: 1024,
      useExponentialShadowMap: false,
      useBlurExponentialShadowMap: false,
      useCloseExponentialShadowMap: false,
      usePoissonSampling: false,
      usePercentageCloserFiltering: false,
      filteringQuality: ShadowGenerator.QUALITY_HIGH,
      blurScale: 2,
      blurBoxOffset: 1,
      bias: 0.00005,
      normalBias: 0.0,
      darkness: 0.0,
    }

    const config = Object.assign(defaultOptions, options)

    // 创建阴影生成器
    const shadowGenerator = new ShadowGenerator(config.mapSize, light)

    // 阴影映射类型
    if (config.useExponentialShadowMap) {
      shadowGenerator.useExponentialShadowMap = true
    } else if (config.useBlurExponentialShadowMap) {
      shadowGenerator.useBlurExponentialShadowMap = true
      shadowGenerator.blurScale = config.blurScale
      shadowGenerator.blurBoxOffset = config.blurBoxOffset
    } else if (config.useCloseExponentialShadowMap) {
      shadowGenerator.useCloseExponentialShadowMap = true
    } else if (config.usePoissonSampling) {
      shadowGenerator.usePoissonSampling = true
    } else if (config.usePercentageCloserFiltering) {
      shadowGenerator.usePercentageCloserFiltering = true
      shadowGenerator.filteringQuality = config.filteringQuality
    }

    // 阴影参数
    shadowGenerator.bias = config.bias
    shadowGenerator.normalBias = config.normalBias
    shadowGenerator.darkness = config.darkness

    // 透明度阈值
    shadowGenerator.transparencyShadow = true
    shadowGenerator.forceBackFacesOnly = false

    // 级联阴影（方向光）
    if (light instanceof DirectionalLight) {
      shadowGenerator.autoCalcDepthBounds = true
      shadowGenerator.stabilizeCascades = true
      shadowGenerator.lambda = 0.5

      // 多级联配置
      if (config.cascadeCount && config.cascadeCount > 1) {
        shadowGenerator.numCascades = config.cascadeCount
        shadowGenerator.cascadeBlendPercentage = 0.1
      }
    }

    this.shadowGenerators.set(lightName, shadowGenerator)
    return shadowGenerator
  }

  // 添加投射阴影的网格
  addShadowCaster(lightName, mesh) {
    const shadowGenerator = this.shadowGenerators.get(lightName)
    if (shadowGenerator) {
      shadowGenerator.addShadowCaster(mesh)
    }
  }

  // 批量添加阴影投射者
  addShadowCasters(lightName, meshes) {
    const shadowGenerator = this.shadowGenerators.get(lightName)
    if (shadowGenerator) {
      meshes.forEach((mesh) => {
        shadowGenerator.addShadowCaster(mesh)
      })
    }
  }

  // 设置网格接收阴影
  enableShadowReceiver(mesh) {
    mesh.receiveShadows = true
  }

  // 光照动画
  animateLight(lightName, property, targetValue, duration = 2000) {
    const light = this.lights.get(lightName)
    if (!light) return

    const animation = Animation.CreateAndStartAnimation(
      `${lightName}_${property}`,
      light,
      property,
      30,
      (duration / 1000) * 30,
      light[property],
      targetValue,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    return animation
  }

  // 光照闪烁效果
  addFlickerEffect(lightName, intensity = 0.2, speed = 5) {
    const light = this.lights.get(lightName)
    if (!light) return

    const baseIntensity = light.intensity
    let time = 0

    const flickerObserver = this.scene.onBeforeRenderObservable.add(() => {
      time += this.scene.getEngine().getDeltaTime() * 0.001 * speed
      const flicker = Math.sin(time * Math.PI * 2) * intensity + Math.random() * intensity * 0.5
      light.intensity = baseIntensity + flicker
    })

    return {
      dispose: () => {
        this.scene.onBeforeRenderObservable.remove(flickerObserver)
        light.intensity = baseIntensity
      },
    }
  }

  // 昼夜循环
  setupDayNightCycle(duration = 120000) {
    // 2分钟一个周期
    const sunLight = this.lights.get('sunLight')
    const ambientLight = this.lights.get('ambientLight')

    if (!sunLight || !ambientLight) return

    let time = 0
    const cycleSpeed = (Math.PI * 2) / duration // 弧度/毫秒

    const cycleObserver = this.scene.onBeforeRenderObservable.add(() => {
      time += this.scene.getEngine().getDeltaTime() * cycleSpeed

      // 太阳高度角 (-90° 到 +90°)
      const sunElevation = (Math.sin(time) * Math.PI) / 2
      const sunAzimuth = time

      // 计算太阳方向
      const sunDirection = new Vector3(
        Math.cos(sunElevation) * Math.sin(sunAzimuth),
        Math.sin(sunElevation),
        Math.cos(sunElevation) * Math.cos(sunAzimuth),
      )

      sunLight.direction = sunDirection.negate()

      // 根据太阳高度调整光照强度和颜色
      const dayFactor = Math.max(0, Math.sin(time)) // 0-1，白天为1，夜晚为0

      // 太阳光强度
      sunLight.intensity = dayFactor * 2.0

      // 太阳光颜色（日出日落时偏红）
      const sunColor = this.calculateSunColor(sunElevation)
      sunLight.diffuse = sunColor

      // 环境光强度
      ambientLight.intensity = 0.1 + dayFactor * 0.4

      // 环境光颜色
      const ambientColor = this.calculateAmbientColor(dayFactor)
      ambientLight.diffuse = ambientColor
      ambientLight.groundColor = ambientColor.scale(0.5)
    })

    return {
      dispose: () => {
        this.scene.onBeforeRenderObservable.remove(cycleObserver)
      },
    }
  }

  calculateSunColor(elevation) {
    // 根据太阳高度角计算颜色
    const factor = Math.max(0, Math.sin(elevation))

    if (factor > 0.8) {
      // 正午 - 白色
      return Color3.White()
    } else if (factor > 0.3) {
      // 白天 - 暖白色
      return Color3.Lerp(new Color3(1, 0.9, 0.7), Color3.White(), (factor - 0.3) / 0.5)
    } else if (factor > 0.1) {
      // 日出日落 - 橙红色
      return Color3.Lerp(new Color3(1, 0.3, 0.1), new Color3(1, 0.9, 0.7), (factor - 0.1) / 0.2)
    } else {
      // 夜晚 - 深蓝色
      return new Color3(0.1, 0.1, 0.3)
    }
  }

  calculateAmbientColor(dayFactor) {
    // 白天：浅蓝色天空光
    const dayColor = new Color3(0.5, 0.7, 1.0)
    // 夜晚：深蓝紫色
    const nightColor = new Color3(0.1, 0.1, 0.2)

    return Color3.Lerp(nightColor, dayColor, dayFactor)
  }

  // 体积光效果 (Volumetric Light)
  setupVolumetricLight(lightName, density = 0.1, decay = 0.95, weight = 0.5) {
    const light = this.lights.get(lightName)
    if (!light || !(light instanceof SpotLight || light instanceof DirectionalLight)) {
      console.warn('体积光只支持聚光灯和方向光')
      return
    }

    // 创建体积光后处理
    const volumetricLightPostProcess = new VolumetricLightScatteringPostProcess(
      'volumetricLight',
      1.0,
      this.scene.activeCamera,
      undefined, // 使用光源自身
      100,
      Texture.BILINEAR_SAMPLINGMODE,
      this.scene.getEngine(),
      false,
    )

    // 配置参数
    volumetricLightPostProcess.density = density
    volumetricLightPostProcess.decay = decay
    volumetricLightPostProcess.weight = weight
    volumetricLightPostProcess.samples = 50

    return volumetricLightPostProcess
  }

  // IES光度文件支持（真实光源分布）
  loadIESProfile(lightName, iesUrl) {
    const light = this.lights.get(lightName)
    if (!light || !(light instanceof SpotLight)) {
      console.warn('IES光度文件只支持聚光灯')
      return
    }

    // 加载IES文件并创建纹理
    const iesTexture = new Texture(iesUrl, this.scene)
    iesTexture.wrapU = Texture.CLAMP_ADDRESSMODE
    iesTexture.wrapV = Texture.CLAMP_ADDRESSMODE

    // 应用到光源
    light.projectionTexture = iesTexture

    return iesTexture
  }

  // 光源调试工具
  enableLightGizmos() {
    this.lights.forEach((light, name) => {
      const lightGizmo = new LightGizmo()
      lightGizmo.light = light
      lightGizmo.material.emissiveColor = light.diffuse

      // 显示光源方向
      if (light instanceof DirectionalLight || light instanceof SpotLight) {
        const helper = this.createLightHelper(light)
        helper.name = `${name}_helper`
      }
    })
  }

  createLightHelper(light) {
    if (light instanceof DirectionalLight) {
      // 方向光帮助器
      const helper = MeshBuilder.CreateLines(
        'lightHelper',
        {
          points: [Vector3.Zero(), light.direction.scale(10)],
        },
        this.scene,
      )
      helper.color = light.diffuse
      return helper
    } else if (light instanceof SpotLight) {
      // 聚光灯锥形帮助器
      const angle = light.angle
      const range = light.range || 20

      const helper = MeshBuilder.CreateCylinder(
        'lightHelper',
        {
          diameterTop: 0,
          diameterBottom: Math.tan(angle / 2) * range * 2,
          height: range,
          tessellation: 8,
        },
        this.scene,
      )

      helper.position = light.position.clone()
      helper.lookAt(light.position.add(light.direction))
      helper.material = new StandardMaterial('lightHelperMat', this.scene)
      helper.material.wireframe = true
      helper.material.emissiveColor = light.diffuse

      return helper
    }
  }

  // 获取光照信息
  getLightInfo(lightName) {
    const light = this.lights.get(lightName)
    if (!light) return null

    const info = {
      name: lightName,
      type: light.getClassName(),
      intensity: light.intensity,
      diffuse: light.diffuse,
      specular: light.specular,
      range: light.range,
      enabled: light.isEnabled(),
    }

    if (light instanceof DirectionalLight) {
      info.direction = light.direction
    } else if (light instanceof PointLight) {
      info.position = light.position
    } else if (light instanceof SpotLight) {
      info.position = light.position
      info.direction = light.direction
      info.angle = light.angle
      info.exponent = light.exponent
    } else if (light instanceof HemisphericLight) {
      info.direction = light.direction
      info.groundColor = light.groundColor
    }

    return info
  }

  // 保存光照设置
  saveLightingSetup() {
    const setup = {
      lights: [],
      shadows: [],
    }

    this.lights.forEach((light, name) => {
      setup.lights.push({
        name: name,
        ...this.getLightInfo(name),
      })
    })

    this.shadowGenerators.forEach((generator, lightName) => {
      setup.shadows.push({
        lightName: lightName,
        mapSize: generator.mapSize,
        bias: generator.bias,
        darkness: generator.darkness,
      })
    })

    return setup
  }

  // 资源清理
  dispose() {
    this.shadowGenerators.forEach((generator) => {
      generator.dispose()
    })
    this.shadowGenerators.clear()

    this.lights.forEach((light) => {
      light.dispose()
    })
    this.lights.clear()
  }
}

// 使用示例
const lightManager = new LightManager(scene)

// 创建自定义光源
const fireLight = lightManager.createPointLight('fireLight', new Vector3(0, 2, 0), 2.0)
fireLight.diffuse = new Color3(1, 0.5, 0.1) // 橙色火光

// 添加闪烁效果
const flicker = lightManager.addFlickerEffect('fireLight', 0.3, 10)

// 设置昼夜循环
const dayNight = lightManager.setupDayNightCycle(60000) // 1分钟周期

// 添加阴影投射者
lightManager.addShadowCasters('sunLight', scene.meshes)
```

## 🎨 Material 材质系统详解

```javascript
// Material 材质系统完整管理
class MaterialManager {
  constructor(scene) {
    this.scene = scene
    this.materials = new Map()
    this.textures = new Map()
    this.nodeMaterials = new Map()

    this.setupDefaultMaterials()
  }

  setupDefaultMaterials() {
    // 标准材质
    this.createStandardMaterial('defaultStandard')

    // PBR材质
    this.createPBRMaterial('defaultPBR')

    // 无光材质
    this.createUnlitMaterial('defaultUnlit')
  }

  // 标准材质 (StandardMaterial)
  createStandardMaterial(name, options = {}) {
    const material = new StandardMaterial(name, this.scene)

    // 基础颜色属性
    // diffuseColor: Color3 - 漫反射颜色
    material.diffuseColor = options.diffuseColor || new Color3(1, 1, 1)

    // specularColor: Color3 - 镜面反射颜色
    material.specularColor = options.specularColor || new Color3(1, 1, 1)

    // emissiveColor: Color3 - 自发光颜色
    material.emissiveColor = options.emissiveColor || new Color3(0, 0, 0)

    // ambientColor: Color3 - 环境光颜色
    material.ambientColor = options.ambientColor || new Color3(0, 0, 0)

    // 纹理属性
    if (options.diffuseTexture) {
      material.diffuseTexture = this.loadTexture(options.diffuseTexture, name + '_diffuse')
    }

    if (options.specularTexture) {
      material.specularTexture = this.loadTexture(options.specularTexture, name + '_specular')
    }

    if (options.normalTexture) {
      material.bumpTexture = this.loadTexture(options.normalTexture, name + '_normal')
    }

    if (options.emissiveTexture) {
      material.emissiveTexture = this.loadTexture(options.emissiveTexture, name + '_emissive')
    }

    if (options.ambientTexture) {
      material.ambientTexture = this.loadTexture(options.ambientTexture, name + '_ambient')
    }

    // 光照属性
    // specularPower: number - 镜面反射强度 (1-128)
    material.specularPower = options.specularPower || 64

    // 透明度设置
    // alpha: number - 透明度 (0-1)
    material.alpha = options.alpha !== undefined ? options.alpha : 1.0

    // 背面剔除
    // backFaceCulling: boolean - 是否剔除背面
    material.backFaceCulling =
      options.backFaceCulling !== undefined ? options.backFaceCulling : true

    // 双面材质
    // twoSidedLighting: boolean - 双面光照
    material.twoSidedLighting = options.twoSidedLighting || false

    // 线框模式
    // wireframe: boolean - 线框显示
    material.wireframe = options.wireframe || false

    // 点模式
    // pointsCloud: boolean - 点云显示
    material.pointsCloud = options.pointsCloud || false

    // UV变换
    if (options.uOffset || options.vOffset || options.uScale || options.vScale) {
      this.setupUVTransform(material.diffuseTexture, options)
    }

    this.materials.set(name, material)
    return material
  }

  // PBR材质 (PBRMaterial) - 基于物理的渲染
  createPBRMaterial(name, options = {}) {
    const material = new PBRMaterial(name, this.scene)

    // 基础颜色
    // baseColor: Color3 - 基础颜色
    material.baseColor = options.baseColor || new Color3(1, 1, 1)

    // baseTexture: Texture - 基础颜色纹理
    if (options.baseTexture) {
      material.baseTexture = this.loadTexture(options.baseTexture, name + '_base')
    }

    // 金属度和粗糙度
    // metallicFactor: number - 金属度 (0-1)
    material.metallicFactor = options.metallicFactor !== undefined ? options.metallicFactor : 0.0

    // roughnessFactor: number - 粗糙度 (0-1)
    material.roughnessFactor = options.roughnessFactor !== undefined ? options.roughnessFactor : 1.0

    // metallicRoughnessTexture: Texture - 金属度粗糙度纹理 (R通道-未使用, G通道-粗糙度, B通道-金属度)
    if (options.metallicRoughnessTexture) {
      material.metallicRoughnessTexture = this.loadTexture(
        options.metallicRoughnessTexture,
        name + '_metallic_roughness',
      )
    }

    // 法线贴图
    if (options.normalTexture) {
      material.normalTexture = this.loadTexture(options.normalTexture, name + '_normal')
      material.normalTextureScale = options.normalScale || 1.0
    }

    // 环境遮蔽
    if (options.occlusionTexture) {
      material.ambientTexture = this.loadTexture(options.occlusionTexture, name + '_occlusion')
      material.ambientTextureStrength = options.occlusionStrength || 1.0
    }

    // 自发光
    // emissiveColor: Color3 - 自发光颜色
    material.emissiveColor = options.emissiveColor || new Color3(0, 0, 0)

    if (options.emissiveTexture) {
      material.emissiveTexture = this.loadTexture(options.emissiveTexture, name + '_emissive')
      material.emissiveIntensity = options.emissiveIntensity || 1.0
    }

    // 透明度
    material.alpha = options.alpha !== undefined ? options.alpha : 1.0

    // 透明度模式
    // alphaMode: number - 透明度模式
    // ALPHA_DISABLE: 不透明
    // ALPHA_BLEND: 透明混合
    // ALPHA_MASK: 透明裁剪
    material.transparencyMode = options.transparencyMode || PBRMaterial.PBRMATERIAL_OPAQUE

    if (material.transparencyMode === PBRMaterial.PBRMATERIAL_ALPHATEST) {
      material.alphaCutOff = options.alphaCutOff || 0.5
    }

    // 折射率
    // indexOfRefraction: number - 折射率
    material.indexOfRefraction = options.indexOfRefraction || 1.5

    // 清漆层 (Clear Coat)
    if (options.clearCoat) {
      material.clearCoat.isEnabled = true
      material.clearCoat.intensity = options.clearCoat.intensity || 1.0
      material.clearCoat.roughness = options.clearCoat.roughness || 0.0

      if (options.clearCoat.texture) {
        material.clearCoat.texture = this.loadTexture(
          options.clearCoat.texture,
          name + '_clearcoat',
        )
      }

      if (options.clearCoat.normalTexture) {
        material.clearCoat.bumpTexture = this.loadTexture(
          options.clearCoat.normalTexture,
          name + '_clearcoat_normal',
        )
      }
    }

    // 次表面散射 (Subsurface)
    if (options.subsurface) {
      material.subSurface.isScatteringEnabled = true
      material.subSurface.scatteringColor = options.subsurface.color || new Color3(1, 1, 1)
      material.subSurface.scatteringDistance = options.subsurface.distance || 1.0
      material.subSurface.scatteringIntensity = options.subsurface.intensity || 1.0
    }

    // 光泽 (Sheen)
    if (options.sheen) {
      material.sheen.isEnabled = true
      material.sheen.color = options.sheen.color || new Color3(1, 1, 1)
      material.sheen.intensity = options.sheen.intensity || 1.0
      material.sheen.roughness = options.sheen.roughness || 0.0
    }

    // 各向异性 (Anisotropy)
    if (options.anisotropy) {
      material.anisotropy.isEnabled = true
      material.anisotropy.intensity = options.anisotropy.intensity || 1.0
      material.anisotropy.direction = options.anisotropy.direction || new Vector2(1, 0)
    }

    this.materials.set(name, material)
    return material
  }

  // 无光材质 (UnlitMaterial) - 不受光照影响
  createUnlitMaterial(name, options = {}) {
    const material = new UnlitMaterial(name, this.scene)

    // 基础颜色
    material.diffuseColor = options.diffuseColor || new Color3(1, 1, 1)

    // 纹理
    if (options.diffuseTexture) {
      material.diffuseTexture = this.loadTexture(options.diffuseTexture, name + '_diffuse')
    }

    // 透明度
    material.alpha = options.alpha !== undefined ? options.alpha : 1.0

    // 背面剔除
    material.backFaceCulling =
      options.backFaceCulling !== undefined ? options.backFaceCulling : true

    this.materials.set(name, material)
    return material
  }

  // 节点材质 (NodeMaterial) - 可视化节点编辑器材质
  async createNodeMaterial(name, nodeJsonUrl) {
    const material = new NodeMaterial(name, this.scene)

    // 从JSON加载节点材质
    await material.loadFromUrl(nodeJsonUrl)

    // 构建材质
    material.build(false)

    this.nodeMaterials.set(name, material)
    return material
  }

  // 自定义着色器材质 (ShaderMaterial)
  createShaderMaterial(name, vertexShader, fragmentShader, options = {}) {
    const shaderMaterial = new ShaderMaterial(
      name,
      this.scene,
      {
        vertex: vertexShader,
        fragment: fragmentShader,
      },
      options,
    )

    // 设置uniforms
    if (options.uniforms) {
      Object.keys(options.uniforms).forEach((key) => {
        shaderMaterial.setFloat(key, options.uniforms[key])
      })
    }

    // 设置纹理
    if (options.textures) {
      Object.keys(options.textures).forEach((key) => {
        const texture = this.loadTexture(options.textures[key], `${name}_${key}`)
        shaderMaterial.setTexture(key, texture)
      })
    }

    this.materials.set(name, shaderMaterial)
    return shaderMaterial
  }

  // 程序化材质
  createProceduralMaterial(name, type, options = {}) {
    let material

    switch (type) {
      case 'wood':
        material = this.createWoodMaterial(name, options)
        break
      case 'marble':
        material = this.createMarbleMaterial(name, options)
        break
      case 'fire':
        material = this.createFireMaterial(name, options)
        break
      case 'water':
        material = this.createWaterMaterial(name, options)
        break
      case 'grass':
        material = this.createGrassMaterial(name, options)
        break
      default:
        console.warn('未知的程序化材质类型:', type)
        return null
    }

    this.materials.set(name, material)
    return material
  }

  // 木材材质
  createWoodMaterial(name, options = {}) {
    const material = new WoodProceduralTexture.WoodProceduralTexture(name, 256, this.scene)

    // 木材参数
    material.woodColor = options.woodColor || new Color3(0.49, 0.25, 0)
    material.ringColor = options.ringColor || new Color3(0.4, 0.1, 0.1)
    material.textureSize = options.textureSize || new Vector2(256, 256)

    const standardMaterial = new StandardMaterial(name + '_standard', this.scene)
    standardMaterial.diffuseTexture = material

    return standardMaterial
  }

  // 大理石材质
  createMarbleMaterial(name, options = {}) {
    const material = new MarbleProceduralTexture.MarbleProceduralTexture(name, 256, this.scene)

    // 大理石参数
    material.marbleColor = options.marbleColor || new Color3(0.77, 0.47, 0.38)
    material.jointColor = options.jointColor || new Color3(0.72, 0.72, 0.72)

    const standardMaterial = new StandardMaterial(name + '_standard', this.scene)
    standardMaterial.diffuseTexture = material

    return standardMaterial
  }

  // 火焰材质
  createFireMaterial(name, options = {}) {
    const material = new FireProceduralTexture.FireProceduralTexture(name, 256, this.scene)

    // 火焰参数
    material.fireColors = options.fireColors || FireProceduralTexture.RedFireColors
    material.speed = options.speed || new Vector2(1.0, 1.0)
    material.shift = options.shift || 1.6
    material.alpha = options.alpha || 1.0

    const unlitMaterial = new UnlitMaterial(name + '_unlit', this.scene)
    unlitMaterial.diffuseTexture = material
    unlitMaterial.hasAlpha = true

    return unlitMaterial
  }

  // 水材质
  createWaterMaterial(name, options = {}) {
    const waterMesh = options.waterMesh
    const skybox = options.skybox

    const waterMaterial = new WaterMaterial(name, this.scene, new Vector2(512, 512))

    // 水面参数
    waterMaterial.backFaceCulling = true
    waterMaterial.bumpTexture = this.loadTexture(
      options.bumpTexture || '/textures/water_normal.jpg',
      name + '_bump',
    )
    waterMaterial.windForce = options.windForce || -10
    waterMaterial.waveHeight = options.waveHeight || 0.5
    waterMaterial.bumpHeight = options.bumpHeight || 0.4
    waterMaterial.windDirection = options.windDirection || new Vector2(1, 1)
    waterMaterial.waterColor = options.waterColor || new Color3(0.1, 0.1, 0.6)
    waterMaterial.colorBlendFactor = options.colorBlendFactor || 0.2

    // 添加到渲染列表
    if (waterMesh) {
      waterMaterial.addToRenderList(waterMesh)
    }
    if (skybox) {
      waterMaterial.addToRenderList(skybox)
    }

    return waterMaterial
  }

  // 草地材质
  createGrassMaterial(name, options = {}) {
    const material = new GrassProceduralTexture.GrassProceduralTexture(name, 256, this.scene)

    // 草地参数
    material.grassColors = options.grassColors || [
      new Color3(0.29, 0.38, 0.02),
      new Color3(0.36, 0.49, 0.09),
      new Color3(0.51, 0.6, 0.28),
    ]

    const standardMaterial = new StandardMaterial(name + '_standard', this.scene)
    standardMaterial.diffuseTexture = material

    return standardMaterial
  }

  // 纹理加载和管理
  loadTexture(url, name, options = {}) {
    // 检查是否已加载
    if (this.textures.has(name)) {
      return this.textures.get(name)
    }

    const texture = new Texture(url, this.scene)

    // 纹理设置
    texture.name = name

    // 包装模式
    // WRAP_ADDRESSMODE: 重复
    // CLAMP_ADDRESSMODE: 钳制
    // MIRROR_ADDRESSMODE: 镜像
    texture.wrapU = options.wrapU || Texture.WRAP_ADDRESSMODE
    texture.wrapV = options.wrapV || Texture.WRAP_ADDRESSMODE

    // 过滤模式
    // NEAREST_SAMPLINGMODE: 最近邻
    // BILINEAR_SAMPLINGMODE: 双线性
    // TRILINEAR_SAMPLINGMODE: 三线性
    texture.samplingMode = options.samplingMode || Texture.TRILINEAR_SAMPLINGMODE

    // Mipmap
    texture.generateMipMaps = options.generateMipMaps !== undefined ? options.generateMipMaps : true

    // 各向异性过滤
    texture.anisotropicFilteringLevel = options.anisotropicFilteringLevel || 4

    // UV偏移和缩放
    if (options.uOffset !== undefined) texture.uOffset = options.uOffset
    if (options.vOffset !== undefined) texture.vOffset = options.vOffset
    if (options.uScale !== undefined) texture.uScale = options.uScale
    if (options.vScale !== undefined) texture.vScale = options.vScale

    // UV旋转
    if (options.uAng !== undefined) texture.uAng = options.uAng
    if (options.vAng !== undefined) texture.vAng = options.vAng
    if (options.wAng !== undefined) texture.wAng = options.wAng

    // 级别调整
    if (options.level !== undefined) texture.level = options.level

    this.textures.set(name, texture)
    return texture
  }

  // 立方体纹理加载 (Skybox/Environment)
  loadCubeTexture(urls, name, options = {}) {
    if (this.textures.has(name)) {
      return this.textures.get(name)
    }

    let cubeTexture

    if (Array.isArray(urls)) {
      // 6个面的纹理
      cubeTexture = new CubeTexture.CreateFromImages(urls, this.scene)
    } else {
      // DDS或HDR格式
      cubeTexture = new CubeTexture(urls, this.scene)
    }

    cubeTexture.name = name
    cubeTexture.coordinatesMode = options.coordinatesMode || Texture.SKYBOX_MODE

    this.textures.set(name, cubeTexture)
    return cubeTexture
  }

  // UV变换设置
  setupUVTransform(texture, options) {
    if (!texture) return

    if (options.uOffset !== undefined) texture.uOffset = options.uOffset
    if (options.vOffset !== undefined) texture.vOffset = options.vOffset
    if (options.uScale !== undefined) texture.uScale = options.uScale
    if (options.vScale !== undefined) texture.vScale = options.vScale
    if (options.uAng !== undefined) texture.uAng = options.uAng
    if (options.vAng !== undefined) texture.vAng = options.vAng
  }

  // UV动画
  animateUV(textureName, property, targetValue, duration = 2000) {
    const texture = this.textures.get(textureName)
    if (!texture) return

    const animation = Animation.CreateAndStartAnimation(
      `${textureName}_${property}`,
      texture,
      property,
      30,
      (duration / 1000) * 30,
      texture[property],
      targetValue,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    return animation
  }

  // 滚动UV效果
  addScrollingUV(textureName, speedU = 0.01, speedV = 0.01) {
    const texture = this.textures.get(textureName)
    if (!texture) return

    const observer = this.scene.onBeforeRenderObservable.add(() => {
      texture.uOffset += speedU * this.scene.getEngine().getDeltaTime() * 0.001
      texture.vOffset += speedV * this.scene.getEngine().getDeltaTime() * 0.001

      // 防止数值过大
      if (texture.uOffset > 1) texture.uOffset -= 1
      if (texture.vOffset > 1) texture.vOffset -= 1
      if (texture.uOffset < 0) texture.uOffset += 1
      if (texture.vOffset < 0) texture.vOffset += 1
    })

    return {
      dispose: () => {
        this.scene.onBeforeRenderObservable.remove(observer)
      },
    }
  }

  // 材质混合
  blendMaterials(name, material1, material2, blendFactor = 0.5) {
    const blendedMaterial = new StandardMaterial(name, this.scene)

    // 混合颜色
    blendedMaterial.diffuseColor = Color3.Lerp(
      material1.diffuseColor || Color3.White(),
      material2.diffuseColor || Color3.White(),
      blendFactor,
    )

    blendedMaterial.specularColor = Color3.Lerp(
      material1.specularColor || Color3.White(),
      material2.specularColor || Color3.White(),
      blendFactor,
    )

    // 混合纹理（通过混合着色器）
    if (material1.diffuseTexture && material2.diffuseTexture) {
      const mixedShader = this.createTextureBlendShader(
        name + '_blend',
        material1.diffuseTexture,
        material2.diffuseTexture,
        blendFactor,
      )
      blendedMaterial.diffuseTexture = mixedShader
    }

    this.materials.set(name, blendedMaterial)
    return blendedMaterial
  }

  // 纹理混合着色器
  createTextureBlendShader(name, texture1, texture2, blendFactor) {
    const shaderMaterial = new ShaderMaterial(
      name,
      this.scene,
      {
        vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        
        void main(void) {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vUV = uv;
        }
      `,
        fragment: `
        precision highp float;
        varying vec2 vUV;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float blendFactor;
        
        void main(void) {
          vec4 color1 = texture2D(texture1, vUV);
          vec4 color2 = texture2D(texture2, vUV);
          gl_FragColor = mix(color1, color2, blendFactor);
        }
      `,
      },
      {
        attributes: ['position', 'uv'],
        uniforms: ['worldViewProjection', 'blendFactor'],
        samplers: ['texture1', 'texture2'],
      },
    )

    shaderMaterial.setTexture('texture1', texture1)
    shaderMaterial.setTexture('texture2', texture2)
    shaderMaterial.setFloat('blendFactor', blendFactor)

    return shaderMaterial
  }

  // 材质动画
  animateMaterial(materialName, property, targetValue, duration = 2000) {
    const material = this.materials.get(materialName)
    if (!material) return

    const animation = Animation.CreateAndStartAnimation(
      `${materialName}_${property}`,
      material,
      property,
      30,
      (duration / 1000) * 30,
      material[property],
      targetValue,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    return animation
  }

  // 材质切换动画
  createMaterialTransition(mesh, fromMaterial, toMaterial, duration = 1000) {
    // 创建过渡材质
    const transitionMaterial = fromMaterial.clone(mesh.name + '_transition')
    mesh.material = transitionMaterial

    // 如果是StandardMaterial，可以动画颜色属性
    if (transitionMaterial instanceof StandardMaterial && toMaterial instanceof StandardMaterial) {
      // 颜色过渡
      Animation.CreateAndStartAnimation(
        'materialTransition_diffuse',
        transitionMaterial,
        'diffuseColor',
        30,
        (duration / 1000) * 30,
        fromMaterial.diffuseColor.clone(),
        toMaterial.diffuseColor.clone(),
        Animation.ANIMATIONLOOPMODE_CONSTANT,
        null,
        () => {
          // 动画完成后切换到目标材质
          mesh.material = toMaterial
          transitionMaterial.dispose()
        },
      )

      Animation.CreateAndStartAnimation(
        'materialTransition_specular',
        transitionMaterial,
        'specularColor',
        30,
        (duration / 1000) * 30,
        fromMaterial.specularColor.clone(),
        toMaterial.specularColor.clone(),
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )
    }
  }

  // 获取材质信息
  getMaterialInfo(materialName) {
    const material = this.materials.get(materialName)
    if (!material) return null

    const info = {
      name: materialName,
      type: material.getClassName(),
      alpha: material.alpha,
      backFaceCulling: material.backFaceCulling,
    }

    if (material instanceof StandardMaterial) {
      info.diffuseColor = material.diffuseColor
      info.specularColor = material.specularColor
      info.emissiveColor = material.emissiveColor
      info.specularPower = material.specularPower
      info.hasTextures = {
        diffuse: !!material.diffuseTexture,
        specular: !!material.specularTexture,
        normal: !!material.bumpTexture,
        emissive: !!material.emissiveTexture,
      }
    } else if (material instanceof PBRMaterial) {
      info.baseColor = material.baseColor
      info.metallicFactor = material.metallicFactor
      info.roughnessFactor = material.roughnessFactor
      info.emissiveColor = material.emissiveColor
      info.hasTextures = {
        base: !!material.baseTexture,
        metallicRoughness: !!material.metallicRoughnessTexture,
        normal: !!material.normalTexture,
        emissive: !!material.emissiveTexture,
        occlusion: !!material.ambientTexture,
      }
    }

    return info
  }

  // 批量应用材质
  applyMaterialToMeshes(materialName, meshes) {
    const material = this.materials.get(materialName)
    if (!material) return

    meshes.forEach((mesh) => {
      mesh.material = material
    })
  }

  // 根据距离切换材质LOD
  setupMaterialLOD(meshName, materials) {
    const mesh = this.scene.getMeshByName(meshName)
    if (!mesh) return

    // materials: [{ distance: number, material: string }, ...]
    const sortedMaterials = materials.sort((a, b) => a.distance - b.distance)

    const observer = this.scene.onBeforeRenderObservable.add(() => {
      if (!this.scene.activeCamera) return

      const distance = Vector3.Distance(mesh.position, this.scene.activeCamera.position)

      for (let i = sortedMaterials.length - 1; i >= 0; i--) {
        if (distance >= sortedMaterials[i].distance) {
          const material = this.materials.get(sortedMaterials[i].material)
          if (material && mesh.material !== material) {
            mesh.material = material
          }
          break
        }
      }
    })

    return {
      dispose: () => {
        this.scene.onBeforeRenderObservable.remove(observer)
      },
    }
  }

  // 保存材质设置
  saveMaterialSetup() {
    const setup = {
      materials: [],
      textures: [],
    }

    this.materials.forEach((material, name) => {
      setup.materials.push({
        name: name,
        ...this.getMaterialInfo(name),
      })
    })

    this.textures.forEach((texture, name) => {
      setup.textures.push({
        name: name,
        url: texture.url,
        wrapU: texture.wrapU,
        wrapV: texture.wrapV,
        uOffset: texture.uOffset,
        vOffset: texture.vOffset,
        uScale: texture.uScale,
        vScale: texture.vScale,
      })
    })

    return setup
  }

  // 资源清理
  dispose() {
    this.nodeMaterials.forEach((material) => {
      material.dispose()
    })
    this.nodeMaterials.clear()

    this.materials.forEach((material) => {
      material.dispose()
    })
    this.materials.clear()

    this.textures.forEach((texture) => {
      texture.dispose()
    })
    this.textures.clear()
  }
}

// 使用示例
const materialManager = new MaterialManager(scene)

// 创建PBR金属材质
const metalMaterial = materialManager.createPBRMaterial('metal', {
  baseColor: new Color3(0.7, 0.7, 0.7),
  metallicFactor: 1.0,
  roughnessFactor: 0.2,
  baseTexture: '/textures/metal_base.jpg',
  normalTexture: '/textures/metal_normal.jpg',
  metallicRoughnessTexture: '/textures/metal_metallic_roughness.jpg',
})

// 创建程序化木材材质
const woodMaterial = materialManager.createProceduralMaterial('wood', 'wood', {
  woodColor: new Color3(0.6, 0.3, 0.1),
  ringColor: new Color3(0.4, 0.2, 0.05),
})

// 应用材质到网格
const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)
sphere.material = metalMaterial

// 添加UV滚动效果
const scrollEffect = materialManager.addScrollingUV('metal_metal_base', 0.02, 0)
```

## 🎭 Mesh 网格系统详解

```javascript
// Mesh 网格系统完整管理
class MeshManager {
  constructor(scene) {
    this.scene = scene
    this.meshes = new Map()
    this.instancedMeshes = new Map()
    this.mergedMeshes = new Map()

    this.setupBuiltInGeometries()
  }

  setupBuiltInGeometries() {
    // 注册基础几何体创建器
    this.geometryCreators = {
      box: this.createBox.bind(this),
      sphere: this.createSphere.bind(this),
      cylinder: this.createCylinder.bind(this),
      plane: this.createPlane.bind(this),
      ground: this.createGround.bind(this),
      torus: this.createTorus.bind(this),
      cone: this.createCone.bind(this),
      polyhedron: this.createPolyhedron.bind(this),
      ribbon: this.createRibbon.bind(this),
      tube: this.createTube.bind(this),
      lines: this.createLines.bind(this),
      dashedLines: this.createDashedLines.bind(this),
    }
  }

  // 立方体创建
  createBox(name, options = {}) {
    const defaultOptions = {
      // size: number - 统一尺寸
      size: options.size || 1,

      // width, height, depth: number - 分别设置宽高深
      width: options.width || options.size || 1,
      height: options.height || options.size || 1,
      depth: options.depth || options.size || 1,

      // faceUV: Vector4[] - 每个面的UV坐标
      faceUV: options.faceUV || undefined,

      // faceColors: Color4[] - 每个面的颜色
      faceColors: options.faceColors || undefined,

      // sideOrientation: number - 面朝向
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,

      // frontUVs, backUVs: Vector4 - 正面背面UV
      frontUVs: options.frontUVs || new Vector4(0, 0, 1, 1),
      backUVs: options.backUVs || new Vector4(0, 0, 1, 1),

      // wrap: boolean - 是否环绕
      wrap: options.wrap || false,

      // topBaseAt: number - 顶部位置
      topBaseAt: options.topBaseAt || 1,

      // bottomBaseAt: number - 底部位置
      bottomBaseAt: options.bottomBaseAt || 0,
    }

    const mesh = MeshBuilder.CreateBox(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 球体创建
  createSphere(name, options = {}) {
    const defaultOptions = {
      // diameter: number - 直径
      diameter: options.diameter || 1,

      // diameterX, diameterY, diameterZ: number - 椭球参数
      diameterX: options.diameterX || options.diameter || 1,
      diameterY: options.diameterY || options.diameter || 1,
      diameterZ: options.diameterZ || options.diameter || 1,

      // segments: number - 分段数
      segments: options.segments || 32,

      // arc: number - 弧度（0-1，1为完整球体）
      arc: options.arc || 1.0,

      // slice: number - 切片（0-1，1为完整球体）
      slice: options.slice || 1.0,

      // sideOrientation: number - 面朝向
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,

      // frontUVs, backUVs: Vector4
      frontUVs: options.frontUVs || new Vector4(0, 0, 1, 1),
      backUVs: options.backUVs || new Vector4(0, 0, 1, 1),
    }

    const mesh = MeshBuilder.CreateSphere(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 圆柱体创建
  createCylinder(name, options = {}) {
    const defaultOptions = {
      // height: number - 高度
      height: options.height || 2,

      // diameterTop: number - 顶部直径
      diameterTop: options.diameterTop || 1,

      // diameterBottom: number - 底部直径
      diameterBottom: options.diameterBottom || 1,

      // tessellation: number - 圆周分段数
      tessellation: options.tessellation || 24,

      // subdivisions: number - 高度细分数
      subdivisions: options.subdivisions || 1,

      // arc: number - 弧度（0-1）
      arc: options.arc || 1.0,

      // faceUV: Vector4[] - 面UV
      faceUV: options.faceUV || undefined,

      // faceColors: Color4[] - 面颜色
      faceColors: options.faceColors || undefined,

      // hasRings: boolean - 是否有环
      hasRings: options.hasRings || false,

      // enclose: boolean - 是否封闭
      enclose: options.enclose || false,

      // sideOrientation: number
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,
    }

    const mesh = MeshBuilder.CreateCylinder(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 平面创建
  createPlane(name, options = {}) {
    const defaultOptions = {
      // size: number - 统一尺寸
      size: options.size || 1,

      // width, height: number - 宽度和高度
      width: options.width || options.size || 1,
      height: options.height || options.size || 1,

      // sideOrientation: number
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,

      // frontUVs, backUVs: Vector4
      frontUVs: options.frontUVs || new Vector4(0, 0, 1, 1),
      backUVs: options.backUVs || new Vector4(0, 0, 1, 1),

      // sourcePlane: Plane - 源平面
      sourcePlane: options.sourcePlane || undefined,
    }

    const mesh = MeshBuilder.CreatePlane(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 地面创建
  createGround(name, options = {}) {
    const defaultOptions = {
      // width, height: number - 地面尺寸
      width: options.width || 10,
      height: options.height || 10,

      // subdivisions: number - 细分数
      subdivisions: options.subdivisions || 1,

      // subdivisionsX, subdivisionsY: number - XY方向细分
      subdivisionsX: options.subdivisionsX || options.subdivisions || 1,
      subdivisionsY: options.subdivisionsY || options.subdivisions || 1,

      // updatable: boolean - 是否可更新
      updatable: options.updatable || false,
    }

    const mesh = MeshBuilder.CreateGround(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 环面创建
  createTorus(name, options = {}) {
    const defaultOptions = {
      // diameter: number - 外直径
      diameter: options.diameter || 1,

      // thickness: number - 管子粗细
      thickness: options.thickness || 0.5,

      // tessellation: number - 分段数
      tessellation: options.tessellation || 16,

      // sideOrientation: number
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,

      // frontUVs, backUVs: Vector4
      frontUVs: options.frontUVs || new Vector4(0, 0, 1, 1),
      backUVs: options.backUVs || new Vector4(0, 0, 1, 1),
    }

    const mesh = MeshBuilder.CreateTorus(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 圆锥创建
  createCone(name, options = {}) {
    const defaultOptions = {
      // diameter: number - 底面直径
      diameter: options.diameter || 1,

      // diameterTop: number - 顶面直径（0为尖锥）
      diameterTop: options.diameterTop || 0,

      // diameterBottom: number - 底面直径
      diameterBottom: options.diameterBottom || options.diameter || 1,

      // height: number - 高度
      height: options.height || 2,

      // tessellation: number - 圆周分段
      tessellation: options.tessellation || 24,

      // subdivisions: number - 高度细分
      subdivisions: options.subdivisions || 1,

      // arc: number - 弧度
      arc: options.arc || 1.0,

      // faceUV: Vector4[]
      faceUV: options.faceUV || undefined,

      // faceColors: Color4[]
      faceColors: options.faceColors || undefined,

      // sideOrientation: number
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,
    }

    const mesh = MeshBuilder.CreateCylinder(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 多面体创建
  createPolyhedron(name, options = {}) {
    const defaultOptions = {
      // type: number - 多面体类型
      // 0: 四面体, 1: 八面体, 2: 十二面体, 3: 二十面体, 4: 八面体, 5: 十二面体
      type: options.type || 0,

      // size: number - 尺寸
      size: options.size || 1,

      // sizeX, sizeY, sizeZ: number - 各轴尺寸
      sizeX: options.sizeX || options.size || 1,
      sizeY: options.sizeY || options.size || 1,
      sizeZ: options.sizeZ || options.size || 1,

      // custom: object - 自定义多面体数据
      custom: options.custom || undefined,

      // faceUV: Vector4[]
      faceUV: options.faceUV || undefined,

      // faceColors: Color4[]
      faceColors: options.faceColors || undefined,

      // flat: boolean - 是否平面着色
      flat: options.flat || true,

      // sideOrientation: number
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,
    }

    const mesh = MeshBuilder.CreatePolyhedron(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 带状网格创建
  createRibbon(name, options = {}) {
    const defaultOptions = {
      // pathArray: Vector3[][] - 路径数组
      pathArray: options.pathArray || [
        [new Vector3(-1, 0, 0), new Vector3(1, 0, 0)],
        [new Vector3(-1, 1, 0), new Vector3(1, 1, 0)],
      ],

      // closeArray: boolean - 是否闭合数组
      closeArray: options.closeArray || false,

      // closePath: boolean - 是否闭合路径
      closePath: options.closePath || false,

      // offset: number - 偏移
      offset: options.offset || undefined,

      // sideOrientation: number
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,

      // frontUVs, backUVs: Vector4
      frontUVs: options.frontUVs || new Vector4(0, 0, 1, 1),
      backUVs: options.backUVs || new Vector4(0, 0, 1, 1),

      // invertUV: boolean - 是否反转UV
      invertUV: options.invertUV || false,

      // uvs: Vector2[] - UV坐标数组
      uvs: options.uvs || undefined,

      // colors: Color4[] - 颜色数组
      colors: options.colors || undefined,
    }

    const mesh = MeshBuilder.CreateRibbon(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 管状网格创建
  createTube(name, options = {}) {
    const defaultOptions = {
      // path: Vector3[] - 路径点
      path: options.path || [new Vector3(0, 0, 0), new Vector3(0, 1, 1), new Vector3(0, 2, 0)],

      // radius: number - 半径
      radius: options.radius || 1,

      // tessellation: number - 圆周分段
      tessellation: options.tessellation || 8,

      // radiusFunction: function - 半径函数
      radiusFunction: options.radiusFunction || undefined,

      // cap: number - 端盖类型
      cap: options.cap || Mesh.NO_CAP,

      // arc: number - 弧度
      arc: options.arc || 1.0,

      // sideOrientation: number
      sideOrientation: options.sideOrientation || Mesh.DEFAULTSIDE,

      // frontUVs, backUVs: Vector4
      frontUVs: options.frontUVs || new Vector4(0, 0, 1, 1),
      backUVs: options.backUVs || new Vector4(0, 0, 1, 1),

      // invertUV: boolean
      invertUV: options.invertUV || false,
    }

    const mesh = MeshBuilder.CreateTube(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 线条创建
  createLines(name, options = {}) {
    const defaultOptions = {
      // points: Vector3[] - 点数组
      points: options.points || [new Vector3(-1, 0, 0), new Vector3(0, 1, 0), new Vector3(1, 0, 0)],

      // colors: Color4[] - 颜色数组
      colors: options.colors || undefined,

      // useVertexAlpha: boolean - 是否使用顶点透明度
      useVertexAlpha: options.useVertexAlpha || true,
    }

    const mesh = MeshBuilder.CreateLines(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 虚线创建
  createDashedLines(name, options = {}) {
    const defaultOptions = {
      // points: Vector3[] - 点数组
      points: options.points || [new Vector3(-1, 0, 0), new Vector3(0, 1, 0), new Vector3(1, 0, 0)],

      // dashSize: number - 虚线长度
      dashSize: options.dashSize || 3,

      // gapSize: number - 间隙长度
      gapSize: options.gapSize || 1,

      // dashNb: number - 虚线数量
      dashNb: options.dashNb || 200,

      // useVertexAlpha: boolean
      useVertexAlpha: options.useVertexAlpha || true,
    }

    const mesh = MeshBuilder.CreateDashedLines(name, defaultOptions, this.scene)
    this.setupMeshDefaults(mesh, options)
    this.meshes.set(name, mesh)

    return mesh
  }

  // 设置网格默认属性
  setupMeshDefaults(mesh, options) {
    // 位置变换
    if (options.position) mesh.position = options.position
    if (options.rotation) mesh.rotation = options.rotation
    if (options.scaling) mesh.scaling = options.scaling

    // 材质
    if (options.material) mesh.material = options.material

    // 可见性
    if (options.visibility !== undefined) mesh.visibility = options.visibility
    if (options.isVisible !== undefined) mesh.isVisible = options.isVisible

    // 渲染属性
    if (options.receiveShadows !== undefined) mesh.receiveShadows = options.receiveShadows
    if (options.checkCollisions !== undefined) mesh.checkCollisions = options.checkCollisions
    if (options.isPickable !== undefined) mesh.isPickable = options.isPickable

    // 渲染组
    if (options.renderingGroupId !== undefined) mesh.renderingGroupId = options.renderingGroupId

    // 自定义属性
    if (options.metadata) mesh.metadata = options.metadata

    return mesh
  }

  // 网格实例化
  createInstances(sourceMeshName, count, options = {}) {
    const sourceMesh = this.meshes.get(sourceMeshName)
    if (!sourceMesh) {
      console.error('源网格不存在:', sourceMeshName)
      return []
    }

    const instances = []
    const instanceName = options.namePrefix || sourceMeshName + '_instance'

    for (let i = 0; i < count; i++) {
      const instance = sourceMesh.createInstance(`${instanceName}_${i}`)

      // 随机或指定位置
      if (options.positions && options.positions[i]) {
        instance.position = options.positions[i]
      } else if (options.randomPosition) {
        instance.position = this.generateRandomPosition(options.randomPosition)
      }

      // 随机或指定旋转
      if (options.rotations && options.rotations[i]) {
        instance.rotation = options.rotations[i]
      } else if (options.randomRotation) {
        instance.rotation = this.generateRandomRotation(options.randomRotation)
      }

      // 随机或指定缩放
      if (options.scalings && options.scalings[i]) {
        instance.scaling = options.scalings[i]
      } else if (options.randomScaling) {
        instance.scaling = this.generateRandomScaling(options.randomScaling)
      }

      instances.push(instance)
    }

    this.instancedMeshes.set(sourceMeshName, instances)
    return instances
  }

  // 生成随机位置
  generateRandomPosition(bounds) {
    const { min = new Vector3(-10, 0, -10), max = new Vector3(10, 10, 10) } = bounds

    return new Vector3(
      min.x + Math.random() * (max.x - min.x),
      min.y + Math.random() * (max.y - min.y),
      min.z + Math.random() * (max.z - min.z),
    )
  }

  // 生成随机旋转
  generateRandomRotation(bounds) {
    const { min = Vector3.Zero(), max = new Vector3(Math.PI * 2, Math.PI * 2, Math.PI * 2) } =
      bounds

    return new Vector3(
      min.x + Math.random() * (max.x - min.x),
      min.y + Math.random() * (max.y - min.y),
      min.z + Math.random() * (max.z - min.z),
    )
  }

  // 生成随机缩放
  generateRandomScaling(bounds) {
    const { min = new Vector3(0.5, 0.5, 0.5), max = new Vector3(1.5, 1.5, 1.5) } = bounds

    return new Vector3(
      min.x + Math.random() * (max.x - min.x),
      min.y + Math.random() * (max.y - min.y),
      min.z + Math.random() * (max.z - min.z),
    )
  }

  // 网格合并
  mergeMeshes(meshNames, options = {}) {
    const meshesToMerge = meshNames.map((name) => this.meshes.get(name)).filter(Boolean)

    if (meshesToMerge.length < 2) {
      console.warn('至少需要2个网格进行合并')
      return null
    }

    const mergedMesh = Mesh.MergeMeshes(
      meshesToMerge,
      options.disposeSource !== false, // 默认销毁源网格
      options.allow32BitsIndices !== false, // 允许32位索引
      options.meshSubclass || undefined,
      options.subdivideWithSubMeshes || false,
      options.multiMultiMaterials || false,
    )

    if (mergedMesh) {
      const mergedName = options.name || 'merged_' + meshNames.join('_')
      mergedMesh.name = mergedName
      this.mergedMeshes.set(mergedName, mergedMesh)

      // 从原始网格映射中移除已合并的网格
      if (options.disposeSource !== false) {
        meshNames.forEach((name) => this.meshes.delete(name))
      }

      this.meshes.set(mergedName, mergedMesh)
    }

    return mergedMesh
  }

  // 网格简化
  simplifyMesh(meshName, settings = {}) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return

    const simplificationSettings = [
      {
        quality: settings.quality || 0.5,
        distance: settings.distance || 10,
        optimizeMesh: settings.optimizeMesh !== false,
      },
    ]

    // 使用四边形简化
    const task = mesh.simplify(
      simplificationSettings,
      settings.parallelProcessing !== false,
      SimplificationType.QUADRATIC,
      (simplifiedMesh) => {
        console.log('网格简化完成:', meshName)
        if (settings.onSuccess) settings.onSuccess(simplifiedMesh)
      },
    )

    return task
  }

  // 网格优化
  optimizeMesh(meshName, options = {}) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return

    // 冻结世界矩阵
    if (options.freezeWorldMatrix !== false) {
      mesh.freezeWorldMatrix()
    }

    // 冻结法线
    if (options.freezeNormals) {
      mesh.freezeNormals()
    }

    // 设置为不可更新
    if (options.makeGeometryUnique) {
      mesh.makeGeometryUnique()
    }

    // 转换为实例化
    if (options.convertToInstancedMesh && mesh.instances.length === 0) {
      // 创建单个实例以启用实例化优化
      const instance = mesh.createInstance(mesh.name + '_instance_0')
      instance.position = mesh.position.clone()
      instance.rotation = mesh.rotation.clone()
      instance.scaling = mesh.scaling.clone()
    }

    console.log('网格优化完成:', meshName)
  }

  // 网格动画
  animateMesh(meshName, property, targetValue, duration = 2000) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return

    const animation = Animation.CreateAndStartAnimation(
      `${meshName}_${property}`,
      mesh,
      property,
      30,
      (duration / 1000) * 30,
      mesh[property],
      targetValue,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    return animation
  }

  // 网格变形
  morphMesh(meshName, targetPositions, duration = 2000) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return

    const positions = mesh.getVerticesData(VertexBuffer.PositionKind)
    if (!positions || positions.length !== targetPositions.length) {
      console.error('目标位置数据长度不匹配')
      return
    }

    // 创建变形动画
    const morphAnimation = new Animation(
      'meshMorph',
      'position',
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    const keys = []
    const frameCount = (duration / 1000) * 30

    for (let i = 0; i <= frameCount; i++) {
      const progress = i / frameCount
      const interpolatedPositions = []

      for (let j = 0; j < positions.length; j += 3) {
        const startPos = new Vector3(positions[j], positions[j + 1], positions[j + 2])
        const endPos = new Vector3(
          targetPositions[j],
          targetPositions[j + 1],
          targetPositions[j + 2],
        )
        const interpolated = Vector3.Lerp(startPos, endPos, progress)

        interpolatedPositions.push(interpolated.x, interpolated.y, interpolated.z)
      }

      keys.push({
        frame: i,
        value: interpolatedPositions,
      })
    }

    morphAnimation.setKeys(keys)

    // 执行动画
    const animatable = this.scene.beginDirectAnimation(
      mesh,
      [morphAnimation],
      0,
      frameCount,
      false,
      1,
      () => {
        // 动画完成后更新顶点数据
        mesh.updateVerticesData(VertexBuffer.PositionKind, targetPositions)
        mesh.refreshBoundingInfo()
      },
    )

    return animatable
  }

  // 网格碰撞检测
  setupCollision(meshName, options = {}) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return

    // 启用碰撞检测
    mesh.checkCollisions = true

    // 设置椭球体碰撞器
    if (options.ellipsoid) {
      mesh.ellipsoid = options.ellipsoid
    }

    // 设置椭球体偏移
    if (options.ellipsoidOffset) {
      mesh.ellipsoidOffset = options.ellipsoidOffset
    }

    // 移动碰撞回调
    if (options.onCollide) {
      mesh.onCollide = options.onCollide
    }

    // 碰撞位置回调
    if (options.onCollisionPositionChange) {
      mesh.onCollisionPositionChange = options.onCollisionPositionChange
    }
  }

  // 网格物理设置
  setupPhysics(meshName, impostor, options = {}) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return

    const physicsOptions = {
      mass: options.mass || 1,
      restitution: options.restitution || 0.7,
      friction: options.friction || 0.2,
      ...options,
    }

    mesh.physicsImpostor = new PhysicsImpostor(mesh, impostor, physicsOptions, this.scene)

    return mesh.physicsImpostor
  }

  // 网格LOD系统
  setupLOD(meshName, lodMeshes) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return

    // lodMeshes: [{ distance: number, mesh: string }, ...]
    lodMeshes.forEach((lod) => {
      const lodMesh = this.meshes.get(lod.mesh)
      if (lodMesh) {
        mesh.addLODLevel(lod.distance, lodMesh)
      }
    })

    // 添加完全隐藏级别
    if (lodMeshes.length > 0) {
      const maxDistance = Math.max(...lodMeshes.map((lod) => lod.distance))
      mesh.addLODLevel(maxDistance * 2, null)
    }
  }

  // 获取网格信息
  getMeshInfo(meshName) {
    const mesh = this.meshes.get(meshName)
    if (!mesh) return null

    const info = {
      name: meshName,
      id: mesh.id,
      uniqueId: mesh.uniqueId,
      position: mesh.position.clone(),
      rotation: mesh.rotation.clone(),
      scaling: mesh.scaling.clone(),
      visibility: mesh.visibility,
      isVisible: mesh.isVisible,
      isEnabled: mesh.isEnabled(),

      // 几何信息
      totalVertices: mesh.getTotalVertices(),
      totalIndices: mesh.getTotalIndices(),
      boundingInfo: {
        boundingBox: mesh.getBoundingInfo().boundingBox,
        boundingSphere: mesh.getBoundingInfo().boundingSphere,
      },

      // 材质信息
      material: mesh.material ? mesh.material.name : null,

      // 实例信息
      hasInstances: mesh.instances.length > 0,
      instanceCount: mesh.instances.length,

      // 物理信息
      hasPhysics: !!mesh.physicsImpostor,
      checkCollisions: mesh.checkCollisions,

      // LOD信息
      hasLODLevels: mesh.getLODLevels().length > 0,

      // 性能信息
      isWorldMatrixFrozen: mesh.isWorldMatrixFrozen,
      doNotSyncBoundingInfo: mesh.doNotSyncBoundingInfo,
    }

    return info
  }

  // 网格搜索和过滤
  findMeshes(filter) {
    const results = []

    this.meshes.forEach((mesh, name) => {
      let match = true

      if (filter.name && !name.includes(filter.name)) match = false
      if (filter.tag && (!mesh.metadata || !mesh.metadata.tag || mesh.metadata.tag !== filter.tag))
        match = false
      if (filter.material && (!mesh.material || mesh.material.name !== filter.material))
        match = false
      if (filter.hasPhysics !== undefined && !!mesh.physicsImpostor !== filter.hasPhysics)
        match = false
      if (filter.isVisible !== undefined && mesh.isVisible !== filter.isVisible) match = false

      if (match) {
        results.push({ name, mesh })
      }
    })

    return results
  }

  // 批量操作
  batchOperation(meshNames, operation, ...args) {
    const results = []

    meshNames.forEach((name) => {
      const mesh = this.meshes.get(name)
      if (mesh && typeof mesh[operation] === 'function') {
        const result = mesh[operation](...args)
        results.push({ name, result })
      }
    })

    return results
  }

  // 保存网格设置
  saveMeshSetup() {
    const setup = {
      meshes: [],
      instances: [],
      merged: [],
    }

    this.meshes.forEach((mesh, name) => {
      setup.meshes.push({
        name: name,
        ...this.getMeshInfo(name),
      })
    })

    this.instancedMeshes.forEach((instances, sourceName) => {
      setup.instances.push({
        sourceName: sourceName,
        count: instances.length,
        instances: instances.map((instance) => ({
          position: instance.position,
          rotation: instance.rotation,
          scaling: instance.scaling,
        })),
      })
    })

    this.mergedMeshes.forEach((mesh, name) => {
      setup.merged.push({
        name: name,
        info: this.getMeshInfo(name),
      })
    })

    return setup
  }

  // 资源清理
  dispose() {
    this.instancedMeshes.forEach((instances) => {
      instances.forEach((instance) => instance.dispose())
    })
    this.instancedMeshes.clear()

    this.mergedMeshes.forEach((mesh) => {
      mesh.dispose()
    })
    this.mergedMeshes.clear()

    this.meshes.forEach((mesh) => {
      mesh.dispose()
    })
    this.meshes.clear()
  }
}

// 使用示例
const meshManager = new MeshManager(scene)

// 创建基础几何体
const box = meshManager.createBox('myBox', {
  size: 2,
  position: new Vector3(0, 1, 0),
  material: someMaterial,
})

const sphere = meshManager.createSphere('mySphere', {
  diameter: 1.5,
  segments: 32,
  position: new Vector3(3, 1, 0),
})

// 创建实例化网格
const treeInstances = meshManager.createInstances('tree', 100, {
  randomPosition: {
    min: new Vector3(-50, 0, -50),
    max: new Vector3(50, 0, 50),
  },
  randomRotation: {
    min: Vector3.Zero(),
    max: new Vector3(0, Math.PI * 2, 0),
  },
  randomScaling: {
    min: new Vector3(0.8, 0.8, 0.8),
    max: new Vector3(1.2, 1.2, 1.2),
  },
})

// 设置物理属性
meshManager.setupPhysics('myBox', PhysicsImpostor.BoxImpostor, {
  mass: 1,
  restitution: 0.8,
})

// 网格动画
meshManager.animateMesh('mySphere', 'position.y', 5, 3000)

// 合并网格
const mergedMesh = meshManager.mergeMeshes(['box1', 'box2', 'box3'], {
  name: 'combinedBoxes',
  disposeSource: true,
})
```

## 🎬 Animation 动画系统详解

```javascript
// Animation 动画系统完整管理
class AnimationManager {
  constructor(scene) {
    this.scene = scene
    this.animations = new Map()
    this.animationGroups = new Map()
    this.animatables = new Map()

    this.setupDefaultAnimations()
  }

  setupDefaultAnimations() {
    // 预定义常用动画类型
    this.animationTypes = {
      FLOAT: Animation.ANIMATIONTYPE_FLOAT,
      VECTOR2: Animation.ANIMATIONTYPE_VECTOR2,
      VECTOR3: Animation.ANIMATIONTYPE_VECTOR3,
      COLOR3: Animation.ANIMATIONTYPE_COLOR3,
      COLOR4: Animation.ANIMATIONTYPE_COLOR4,
      QUATERNION: Animation.ANIMATIONTYPE_QUATERNION,
      MATRIX: Animation.ANIMATIONTYPE_MATRIX,
      SIZE: Animation.ANIMATIONTYPE_SIZE,
    }

    // 预定义循环模式
    this.loopModes = {
      RELATIVE: Animation.ANIMATIONLOOPMODE_RELATIVE,
      CYCLE: Animation.ANIMATIONLOOPMODE_CYCLE,
      CONSTANT: Animation.ANIMATIONLOOPMODE_CONSTANT,
    }
  }

  // 创建基础动画
  createAnimation(name, targetProperty, frameRate, animationType, loopMode) {
    const animation = new Animation(
      name,
      targetProperty,
      frameRate || 30,
      animationType || Animation.ANIMATIONTYPE_FLOAT,
      loopMode || Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    this.animations.set(name, animation)
    return animation
  }

  // 位置动画
  createPositionAnimation(name, positions, frameRate = 30, duration = 2000) {
    const animation = this.createAnimation(
      name,
      'position',
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = []
    const totalFrames = (duration / 1000) * frameRate

    positions.forEach((position, index) => {
      keys.push({
        frame: (totalFrames / (positions.length - 1)) * index,
        value: position,
      })
    })

    animation.setKeys(keys)

    // 设置缓动函数
    animation.setEasingFunction(new CubicEase())

    return animation
  }

  // 旋转动画
  createRotationAnimation(name, rotations, frameRate = 30, duration = 2000) {
    const animation = this.createAnimation(
      name,
      'rotation',
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = []
    const totalFrames = (duration / 1000) * frameRate

    rotations.forEach((rotation, index) => {
      keys.push({
        frame: (totalFrames / (rotations.length - 1)) * index,
        value: rotation,
      })
    })

    animation.setKeys(keys)
    return animation
  }

  // 缩放动画
  createScalingAnimation(name, scalings, frameRate = 30, duration = 2000) {
    const animation = this.createAnimation(
      name,
      'scaling',
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = []
    const totalFrames = (duration / 1000) * frameRate

    scalings.forEach((scaling, index) => {
      keys.push({
        frame: (totalFrames / (scalings.length - 1)) * index,
        value: scaling,
      })
    })

    animation.setKeys(keys)
    return animation
  }

  // 透明度动画
  createAlphaAnimation(name, alphaValues, frameRate = 30, duration = 2000) {
    const animation = this.createAnimation(
      name,
      'visibility',
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = []
    const totalFrames = (duration / 1000) * frameRate

    alphaValues.forEach((alpha, index) => {
      keys.push({
        frame: (totalFrames / (alphaValues.length - 1)) * index,
        value: alpha,
      })
    })

    animation.setKeys(keys)
    return animation
  }

  // 颜色动画（材质）
  createColorAnimation(name, colors, frameRate = 30, duration = 2000) {
    const animation = this.createAnimation(
      name,
      'material.diffuseColor',
      frameRate,
      Animation.ANIMATIONTYPE_COLOR3,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = []
    const totalFrames = (duration / 1000) * frameRate

    colors.forEach((color, index) => {
      keys.push({
        frame: (totalFrames / (colors.length - 1)) * index,
        value: color,
      })
    })

    animation.setKeys(keys)
    return animation
  }

  // 纹理偏移动画
  createTextureOffsetAnimation(name, property = 'uOffset', speed = 1.0) {
    const animation = this.createAnimation(
      name,
      `material.diffuseTexture.${property}`,
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = [
      { frame: 0, value: 0 },
      { frame: 30, value: speed },
    ]

    animation.setKeys(keys)
    return animation
  }

  // 相机动画
  createCameraAnimation(camera, targetPosition, targetTarget, duration = 2000) {
    const animationGroup = new AnimationGroup('cameraAnimation', this.scene)

    // 位置动画
    const positionAnimation = this.createPositionAnimation(
      'cameraPosition',
      [camera.position.clone(), targetPosition],
      30,
      duration,
    )

    // 目标动画（对于FreeCamera）
    if (camera instanceof FreeCamera) {
      const targetAnimation = this.createAnimation(
        'cameraTarget',
        'target',
        30,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      targetAnimation.setKeys([
        { frame: 0, value: camera.getTarget().clone() },
        { frame: (duration / 1000) * 30, value: targetTarget },
      ])

      animationGroup.addTargetedAnimation(targetAnimation, camera)
    }

    // ArcRotateCamera特殊处理
    if (camera instanceof ArcRotateCamera) {
      const direction = targetPosition.subtract(targetTarget)
      const radius = direction.length()
      const alpha = Math.atan2(direction.x, direction.z)
      const beta = Math.acos(direction.y / radius)

      const alphaAnimation = this.createAnimation(
        'cameraAlpha',
        'alpha',
        30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      const betaAnimation = this.createAnimation(
        'cameraBeta',
        'beta',
        30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      const radiusAnimation = this.createAnimation(
        'cameraRadius',
        'radius',
        30,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      const targetAnimation = this.createAnimation(
        'cameraTarget',
        'target',
        30,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
      )

      const totalFrames = (duration / 1000) * 30

      alphaAnimation.setKeys([
        { frame: 0, value: camera.alpha },
        { frame: totalFrames, value: alpha },
      ])

      betaAnimation.setKeys([
        { frame: 0, value: camera.beta },
        { frame: totalFrames, value: beta },
      ])

      radiusAnimation.setKeys([
        { frame: 0, value: camera.radius },
        { frame: totalFrames, value: radius },
      ])

      targetAnimation.setKeys([
        { frame: 0, value: camera.target.clone() },
        { frame: totalFrames, value: targetTarget },
      ])

      animationGroup.addTargetedAnimation(alphaAnimation, camera)
      animationGroup.addTargetedAnimation(betaAnimation, camera)
      animationGroup.addTargetedAnimation(radiusAnimation, camera)
      animationGroup.addTargetedAnimation(targetAnimation, camera)
    }

    animationGroup.addTargetedAnimation(positionAnimation, camera)
    this.animationGroups.set('cameraAnimation', animationGroup)

    return animationGroup
  }

  // 骨骼动画
  createSkeletonAnimation(skeleton, animationName) {
    if (!skeleton || !skeleton.animations) return null

    const skeletonAnimation = skeleton.animations.find((anim) => anim.name === animationName)
    if (!skeletonAnimation) {
      console.warn(`骨骼动画 ${animationName} 未找到`)
      return null
    }

    return skeletonAnimation
  }

  // 变形目标动画
  createMorphTargetAnimation(mesh, morphTargetIndex, influences, duration = 2000) {
    if (!mesh.morphTargetManager) {
      console.warn('网格没有变形目标管理器')
      return null
    }

    const animation = this.createAnimation(
      `morphTarget_${morphTargetIndex}`,
      `morphTargetManager.getTarget(${morphTargetIndex}).influence`,
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    )

    const keys = []
    const totalFrames = (duration / 1000) * 30

    influences.forEach((influence, index) => {
      keys.push({
        frame: (totalFrames / (influences.length - 1)) * index,
        value: influence,
      })
    })

    animation.setKeys(keys)
    return animation
  }

  // 路径动画
  createPathAnimation(name, path, duration = 5000, loop = true) {
    const animation = this.createAnimation(
      name,
      'position',
      30,
      Animation.ANIMATIONTYPE_VECTOR3,
      loop ? Animation.ANIMATIONLOOPMODE_CYCLE : Animation.ANIMATIONLOOPMODE_CONSTANT,
    )

    const keys = []
    const totalFrames = (duration / 1000) * 30

    path.forEach((point, index) => {
      keys.push({
        frame: (totalFrames / (path.length - 1)) * index,
        value: point,
      })
    })

    animation.setKeys(keys)

    // 添加插值器以平滑路径
    animation.setEasingFunction(new BezierCurveEase(0.25, 0.1, 0.25, 1.0))

    return animation
  }

  // 动画组管理
  createAnimationGroup(name, targetedAnimations = []) {
    const animationGroup = new AnimationGroup(name, this.scene)

    targetedAnimations.forEach(({ animation, target }) => {
      animationGroup.addTargetedAnimation(animation, target)
    })

    this.animationGroups.set(name, animationGroup)
    return animationGroup
  }

  // 播放动画
  playAnimation(target, animationName, loop = true, speed = 1.0, onComplete = null) {
    const animation = this.animations.get(animationName)
    if (!animation) {
      console.warn(`动画 ${animationName} 未找到`)
      return null
    }

    // 停止现有动画
    this.scene.stopAnimation(target)

    // 开始新动画
    const animatable = this.scene.beginAnimation(
      target,
      0,
      animation.getKeys()[animation.getKeys().length - 1].frame,
      loop,
      speed,
      onComplete,
    )

    this.animatables.set(`${target.name}_${animationName}`, animatable)
    return animatable
  }

  // 播放动画组
  playAnimationGroup(groupName, loop = true, speed = 1.0) {
    const group = this.animationGroups.get(groupName)
    if (!group) {
      console.warn(`动画组 ${groupName} 未找到`)
      return null
    }

    group.play(loop)
    group.speedRatio = speed

    return group
  }

  // 暂停动画
  pauseAnimation(target, animationName) {
    const key = `${target.name}_${animationName}`
    const animatable = this.animatables.get(key)

    if (animatable) {
      animatable.pause()
    }
  }

  // 恢复动画
  resumeAnimation(target, animationName) {
    const key = `${target.name}_${animationName}`
    const animatable = this.animatables.get(key)

    if (animatable) {
      animatable.restart()
    }
  }

  // 停止动画
  stopAnimation(target, animationName = null) {
    if (animationName) {
      const key = `${target.name}_${animationName}`
      const animatable = this.animatables.get(key)

      if (animatable) {
        animatable.stop()
        this.animatables.delete(key)
      }
    } else {
      // 停止目标对象的所有动画
      this.scene.stopAnimation(target)

      // 清理相关的animatable记录
      for (const [key, animatable] of this.animatables) {
        if (key.startsWith(target.name + '_')) {
          animatable.stop()
          this.animatables.delete(key)
        }
      }
    }
  }

  // 缓动函数
  createEasingFunction(type, ...params) {
    switch (type) {
      case 'linear':
        return null // 默认线性
      case 'cubic':
        return new CubicEase()
      case 'quadratic':
        return new QuadraticEase()
      case 'quartic':
        return new QuarticEase()
      case 'quintic':
        return new QuinticEase()
      case 'sine':
        return new SineEase()
      case 'exponential':
        return new ExponentialEase()
      case 'circle':
        return new CircleEase()
      case 'back':
        return new BackEase(params[0] || 1.7)
      case 'elastic':
        return new ElasticEase(params[0] || 3, params[1] || 1)
      case 'bounce':
        return new BounceEase(params[0] || 3, params[1] || 2)
      case 'bezier':
        return new BezierCurveEase(
          params[0] || 0.25,
          params[1] || 0.1,
          params[2] || 0.25,
          params[3] || 1.0,
        )
      default:
        return new CubicEase()
    }
  }

  // 动画事件
  addAnimationEvent(animation, frame, action) {
    animation.addEvent(
      new AnimationEvent(
        frame,
        action,
        false, // 只执行一次
      ),
    )
  }

  // 获取动画信息
  getAnimationInfo(animationName) {
    const animation = this.animations.get(animationName)
    if (!animation) return null

    const keys = animation.getKeys()

    return {
      name: animationName,
      targetProperty: animation.targetProperty,
      framePerSecond: animation.framePerSecond,
      dataType: animation.dataType,
      loopMode: animation.loopBehavior,
      keyFrameCount: keys.length,
      duration: keys.length > 0 ? keys[keys.length - 1].frame / animation.framePerSecond : 0,
      hasEasing: !!animation.getEasingFunction(),
    }
  }

  // 从Babylon文件加载动画
  async loadAnimationsFromFile(url, targetMesh) {
    try {
      const importResult = await SceneLoader.ImportMeshAsync('', '', url, this.scene)

      if (importResult.animationGroups.length > 0) {
        importResult.animationGroups.forEach((group) => {
          this.animationGroups.set(group.name, group)
        })

        console.log(`加载了 ${importResult.animationGroups.length} 个动画组`)
        return importResult.animationGroups
      }

      return []
    } catch (error) {
      console.error('加载动画文件失败:', error)
      return []
    }
  }

  // 混合动画
  blendAnimations(target, animation1Name, animation2Name, blendFactor) {
    const anim1 = this.animations.get(animation1Name)
    const anim2 = this.animations.get(animation2Name)

    if (!anim1 || !anim2) {
      console.warn('找不到要混合的动画')
      return null
    }

    // 这里需要自定义混合逻辑
    // BabylonJS的动画混合通常通过AnimationGroup的weight属性实现
    const group1 = this.animationGroups.get(animation1Name + '_group')
    const group2 = this.animationGroups.get(animation2Name + '_group')

    if (group1 && group2) {
      group1.weight = 1 - blendFactor
      group2.weight = blendFactor
    }
  }

  // 保存动画设置
  saveAnimationSetup() {
    const setup = {
      animations: [],
      animationGroups: [],
    }

    this.animations.forEach((animation, name) => {
      setup.animations.push({
        name: name,
        ...this.getAnimationInfo(name),
      })
    })

    this.animationGroups.forEach((group, name) => {
      setup.animationGroups.push({
        name: name,
        isPlaying: group.isPlaying,
        speedRatio: group.speedRatio,
        weight: group.weight,
        targetedAnimations: group.targetedAnimations.length,
      })
    })

    return setup
  }

  // 资源清理
  dispose() {
    // 停止所有动画
    this.animatables.forEach((animatable) => {
      animatable.stop()
    })
    this.animatables.clear()

    // 清理动画组
    this.animationGroups.forEach((group) => {
      group.dispose()
    })
    this.animationGroups.clear()

    // 清理动画
    this.animations.forEach((animation) => {
      animation.dispose()
    })
    this.animations.clear()
  }
}

// 使用示例
const animationManager = new AnimationManager(scene)

// 创建位置动画
const positionAnim = animationManager.createPositionAnimation(
  'boxMove',
  [new Vector3(0, 0, 0), new Vector3(5, 2, 0), new Vector3(10, 0, 5), new Vector3(0, 0, 0)],
  30,
  4000,
)

// 添加缓动函数
positionAnim.setEasingFunction(animationManager.createEasingFunction('bounce', 3, 2))

// 创建旋转动画
const rotationAnim = animationManager.createRotationAnimation(
  'boxRotate',
  [new Vector3(0, 0, 0), new Vector3(0, Math.PI, 0), new Vector3(0, Math.PI * 2, 0)],
  30,
  3000,
)

// 创建动画组
const boxAnimGroup = animationManager.createAnimationGroup('boxAnimations', [
  { animation: positionAnim, target: myBox },
  { animation: rotationAnim, target: myBox },
])

// 播放动画组
animationManager.playAnimationGroup('boxAnimations', true, 1.5)

// 相机动画
const cameraAnim = animationManager.createCameraAnimation(
  scene.activeCamera,
  new Vector3(10, 10, 10),
  Vector3.Zero(),
  2000,
)

// 播放相机动画
animationManager.playAnimationGroup('cameraAnimation')
```

## 🎆 ParticleSystem 粒子系统详解

```javascript
// ParticleSystem 粒子系统完整管理
class ParticleSystemManager {
  constructor(scene) {
    this.scene = scene
    this.particleSystems = new Map()
    this.gpuParticleSystems = new Map()

    this.setupDefaultParticleSystems()
  }

  setupDefaultParticleSystems() {
    // 检查GPU粒子系统支持
    this.supportsGPUParticles = GPUParticleSystem.IsSupported

    console.log('GPU粒子系统支持:', this.supportsGPUParticles)
  }

  // 创建基础CPU粒子系统
  createParticleSystem(name, capacity = 2000, emitter = null) {
    const particleSystem = new ParticleSystem(name, capacity, this.scene)

    // 基础发射器设置
    if (emitter) {
      particleSystem.emitter = emitter
    } else {
      particleSystem.emitter = Vector3.Zero()
    }

    // 粒子纹理
    particleSystem.particleTexture = new Texture('/textures/flare.png', this.scene)

    // 发射属性
    particleSystem.emitRate = 300 // 每秒发射粒子数
    particleSystem.maxEmitPower = 1.5 // 最大发射力度
    particleSystem.minEmitPower = 1.0 // 最小发射力度
    particleSystem.updateSpeed = 0.005 // 更新速度

    // 生命周期
    particleSystem.minLifeTime = 0.3 // 最小生命时间
    particleSystem.maxLifeTime = 1.5 // 最大生命时间

    // 尺寸
    particleSystem.minSize = 0.1 // 最小尺寸
    particleSystem.maxSize = 0.5 // 最大尺寸

    // 角度范围
    particleSystem.minAngularSpeed = 0 // 最小角速度
    particleSystem.maxAngularSpeed = Math.PI // 最大角速度

    // 方向
    particleSystem.direction1 = new Vector3(-7, 8, 3) // 方向1
    particleSystem.direction2 = new Vector3(7, 8, -3) // 方向2

    // 重力
    particleSystem.gravity = new Vector3(0, -9.81, 0)

    // 颜色变化
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0) // 起始颜色
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0) // 中间颜色
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0) // 消失颜色

    // 发射形状
    particleSystem.minEmitBox = new Vector3(-1, 0, 0) // 发射盒最小值
    particleSystem.maxEmitBox = new Vector3(1, 0, 0) // 发射盒最大值

    // 混合模式
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE

    this.particleSystems.set(name, particleSystem)
    return particleSystem
  }

  // 创建GPU粒子系统
  createGPUParticleSystem(name, capacity = 50000, emitter = null) {
    if (!this.supportsGPUParticles) {
      console.warn('当前设备不支持GPU粒子系统，使用CPU粒子系统代替')
      return this.createParticleSystem(name, Math.min(capacity, 5000), emitter)
    }

    const particleSystem = new GPUParticleSystem(name, { capacity: capacity }, this.scene)

    // 基础发射器设置
    if (emitter) {
      particleSystem.emitter = emitter
    } else {
      particleSystem.emitter = Vector3.Zero()
    }

    // 粒子纹理
    particleSystem.particleTexture = new Texture('/textures/flare.png', this.scene)

    // GPU特有的发射属性
    particleSystem.emitRate = 5000 // GPU可以处理更多粒子
    particleSystem.maxEmitPower = 1.5
    particleSystem.minEmitPower = 1.0
    particleSystem.updateSpeed = 0.005

    // 生命周期
    particleSystem.minLifeTime = 0.3
    particleSystem.maxLifeTime = 1.5

    // 尺寸
    particleSystem.minSize = 0.1
    particleSystem.maxSize = 0.5

    // 角度范围
    particleSystem.minAngularSpeed = 0
    particleSystem.maxAngularSpeed = Math.PI

    // 方向
    particleSystem.direction1 = new Vector3(-7, 8, 3)
    particleSystem.direction2 = new Vector3(7, 8, -3)

    // 重力
    particleSystem.gravity = new Vector3(0, -9.81, 0)

    // 颜色变化
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0)
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0)
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0)

    // 发射形状
    particleSystem.minEmitBox = new Vector3(-1, 0, 0)
    particleSystem.maxEmitBox = new Vector3(1, 0, 0)

    // 混合模式
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE

    this.gpuParticleSystems.set(name, particleSystem)
    return particleSystem
  }

  // 创建火焰效果
  createFireEffect(name, emitter, intensity = 1.0) {
    const fireSystem = this.createParticleSystem(name + '_fire', 2000, emitter)

    // 火焰特效参数
    fireSystem.particleTexture = new Texture('/textures/fire.jpg', this.scene)
    fireSystem.emitRate = 300 * intensity
    fireSystem.maxEmitPower = 1.0
    fireSystem.minEmitPower = 0.8

    // 火焰生命周期
    fireSystem.minLifeTime = 0.5
    fireSystem.maxLifeTime = 1.0

    // 火焰尺寸
    fireSystem.minSize = 0.5 * intensity
    fireSystem.maxSize = 1.0 * intensity

    // 火焰方向（向上）
    fireSystem.direction1 = new Vector3(-0.5, 1, -0.5)
    fireSystem.direction2 = new Vector3(0.5, 1, 0.5)

    // 无重力（火焰向上飘）
    fireSystem.gravity = new Vector3(0, 0, 0)

    // 火焰颜色渐变
    fireSystem.color1 = new Color4(1, 1, 0, 1.0) // 黄色
    fireSystem.color2 = new Color4(1, 0.5, 0, 1.0) // 橙色
    fireSystem.colorDead = new Color4(0.5, 0, 0, 0.0) // 红色渐隐

    // 火焰发射形状
    fireSystem.minEmitBox = new Vector3(-0.3, 0, -0.3)
    fireSystem.maxEmitBox = new Vector3(0.3, 0, 0.3)

    // 混合模式（叠加发光）
    fireSystem.blendMode = ParticleSystem.BLENDMODE_ADD

    return fireSystem
  }

  // 创建烟雾效果
  createSmokeEffect(name, emitter, intensity = 1.0) {
    const smokeSystem = this.createParticleSystem(name + '_smoke', 1000, emitter)

    // 烟雾特效参数
    smokeSystem.particleTexture = new Texture('/textures/smoke.png', this.scene)
    smokeSystem.emitRate = 50 * intensity
    smokeSystem.maxEmitPower = 0.5
    smokeSystem.minEmitPower = 0.2

    // 烟雾生命周期（较长）
    smokeSystem.minLifeTime = 2.0
    smokeSystem.maxLifeTime = 4.0

    // 烟雾尺寸（逐渐增大）
    smokeSystem.minSize = 1.0 * intensity
    smokeSystem.maxSize = 3.0 * intensity
    smokeSystem.minScaleX = 1.0
    smokeSystem.maxScaleX = 3.0
    smokeSystem.minScaleY = 1.0
    smokeSystem.maxScaleY = 3.0

    // 烟雾方向（向上扩散）
    smokeSystem.direction1 = new Vector3(-1, 1, -1)
    smokeSystem.direction2 = new Vector3(1, 1, 1)

    // 轻微重力
    smokeSystem.gravity = new Vector3(0, -1, 0)

    // 烟雾颜色（灰色渐隐）
    smokeSystem.color1 = new Color4(0.8, 0.8, 0.8, 0.8)
    smokeSystem.color2 = new Color4(0.5, 0.5, 0.5, 0.5)
    smokeSystem.colorDead = new Color4(0.3, 0.3, 0.3, 0.0)

    // 烟雾发射形状
    smokeSystem.minEmitBox = new Vector3(-0.5, 0, -0.5)
    smokeSystem.maxEmitBox = new Vector3(0.5, 0.2, 0.5)

    // 混合模式（透明）
    smokeSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD

    return smokeSystem
  }

  // 创建爆炸效果
  createExplosionEffect(name, position, size = 1.0) {
    const explosionSystem = this.createParticleSystem(name + '_explosion', 5000, position)

    // 爆炸特效参数
    explosionSystem.particleTexture = new Texture('/textures/explosion.png', this.scene)
    explosionSystem.emitRate = 10000 // 瞬间大量发射
    explosionSystem.maxEmitPower = 10.0 * size
    explosionSystem.minEmitPower = 5.0 * size

    // 爆炸生命周期（短暂）
    explosionSystem.minLifeTime = 0.1
    explosionSystem.maxLifeTime = 0.8

    // 爆炸尺寸
    explosionSystem.minSize = 0.5 * size
    explosionSystem.maxSize = 2.0 * size

    // 全方向爆炸
    explosionSystem.createSphereEmitter(0.1, 1.0)

    // 重力影响
    explosionSystem.gravity = new Vector3(0, -5, 0)

    // 爆炸颜色
    explosionSystem.color1 = new Color4(1, 1, 1, 1.0) // 白色闪光
    explosionSystem.color2 = new Color4(1, 0.8, 0.2, 1.0) // 橙黄色
    explosionSystem.colorDead = new Color4(0.3, 0.1, 0, 0.0) // 暗红色消散

    // 混合模式（叠加）
    explosionSystem.blendMode = ParticleSystem.BLENDMODE_ADD

    // 限制发射时间（爆炸是瞬间的）
    explosionSystem.targetStopDuration = 0.1

    return explosionSystem
  }

  // 创建雨雪效果
  createWeatherEffect(
    name,
    type = 'rain',
    intensity = 1.0,
    area = { width: 50, height: 20, depth: 50 },
  ) {
    const weatherSystem = this.createParticleSystem(name + '_weather', 10000)

    if (type === 'rain') {
      // 雨效果
      weatherSystem.particleTexture = new Texture('/textures/raindrop.png', this.scene)
      weatherSystem.emitRate = 1000 * intensity
      weatherSystem.minLifeTime = 1.0
      weatherSystem.maxLifeTime = 3.0
      weatherSystem.minSize = 0.1
      weatherSystem.maxSize = 0.3

      // 雨滴方向（向下）
      weatherSystem.direction1 = new Vector3(-0.2, -1, -0.1)
      weatherSystem.direction2 = new Vector3(0.2, -1, 0.1)
      weatherSystem.gravity = new Vector3(0, -15, 0)

      // 雨滴颜色
      weatherSystem.color1 = new Color4(0.7, 0.8, 1.0, 0.8)
      weatherSystem.color2 = new Color4(0.5, 0.6, 0.8, 0.6)
      weatherSystem.colorDead = new Color4(0.3, 0.4, 0.6, 0.0)
    } else if (type === 'snow') {
      // 雪效果
      weatherSystem.particleTexture = new Texture('/textures/snowflake.png', this.scene)
      weatherSystem.emitRate = 500 * intensity
      weatherSystem.minLifeTime = 3.0
      weatherSystem.maxLifeTime = 8.0
      weatherSystem.minSize = 0.3
      weatherSystem.maxSize = 0.8

      // 雪花飘落
      weatherSystem.direction1 = new Vector3(-1, -0.5, -1)
      weatherSystem.direction2 = new Vector3(1, -0.5, 1)
      weatherSystem.gravity = new Vector3(0, -2, 0)

      // 雪花颜色
      weatherSystem.color1 = new Color4(1, 1, 1, 0.9)
      weatherSystem.color2 = new Color4(0.9, 0.9, 1, 0.8)
      weatherSystem.colorDead = new Color4(0.8, 0.8, 0.9, 0.0)
    }

    // 设置发射区域
    weatherSystem.createBoxEmitter(
      new Vector3(-1, 0, -1),
      new Vector3(1, 0, 1),
      new Vector3(-area.width / 2, area.height, -area.depth / 2),
      new Vector3(area.width / 2, area.height, area.depth / 2),
    )

    return weatherSystem
  }

  // 设置发射器形状
  setupEmitterShape(particleSystem, shapeType, ...params) {
    switch (shapeType) {
      case 'box':
        const [minEmitBox, maxEmitBox] = params
        particleSystem.minEmitBox = minEmitBox || new Vector3(-1, 0, -1)
        particleSystem.maxEmitBox = maxEmitBox || new Vector3(1, 0, 1)
        break

      case 'sphere':
        const [radius, radiusRange] = params
        particleSystem.createSphereEmitter(radius || 1.0, radiusRange || 1.0)
        break

      case 'cone':
        const [coneRadius, coneAngle, coneHeight] = params
        particleSystem.createConeEmitter(
          coneRadius || 1.0,
          coneAngle || Math.PI / 4,
          coneHeight || 1.0,
        )
        break

      case 'cylinder':
        const [cylRadius, cylHeight, cylRadiusRange] = params
        particleSystem.createCylinderEmitter(
          cylRadius || 1.0,
          cylHeight || 1.0,
          cylRadiusRange || 1.0,
          0, // directionRandomizer
        )
        break

      case 'hemisphere':
        const [hemiRadius, hemiRadiusRange] = params
        particleSystem.createHemisphericEmitter(hemiRadius || 1.0, hemiRadiusRange || 1.0)
        break

      default:
        console.warn('未知的发射器形状:', shapeType)
    }
  }

  // 启动粒子系统
  startParticleSystem(name) {
    const cpuSystem = this.particleSystems.get(name)
    const gpuSystem = this.gpuParticleSystems.get(name)

    if (cpuSystem) {
      cpuSystem.start()
      console.log(`CPU粒子系统 ${name} 已启动`)
    } else if (gpuSystem) {
      gpuSystem.start()
      console.log(`GPU粒子系统 ${name} 已启动`)
    } else {
      console.warn(`粒子系统 ${name} 未找到`)
    }
  }

  // 停止粒子系统
  stopParticleSystem(name) {
    const cpuSystem = this.particleSystems.get(name)
    const gpuSystem = this.gpuParticleSystems.get(name)

    if (cpuSystem) {
      cpuSystem.stop()
    } else if (gpuSystem) {
      gpuSystem.stop()
    }
  }

  // 重置粒子系统
  resetParticleSystem(name) {
    const cpuSystem = this.particleSystems.get(name)
    const gpuSystem = this.gpuParticleSystems.get(name)

    if (cpuSystem) {
      cpuSystem.reset()
    } else if (gpuSystem) {
      gpuSystem.reset()
    }
  }

  // 获取粒子系统信息
  getParticleSystemInfo(particleSystemName) {
    const particleSystem = this.particleSystems.get(particleSystemName)
    if (!particleSystem) return null

    const info = {
      name: particleSystemName,
      type: particleSystem.getClassName(),
      emitRate: particleSystem.emitRate,
      lifeTime: particleSystem.lifeTime,
      size: particleSystem.size,
      color: particleSystem.color,
      color2: particleSystem.color2,
      colorDead: particleSystem.colorDead,
      gravity: particleSystem.gravity,
      direction: particleSystem.direction,
      direction2: particleSystem.direction2,
      minEmitPower: particleSystem.minEmitPower,
      maxEmitPower: particleSystem.maxEmitPower,
      minLifeTime: particleSystem.minLifeTime,
      maxLifeTime: particleSystem.maxLifeTime,
      minSize: particleSystem.minSize,
      maxSize: particleSystem.maxSize,
      minEmitBox: particleSystem.minEmitBox,
      maxEmitBox: particleSystem.maxEmitBox,
      emitBox: particleSystem.emitBox,
      particles: particleSystem.particles.map((particle) => ({
        position: particle.position.clone(),
        velocity: particle.velocity.clone(),
        color: particle.color.clone(),
        size: particle.size,
        lifeTime: particle.lifeTime,
      })),
    }

    return info
  }

  // 批量应用粒子系统
  applyParticleSystems(particleSystems) {
    particleSystems.forEach((particleSystem, name) => {
      this.applyParticleSystem(name, particleSystem)
    })
  }

  // 应用粒子系统
  applyParticleSystem(particleSystemName, particleSystem) {
    const currentParticleSystem = this.particleSystems.get(particleSystemName)
    if (!currentParticleSystem) return

    currentParticleSystem.emitRate = particleSystem.emitRate
    currentParticleSystem.lifeTime = particleSystem.lifeTime
    currentParticleSystem.size = particleSystem.size
    currentParticleSystem.color = particleSystem.color
    currentParticleSystem.color2 = particleSystem.color2
    currentParticleSystem.colorDead = particleSystem.colorDead
    currentParticleSystem.gravity = particleSystem.gravity
    currentParticleSystem.direction = particleSystem.direction
    currentParticleSystem.direction2 = particleSystem.direction2
    currentParticleSystem.minEmitPower = particleSystem.minEmitPower
    currentParticleSystem.maxEmitPower = particleSystem.maxEmitPower
    currentParticleSystem.minLifeTime = particleSystem.minLifeTime
    currentParticleSystem.maxLifeTime = particleSystem.maxLifeTime
    currentParticleSystem.minSize = particleSystem.minSize
    currentParticleSystem.maxSize = particleSystem.maxSize
    currentParticleSystem.minEmitBox = particleSystem.minEmitBox
    currentParticleSystem.maxEmitBox = particleSystem.maxEmitBox
    currentParticleSystem.emitBox = particleSystem.emitBox
    currentParticleSystem.particles = particleSystem.particles.map((particle) => ({
      position: particle.position.clone(),
      velocity: particle.velocity.clone(),
      color: particle.color.clone(),
      size: particle.size,
      lifeTime: particle.lifeTime,
    }))
  }

  // 资源清理
  dispose() {
    this.particleSystems.forEach((particleSystem) => {
      particleSystem.dispose()
    })
    this.particleSystems.clear()
  }
}

// 使用示例
const particleSystemManager = new ParticleSystemManager(scene)

// 创建基础粒子系统
const basicParticleSystem = particleSystemManager.createBasicParticleSystem()

// 创建复合粒子系统
const complexParticleSystem = particleSystemManager.createComplexParticleSystem()

// 添加粒子系统到场景
scene.addParticleSystem(basicParticleSystem)
scene.addParticleSystem(complexParticleSystem)
```

## 🔊 Audio 音频系统详解

```javascript
// Audio 音频系统完整管理
class AudioManager {
  constructor(scene) {
    this.scene = scene
    this.sounds = new Map()
    this.soundTracks = new Map()
    this.audioEngine = Engine.audioEngine

    this.setupDefaultAudio()
  }

  setupDefaultAudio() {
    // 检查音频引擎是否可用
    if (!this.audioEngine) {
      console.warn('音频引擎不可用')
      return
    }

    console.log('音频引擎已初始化')

    // 设置全局音频参数
    this.setGlobalVolume(1.0)
  }

  // 创建音效
  createSound(name, url, options = {}) {
    const soundOptions = {
      // 基础属性
      autoplay: options.autoplay || false, // 自动播放
      loop: options.loop || false, // 循环播放
      volume: options.volume || 1.0, // 音量
      playbackRate: options.playbackRate || 1.0, // 播放速率

      // 3D音频属性
      spatialSound: options.spatialSound || false, // 3D空间音效
      maxDistance: options.maxDistance || 100, // 最大距离
      rolloffFactor: options.rolloffFactor || 1.0, // 衰减因子
      refDistance: options.refDistance || 1.0, // 参考距离
      distanceModel: options.distanceModel || 'linear', // 距离模型

      // 回调函数
      onended: options.onended || null, // 播放结束回调
      onload: options.onload || null, // 加载完成回调
      onerror: options.onerror || null, // 错误回调

      // 其他选项
      streaming: options.streaming || false, // 流式播放
      length: options.length || 0, // 音频长度（秒）
      offset: options.offset || 0, // 播放偏移
    }

    const sound = new Sound(name, url, this.scene, soundOptions.onload, soundOptions)

    this.sounds.set(name, sound)
    return sound
  }

  // 创建背景音乐
  createBackgroundMusic(name, url, options = {}) {
    const musicOptions = {
      autoplay: options.autoplay || false,
      loop: options.loop || true, // 背景音乐通常循环播放
      volume: options.volume || 0.5, // 背景音乐音量较低
      spatialSound: false, // 背景音乐不使用3D音效
      streaming: options.streaming || true, // 大文件使用流式播放
      ...options,
    }

    return this.createSound(name, url, musicOptions)
  }

  // 创建3D音效
  createSpatialSound(name, url, mesh, options = {}) {
    const spatialOptions = {
      spatialSound: true,
      maxDistance: options.maxDistance || 50,
      rolloffFactor: options.rolloffFactor || 2.0,
      refDistance: options.refDistance || 1.0,
      distanceModel: options.distanceModel || 'exponential',
      ...options,
    }

    const sound = this.createSound(name, url, spatialOptions)

    // 将音效附加到网格
    if (mesh) {
      sound.attachToMesh(mesh)
    }

    return sound
  }

  // 创建音轨组
  createSoundTrack(name, sounds = []) {
    const soundTrack = new SoundTrack(this.scene, {
      volume: 1.0,
      mainTrack: false,
    })

    // 添加音效到音轨
    sounds.forEach((soundName) => {
      const sound = this.sounds.get(soundName)
      if (sound) {
        soundTrack.addSound(sound)
      }
    })

    this.soundTracks.set(name, soundTrack)
    return soundTrack
  }

  // 播放音效
  playSound(name, when = 0, offset = 0, length = 0) {
    const sound = this.sounds.get(name)
    if (!sound) {
      console.warn(`音效 ${name} 未找到`)
      return false
    }

    try {
      if (when > 0) {
        // 延迟播放
        setTimeout(() => {
          sound.play(when, offset, length)
        }, when * 1000)
      } else {
        sound.play(when, offset, length)
      }
      return true
    } catch (error) {
      console.error(`播放音效 ${name} 失败:`, error)
      return false
    }
  }

  // 停止音效
  stopSound(name) {
    const sound = this.sounds.get(name)
    if (sound) {
      sound.stop()
    }
  }

  // 暂停音效
  pauseSound(name) {
    const sound = this.sounds.get(name)
    if (sound) {
      sound.pause()
    }
  }

  // 设置音效音量
  setSoundVolume(name, volume) {
    const sound = this.sounds.get(name)
    if (sound) {
      sound.setVolume(volume)
    }
  }

  // 淡入效果
  fadeInSound(name, duration = 1.0, targetVolume = 1.0) {
    const sound = this.sounds.get(name)
    if (!sound) return

    const startVolume = 0
    const steps = 60 // 60帧
    const stepDuration = (duration * 1000) / steps
    const volumeStep = (targetVolume - startVolume) / steps

    sound.setVolume(startVolume)
    sound.play()

    let currentStep = 0
    const fadeInterval = setInterval(() => {
      currentStep++
      const currentVolume = startVolume + volumeStep * currentStep
      sound.setVolume(currentVolume)

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        sound.setVolume(targetVolume)
      }
    }, stepDuration)
  }

  // 淡出效果
  fadeOutSound(name, duration = 1.0, stopAfterFade = true) {
    const sound = this.sounds.get(name)
    if (!sound) return

    const startVolume = sound.getVolume()
    const targetVolume = 0
    const steps = 60
    const stepDuration = (duration * 1000) / steps
    const volumeStep = (startVolume - targetVolume) / steps

    let currentStep = 0
    const fadeInterval = setInterval(() => {
      currentStep++
      const currentVolume = startVolume - volumeStep * currentStep
      sound.setVolume(Math.max(0, currentVolume))

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        sound.setVolume(targetVolume)
        if (stopAfterFade) {
          sound.stop()
        }
      }
    }, stepDuration)
  }

  // 设置全局音量
  setGlobalVolume(volume) {
    if (this.audioEngine) {
      Engine.audioEngine.setGlobalVolume(volume)
    }
  }

  // 预加载音频
  async preloadSound(name, url) {
    return new Promise((resolve, reject) => {
      const sound = new Sound(
        name,
        url,
        this.scene,
        () => {
          this.sounds.set(name, sound)
          console.log(`音效 ${name} 预加载完成`)
          resolve(sound)
        },
        {
          autoplay: false,
          onError: (sound, error) => {
            console.error(`音效 ${name} 加载失败:`, error)
            reject(error)
          },
        },
      )
    })
  }

  // 获取音效信息
  getSoundInfo(soundName) {
    const sound = this.sounds.get(soundName)
    if (!sound) return null

    return {
      name: soundName,
      isPlaying: sound.isPlaying,
      isPaused: sound.isPaused,
      volume: sound.getVolume(),
      playbackRate: sound.playbackRate,
      spatialSound: sound.spatialSound,
      loop: sound.loop,
      autoplay: sound.autoplay,
    }
  }

  // 资源清理
  dispose() {
    this.sounds.forEach((sound) => {
      sound.dispose()
    })
    this.sounds.clear()

    this.soundTracks.forEach((track) => {
      track.dispose()
    })
    this.soundTracks.clear()
  }
}

// 使用示例
const audioManager = new AudioManager(scene)

// 创建背景音乐
audioManager.createBackgroundMusic('bgMusic', '/audio/background.mp3', {
  volume: 0.3,
  autoplay: true,
})

// 创建3D音效
const fireSound = audioManager.createSpatialSound('fire', '/audio/fire.wav', fireMesh, {
  loop: true,
  volume: 0.8,
  maxDistance: 50,
})

// 播放音效
audioManager.playSound('fire')

// 淡入背景音乐
audioManager.fadeInSound('bgMusic', 2.0, 0.5)
```

## 🎮 Input 输入系统详解

```javascript
// Input 输入系统完整管理
class InputManager {
  constructor(scene) {
    this.scene = scene
    this.canvas = scene.getEngine().getRenderingCanvas()
    this.actionManager = new ActionManager(scene)

    // 输入状态
    this.keys = new Map()
    this.mouseButtons = new Map()
    this.mousePosition = { x: 0, y: 0 }
    this.gamepads = new Map()

    // 事件监听器
    this.keyboardObservables = new Map()
    this.pointerObservables = new Map()

    this.setupDefaultInput()
  }

  setupDefaultInput() {
    // 设置键盘输入
    this.setupKeyboardInput()

    // 设置鼠标输入
    this.setupPointerInput()

    // 设置游戏手柄输入
    this.setupGamepadInput()

    // 设置场景ActionManager
    this.scene.actionManager = this.actionManager
  }

  // 设置键盘输入
  setupKeyboardInput() {
    // 监听键盘按下
    this.keyboardObservables.set(
      'keydown',
      this.scene.onKeyboardObservable.add((kbInfo) => {
        if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
          this.keys.set(kbInfo.event.code, {
            key: kbInfo.event.key,
            code: kbInfo.event.code,
            pressed: true,
            timestamp: Date.now(),
          })

          this.onKeyDown(kbInfo.event)
        }
      }),
    )

    // 监听键盘释放
    this.keyboardObservables.set(
      'keyup',
      this.scene.onKeyboardObservable.add((kbInfo) => {
        if (kbInfo.type === KeyboardEventTypes.KEYUP) {
          const keyData = this.keys.get(kbInfo.event.code)
          if (keyData) {
            keyData.pressed = false
            keyData.releasedTimestamp = Date.now()
          }

          this.onKeyUp(kbInfo.event)
        }
      }),
    )
  }

  // 设置指针（鼠标/触摸）输入
  setupPointerInput() {
    // 监听指针按下
    this.pointerObservables.set(
      'pointerdown',
      this.scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
          this.mouseButtons.set(pointerInfo.event.button, {
            button: pointerInfo.event.button,
            pressed: true,
            position: { x: pointerInfo.event.clientX, y: pointerInfo.event.clientY },
            timestamp: Date.now(),
          })

          this.onPointerDown(pointerInfo.event, pointerInfo)
        }
      }),
    )

    // 监听指针释放
    this.pointerObservables.set(
      'pointerup',
      this.scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERUP) {
          const buttonData = this.mouseButtons.get(pointerInfo.event.button)
          if (buttonData) {
            buttonData.pressed = false
            buttonData.releasedTimestamp = Date.now()
          }

          this.onPointerUp(pointerInfo.event, pointerInfo)
        }
      }),
    )

    // 监听指针移动
    this.pointerObservables.set(
      'pointermove',
      this.scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
          this.mousePosition.x = pointerInfo.event.clientX
          this.mousePosition.y = pointerInfo.event.clientY

          this.onPointerMove(pointerInfo.event, pointerInfo)
        }
      }),
    )

    // 监听鼠标滚轮
    this.pointerObservables.set(
      'wheel',
      this.scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === PointerEventTypes.POINTERWHEEL) {
          this.onWheel(pointerInfo.event, pointerInfo)
        }
      }),
    )
  }

  // 设置游戏手柄输入
  setupGamepadInput() {
    // 检查游戏手柄支持
    if (navigator.getGamepads) {
      // 监听游戏手柄连接
      window.addEventListener('gamepadconnected', (event) => {
        this.onGamepadConnected(event.gamepad)
      })

      // 监听游戏手柄断开
      window.addEventListener('gamepaddisconnected', (event) => {
        this.onGamepadDisconnected(event.gamepad)
      })

      // 定期检查游戏手柄状态
      this.gamepadCheckInterval = setInterval(() => {
        this.updateGamepadState()
      }, 16) // 60fps
    }
  }

  // 键盘事件处理器（可重写）
  onKeyDown(event) {
    // 默认实现 - 可被子类重写
    console.log(`Key pressed: ${event.key} (${event.code})`)
  }

  onKeyUp(event) {
    // 默认实现 - 可被子类重写
    console.log(`Key released: ${event.key} (${event.code})`)
  }

  // 指针事件处理器（可重写）
  onPointerDown(event, pointerInfo) {
    console.log(`Pointer down: button ${event.button} at (${event.clientX}, ${event.clientY})`)
  }

  onPointerUp(event, pointerInfo) {
    console.log(`Pointer up: button ${event.button}`)
  }

  onPointerMove(event, pointerInfo) {
    // 通常不打印移动事件，频率太高
  }

  onWheel(event, pointerInfo) {
    console.log(`Wheel: ${pointerInfo.event.deltaY}`)
  }

  // 游戏手柄事件处理器
  onGamepadConnected(gamepad) {
    console.log(`Gamepad connected: ${gamepad.id}`)
    this.gamepads.set(gamepad.index, {
      gamepad: gamepad,
      lastState: {
        buttons: Array(gamepad.buttons.length).fill(false),
        axes: Array(gamepad.axes.length).fill(0),
      },
    })
  }

  onGamepadDisconnected(gamepad) {
    console.log(`Gamepad disconnected: ${gamepad.id}`)
    this.gamepads.delete(gamepad.index)
  }

  updateGamepadState() {
    const gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
      if (gamepad && this.gamepads.has(gamepad.index)) {
        const gamepadData = this.gamepads.get(gamepad.index)
        const lastState = gamepadData.lastState

        // 检查按钮状态变化
        gamepad.buttons.forEach((button, index) => {
          const wasPressed = lastState.buttons[index]
          const isPressed = button.pressed

          if (isPressed && !wasPressed) {
            this.onGamepadButtonDown(gamepad, index, button)
          } else if (!isPressed && wasPressed) {
            this.onGamepadButtonUp(gamepad, index, button)
          }

          lastState.buttons[index] = isPressed
        })

        // 检查摇杆状态变化
        gamepad.axes.forEach((axis, index) => {
          const lastValue = lastState.axes[index]
          const currentValue = axis

          if (Math.abs(currentValue - lastValue) > 0.1) {
            // 死区处理
            this.onGamepadAxisMove(gamepad, index, currentValue, lastValue)
          }

          lastState.axes[index] = currentValue
        })
      }
    }
  }

  onGamepadButtonDown(gamepad, buttonIndex, button) {
    console.log(`Gamepad ${gamepad.index} button ${buttonIndex} pressed`)
  }

  onGamepadButtonUp(gamepad, buttonIndex, button) {
    console.log(`Gamepad ${gamepad.index} button ${buttonIndex} released`)
  }

  onGamepadAxisMove(gamepad, axisIndex, currentValue, lastValue) {
    console.log(`Gamepad ${gamepad.index} axis ${axisIndex}: ${currentValue}`)
  }

  // 输入状态查询方法
  isKeyPressed(keyCode) {
    const keyData = this.keys.get(keyCode)
    return keyData ? keyData.pressed : false
  }

  isMouseButtonPressed(button) {
    const buttonData = this.mouseButtons.get(button)
    return buttonData ? buttonData.pressed : false
  }

  getMousePosition() {
    return { ...this.mousePosition }
  }

  isGamepadButtonPressed(gamepadIndex, buttonIndex) {
    const gamepadData = this.gamepads.get(gamepadIndex)
    if (!gamepadData) return false

    const gamepad = navigator.getGamepads()[gamepadIndex]
    return gamepad && gamepad.buttons[buttonIndex] && gamepad.buttons[buttonIndex].pressed
  }

  getGamepadAxisValue(gamepadIndex, axisIndex) {
    const gamepadData = this.gamepads.get(gamepadIndex)
    if (!gamepadData) return 0

    const gamepad = navigator.getGamepads()[gamepadIndex]
    return gamepad && gamepad.axes[axisIndex] ? gamepad.axes[axisIndex] : 0
  }

  // ActionManager 便捷方法
  addKeyAction(keyCode, trigger, callback) {
    const action = new ExecuteCodeAction(trigger || ActionManager.OnKeyDownTrigger, callback)
    action.trigger.parameter = keyCode
    this.actionManager.registerAction(action)
    return action
  }

  addPointerAction(trigger, callback, condition = null) {
    const action = new ExecuteCodeAction(trigger, callback)
    if (condition) {
      action.trigger.parameter = condition
    }
    this.actionManager.registerAction(action)
    return action
  }

  // 组合按键检测
  areKeysPressed(keyCodes) {
    return keyCodes.every((keyCode) => this.isKeyPressed(keyCode))
  }

  // 快捷键绑定
  bindShortcut(keys, callback, description = '') {
    const shortcut = {
      keys: Array.isArray(keys) ? keys : [keys],
      callback: callback,
      description: description,
      active: true,
    }

    // 每帧检查快捷键
    const checkShortcut = () => {
      if (shortcut.active && this.areKeysPressed(shortcut.keys)) {
        callback()
      }
    }

    this.scene.registerBeforeRender(checkShortcut)

    return {
      unbind: () => {
        shortcut.active = false
        this.scene.unregisterBeforeRender(checkShortcut)
      },
      description: shortcut.description,
    }
  }

  // 虚拟摇杆支持（移动端）
  createVirtualJoystick(options = {}) {
    if (!VirtualJoystick) {
      console.warn('VirtualJoystick 不可用')
      return null
    }

    const joystick = new VirtualJoystick(options.leftJoystick !== false)

    // 设置回调
    if (options.onMove) {
      joystick.setJoystickSensibility(options.sensitivity || 25)
      joystick.onPointerDown = options.onPointerDown
      joystick.onPointerUp = options.onPointerUp
      joystick.onPointerMove = options.onMove
    }

    return joystick
  }

  // 触摸手势支持
  setupTouchGestures() {
    if (!this.canvas.ontouchstart === undefined) return // 不是触摸设备

    let touchStartTime = 0
    let touchStartPos = { x: 0, y: 0 }
    let lastTouchDistance = 0

    this.canvas.addEventListener('touchstart', (event) => {
      touchStartTime = Date.now()
      if (event.touches.length === 1) {
        touchStartPos.x = event.touches[0].clientX
        touchStartPos.y = event.touches[0].clientY
      } else if (event.touches.length === 2) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        lastTouchDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2),
        )
      }
    })

    this.canvas.addEventListener('touchend', (event) => {
      const touchDuration = Date.now() - touchStartTime

      if (event.changedTouches.length === 1 && touchDuration < 300) {
        const touch = event.changedTouches[0]
        const deltaX = Math.abs(touch.clientX - touchStartPos.x)
        const deltaY = Math.abs(touch.clientY - touchStartPos.y)

        if (deltaX < 10 && deltaY < 10) {
          this.onTap && this.onTap(touch)
        }
      }
    })

    this.canvas.addEventListener('touchmove', (event) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0]
        const touch2 = event.touches[1]
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2),
        )

        const scale = currentDistance / lastTouchDistance
        this.onPinch && this.onPinch(scale)
        lastTouchDistance = currentDistance
      }
    })
  }

  // 触摸回调设置
  onTap(touch) {
    console.log('Tap detected at:', touch.clientX, touch.clientY)
  }

  onPinch(scale) {
    console.log('Pinch detected, scale:', scale)
  }

  // 获取输入状态信息
  getInputState() {
    return {
      keyboard: {
        pressedKeys: Array.from(this.keys.entries()).filter(([, data]) => data.pressed),
        keyCount: this.keys.size,
      },
      mouse: {
        position: this.mousePosition,
        pressedButtons: Array.from(this.mouseButtons.entries()).filter(([, data]) => data.pressed),
        buttonCount: this.mouseButtons.size,
      },
      gamepad: {
        connectedGamepads: Array.from(this.gamepads.keys()),
        gamepadCount: this.gamepads.size,
      },
    }
  }

  // 资源清理
  dispose() {
    // 清理键盘监听器
    this.keyboardObservables.forEach((observable) => {
      this.scene.onKeyboardObservable.remove(observable)
    })
    this.keyboardObservables.clear()

    // 清理指针监听器
    this.pointerObservables.forEach((observable) => {
      this.scene.onPointerObservable.remove(observable)
    })
    this.pointerObservables.clear()

    // 清理游戏手柄监听器
    if (this.gamepadCheckInterval) {
      clearInterval(this.gamepadCheckInterval)
    }

    // 清理状态
    this.keys.clear()
    this.mouseButtons.clear()
    this.gamepads.clear()
  }
}

// 使用示例
const inputManager = new InputManager(scene)

// 键盘事件重写示例
class CustomInputManager extends InputManager {
  onKeyDown(event) {
    switch (event.code) {
      case 'KeyW':
        console.log('向前移动')
        break
      case 'KeyS':
        console.log('向后移动')
        break
      case 'KeyA':
        console.log('向左移动')
        break
      case 'KeyD':
        console.log('向右移动')
        break
      case 'Space':
        console.log('跳跃')
        break
    }
  }

  onPointerDown(event, pointerInfo) {
    if (event.button === 0) {
      // 左键
      console.log('射击')
    } else if (event.button === 2) {
      // 右键
      console.log('瞄准')
    }
  }
}

// 创建自定义输入管理器
const customInput = new CustomInputManager(scene)

// 绑定快捷键
const saveShortcut = customInput.bindShortcut(
  ['ControlLeft', 'KeyS'],
  () => {
    console.log('保存游戏')
  },
  '保存游戏 (Ctrl+S)',
)

// 检查输入状态
console.log('是否按下W键:', customInput.isKeyPressed('KeyW'))
console.log('鼠标位置:', customInput.getMousePosition())

// 触摸手势支持
customInput.setupTouchGestures()
customInput.onTap = (touch) => {
  console.log('点击位置:', touch.clientX, touch.clientY)
}

// 添加ActionManager动作
customInput.addKeyAction('KeyE', ActionManager.OnKeyDownTrigger, () => {
  console.log('互动')
})
```

## 🔧 Asset 资源管理详解

```javascript
// Asset 资源管理完整管理
class AssetManager {
  constructor(scene) {
    this.scene = scene
    this.engine = scene.getEngine()

    // 资源容器
    this.assetContainers = new Map()
    this.textures = new Map()
    this.models = new Map()
    this.sounds = new Map()
    this.materials = new Map()

    // 加载状态
    this.loadingTasks = new Map()
    this.loadedAssets = new Set()
    this.failedAssets = new Set()

    // 配置
    this.baseUrl = ''
    this.enableCaching = true
    this.maxConcurrentLoads = 6
    this.retryAttempts = 3

    this.setupDefaultConfiguration()
  }

  setupDefaultConfiguration() {
    // 设置SceneLoader插件
    this.enableLoaderPlugins()

    // 配置缓存策略
    this.setupCaching()
  }

  enableLoaderPlugins() {
    // 确保必要的loader插件可用
    if (typeof GLTFFileLoader !== 'undefined') {
      BABYLON.SceneLoader.RegisterPlugin(new GLTFFileLoader())
    }

    if (typeof OBJFileLoader !== 'undefined') {
      BABYLON.SceneLoader.RegisterPlugin(new OBJFileLoader())
    }

    console.log('资源加载器插件已启用')
  }

  setupCaching() {
    if (this.enableCaching) {
      // 设置纹理缓存
      this.engine.enableOfflineSupport = false // 根据需要调整
      console.log('资源缓存已启用')
    }
  }

  // 加载3D模型
  async loadModel(name, url, options = {}) {
    try {
      const fullUrl = this.baseUrl + url
      console.log(`开始加载模型: ${name} from ${fullUrl}`)

      const result = await SceneLoader.ImportMeshAsync(
        options.meshNames || '',
        '',
        fullUrl,
        this.scene,
        options.onProgress,
        options.pluginExtension,
      )

      // 创建资源容器
      const container = new AssetContainer(this.scene)

      // 添加加载的资源到容器
      result.meshes.forEach((mesh) => {
        container.meshes.push(mesh)
        if (options.position) mesh.position = options.position
        if (options.rotation) mesh.rotation = options.rotation
        if (options.scaling) mesh.scaling = options.scaling
      })

      result.materials.forEach((material) => {
        container.materials.push(material)
      })

      result.textures.forEach((texture) => {
        container.textures.push(texture)
      })

      result.animationGroups.forEach((animGroup) => {
        container.animationGroups.push(animGroup)
      })

      // 存储资源
      this.assetContainers.set(name, container)
      this.models.set(name, {
        container: container,
        meshes: result.meshes,
        materials: result.materials,
        textures: result.textures,
        animationGroups: result.animationGroups,
        skeletons: result.skeletons,
        url: fullUrl,
        loadTime: Date.now(),
      })

      this.loadedAssets.add(name)
      console.log(`模型加载完成: ${name}`)

      return result
    } catch (error) {
      console.error(`模型加载失败: ${name}`, error)
      this.failedAssets.add(name)
      throw error
    }
  }

  // 加载纹理
  async loadTexture(name, url, options = {}) {
    try {
      const fullUrl = this.baseUrl + url
      console.log(`开始加载纹理: ${name} from ${fullUrl}`)

      const texture = new Texture(
        fullUrl,
        this.scene,
        options.noMipmap,
        options.invertY,
        options.samplingMode,
      )

      // 等待纹理加载完成
      await new Promise((resolve, reject) => {
        texture.onLoadObservable.add(() => resolve(texture))
        texture.onErrorObservable.add((error) => reject(error))
      })

      // 应用纹理设置
      if (options.wrapU !== undefined) texture.wrapU = options.wrapU
      if (options.wrapV !== undefined) texture.wrapV = options.wrapV
      if (options.uOffset !== undefined) texture.uOffset = options.uOffset
      if (options.vOffset !== undefined) texture.vOffset = options.vOffset
      if (options.uScale !== undefined) texture.uScale = options.uScale
      if (options.vScale !== undefined) texture.vScale = options.vScale

      this.textures.set(name, {
        texture: texture,
        url: fullUrl,
        options: options,
        loadTime: Date.now(),
      })

      this.loadedAssets.add(name)
      console.log(`纹理加载完成: ${name}`)

      return texture
    } catch (error) {
      console.error(`纹理加载失败: ${name}`, error)
      this.failedAssets.add(name)
      throw error
    }
  }

  // 加载立方体纹理
  async loadCubeTexture(name, url, options = {}) {
    try {
      const fullUrl = this.baseUrl + url
      console.log(`开始加载立方体纹理: ${name} from ${fullUrl}`)

      const cubeTexture = new CubeTexture(fullUrl, this.scene, options.extensions, options.noMipmap)

      // 等待加载完成
      await new Promise((resolve, reject) => {
        cubeTexture.onLoadObservable.add(() => resolve(cubeTexture))
        cubeTexture.onErrorObservable.add((error) => reject(error))
      })

      this.textures.set(name, {
        texture: cubeTexture,
        url: fullUrl,
        type: 'cube',
        loadTime: Date.now(),
      })

      this.loadedAssets.add(name)
      console.log(`立方体纹理加载完成: ${name}`)

      return cubeTexture
    } catch (error) {
      console.error(`立方体纹理加载失败: ${name}`, error)
      this.failedAssets.add(name)
      throw error
    }
  }

  // 加载HDR环境纹理
  async loadHDRTexture(name, url, options = {}) {
    try {
      const fullUrl = this.baseUrl + url
      console.log(`开始加载HDR纹理: ${name} from ${fullUrl}`)

      const hdrTexture = new HDRCubeTexture(
        fullUrl,
        this.scene,
        options.size,
        options.noMipmap,
        options.generateHarmonics,
        options.useInGammaSpace,
      )

      // 等待加载完成
      await new Promise((resolve, reject) => {
        hdrTexture.onLoadObservable.add(() => resolve(hdrTexture))
        hdrTexture.onErrorObservable.add((error) => reject(error))
      })

      this.textures.set(name, {
        texture: hdrTexture,
        url: fullUrl,
        type: 'hdr',
        loadTime: Date.now(),
      })

      this.loadedAssets.add(name)
      console.log(`HDR纹理加载完成: ${name}`)

      return hdrTexture
    } catch (error) {
      console.error(`HDR纹理加载失败: ${name}`, error)
      this.failedAssets.add(name)
      throw error
    }
  }

  // 批量加载资源
  async loadAssets(assetList, onProgress = null) {
    const tasks = []
    const results = []

    for (const asset of assetList) {
      const { type, name, url, options = {} } = asset

      let loadTask
      switch (type) {
        case 'model':
          loadTask = this.loadModel(name, url, options)
          break
        case 'texture':
          loadTask = this.loadTexture(name, url, options)
          break
        case 'cubeTexture':
          loadTask = this.loadCubeTexture(name, url, options)
          break
        case 'hdrTexture':
          loadTask = this.loadHDRTexture(name, url, options)
          break
        case 'sound':
          loadTask = this.loadSound(name, url, options)
          break
        default:
          console.warn(`未知的资源类型: ${type}`)
          continue
      }

      tasks.push(
        loadTask
          .then((result) => {
            results.push({ name, type, success: true, result })
            if (onProgress) {
              onProgress(results.length, assetList.length, name, type)
            }
            return result
          })
          .catch((error) => {
            results.push({ name, type, success: false, error })
            if (onProgress) {
              onProgress(results.length, assetList.length, name, type)
            }
            return null
          }),
      )
    }

    await Promise.all(tasks)

    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    console.log(`批量加载完成: 成功 ${successful}, 失败 ${failed}`)

    return {
      results,
      successful,
      failed,
      successRate: successful / assetList.length,
    }
  }

  // 克隆模型实例
  cloneModel(originalName, newName, options = {}) {
    const modelData = this.models.get(originalName)
    if (!modelData) {
      console.error(`原始模型未找到: ${originalName}`)
      return null
    }

    const clonedMeshes = []

    modelData.meshes.forEach((mesh) => {
      const clonedMesh = mesh.clone(newName + '_' + mesh.name, options.parent)

      if (options.position) clonedMesh.position = options.position
      if (options.rotation) clonedMesh.rotation = options.rotation
      if (options.scaling) clonedMesh.scaling = options.scaling

      clonedMeshes.push(clonedMesh)
    })

    // 创建新的模型记录
    this.models.set(newName, {
      ...modelData,
      meshes: clonedMeshes,
      isClone: true,
      originalModel: originalName,
    })

    console.log(`模型克隆完成: ${originalName} -> ${newName}`)
    return clonedMeshes
  }

  // 实例化模型
  instanceModel(originalName, newName, options = {}) {
    const modelData = this.models.get(originalName)
    if (!modelData) {
      console.error(`原始模型未找到: ${originalName}`)
      return null
    }

    const instances = []

    modelData.meshes.forEach((mesh) => {
      if (mesh.geometry) {
        const instance = mesh.createInstance(newName + '_' + mesh.name)

        if (options.position) instance.position = options.position
        if (options.rotation) instance.rotation = options.rotation
        if (options.scaling) instance.scaling = options.scaling

        instances.push(instance)
      }
    })

    console.log(`模型实例化完成: ${originalName} -> ${newName}`)
    return instances
  }

  // 添加自定义资源
  addCustomAssets() {
    // 添加模型资源
    this.addModelAsset('/models/customModel.glb')

    // 添加纹理资源
    this.addTextureAsset('/textures/customTexture.jpg')

    // 添加音频资源
    this.addAudioAsset('/sounds/customSound.mp3')

    // 添加环境资源
    this.addEnvironmentAsset('/environments/customEnvironment.dds')
  }

  // 添加模型资源
  addModelAsset(url) {
    // 创建模型资源
    const modelAsset = new AssetContainer(url, this.scene)
    modelAsset.name = url.split('/').pop()
    this.assets.set(url, modelAsset)
  }

  // 添加纹理资源
  addTextureAsset(url) {
    // 创建纹理资源
    const textureAsset = new Texture(url, this.scene)
    textureAsset.name = url.split('/').pop()
    this.assets.set(url, textureAsset)
  }

  // 添加音频资源
  addAudioAsset(url) {
    // 创建音频资源
    const audioAsset = new Audio(url, this.scene)
    audioAsset.name = url.split('/').pop()
    this.assets.set(url, audioAsset)
  }

  // 添加环境资源
  addEnvironmentAsset(url) {
    // 创建环境资源
    const environmentAsset = new CubeTexture(url, this.scene)
    environmentAsset.name = url.split('/').pop()
    this.assets.set(url, environmentAsset)
  }

  // 获取资源信息
  getAssetInfo(assetName) {
    const asset = this.assets.get(assetName)
    if (!asset) return null

    const info = {
      name: assetName,
      type: asset.getClassName(),
      url: asset.url,
    }

    return info
  }

  // 批量应用资源
  applyAssets(assets) {
    assets.forEach((asset, name) => {
      this.applyAsset(name, asset)
    })
  }

  // 应用资源
  applyAsset(assetName, asset) {
    const currentAsset = this.assets.get(assetName)
    if (!currentAsset) return

    currentAsset.url = asset.url
    currentAsset.name = asset.name
    currentAsset.type = asset.type
  }

  // 资源清理
  dispose() {
    this.assets.forEach((asset) => {
      asset.dispose()
    })
    this.assets.clear()
  }
}

// 使用示例
const assetManager = new AssetManager(scene)

// 添加默认资源
assetManager.addDefaultAssets()

// 添加自定义资源
assetManager.addCustomAssets()

// 获取资源信息
console.log('资源信息:', assetManager.getAssetInfo('/models/defaultModel.glb'))
```

## ⚡ Performance 性能优化详解

### 🎯 性能优化核心原则

1. **减少Draw Calls** - 合并网格，使用实例化
2. **优化纹理** - 压缩纹理，减少尺寸
3. **简化几何体** - LOD系统，面数优化
4. **智能剔除** - 视锥剔除，遮挡剔除
5. **内存管理** - 及时释放资源，对象池

```javascript
// 性能优化管理器
class PerformanceOptimizer {
  constructor(scene) {
    this.scene = scene
    this.engine = scene.getEngine()

    // 性能监控
    this.performanceMonitor = new PerformanceMonitor()
    this.fpsCounter = 0
    this.frameTime = 0
    this.lastFrameTime = performance.now()

    // 优化配置
    this.config = {
      enableOptimizations: true,
      targetFPS: 60,
      adaptiveQuality: true,
      enableLOD: true,
      enableFrustumCulling: true,
      maxLights: 8,
      shadowMapSize: 1024,
    }

    this.initializeOptimizations()
  }

  initializeOptimizations() {
    this.setupEngineOptimizations()
    this.setupSceneOptimizations()
    this.setupRenderingOptimizations()
    this.startPerformanceMonitoring()
  }

  // ===== 引擎级优化 =====
  setupEngineOptimizations() {
    const engine = this.engine

    // 禁用不必要的功能
    engine.enableOfflineSupport = false
    engine.doNotHandleContextLost = true

    // 优化WebGL状态
    engine.setDepthFunction(Engine.LEQUAL)
    engine.setStencilBuffer(false) // 如果不需要模板缓冲

    // 自适应设备像素比
    if (this.config.adaptiveQuality) {
      this.setupAdaptiveQuality()
    }

    console.log('引擎优化设置完成')
  }

  setupAdaptiveQuality() {
    const engine = this.engine
    let basePixelRatio = window.devicePixelRatio

    // 根据性能动态调整像素比
    this.scene.registerBeforeRender(() => {
      if (this.fpsCounter < this.config.targetFPS * 0.8) {
        const newRatio = Math.max(0.5, basePixelRatio * 0.9)
        engine.setHardwareScalingLevel(1 / newRatio)
      } else if (this.fpsCounter > this.config.targetFPS * 0.95) {
        const newRatio = Math.min(basePixelRatio, basePixelRatio * 1.1)
        engine.setHardwareScalingLevel(1 / newRatio)
      }
    })
  }

  // ===== 场景级优化 =====
  setupSceneOptimizations() {
    const scene = this.scene

    // 启用视锥剔除
    if (this.config.enableFrustumCulling) {
      scene.skipFrustumClipping = false
      scene.autoClear = true
    }

    // 优化光照
    this.optimizeLighting()

    // 优化阴影
    this.optimizeShadows()

    // 启用实例化
    this.enableInstancing()

    console.log('场景优化设置完成')
  }

  optimizeLighting() {
    const scene = this.scene

    // 限制光源数量
    let lightCount = 0
    scene.lights.forEach((light) => {
      if (lightCount >= this.config.maxLights) {
        light.setEnabled(false)
      } else {
        lightCount++
      }
    })

    // 禁用不需要的光照计算
    scene.lightsEnabled = lightCount > 0
  }

  optimizeShadows() {
    const scene = this.scene

    scene.lights.forEach((light) => {
      if (light.getShadowGenerator()) {
        const shadowGen = light.getShadowGenerator()

        // 优化阴影贴图尺寸
        shadowGen.mapSize = this.config.shadowMapSize

        // 启用阴影优化
        shadowGen.usePercentageCloserFiltering = false
        shadowGen.useKernelBlur = false
        shadowGen.blurKernel = 1

        // 设置合理的阴影距离
        shadowGen.setDarkness(0.3)
      }
    })
  }

  enableInstancing() {
    // 为相似网格启用实例化
    const meshGroups = new Map()

    this.scene.meshes.forEach((mesh) => {
      if (mesh.geometry) {
        const key = mesh.geometry.id + '_' + (mesh.material ? mesh.material.id : 'none')

        if (!meshGroups.has(key)) {
          meshGroups.set(key, [])
        }
        meshGroups.get(key).push(mesh)
      }
    })

    // 对于相同几何体和材质的网格，使用实例化
    meshGroups.forEach((meshes, key) => {
      if (meshes.length > 1) {
        console.log(`发现 ${meshes.length} 个相似网格，建议使用实例化`)
      }
    })
  }

  // ===== 渲染优化 =====
  setupRenderingOptimizations() {
    const scene = this.scene

    // 优化材质
    this.optimizeMaterials()

    // 优化纹理
    this.optimizeTextures()

    // 启用几何体优化
    this.optimizeGeometry()

    console.log('渲染优化设置完成')
  }

  optimizeMaterials() {
    this.scene.materials.forEach((material) => {
      if (material instanceof StandardMaterial) {
        // 禁用不必要的材质特性
        if (!material.diffuseTexture) material.disableLighting = false
        material.maxSimultaneousLights = Math.min(4, this.config.maxLights)

        // 优化反射
        if (material.reflectionTexture) {
          material.reflectionTexture.level = 0.5
        }
      } else if (material instanceof PBRMaterial) {
        // PBR材质优化
        material.maxSimultaneousLights = Math.min(4, this.config.maxLights)
        material.useRadianceOcclusion = false
        material.useHorizonOcclusion = false
      }
    })
  }

  optimizeTextures() {
    this.scene.textures.forEach((texture) => {
      if (texture instanceof Texture) {
        // 设置合理的过滤模式
        texture.samplingMode = Texture.TRILINEAR_SAMPLINGMODE

        // 启用纹理压缩（如果支持）
        if (this.engine.getCaps().s3tc) {
          // 可以使用DDS压缩纹理
        }

        // 限制纹理尺寸
        const maxSize = 1024
        if (texture.getSize().width > maxSize || texture.getSize().height > maxSize) {
          console.warn(`纹理 ${texture.name} 尺寸过大，建议压缩`)
        }
      }
    })
  }

  optimizeGeometry() {
    this.scene.meshes.forEach((mesh) => {
      if (mesh.geometry) {
        const vertexCount = mesh.getTotalVertices()

        // 对于高面数模型建议LOD
        if (vertexCount > 10000) {
          console.warn(`网格 ${mesh.name} 顶点数过多 (${vertexCount})，建议使用LOD`)
        }

        // 合并顶点
        if (mesh.isVerticesDataPresent(VertexBuffer.PositionKind)) {
          // mesh.mergeVertices() // 谨慎使用，可能影响UV
        }
      }
    })
  }

  // ===== LOD系统 =====
  setupLODSystem(meshes, distances = [10, 50, 100]) {
    meshes.forEach((mesh) => {
      if (mesh.geometry) {
        // 创建LOD级别
        const lod1 = mesh.simplify(
          [
            { quality: 0.8, distance: distances[0] },
            { quality: 0.5, distance: distances[1] },
            { quality: 0.2, distance: distances[2] },
          ],
          false,
          SimplificationType.QUADRATIC,
        )

        console.log(`为网格 ${mesh.name} 设置LOD系统`)
      }
    })
  }

  // ===== 对象池 =====
  createObjectPool(createFunc, resetFunc, initialSize = 10) {
    const pool = []
    const inUse = new Set()

    // 初始化对象池
    for (let i = 0; i < initialSize; i++) {
      pool.push(createFunc())
    }

    return {
      acquire() {
        let obj = pool.pop()
        if (!obj) {
          obj = createFunc()
        }
        inUse.add(obj)
        return obj
      },

      release(obj) {
        if (inUse.has(obj)) {
          resetFunc(obj)
          inUse.delete(obj)
          pool.push(obj)
        }
      },

      getStats() {
        return {
          poolSize: pool.length,
          inUse: inUse.size,
          total: pool.length + inUse.size,
        }
      },
    }
  }

  // ===== 性能监控 =====
  startPerformanceMonitoring() {
    const scene = this.scene

    scene.registerBeforeRender(() => {
      const currentTime = performance.now()
      this.frameTime = currentTime - this.lastFrameTime
      this.fpsCounter = 1000 / this.frameTime
      this.lastFrameTime = currentTime

      // 更新性能监控器
      this.performanceMonitor.sampleFrame(currentTime)
    })

    // 定期输出性能报告
    setInterval(() => {
      this.generatePerformanceReport()
    }, 5000)
  }

  generatePerformanceReport() {
    const engine = this.engine
    const scene = this.scene

    const report = {
      fps: Math.round(this.fpsCounter),
      frameTime: Math.round(this.frameTime * 100) / 100,
      drawCalls: engine.getDrawCalls(),
      meshes: scene.meshes.length,
      materials: scene.materials.length,
      textures: scene.textures.length,
      lights: scene.lights.filter((l) => l.isEnabled()).length,
      memory: {
        geometries: engine.getGeometriesStatistics(),
        textures: engine.getTexturesStatistics(),
      },
    }

    console.log('性能报告:', report)

    // 自动优化建议
    this.generateOptimizationSuggestions(report)

    return report
  }

  generateOptimizationSuggestions(report) {
    const suggestions = []

    if (report.fps < this.config.targetFPS * 0.8) {
      suggestions.push('FPS过低，建议：')

      if (report.drawCalls > 100) {
        suggestions.push('- 减少Draw Calls（当前：' + report.drawCalls + '）')
      }

      if (report.meshes > 1000) {
        suggestions.push('- 减少网格数量（当前：' + report.meshes + '）')
      }

      if (report.lights > 4) {
        suggestions.push('- 减少光源数量（当前：' + report.lights + '）')
      }
    }

    if (report.frameTime > 16.67) {
      suggestions.push('- 帧时间过长，考虑降低渲染质量')
    }

    if (suggestions.length > 0) {
      console.warn('优化建议：', suggestions)
    }
  }

  // ===== 批量优化工具 =====
  applyQuickOptimizations() {
    console.log('应用快速优化设置...')

    // 引擎优化
    this.engine.setHardwareScalingLevel(1.2) // 降低渲染分辨率

    // 场景优化
    this.scene.skipPointerMovePicking = true
    this.scene.autoClear = true
    this.scene.autoClearDepthAndStencil = true

    // 材质优化
    this.scene.materials.forEach((material) => {
      if (material instanceof StandardMaterial) {
        material.maxSimultaneousLights = 2
      }
    })

    // 阴影优化
    this.scene.lights.forEach((light) => {
      if (light.getShadowGenerator()) {
        light.getShadowGenerator().mapSize = 512
      }
    })

    console.log('快速优化完成')
  }

  // ===== 内存优化 =====
  cleanupUnusedResources() {
    const scene = this.scene

    // 清理未使用的纹理
    scene.textures.forEach((texture) => {
      if (texture.getScene() === null) {
        texture.dispose()
      }
    })

    // 清理未使用的材质
    scene.materials.forEach((material) => {
      if (material.getBindedMeshes().length === 0) {
        material.dispose()
      }
    })

    // 清理未使用的几何体
    scene.geometries.forEach((geometry) => {
      if (geometry.meshes.length === 0) {
        geometry.dispose()
      }
    })

    // 强制垃圾回收（仅开发环境）
    if (window.gc && typeof window.gc === 'function') {
      window.gc()
    }

    console.log('资源清理完成')
  }

  // 资源清理
  dispose() {
    this.performanceMonitor.dispose()
    console.log('性能优化器已清理')
  }
}

// 使用示例
const optimizer = new PerformanceOptimizer(scene)

// 应用快速优化
optimizer.applyQuickOptimizations()

// 设置LOD系统
const importantMeshes = scene.meshes.filter((m) => m.getTotalVertices() > 1000)
optimizer.setupLODSystem(importantMeshes, [20, 100, 500])

// 创建粒子对象池
const particlePool = optimizer.createObjectPool(
  () => new ParticleSystem('pooled', 100, scene),
  (ps) => {
    ps.stop()
    ps.reset()
  },
  5,
)

// 获取性能报告
const report = optimizer.generatePerformanceReport()
console.log('当前性能：', report)

// 清理未使用资源
optimizer.cleanupUnusedResources()
```

### 🎯 具体优化技巧

#### 1. 网格优化

```javascript
// 合并网格减少Draw Calls
const merged = Mesh.MergeMeshes(meshesToMerge)

// 使用实例化
const instances = []
for (let i = 0; i < 100; i++) {
  instances.push(originalMesh.createInstance('instance_' + i))
}

// 简化几何体
mesh.simplify([{ quality: 0.5, distance: 100 }])
```

#### 2. 纹理优化

```javascript
// 压缩纹理
texture.format = Engine.TEXTUREFORMAT_RGB
texture.samplingMode = Texture.BILINEAR_SAMPLINGMODE

// 纹理图集
const atlasTexture = new Texture('atlas.jpg', scene)
```

#### 3. 光照优化

```javascript
// 限制光源影响范围
light.range = 50

// 使用烘焙光照
const bakedTexture = new Texture('lightmap.jpg', scene)
material.lightmapTexture = bakedTexture
```

#### 4. 渲染管线优化

```javascript
// 禁用不必要的渲染特性
scene.skipPointerMovePicking = true
scene.constantlyUpdateMeshUnderPointer = false

// 自定义渲染顺序
scene.setRenderingOrder(
  0, // opaque sorting
  null, // alpha testing sorting
  null, // transparent sorting
)
```
## 🎯 最佳实践

### 🏗️ 项目结构最佳实践

```javascript
// 推荐的项目结构
project/
├── src/
│   ├── scenes/          // 场景管理
│   ├── models/          // 3D模型
│   ├── materials/       // 材质库
│   ├── animations/      // 动画控制
│   ├── utils/           // 工具函数
│   └── main.js          // 入口文件
├── assets/
│   ├── models/          // .glb, .babylon文件
│   ├── textures/        // 纹理贴图
│   ├── sounds/          // 音频文件
│   └── environments/    // 环境贴图
└── public/
    └── babylon/         // BabylonJS库文件
```

### 📝 代码组织最佳实践

#### 1. 场景管理
```javascript
class SceneManager {
  constructor(canvas) {
    this.engine = new Engine(canvas, true)
    this.scene = new Scene(this.engine)
    this.setupBasicScene()
  }
  
  setupBasicScene() {
    // 相机
    this.camera = new ArcRotateCamera('camera', 0, 0, 10, Vector3.Zero(), this.scene)
    this.camera.attachToCanvas(this.canvas)
    
    // 光照
    this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene)
    
    // 渲染循环
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
  
  dispose() {
    this.scene.dispose()
    this.engine.dispose()
  }
}
```

#### 2. 资源加载管理
```javascript
class AssetLoader {
  constructor(scene) {
    this.scene = scene
    this.loadedAssets = new Map()
  }
  
  async loadAssets(assetList) {
    const promises = assetList.map(asset => this.loadSingleAsset(asset))
    const results = await Promise.allSettled(promises)
    
    return results.map((result, index) => ({
      name: assetList[index].name,
      success: result.status === 'fulfilled',
      asset: result.value || null,
      error: result.reason || null
    }))
  }
  
  async loadSingleAsset({ type, name, url, options = {} }) {
    try {
      let asset
      switch (type) {
        case 'model':
          asset = await SceneLoader.ImportMeshAsync('', '', url, this.scene)
          break
        case 'texture':
          asset = new Texture(url, this.scene)
          break
        default:
          throw new Error(`不支持的资源类型: ${type}`)
      }
      
      this.loadedAssets.set(name, asset)
      return asset
      
    } catch (error) {
      console.error(`加载资源失败: ${name}`, error)
      throw error
    }
  }
}
```

#### 3. 错误处理
```javascript
class ErrorHandler {
  static handleError(error, context = '') {
    console.error(`BabylonJS错误 [${context}]:`, error)
    
    // 根据错误类型进行处理
    if (error.message.includes('WebGL')) {
      this.handleWebGLError(error)
    } else if (error.message.includes('loading')) {
      this.handleLoadingError(error)
    } else {
      this.handleGenericError(error)
    }
  }
  
  static handleWebGLError(error) {
    alert('WebGL不支持或已禁用，请更新浏览器或启用硬件加速')
  }
  
  static handleLoadingError(error) {
    console.warn('资源加载失败，将使用默认资源')
  }
  
  static handleGenericError(error) {
    // 通用错误处理
    if (window.isDevelopment) {
      throw error // 开发环境抛出错误
    }
  }
}
```

### 🎨 开发最佳实践

#### 1. 性能优化原则
- **避免在渲染循环中创建对象**
- **使用对象池管理频繁创建/销毁的对象**
- **合理使用LOD和实例化**
- **及时释放不用的资源**

```javascript
// ❌ 错误示例 - 在渲染循环中创建对象
scene.registerBeforeRender(() => {
  const newVector = new Vector3(1, 2, 3) // 每帧都创建新对象
})

// ✅ 正确示例 - 重用对象
const reusableVector = new Vector3()
scene.registerBeforeRender(() => {
  reusableVector.set(1, 2, 3) // 重用现有对象
})
```

#### 2. 内存管理
```javascript
class ResourceManager {
  constructor() {
    this.disposables = new Set()
  }
  
  addDisposable(resource) {
    this.disposables.add(resource)
  }
  
  dispose() {
    this.disposables.forEach(resource => {
      if (resource.dispose) {
        resource.dispose()
      }
    })
    this.disposables.clear()
  }
}
```

#### 3. 调试技巧
```javascript
// 启用调试功能
scene.debugLayer.show({
  overlay: true,
  showExplorer: true,
  showInspector: true
})

// 性能计数器
scene.registerBeforeRender(() => {
  if (window.isDevelopment && Math.random() < 0.01) { // 1%概率输出
    console.log({
      fps: engine.getFps(),
      meshes: scene.meshes.length,
      drawCalls: engine.getDrawCalls(),
      materials: scene.materials.length
    })
  }
})
```

### 🛡️ 安全性最佳实践

#### 1. 输入验证
```javascript
function validateAssetUrl(url) {
  // 只允许特定域名和文件类型
  const allowedDomains = ['your-cdn.com', 'localhost']
  const allowedExtensions = ['.glb', '.babylon', '.jpg', '.png']
  
  try {
    const urlObj = new URL(url)
    const isValidDomain = allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    )
    const isValidExtension = allowedExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    )
    
    return isValidDomain && isValidExtension
  } catch {
    return false
  }
}
```

#### 2. 资源限制
```javascript
const RESOURCE_LIMITS = {
  maxMeshes: 1000,
  maxMaterials: 100,
  maxTextures: 200,
  maxTextureSize: 2048,
  maxVerticesPerMesh: 50000
}

function validateResourceLimits(scene) {
  const issues = []
  
  if (scene.meshes.length > RESOURCE_LIMITS.maxMeshes) {
    issues.push(`网格数量超限: ${scene.meshes.length}/${RESOURCE_LIMITS.maxMeshes}`)
  }
  
  scene.meshes.forEach(mesh => {
    if (mesh.getTotalVertices() > RESOURCE_LIMITS.maxVerticesPerMesh) {
      issues.push(`网格 ${mesh.name} 顶点数过多: ${mesh.getTotalVertices()}`)
    }
  })
  
  return issues
}
```

### 📱 移动端优化最佳实践

```javascript
// 检测移动设备
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

if (isMobile) {
  // 移动端优化设置
  engine.setHardwareScalingLevel(1.5) // 降低分辨率
  scene.skipPointerMovePicking = true // 禁用鼠标移动拾取
  
  // 简化材质
  scene.materials.forEach(material => {
    if (material instanceof StandardMaterial) {
      material.maxSimultaneousLights = 2
    }
  })
  
  // 启用触摸控制
  scene.actionManager = new ActionManager(scene)
}
```

### 🎯 部署最佳实践

#### 1. 生产环境配置
```javascript
// 生产环境优化
if (process.env.NODE_ENV === 'production') {
  // 禁用调试
  console.log = () => {}
  console.warn = () => {}
  
  // 启用压缩
  Engine.audioEngine.useCustomUnlockedState = true
  
  // 错误上报
  window.addEventListener('error', (event) => {
    // 发送错误报告到服务器
    sendErrorReport(event.error)
  })
}
```

#### 2. CDN资源配置
```javascript
const CDN_CONFIG = {
  models: 'https://cdn.example.com/models/',
  textures: 'https://cdn.example.com/textures/',
  sounds: 'https://cdn.example.com/sounds/'
}

function getAssetUrl(type, filename) {
  const baseUrl = CDN_CONFIG[type] || ''
  return baseUrl + filename
}
```

### 📚 常见问题解决方案

#### 1. WebGL上下文丢失
```javascript
canvas.addEventListener('webglcontextlost', (event) => {
  event.preventDefault()
  console.warn('WebGL上下文丢失')
})

canvas.addEventListener('webglcontextrestored', () => {
  console.log('WebGL上下文已恢复')
  // 重新初始化场景
  initializeScene()
})
```

#### 2. 内存泄漏预防
```javascript
// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
  if (scene) {
    scene.dispose()
  }
  if (engine) {
    engine.dispose()
  }
})
```

#### 3. 异步加载处理
```javascript
async function safeAsyncLoad(loadFunction) {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('加载超时')), 30000)
  )
  
  try {
    return await Promise.race([loadFunction(), timeout])
  } catch (error) {
    console.error('异步加载失败:', error)
    throw error
  }
}
```

### 🎉 总结

遵循这些最佳实践可以帮助你：

- **提高应用性能** - 通过合理的资源管理和优化
- **增强代码可维护性** - 通过清晰的结构和错误处理
- **确保用户体验** - 通过移动端优化和安全性措施
- **简化调试过程** - 通过完善的日志和监控

记住，最佳实践是指导原则，需要根据具体项目需求灵活调整。持续学习和优化是BabylonJS开发的关键。
```
```
