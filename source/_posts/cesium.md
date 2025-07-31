---
title: Cesium 开发文档
date: 2025-7-31
tags:
  - Cesium
  - 三维GIS
cover: /img/cesium.jpg
---
# Cesium 完整离线开发指南

## 📋 目录

- [离线环境配置](#离线环境配置)
- [Viewer 详细配置](#viewer-详细配置)
- [坐标系统详解](#坐标系统详解)
- [实体系统完整属性](#实体系统完整属性)
- [影像系统详解](#影像系统详解)
- [地形系统详解](#地形系统详解)
- [相机系统完整属性](#相机系统完整属性)
- [事件系统详解](#事件系统详解)
- [材质系统详解](#材质系统详解)
- [动画系统详解](#动画系统详解)
- [几何体系统详解](#几何体系统详解)
- [场景控制详解](#场景控制详解)
- [数据源详解](#数据源详解)
- [时间系统详解](#时间系统详解)
- [绘制功能详解](#绘制功能详解)
- [性能优化详解](#性能优化详解)

## 离线环境配置

### 完整离线包下载

```bash
# 1. 下载Cesium完整包
wget https://github.com/CesiumGS/cesium/releases/download/1.110/Cesium-1.110.zip

# 2. 解压到静态资源目录
unzip Cesium-1.110.zip -d public/cesium/

# 3. 项目结构
public/
├── cesium/
│   ├── Build/
│   │   └── Cesium/
│   │       ├── Cesium.js          # 主库文件
│   │       ├── Widgets/
│   │       │   └── widgets.css    # 样式文件
│   │       ├── Workers/           # WebWorker文件
│   │       ├── ThirdParty/        # 第三方库
│   │       └── Assets/            # 静态资源
│   └── Apps/                      # 示例应用
```

### Vite离线配置

```javascript
// vite.config.js - 离线开发配置
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  define: {
    // 定义全局常量，避免Ion依赖
    CESIUM_BASE_URL: JSON.stringify('/cesium/'),
  },

  // 静态资源处理
  publicDir: 'public',

  // 构建配置
  build: {
    rollupOptions: {
      // 排除不需要的依赖
      external: ['@cesium/engine'],

      // 复制Cesium静态资源
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },

  // 开发服务器配置
  server: {
    // 静态文件服务
    fs: {
      allow: ['..'],
    },
  },

  // 优化配置
  optimizeDeps: {
    // 预构建Cesium
    include: ['cesium'],
  },
})
```

### 离线初始化

```javascript
// main.js - 离线初始化配置
// 设置Cesium基础路径
window.CESIUM_BASE_URL = '/cesium/Build/Cesium/'

// 禁用Ion服务（离线环境）
import * as Cesium from 'cesium'

// 覆盖Ion默认设置
Cesium.Ion.defaultAccessToken = undefined
Cesium.Ion.defaultServer = undefined

// 离线Viewer配置
const viewer = new Cesium.Viewer('cesiumContainer', {
  // 关闭所有在线服务
  baseLayerPicker: false,
  geocoder: false,

  // 使用离线影像
  imageryProvider: false, // 不加载默认影像

  // 使用本地地形
  terrainProvider: new Cesium.EllipsoidTerrainProvider(),
})
```

## Viewer 详细配置

### 构造函数完整参数

```javascript
const viewer = new Cesium.Viewer(container, {
  // === 基础渲染选项 ===

  // animation: boolean
  // 作用: 控制时间动画控件的显示
  // 默认: true
  // 离线建议: false（减少UI复杂度）
  animation: false,

  // baseLayerPicker: boolean
  // 作用: 控制图层选择器的显示
  // 默认: true
  // 离线建议: false（避免在线图层依赖）
  baseLayerPicker: false,

  // fullscreenButton: boolean
  // 作用: 控制全屏按钮的显示
  // 默认: true
  // 用途: 允许用户全屏查看地图
  fullscreenButton: true,

  // geocoder: boolean | GeocoderService[]
  // 作用: 控制地址搜索框的显示
  // 默认: true
  // 离线建议: false（需要在线服务）
  geocoder: false,

  // homeButton: boolean
  // 作用: 控制主页按钮的显示
  // 默认: true
  // 用途: 重置到初始视角
  homeButton: true,

  // infoBox: boolean
  // 作用: 控制信息框的显示
  // 默认: true
  // 用途: 显示实体详细信息
  infoBox: true,

  // sceneModePicker: boolean
  // 作用: 控制场景模式选择器（3D/2D/Columbus）
  // 默认: true
  // 用途: 切换不同的查看模式
  sceneModePicker: true,

  // selectionIndicator: boolean
  // 作用: 控制选择指示器（绿色框）
  // 默认: true
  // 用途: 显示选中实体的边界框
  selectionIndicator: false, // 通常关闭以获得更好的视觉效果

  // timeline: boolean
  // 作用: 控制时间轴的显示
  // 默认: true
  // 用途: 控制时间相关的动画
  timeline: false,

  // navigationHelpButton: boolean
  // 作用: 控制导航帮助按钮
  // 默认: true
  // 用途: 显示鼠标/触摸操作说明
  navigationHelpButton: false,

  // navigationInstructionsInitiallyVisible: boolean
  // 作用: 控制导航说明的初始可见性
  // 默认: true
  // 用途: 页面加载时是否显示操作说明
  navigationInstructionsInitiallyVisible: false,

  // === 场景渲染选项 ===

  // scene3DOnly: boolean
  // 作用: 是否只支持3D模式
  // 默认: false
  // 用途: 禁用2D和Columbus模式以提升性能
  scene3DOnly: false,

  // shouldAnimate: boolean
  // 作用: 是否启用动画
  // 默认: false
  // 用途: 控制时间动画的播放
  shouldAnimate: true,

  // clockViewModel: ClockViewModel
  // 作用: 时钟视图模型
  // 默认: new ClockViewModel(clock)
  // 用途: 控制时间和动画
  clockViewModel: new Cesium.ClockViewModel(new Cesium.Clock()),

  // selectedImageryProviderViewModel: ProviderViewModel
  // 作用: 默认选中的影像提供者
  // 默认: undefined
  // 用途: 设置初始影像图层
  selectedImageryProviderViewModel: undefined,

  // imageryProviderViewModels: ProviderViewModel[]
  // 作用: 可用的影像提供者列表
  // 默认: createDefaultImageryProviderViewModels()
  // 用途: 图层选择器中的选项
  imageryProviderViewModels: [],

  // selectedTerrainProviderViewModel: ProviderViewModel
  // 作用: 默认选中的地形提供者
  // 默认: undefined
  // 用途: 设置初始地形
  selectedTerrainProviderViewModel: undefined,

  // terrainProviderViewModels: ProviderViewModel[]
  // 作用: 可用的地形提供者列表
  // 默认: createDefaultTerrainProviderViewModels()
  // 用途: 地形选择器中的选项
  terrainProviderViewModels: [],

  // === 渲染器选项 ===

  // imageryProvider: ImageryProvider | false
  // 作用: 影像提供者
  // 默认: createWorldImagery()
  // 离线设置: 自定义离线影像或false
  imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    url: 'https://tile.openstreetmap.org/', // 或本地瓦片服务
  }),

  // terrainProvider: TerrainProvider
  // 作用: 地形提供者
  // 默认: new EllipsoidTerrainProvider()
  // 离线设置: EllipsoidTerrainProvider（椭球地形）
  terrainProvider: new Cesium.EllipsoidTerrainProvider(),

  // skyBox: SkyBox | false
  // 作用: 天空盒
  // 默认: undefined（使用默认天空）
  // 用途: 自定义天空背景
  skyBox: new Cesium.SkyBox({
    sources: {
      positiveX: 'path/to/skybox_px.jpg',
      negativeX: 'path/to/skybox_nx.jpg',
      positiveY: 'path/to/skybox_py.jpg',
      negativeY: 'path/to/skybox_ny.jpg',
      positiveZ: 'path/to/skybox_pz.jpg',
      negativeZ: 'path/to/skybox_nz.jpg',
    },
  }),

  // skyAtmosphere: SkyAtmosphere | false
  // 作用: 天空大气效果
  // 默认: undefined（使用默认大气）
  // 用途: 控制大气散射效果
  skyAtmosphere: new Cesium.SkyAtmosphere(),

  // === 高级渲染选项 ===

  // shadows: boolean
  // 作用: 是否启用阴影
  // 默认: false
  // 性能影响: 较大
  shadows: true,

  // terrainShadows: ShadowMode
  // 作用: 地形阴影模式
  // 默认: ShadowMode.RECEIVE_ONLY
  // 选项: DISABLED, ENABLED, CAST_ONLY, RECEIVE_ONLY
  terrainShadows: Cesium.ShadowMode.ENABLED,

  // mapMode2D: MapMode2D
  // 作用: 2D地图模式
  // 默认: MapMode2D.INFINITE_SCROLL
  // 选项: INFINITE_SCROLL, ROTATE
  mapMode2D: Cesium.MapMode2D.INFINITE_SCROLL,

  // projectionPicker: boolean
  // 作用: 投影选择器
  // 默认: false
  // 用途: 在2D模式下选择投影方式
  projectionPicker: false,

  // requestRenderMode: boolean
  // 作用: 按需渲染模式
  // 默认: false
  // 性能优化: 只在需要时渲染
  requestRenderMode: false,

  // maximumRenderTimeChange: number
  // 作用: 最大渲染时间变化（毫秒）
  // 默认: 0.0
  // 用途: 控制按需渲染的触发阈值
  maximumRenderTimeChange: 0.0,

  // === WebGL选项 ===

  // contextOptions: Object
  // 作用: WebGL上下文选项
  // 默认: undefined
  // 用途: 控制WebGL上下文创建
  contextOptions: {
    webgl: {
      alpha: false, // 透明度通道
      depth: true, // 深度缓冲
      stencil: false, // 模板缓冲
      antialias: true, // 抗锯齿
      premultipliedAlpha: true, // 预乘alpha
      preserveDrawingBuffer: false, // 保留绘图缓冲
      powerPreference: 'high-performance', // 性能偏好
    },
  },

  // useDefaultRenderLoop: boolean
  // 作用: 是否使用默认渲染循环
  // 默认: true
  // 高级用途: 自定义渲染循环
  useDefaultRenderLoop: true,

  // targetFrameRate: number
  // 作用: 目标帧率
  // 默认: undefined
  // 性能控制: 限制渲染帧率
  targetFrameRate: 60,

  // showRenderLoopErrors: boolean
  // 作用: 是否显示渲染循环错误
  // 默认: true
  // 调试用途: 错误信息显示
  showRenderLoopErrors: true,

  // automaticallyTrackDataSourceClocks: boolean
  // 作用: 是否自动跟踪数据源时钟
  // 默认: true
  // 时间控制: 数据源时间同步
  automaticallyTrackDataSourceClocks: true,

  // === 输入控制选项 ===

  // enableCollisionDetection: boolean
  // 作用: 是否启用碰撞检测
  // 默认: true
  // 用途: 相机与地形的碰撞检测
  enableCollisionDetection: true,

  // useBrowserRecommendedResolution: boolean
  // 作用: 是否使用浏览器推荐分辨率
  // 默认: true
  // 性能影响: 高分辨率显示器的性能
  useBrowserRecommendedResolution: true,

  // orderIndependentTranslucency: boolean
  // 作用: 顺序无关透明度
  // 默认: true
  // 渲染质量: 透明物体的渲染质量
  orderIndependentTranslucency: true,

  // creditContainer: Element | string
  // 作用: 版权信息容器
  // 默认: undefined
  // 用途: 自定义版权信息显示位置
  creditContainer: undefined,

  // creditViewport: Element | string
  // 作用: 版权信息视口
  // 默认: undefined
  // 用途: 版权信息的显示区域
  creditViewport: undefined,

  // dataSources: DataSourceCollection
  // 作用: 数据源集合
  // 默认: new DataSourceCollection()
  // 用途: 预设的数据源
  dataSources: new Cesium.DataSourceCollection(),

  // clock: Clock
  // 作用: 时钟对象
  // 默认: new Clock()
  // 时间控制: 场景时间管理
  clock: new Cesium.Clock(),

  // blurActiveElementOnCanvasFocus: boolean
  // 作用: 画布获得焦点时是否模糊活动元素
  // 默认: true
  // UI控制: 焦点管理
  blurActiveElementOnCanvasFocus: true,

  // msaaSamples: number
  // 作用: MSAA采样数量
  // 默认: 1
  // 抗锯齿: 多重采样抗锯齿
  msaaSamples: 4,
})
```

## 坐标系统详解

### Cartesian3 笛卡尔坐标系

```javascript
// Cartesian3 - 3D笛卡尔坐标
class Cartesian3 {
  constructor(x = 0.0, y = 0.0, z = 0.0) {
    this.x = x // X轴坐标（米）
    this.y = y // Y轴坐标（米）
    this.z = z // Z轴坐标（米）
  }

  // 静态方法

  // fromDegrees - 从经纬度创建
  // longitude: 经度（度）
  // latitude: 纬度（度）
  // height: 高度（米，可选，默认0）
  // ellipsoid: 椭球体（可选，默认WGS84）
  static fromDegrees(longitude, latitude, height = 0, ellipsoid = Cesium.Ellipsoid.WGS84) {
    return Cesium.Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid)
  }

  // fromRadians - 从弧度创建
  static fromRadians(longitude, latitude, height = 0, ellipsoid = Cesium.Ellipsoid.WGS84) {
    return Cesium.Cartesian3.fromRadians(longitude, latitude, height, ellipsoid)
  }

  // fromDegreesArray - 从经纬度数组创建
  // coordinates: [lon1, lat1, lon2, lat2, ...]
  static fromDegreesArray(coordinates, ellipsoid = Cesium.Ellipsoid.WGS84) {
    return Cesium.Cartesian3.fromDegreesArray(coordinates, ellipsoid)
  }

  // fromDegreesArrayHeights - 从经纬度高度数组创建
  // coordinates: [lon1, lat1, height1, lon2, lat2, height2, ...]
  static fromDegreesArrayHeights(coordinates, ellipsoid = Cesium.Ellipsoid.WGS84) {
    return Cesium.Cartesian3.fromDegreesArrayHeights(coordinates, ellipsoid)
  }

  // 实例方法

  // clone - 克隆
  clone() {
    return Cesium.Cartesian3.clone(this)
  }

  // equals - 比较相等
  equals(other) {
    return Cesium.Cartesian3.equals(this, other)
  }

  // distance - 计算距离
  distanceTo(other) {
    return Cesium.Cartesian3.distance(this, other)
  }

  // normalize - 标准化
  normalize() {
    return Cesium.Cartesian3.normalize(this, new Cesium.Cartesian3())
  }

  // magnitude - 计算向量长度
  magnitude() {
    return Cesium.Cartesian3.magnitude(this)
  }

  // add - 向量加法
  add(other) {
    return Cesium.Cartesian3.add(this, other, new Cesium.Cartesian3())
  }

  // subtract - 向量减法
  subtract(other) {
    return Cesium.Cartesian3.subtract(this, other, new Cesium.Cartesian3())
  }

  // multiplyByScalar - 标量乘法
  multiplyByScalar(scalar) {
    return Cesium.Cartesian3.multiplyByScalar(this, scalar, new Cesium.Cartesian3())
  }

  // dot - 点积
  dot(other) {
    return Cesium.Cartesian3.dot(this, other)
  }

  // cross - 叉积
  cross(other) {
    return Cesium.Cartesian3.cross(this, other, new Cesium.Cartesian3())
  }
}

// 使用示例
const position = new Cesium.Cartesian3(1000000, 2000000, 3000000)
const beijingPosition = Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 100)
const positions = Cesium.Cartesian3.fromDegreesArray([
  116.4074,
  39.9042, // 北京
  121.4737,
  31.2304, // 上海
  113.2644,
  23.1291, // 广州
])
```

### Cartographic 地理坐标系

```javascript
// Cartographic - 地理坐标（经纬度）
class Cartographic {
  constructor(longitude = 0.0, latitude = 0.0, height = 0.0) {
    this.longitude = longitude // 经度（弧度）
    this.latitude = latitude // 纬度（弧度）
    this.height = height // 高度（米）
  }

  // 静态方法

  // fromDegrees - 从度数创建
  static fromDegrees(longitude, latitude, height = 0.0) {
    return new Cesium.Cartographic(
      Cesium.Math.toRadians(longitude),
      Cesium.Math.toRadians(latitude),
      height,
    )
  }

  // fromRadians - 从弧度创建
  static fromRadians(longitude, latitude, height = 0.0) {
    return new Cesium.Cartographic(longitude, latitude, height)
  }

  // fromCartesian - 从笛卡尔坐标创建
  static fromCartesian(cartesian, ellipsoid = Cesium.Ellipsoid.WGS84) {
    return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid)
  }

  // 实例方法

  // toLongitudeLatitude - 转换为经纬度（度）
  toLongitudeLatitude() {
    return {
      longitude: Cesium.Math.toDegrees(this.longitude),
      latitude: Cesium.Math.toDegrees(this.latitude),
      height: this.height,
    }
  }

  // clone - 克隆
  clone() {
    return Cesium.Cartographic.clone(this)
  }

  // equals - 比较相等
  equals(other) {
    return Cesium.Cartographic.equals(this, other)
  }
}

// 使用示例
const cartographic = Cesium.Cartographic.fromDegrees(116.4074, 39.9042, 100)
const cartesian = Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 100)
const backToCartographic = Cesium.Cartographic.fromCartesian(cartesian)
```

### Matrix4 变换矩阵

```javascript
// Matrix4 - 4x4变换矩阵
class Matrix4 {
  constructor() {
    // 16个元素的数组，按列优先存储
    this.elements = [
      1,
      0,
      0,
      0, // 第一列
      0,
      1,
      0,
      0, // 第二列
      0,
      0,
      1,
      0, // 第三列
      0,
      0,
      0,
      1, // 第四列
    ]
  }

  // 静态创建方法

  // IDENTITY - 单位矩阵
  static get IDENTITY() {
    return new Cesium.Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }

  // fromTranslation - 从平移创建
  static fromTranslation(translation) {
    return Cesium.Matrix4.fromTranslation(translation)
  }

  // fromScale - 从缩放创建
  static fromScale(scale) {
    return Cesium.Matrix4.fromScale(scale)
  }

  // fromRotationTranslation - 从旋转和平移创建
  static fromRotationTranslation(rotation, translation) {
    return Cesium.Matrix4.fromRotationTranslation(rotation, translation)
  }

  // 变换方法

  // multiplyByPoint - 乘以点
  multiplyByPoint(point) {
    return Cesium.Matrix4.multiplyByPoint(this, point, new Cesium.Cartesian3())
  }

  // multiplyByVector - 乘以向量
  multiplyByVector(vector) {
    return Cesium.Matrix4.multiplyByVector(this, vector, new Cesium.Cartesian4())
  }

  // multiply - 矩阵乘法
  multiply(other) {
    return Cesium.Matrix4.multiply(this, other, new Cesium.Matrix4())
  }

  // inverse - 求逆矩阵
  inverse() {
    return Cesium.Matrix4.inverse(this, new Cesium.Matrix4())
  }

  // transpose - 转置
  transpose() {
    return Cesium.Matrix4.transpose(this, new Cesium.Matrix4())
  }
}

// 使用示例
const translation = new Cesium.Cartesian3(100, 200, 300)
const translationMatrix = Cesium.Matrix4.fromTranslation(translation)

const scale = new Cesium.Cartesian3(2, 2, 2)
const scaleMatrix = Cesium.Matrix4.fromScale(scale)

const rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(45))
const rotationMatrix = Cesium.Matrix4.fromRotation(rotation)
```

## 实体系统完整属性

### Entity 基础实体

```javascript
// Entity - 基础实体类
class Entity {
  constructor(options = {}) {
    // === 基础属性 ===

    // id: string
    // 作用: 实体的唯一标识符
    // 默认: 自动生成UUID
    // 用途: 查找、更新、删除实体
    this.id = options.id || Cesium.createGuid()

    // name: string
    // 作用: 实体的显示名称
    // 默认: undefined
    // 用途: InfoBox标题、标签文本
    this.name = options.name

    // availability: TimeIntervalCollection
    // 作用: 实体的可用时间间隔
    // 默认: undefined（始终可用）
    // 用途: 时间动画中的显示控制
    this.availability = options.availability

    // show: boolean | Property
    // 作用: 控制实体的可见性
    // 默认: true
    // 用途: 显示/隐藏实体
    this.show = options.show !== undefined ? options.show : true

    // description: string | Property
    // 作用: 实体的描述信息
    // 默认: undefined
    // 用途: InfoBox的内容
    this.description = options.description

    // position: PositionProperty
    // 作用: 实体的位置
    // 默认: undefined
    // 类型: Cartesian3 | PositionProperty
    this.position = options.position

    // orientation: Property
    // 作用: 实体的方向（四元数）
    // 默认: undefined
    // 类型: Quaternion | Property
    this.orientation = options.orientation

    // viewFrom: Property
    // 作用: 相机观察实体时的相对位置
    // 默认: undefined
    // 类型: Cartesian3 | Property
    this.viewFrom = options.viewFrom

    // parent: Entity
    // 作用: 父实体（用于层次结构）
    // 默认: undefined
    // 用途: 实体的父子关系
    this.parent = options.parent

    // === 图形属性 ===

    // billboard: BillboardGraphics
    // 作用: 广告牌图形
    this.billboard = options.billboard

    // box: BoxGraphics
    // 作用: 盒子图形
    this.box = options.box

    // corridor: CorridorGraphics
    // 作用: 走廊图形
    this.corridor = options.corridor

    // cylinder: CylinderGraphics
    // 作用: 圆柱体图形
    this.cylinder = options.cylinder

    // ellipse: EllipseGraphics
    // 作用: 椭圆图形
    this.ellipse = options.ellipse

    // ellipsoid: EllipsoidGraphics
    // 作用: 椭球体图形
    this.ellipsoid = options.ellipsoid

    // label: LabelGraphics
    // 作用: 标签图形
    this.label = options.label

    // model: ModelGraphics
    // 作用: 3D模型图形
    this.model = options.model

    // tileset: Cesium3DTilesetGraphics
    // 作用: 3D瓦片集图形
    this.tileset = options.tileset

    // path: PathGraphics
    // 作用: 路径图形
    this.path = options.path

    // plane: PlaneGraphics
    // 作用: 平面图形
    this.plane = options.plane

    // point: PointGraphics
    // 作用: 点图形
    this.point = options.point

    // polygon: PolygonGraphics
    // 作用: 多边形图形
    this.polygon = options.polygon

    // polyline: PolylineGraphics
    // 作用: 多段线图形
    this.polyline = options.polyline

    // polylineVolume: PolylineVolumeGraphics
    // 作用: 多段线体积图形
    this.polylineVolume = options.polylineVolume

    // rectangle: RectangleGraphics
    // 作用: 矩形图形
    this.rectangle = options.rectangle

    // wall: WallGraphics
    // 作用: 墙体图形
    this.wall = options.wall
  }

  // === 方法 ===

  // computeModelMatrix - 计算模型矩阵
  // time: JulianDate - 时间
  // result: Matrix4 - 结果矩阵
  computeModelMatrix(time, result) {
    return Cesium.Entity.prototype.computeModelMatrix.call(this, time, result)
  }

  // isShowing - 是否正在显示
  // time: JulianDate - 时间
  isShowing(time) {
    return this.show && (!this.availability || this.availability.contains(time))
  }

  // isAvailable - 是否可用
  // time: JulianDate - 时间
  isAvailable(time) {
    return !this.availability || this.availability.contains(time)
  }
}

// 创建实体示例
const entity = new Cesium.Entity({
  id: 'beijing-marker',
  name: '北京标记',
  description: `
    <div style="padding: 10px;">
      <h3>北京市</h3>
      <p>中华人民共和国首都</p>
      <p>人口: 2154万</p>
      <p>面积: 16410.54平方公里</p>
    </div>
  `,
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 0),
  show: true,
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start: Cesium.JulianDate.fromDate(new Date('2023-01-01')),
      stop: Cesium.JulianDate.fromDate(new Date('2024-12-31')),
    }),
  ]),
})
```

### BillboardGraphics 广告牌图形

```javascript
// BillboardGraphics - 广告牌图形
class BillboardGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制广告牌的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // image: string | HTMLCanvasElement | HTMLVideoElement | Property
    // 作用: 广告牌的图像
    // 支持: URL、Canvas、Video、Data URL
    this.image = options.image

    // scale: number | Property
    // 作用: 广告牌的缩放比例
    // 默认: 1.0
    // 范围: 0.0 - 任意正数
    this.scale = options.scale !== undefined ? options.scale : 1.0

    // pixelOffset: Cartesian2 | Property
    // 作用: 像素偏移量
    // 默认: Cartesian2.ZERO
    // 用途: 微调广告牌位置
    this.pixelOffset = options.pixelOffset || Cesium.Cartesian2.ZERO

    // eyeOffset: Cartesian3 | Property
    // 作用: 眼部偏移量（相机空间）
    // 默认: Cartesian3.ZERO
    // 用途: 深度控制
    this.eyeOffset = options.eyeOffset || Cesium.Cartesian3.ZERO

    // horizontalOrigin: HorizontalOrigin | Property
    // 作用: 水平对齐方式
    // 默认: HorizontalOrigin.CENTER
    // 选项: LEFT, CENTER, RIGHT
    this.horizontalOrigin = options.horizontalOrigin || Cesium.HorizontalOrigin.CENTER

    // verticalOrigin: VerticalOrigin | Property
    // 作用: 垂直对齐方式
    // 默认: VerticalOrigin.CENTER
    // 选项: BOTTOM, BASELINE, CENTER, TOP
    this.verticalOrigin = options.verticalOrigin || Cesium.VerticalOrigin.CENTER

    // heightReference: HeightReference | Property
    // 作用: 高度参考
    // 默认: HeightReference.NONE
    // 选项: NONE, CLAMP_TO_GROUND, RELATIVE_TO_GROUND
    this.heightReference = options.heightReference || Cesium.HeightReference.NONE

    // color: Color | Property
    // 作用: 广告牌颜色（与图像混合）
    // 默认: Color.WHITE
    this.color = options.color || Cesium.Color.WHITE

    // rotation: number | Property
    // 作用: 旋转角度（弧度）
    // 默认: 0.0
    // 正值: 逆时针旋转
    this.rotation = options.rotation !== undefined ? options.rotation : 0.0

    // alignedAxis: Cartesian3 | Property
    // 作用: 对齐轴
    // 默认: Cartesian3.ZERO（自动对齐到屏幕）
    // 用途: 固定广告牌的旋转轴
    this.alignedAxis = options.alignedAxis || Cesium.Cartesian3.ZERO

    // sizeInMeters: boolean | Property
    // 作用: 是否以米为单位计算尺寸
    // 默认: false（以像素为单位）
    // true: 广告牌大小不随距离变化
    this.sizeInMeters = options.sizeInMeters !== undefined ? options.sizeInMeters : false

    // width: number | Property
    // 作用: 广告牌宽度
    // 默认: undefined（使用图像宽度）
    // 单位: 像素或米（取决于sizeInMeters）
    this.width = options.width

    // height: number | Property
    // 作用: 广告牌高度
    // 默认: undefined（使用图像高度）
    // 单位: 像素或米（取决于sizeInMeters）
    this.height = options.height

    // scaleByDistance: NearFarScalar | Property
    // 作用: 基于距离的缩放
    // 默认: undefined
    // 用途: LOD效果
    this.scaleByDistance = options.scaleByDistance

    // translucencyByDistance: NearFarScalar | Property
    // 作用: 基于距离的透明度
    // 默认: undefined
    // 用途: 渐隐效果
    this.translucencyByDistance = options.translucencyByDistance

    // pixelOffsetScaleByDistance: NearFarScalar | Property
    // 作用: 基于距离的像素偏移缩放
    // 默认: undefined
    this.pixelOffsetScaleByDistance = options.pixelOffsetScaleByDistance

    // imageSubRegion: BoundingRectangle | Property
    // 作用: 图像子区域
    // 默认: undefined（使用整个图像）
    // 用途: 纹理图集
    this.imageSubRegion = options.imageSubRegion

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    // 用途: 基于距离的显示/隐藏
    this.distanceDisplayCondition = options.distanceDisplayCondition

    // disableDepthTestDistance: number | Property
    // 作用: 禁用深度测试的距离
    // 默认: 0.0
    // 用途: 防止广告牌被地形遮挡
    this.disableDepthTestDistance =
      options.disableDepthTestDistance !== undefined ? options.disableDepthTestDistance : 0.0
  }
}

// 使用示例
const billboardEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042),
  billboard: {
    image:
      'data:image/svg+xml;base64,' +
      btoa(`
      <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.2 0 0 7.2 0 16c0 8.8 16 24 16 24s16-15.2 16-24C32 7.2 24.8 0 16 0z" fill="#E53E3E"/>
        <circle cx="16" cy="16" r="8" fill="#FFF"/>
        <text x="16" y="20" text-anchor="middle" fill="#E53E3E" font-size="8">1</text>
      </svg>
    `),
    scale: 1.5,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1.5e7),
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  },
})
```

### PointGraphics 点图形

```javascript
// PointGraphics - 点图形
class PointGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制点的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // pixelSize: number | Property
    // 作用: 点的像素大小
    // 默认: 1
    // 范围: 1 - 硬件限制
    this.pixelSize = options.pixelSize !== undefined ? options.pixelSize : 1

    // heightReference: HeightReference | Property
    // 作用: 高度参考
    // 默认: HeightReference.NONE
    // 选项: NONE, CLAMP_TO_GROUND, RELATIVE_TO_GROUND
    this.heightReference = options.heightReference || Cesium.HeightReference.NONE

    // color: Color | Property
    // 作用: 点的颜色
    // 默认: Color.WHITE
    this.color = options.color || Cesium.Color.WHITE

    // outlineColor: Color | Property
    // 作用: 点的轮廓颜色
    // 默认: Color.BLACK
    this.outlineColor = options.outlineColor || Cesium.Color.BLACK

    // outlineWidth: number | Property
    // 作用: 轮廓宽度
    // 默认: 0
    // 范围: 0 - 硬件限制
    this.outlineWidth = options.outlineWidth !== undefined ? options.outlineWidth : 0

    // scaleByDistance: NearFarScalar | Property
    // 作用: 基于距离的缩放
    // 默认: undefined
    this.scaleByDistance = options.scaleByDistance

    // translucencyByDistance: NearFarScalar | Property
    // 作用: 基于距离的透明度
    // 默认: undefined
    this.translucencyByDistance = options.translucencyByDistance

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    this.distanceDisplayCondition = options.distanceDisplayCondition

    // disableDepthTestDistance: number | Property
    // 作用: 禁用深度测试的距离
    // 默认: 0.0
    this.disableDepthTestDistance =
      options.disableDepthTestDistance !== undefined ? options.disableDepthTestDistance : 0.0
  }
}

// 使用示例
const pointEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042),
  point: {
    pixelSize: 15,
    color: Cesium.Color.YELLOW,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 3,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2.0e6),
  },
})
```

### LabelGraphics 标签图形

```javascript
// LabelGraphics - 标签图形
class LabelGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制标签的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // text: string | Property
    // 作用: 标签文本
    // 默认: undefined
    // 支持: 普通文本、HTML实体
    this.text = options.text

    // font: string | Property
    // 作用: 字体样式
    // 默认: '30px sans-serif'
    // 格式: CSS字体格式
    this.font = options.font || '30px sans-serif'

    // style: LabelStyle | Property
    // 作用: 标签样式
    // 默认: LabelStyle.FILL
    // 选项: FILL, OUTLINE, FILL_AND_OUTLINE
    this.style = options.style || Cesium.LabelStyle.FILL

    // scale: number | Property
    // 作用: 标签缩放比例
    // 默认: 1.0
    this.scale = options.scale !== undefined ? options.scale : 1.0

    // showBackground: boolean | Property
    // 作用: 是否显示背景
    // 默认: false
    this.showBackground = options.showBackground !== undefined ? options.showBackground : false

    // backgroundColor: Color | Property
    // 作用: 背景颜色
    // 默认: Color(0.165, 0.165, 0.165, 0.8)
    this.backgroundColor = options.backgroundColor || new Cesium.Color(0.165, 0.165, 0.165, 0.8)

    // backgroundPadding: Cartesian2 | Property
    // 作用: 背景内边距（像素）
    // 默认: Cartesian2(7, 5)
    this.backgroundPadding = options.backgroundPadding || new Cesium.Cartesian2(7, 5)

    // pixelOffset: Cartesian2 | Property
    // 作用: 像素偏移量
    // 默认: Cartesian2.ZERO
    this.pixelOffset = options.pixelOffset || Cesium.Cartesian2.ZERO

    // eyeOffset: Cartesian3 | Property
    // 作用: 眼部偏移量
    // 默认: Cartesian3.ZERO
    this.eyeOffset = options.eyeOffset || Cesium.Cartesian3.ZERO

    // horizontalOrigin: HorizontalOrigin | Property
    // 作用: 水平对齐方式
    // 默认: HorizontalOrigin.CENTER
    // 选项: LEFT, CENTER, RIGHT
    this.horizontalOrigin = options.horizontalOrigin || Cesium.HorizontalOrigin.CENTER

    // verticalOrigin: VerticalOrigin | Property
    // 作用: 垂直对齐方式
    // 默认: VerticalOrigin.CENTER
    // 选项: BOTTOM, BASELINE, CENTER, TOP
    this.verticalOrigin = options.verticalOrigin || Cesium.VerticalOrigin.CENTER

    // heightReference: HeightReference | Property
    // 作用: 高度参考
    // 默认: HeightReference.NONE
    this.heightReference = options.heightReference || Cesium.HeightReference.NONE

    // fillColor: Color | Property
    // 作用: 填充颜色
    // 默认: Color.WHITE
    this.fillColor = options.fillColor || Cesium.Color.WHITE

    // outlineColor: Color | Property
    // 作用: 轮廓颜色
    // 默认: Color.BLACK
    this.outlineColor = options.outlineColor || Cesium.Color.BLACK

    // outlineWidth: number | Property
    // 作用: 轮廓宽度
    // 默认: 1
    this.outlineWidth = options.outlineWidth !== undefined ? options.outlineWidth : 1

    // translucencyByDistance: NearFarScalar | Property
    // 作用: 基于距离的透明度
    // 默认: undefined
    this.translucencyByDistance = options.translucencyByDistance

    // pixelOffsetScaleByDistance: NearFarScalar | Property
    // 作用: 基于距离的像素偏移缩放
    // 默认: undefined
    this.pixelOffsetScaleByDistance = options.pixelOffsetScaleByDistance

    // scaleByDistance: NearFarScalar | Property
    // 作用: 基于距离的缩放
    // 默认: undefined
    this.scaleByDistance = options.scaleByDistance

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    this.distanceDisplayCondition = options.distanceDisplayCondition

    // disableDepthTestDistance: number | Property
    // 作用: 禁用深度测试的距离
    // 默认: 0.0
    this.disableDepthTestDistance =
      options.disableDepthTestDistance !== undefined ? options.disableDepthTestDistance : 0.0
  }
}

// 使用示例
const labelEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042),
  label: {
    text: '北京市',
    font: '24pt Microsoft YaHei',
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    showBackground: true,
    backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
    backgroundPadding: new Cesium.Cartesian2(10, 8),
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, -50),
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.5),
  },
})
```

### PolylineGraphics 多段线图形

```javascript
// PolylineGraphics - 多段线图形
class PolylineGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制多段线的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // positions: Array<Cartesian3> | Property
    // 作用: 多段线的顶点位置数组
    // 默认: undefined
    // 格式: [Cartesian3, Cartesian3, ...]
    this.positions = options.positions

    // width: number | Property
    // 作用: 线条宽度（像素）
    // 默认: 1.0
    // 范围: 1.0 - 硬件限制
    this.width = options.width !== undefined ? options.width : 1.0

    // granularity: number | Property
    // 作用: 线条细分粒度（弧度）
    // 默认: Math.PI / 180（1度）
    // 用途: 控制曲线的平滑度
    this.granularity = options.granularity !== undefined ? options.granularity : Math.PI / 180

    // material: MaterialProperty | Color
    // 作用: 线条材质
    // 默认: Color.WHITE
    // 类型: Color、ImageMaterialProperty、PolylineDashMaterialProperty等
    this.material = options.material || Cesium.Color.WHITE

    // depthFailMaterial: MaterialProperty | Color
    // 作用: 深度测试失败时的材质
    // 默认: undefined
    // 用途: 被遮挡部分的显示
    this.depthFailMaterial = options.depthFailMaterial

    // followSurface: boolean | Property
    // 作用: 是否跟随地表
    // 默认: true
    // true: 线条贴合地球表面曲率
    this.followSurface = options.followSurface !== undefined ? options.followSurface : true

    // clampToGround: boolean | Property
    // 作用: 是否贴地
    // 默认: false
    // true: 线条贴合地形表面
    this.clampToGround = options.clampToGround !== undefined ? options.clampToGround : false

    // shadows: ShadowMode | Property
    // 作用: 阴影模式
    // 默认: ShadowMode.DISABLED
    // 选项: DISABLED, ENABLED, CAST_ONLY, RECEIVE_ONLY
    this.shadows = options.shadows || Cesium.ShadowMode.DISABLED

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    this.distanceDisplayCondition = options.distanceDisplayCondition

    // classificationType: ClassificationType | Property
    // 作用: 分类类型（用于贴地）
    // 默认: ClassificationType.BOTH
    // 选项: TERRAIN, CESIUM_3D_TILE, BOTH
    this.classificationType = options.classificationType || Cesium.ClassificationType.BOTH

    // zIndex: number | Property
    // 作用: Z轴索引（贴地时的层次）
    // 默认: 0
    // 用途: 控制重叠线条的显示顺序
    this.zIndex = options.zIndex !== undefined ? options.zIndex : 0
  }
}

// 使用示例
const polylineEntity = viewer.entities.add({
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArray([
      116.4074,
      39.9042, // 北京
      121.4737,
      31.2304, // 上海
      113.2644,
      23.1291, // 广州
    ]),
    width: 5,
    material: Cesium.Color.CYAN,
    clampToGround: true,

    // 虚线材质
    material: new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.YELLOW,
      dashLength: 16.0, // 虚线长度
      dashPattern: 255, // 虚线模式
    }),

    // 箭头材质
    material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),

    // 发光材质
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.2, // 发光强度
      taperPower: 0.5, // 锥形功率
      color: Cesium.Color.BLUE,
    }),
  },
})
```

### PolygonGraphics 多边形图形

```javascript
// PolygonGraphics - 多边形图形
class PolygonGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制多边形的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // hierarchy: PolygonHierarchy | Property
    // 作用: 多边形层次结构（外环和内环）
    // 默认: undefined
    // 格式: 顶点数组或PolygonHierarchy对象
    this.hierarchy = options.hierarchy

    // height: number | Property
    // 作用: 多边形高度（米）
    // 默认: 0
    // 用途: 抬高多边形
    this.height = options.height !== undefined ? options.height : 0

    // heightReference: HeightReference | Property
    // 作用: 高度参考
    // 默认: HeightReference.NONE
    this.heightReference = options.heightReference || Cesium.HeightReference.NONE

    // extrudedHeight: number | Property
    // 作用: 拉伸高度（米）
    // 默认: undefined
    // 用途: 创建3D立体效果
    this.extrudedHeight = options.extrudedHeight

    // extrudedHeightReference: HeightReference | Property
    // 作用: 拉伸高度参考
    // 默认: HeightReference.NONE
    this.extrudedHeightReference = options.extrudedHeightReference || Cesium.HeightReference.NONE

    // stRotation: number | Property
    // 作用: 纹理旋转角度（弧度）
    // 默认: 0.0
    // 用途: 旋转材质纹理
    this.stRotation = options.stRotation !== undefined ? options.stRotation : 0.0

    // granularity: number | Property
    // 作用: 细分粒度（弧度）
    // 默认: Math.PI / 180
    // 用途: 控制曲线边的平滑度
    this.granularity = options.granularity !== undefined ? options.granularity : Math.PI / 180

    // fill: boolean | Property
    // 作用: 是否填充
    // 默认: true
    this.fill = options.fill !== undefined ? options.fill : true

    // material: MaterialProperty | Color
    // 作用: 填充材质
    // 默认: Color.WHITE
    this.material = options.material || Cesium.Color.WHITE

    // outline: boolean | Property
    // 作用: 是否显示轮廓
    // 默认: false
    this.outline = options.outline !== undefined ? options.outline : false

    // outlineColor: Color | Property
    // 作用: 轮廓颜色
    // 默认: Color.BLACK
    this.outlineColor = options.outlineColor || Cesium.Color.BLACK

    // outlineWidth: number | Property
    // 作用: 轮廓宽度（像素）
    // 默认: 1.0
    // 注意: 在某些硬件上可能不支持
    this.outlineWidth = options.outlineWidth !== undefined ? options.outlineWidth : 1.0

    // perPositionHeight: boolean | Property
    // 作用: 是否使用每个顶点的高度
    // 默认: false
    // true: 每个顶点可以有不同的高度
    this.perPositionHeight =
      options.perPositionHeight !== undefined ? options.perPositionHeight : false

    // closeTop: boolean | Property
    // 作用: 是否封闭顶部（拉伸时）
    // 默认: true
    this.closeTop = options.closeTop !== undefined ? options.closeTop : true

    // closeBottom: boolean | Property
    // 作用: 是否封闭底部（拉伸时）
    // 默认: true
    this.closeBottom = options.closeBottom !== undefined ? options.closeBottom : true

    // arcType: ArcType | Property
    // 作用: 弧线类型
    // 默认: ArcType.GEODESIC
    // 选项: NONE, GEODESIC, RHUMB
    this.arcType = options.arcType || Cesium.ArcType.GEODESIC

    // shadows: ShadowMode | Property
    // 作用: 阴影模式
    // 默认: ShadowMode.DISABLED
    this.shadows = options.shadows || Cesium.ShadowMode.DISABLED

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    this.distanceDisplayCondition = options.distanceDisplayCondition

    // classificationType: ClassificationType | Property
    // 作用: 分类类型
    // 默认: ClassificationType.BOTH
    this.classificationType = options.classificationType || Cesium.ClassificationType.BOTH

    // zIndex: number | Property
    // 作用: Z轴索引
    // 默认: 0
    this.zIndex = options.zIndex !== undefined ? options.zIndex : 0
  }
}

// 使用示例
const polygonEntity = viewer.entities.add({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      116.3,
      39.8, // 西南角
      116.5,
      39.8, // 东南角
      116.5,
      40.0, // 东北角
      116.3,
      40.0, // 西北角
    ]),
    height: 0,
    extrudedHeight: 300, // 拉伸300米
    material: Cesium.Color.BLUE.withAlpha(0.7),
    outline: true,
    outlineColor: Cesium.Color.BLUE,
    outlineWidth: 2,

    // 带洞的多边形
    hierarchy: new Cesium.PolygonHierarchy(
      // 外环
      Cesium.Cartesian3.fromDegreesArray([116.3, 39.8, 116.5, 39.8, 116.5, 40.0, 116.3, 40.0]),
      // 内环（洞）
      [
        new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            116.35, 39.85, 116.45, 39.85, 116.45, 39.95, 116.35, 39.95,
          ]),
        ),
      ],
    ),

    // 图片材质
    material: new Cesium.ImageMaterialProperty({
      image: 'path/to/texture.png',
      repeat: new Cesium.Cartesian2(4.0, 4.0),
    }),

    // 棋盘材质
    material: new Cesium.CheckerboardMaterialProperty({
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: new Cesium.Cartesian2(4.0, 4.0),
    }),
  },
})
```

### ModelGraphics 3D模型图形

```javascript
// ModelGraphics - 3D模型图形
class ModelGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制模型的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // uri: string | Resource | Property
    // 作用: 模型文件路径
    // 默认: undefined
    // 支持: glTF(.gltf, .glb)、COLLADA(.dae)等
    this.uri = options.uri

    // scale: number | Property
    // 作用: 模型缩放比例
    // 默认: 1.0
    this.scale = options.scale !== undefined ? options.scale : 1.0

    // minimumPixelSize: number | Property
    // 作用: 最小像素大小
    // 默认: 0.0
    // 用途: 防止模型在远距离时变得过小
    this.minimumPixelSize = options.minimumPixelSize !== undefined ? options.minimumPixelSize : 0.0

    // maximumScale: number | Property
    // 作用: 最大缩放比例
    // 默认: undefined
    // 用途: 限制模型的最大显示尺寸
    this.maximumScale = options.maximumScale

    // incrementallyLoadTextures: boolean | Property
    // 作用: 是否增量加载纹理
    // 默认: true
    // 性能优化: 渐进式纹理加载
    this.incrementallyLoadTextures =
      options.incrementallyLoadTextures !== undefined ? options.incrementallyLoadTextures : true

    // runAnimations: boolean | Property
    // 作用: 是否运行动画
    // 默认: true
    // 用途: 控制模型内置动画的播放
    this.runAnimations = options.runAnimations !== undefined ? options.runAnimations : true

    // clampAnimations: boolean | Property
    // 作用: 是否限制动画
    // 默认: true
    // 用途: 将动画限制在定义的时间范围内
    this.clampAnimations = options.clampAnimations !== undefined ? options.clampAnimations : true

    // shadows: ShadowMode | Property
    // 作用: 阴影模式
    // 默认: ShadowMode.ENABLED
    this.shadows = options.shadows || Cesium.ShadowMode.ENABLED

    // heightReference: HeightReference | Property
    // 作用: 高度参考
    // 默认: HeightReference.NONE
    this.heightReference = options.heightReference || Cesium.HeightReference.NONE

    // silhouetteColor: Color | Property
    // 作用: 轮廓颜色
    // 默认: Color.RED
    // 用途: 模型被选中时的轮廓颜色
    this.silhouetteColor = options.silhouetteColor || Cesium.Color.RED

    // silhouetteSize: number | Property
    // 作用: 轮廓大小
    // 默认: 0.0（不显示轮廓）
    // 用途: 模型被选中时的轮廓宽度
    this.silhouetteSize = options.silhouetteSize !== undefined ? options.silhouetteSize : 0.0

    // color: Color | Property
    // 作用: 模型颜色（混合）
    // 默认: Color.WHITE
    // 用途: 与模型纹理混合的颜色
    this.color = options.color || Cesium.Color.WHITE

    // colorBlendMode: ColorBlendMode | Property
    // 作用: 颜色混合模式
    // 默认: ColorBlendMode.HIGHLIGHT
    // 选项: HIGHLIGHT, REPLACE, MIX
    this.colorBlendMode = options.colorBlendMode || Cesium.ColorBlendMode.HIGHLIGHT

    // colorBlendAmount: number | Property
    // 作用: 颜色混合强度
    // 默认: 0.5
    // 范围: 0.0 - 1.0
    this.colorBlendAmount = options.colorBlendAmount !== undefined ? options.colorBlendAmount : 0.5

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    this.distanceDisplayCondition = options.distanceDisplayCondition

    // nodeTransformations: PropertyBag | Property
    // 作用: 节点变换
    // 默认: undefined
    // 用途: 控制模型中特定节点的变换
    this.nodeTransformations = options.nodeTransformations

    // articulations: PropertyBag | Property
    // 作用: 关节动画
    // 默认: undefined
    // 用途: 控制模型的关节动画
    this.articulations = options.articulations

    // clippingPlanes: ClippingPlaneCollection | Property
    // 作用: 裁剪平面
    // 默认: undefined
    // 用途: 裁剪模型的某些部分
    this.clippingPlanes = options.clippingPlanes
  }
}

// 使用示例
const modelEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 0),
  model: {
    uri: './models/airplane.gltf',
    scale: 2.0,
    minimumPixelSize: 128,
    maximumScale: 20000,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

    // 高亮显示
    silhouetteColor: Cesium.Color.LIME,
    silhouetteSize: 2.0,

    // 颜色调整
    color: Cesium.Color.RED,
    colorBlendMode: Cesium.ColorBlendMode.MIX,
    colorBlendAmount: 0.3,

    // 节点变换（旋转螺旋桨）
    nodeTransformations: {
      Propeller: new Cesium.NodeTransformationProperty({
        rotation: new Cesium.CallbackProperty(() => {
          return Cesium.Quaternion.fromAxisAngle(
            Cesium.Cartesian3.UNIT_Z,
            (Date.now() / 1000) * 10, // 每秒10弧度
          )
        }, false),
      }),
    },

    // 裁剪平面
    clippingPlanes: new Cesium.ClippingPlaneCollection({
      planes: [new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 0.0, 0.0), 0.0)],
    }),
  },
})
```

### BoxGraphics 盒子图形

```javascript
// BoxGraphics - 盒子图形
class BoxGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制盒子的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // dimensions: Cartesian3 | Property
    // 作用: 盒子的尺寸（长、宽、高）
    // 默认: undefined
    // 单位: 米
    this.dimensions = options.dimensions

    // heightReference: HeightReference | Property
    // 作用: 高度参考
    // 默认: HeightReference.NONE
    this.heightReference = options.heightReference || Cesium.HeightReference.NONE

    // fill: boolean | Property
    // 作用: 是否填充
    // 默认: true
    this.fill = options.fill !== undefined ? options.fill : true

    // material: MaterialProperty | Color
    // 作用: 填充材质
    // 默认: Color.WHITE
    this.material = options.material || Cesium.Color.WHITE

    // outline: boolean | Property
    // 作用: 是否显示轮廓
    // 默认: false
    this.outline = options.outline !== undefined ? options.outline : false

    // outlineColor: Color | Property
    // 作用: 轮廓颜色
    // 默认: Color.BLACK
    this.outlineColor = options.outlineColor || Cesium.Color.BLACK

    // outlineWidth: number | Property
    // 作用: 轮廓宽度
    // 默认: 1.0
    this.outlineWidth = options.outlineWidth !== undefined ? options.outlineWidth : 1.0

    // shadows: ShadowMode | Property
    // 作用: 阴影模式
    // 默认: ShadowMode.DISABLED
    this.shadows = options.shadows || Cesium.ShadowMode.DISABLED

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    this.distanceDisplayCondition = options.distanceDisplayCondition
  }
}

// 使用示例
const boxEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 100),
  box: {
    dimensions: new Cesium.Cartesian3(200, 200, 100), // 长200m，宽200m，高100m
    material: Cesium.Color.BLUE.withAlpha(0.7),
    outline: true,
    outlineColor: Cesium.Color.BLUE,
    outlineWidth: 2,
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  },
})
```

### CylinderGraphics 圆柱体图形

```javascript
// CylinderGraphics - 圆柱体图形
class CylinderGraphics {
  constructor(options = {}) {
    // show: boolean | Property
    // 作用: 控制圆柱体的可见性
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // length: number | Property
    // 作用: 圆柱体长度（高度）
    // 默认: undefined
    // 单位: 米
    this.length = options.length

    // topRadius: number | Property
    // 作用: 顶部半径
    // 默认: undefined
    // 单位: 米
    this.topRadius = options.topRadius

    // bottomRadius: number | Property
    // 作用: 底部半径
    // 默认: undefined
    // 单位: 米
    this.bottomRadius = options.bottomRadius

    // heightReference: HeightReference | Property
    // 作用: 高度参考
    // 默认: HeightReference.NONE
    this.heightReference = options.heightReference || Cesium.HeightReference.NONE

    // fill: boolean | Property
    // 作用: 是否填充
    // 默认: true
    this.fill = options.fill !== undefined ? options.fill : true

    // material: MaterialProperty | Color
    // 作用: 填充材质
    // 默认: Color.WHITE
    this.material = options.material || Cesium.Color.WHITE

    // outline: boolean | Property
    // 作用: 是否显示轮廓
    // 默认: false
    this.outline = options.outline !== undefined ? options.outline : false

    // outlineColor: Color | Property
    // 作用: 轮廓颜色
    // 默认: Color.BLACK
    this.outlineColor = options.outlineColor || Cesium.Color.BLACK

    // outlineWidth: number | Property
    // 作用: 轮廓宽度
    // 默认: 1.0
    this.outlineWidth = options.outlineWidth !== undefined ? options.outlineWidth : 1.0

    // numberOfVerticalLines: number | Property
    // 作用: 垂直线条数量
    // 默认: 16
    // 用途: 控制圆柱体的细分精度
    this.numberOfVerticalLines =
      options.numberOfVerticalLines !== undefined ? options.numberOfVerticalLines : 16

    // slices: number | Property
    // 作用: 切片数量
    // 默认: 128
    // 用途: 控制圆周方向的精度
    this.slices = options.slices !== undefined ? options.slices : 128

    // shadows: ShadowMode | Property
    // 作用: 阴影模式
    // 默认: ShadowMode.DISABLED
    this.shadows = options.shadows || Cesium.ShadowMode.DISABLED

    // distanceDisplayCondition: DistanceDisplayCondition | Property
    // 作用: 距离显示条件
    // 默认: undefined
    this.distanceDisplayCondition = options.distanceDisplayCondition
  }
}

// 使用示例
const cylinderEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 50),
  cylinder: {
    length: 100, // 高度100米
    topRadius: 30, // 顶部半径30米
    bottomRadius: 50, // 底部半径50米（锥形）
    material: Cesium.Color.GREEN.withAlpha(0.8),
    outline: true,
    outlineColor: Cesium.Color.DARKGREEN,
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  },
})
```

## 地形系统详解

### TerrainProvider 地形提供者

```javascript
// EllipsoidTerrainProvider - 椭球地形（离线推荐）
class EllipsoidTerrainProvider {
  constructor(options = {}) {
    // ellipsoid: Ellipsoid
    // 作用: 椭球体参数
    // 默认: Ellipsoid.WGS84
    this.ellipsoid = options.ellipsoid || Cesium.Ellipsoid.WGS84

    // credit: Credit | string
    // 作用: 版权信息
    // 默认: undefined
    this.credit = options.credit
  }

  // 属性
  get ready() {
    return true
  } // 是否就绪
  get readyPromise() {
    return Promise.resolve(true)
  } // 就绪Promise
  get errorEvent() {
    return new Cesium.Event()
  } // 错误事件
  get hasWaterMask() {
    return false
  } // 是否有水体遮罩
  get hasVertexNormals() {
    return false
  } // 是否有顶点法线
  get availability() {
    return undefined
  } // 可用性
}

// CesiumTerrainProvider - Cesium地形服务
class CesiumTerrainProvider {
  constructor(options = {}) {
    // url: string | Resource
    // 作用: 地形服务URL
    // 必需: true
    this.url = options.url

    // requestWaterMask: boolean
    // 作用: 是否请求水体遮罩
    // 默认: false
    this.requestWaterMask =
      options.requestWaterMask !== undefined ? options.requestWaterMask : false

    // requestVertexNormals: boolean
    // 作用: 是否请求顶点法线
    // 默认: false
    this.requestVertexNormals =
      options.requestVertexNormals !== undefined ? options.requestVertexNormals : false

    // ellipsoid: Ellipsoid
    // 作用: 椭球体
    // 默认: Ellipsoid.WGS84
    this.ellipsoid = options.ellipsoid || Cesium.Ellipsoid.WGS84

    // credit: Credit | string
    // 作用: 版权信息
    // 默认: undefined
    this.credit = options.credit
  }

  // 方法

  // requestTileGeometry - 请求瓦片几何
  // x: number - X坐标
  // y: number - Y坐标
  // level: number - 级别
  requestTileGeometry(x, y, level) {
    // 返回Promise<TerrainData>
  }

  // getLevelMaximumGeometricError - 获取级别最大几何误差
  // level: number - 级别
  getLevelMaximumGeometricError(level) {
    // 返回几何误差值
  }

  // getTileDataAvailable - 获取瓦片数据可用性
  // x: number - X坐标
  // y: number - Y坐标
  // level: number - 级别
  getTileDataAvailable(x, y, level) {
    // 返回boolean
  }
}

// 地形采样
const sampleTerrain = async () => {
  const positions = [
    Cesium.Cartographic.fromDegrees(116.4074, 39.9042),
    Cesium.Cartographic.fromDegrees(121.4737, 31.2304),
  ]

  // 采样地形高度
  const sampledPositions = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions)

  sampledPositions.forEach((position, index) => {
    console.log(`位置 ${index}: 高度 ${position.height} 米`)
  })
}

// 地形配置示例
// 离线椭球地形
viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()

// Cesium World Terrain（需要网络）
const worldTerrain = Cesium.createWorldTerrain({
  requestWaterMask: true, // 请求水体遮罩
  requestVertexNormals: true, // 请求顶点法线
})
viewer.terrainProvider = worldTerrain

// 自定义地形服务
const customTerrain = new Cesium.CesiumTerrainProvider({
  url: 'http://localhost:8080/terrain/',
  requestWaterMask: true,
  requestVertexNormals: true,
})
viewer.terrainProvider = customTerrain
```

## 相机系统完整属性

### Camera 相机类

```javascript
// Camera - 相机类
class Camera {
  constructor() {
    // position: Cartesian3
    // 作用: 相机在世界坐标系中的位置
    // 只读: false
    this.position = new Cesium.Cartesian3()

    // direction: Cartesian3
    // 作用: 相机朝向（单位向量）
    // 只读: false
    this.direction = new Cesium.Cartesian3()

    // up: Cartesian3
    // 作用: 相机上方向（单位向量）
    // 只读: false
    this.up = new Cesium.Cartesian3()

    // right: Cartesian3
    // 作用: 相机右方向（单位向量）
    // 只读: true（由direction和up计算）
    this.right = new Cesium.Cartesian3()

    // frustum: Frustum
    // 作用: 视锥体（透视或正交投影）
    // 类型: PerspectiveFrustum | OrthographicFrustum
    this.frustum = new Cesium.PerspectiveFrustum()

    // defaultMoveAmount: number
    // 作用: 默认移动距离
    // 默认: 100000.0（米）
    this.defaultMoveAmount = 100000.0

    // defaultLookAmount: number
    // 作用: 默认旋转角度
    // 默认: Math.PI / 60（弧度）
    this.defaultLookAmount = Math.PI / 60

    // defaultRotateAmount: number
    // 作用: 默认旋转角度
    // 默认: Math.PI / 3600（弧度）
    this.defaultRotateAmount = Math.PI / 3600

    // defaultZoomAmount: number
    // 作用: 默认缩放距离
    // 默认: 100000.0（米）
    this.defaultZoomAmount = 100000.0

    // constrainedAxis: Cartesian3
    // 作用: 约束轴（限制相机旋转）
    // 默认: undefined（无约束）
    this.constrainedAxis = undefined

    // maximumZoomFactor: number
    // 作用: 最大缩放因子
    // 默认: 1.5
    this.maximumZoomFactor = 1.5
  }

  // === 事件 ===

  // moveStart: Event
  // 作用: 相机开始移动事件
  // 触发: 相机开始移动时
  moveStart = new Cesium.Event()

  // moveEnd: Event
  // 作用: 相机停止移动事件
  // 触发: 相机停止移动时
  moveEnd = new Cesium.Event()

  // changed: Event
  // 作用: 相机变化事件
  // 触发: 相机位置、方向或视锥体变化时
  changed = new Cesium.Event()

  // === 位置设置方法 ===

  // setView - 设置视图
  setView(options) {
    // destination: Cartesian3 | Rectangle
    // 作用: 目标位置或区域
    const destination = options.destination

    // orientation: Object
    // 作用: 相机方向
    // heading: number - 航向角（弧度）
    // pitch: number - 俯仰角（弧度）
    // roll: number - 翻滚角（弧度）
    const orientation = options.orientation || {}

    // endTransform: Matrix4
    // 作用: 结束变换矩阵
    const endTransform = options.endTransform
  }

  // flyTo - 飞行到目标
  flyTo(options) {
    // destination: Cartesian3 | Rectangle
    // 作用: 目标位置
    const destination = options.destination

    // orientation: Object
    // 作用: 目标方向
    const orientation = options.orientation

    // duration: number
    // 作用: 飞行时间（秒）
    // 默认: 自动计算
    const duration = options.duration

    // complete: function
    // 作用: 完成回调
    const complete = options.complete

    // cancel: function
    // 作用: 取消回调
    const cancel = options.cancel

    // endTransform: Matrix4
    // 作用: 结束变换矩阵
    const endTransform = options.endTransform

    // maximumHeight: number
    // 作用: 飞行最大高度
    const maximumHeight = options.maximumHeight

    // pitchAdjustHeight: number
    // 作用: 俯仰角调整高度
    const pitchAdjustHeight = options.pitchAdjustHeight

    // flyOverLongitude: number
    // 作用: 飞越经度
    const flyOverLongitude = options.flyOverLongitude

    // flyOverLongitudeWeight: number
    // 作用: 飞越经度权重
    const flyOverLongitudeWeight = options.flyOverLongitudeWeight

    // convert: boolean
    // 作用: 是否转换坐标
    // 默认: true
    const convert = options.convert !== undefined ? options.convert : true

    // easingFunction: EasingFunction
    // 作用: 缓动函数
    const easingFunction = options.easingFunction
  }

  // lookAt - 看向目标
  lookAt(target, offset) {
    // target: Cartesian3
    // 作用: 目标位置
    // offset: Cartesian3 | HeadingPitchRange
    // 作用: 偏移量或方向距离
  }

  // lookAtTransform - 应用变换后看向目标
  lookAtTransform(transform, offset) {
    // transform: Matrix4
    // 作用: 变换矩阵
    // offset: Cartesian3 | HeadingPitchRange
    // 作用: 偏移量
  }

  // === 移动方法 ===

  // move - 移动相机
  move(direction, amount) {
    // direction: Cartesian3
    // 作用: 移动方向（单位向量）
    // amount: number
    // 作用: 移动距离（米）
  }

  // moveForward - 向前移动
  moveForward(amount = this.defaultMoveAmount) {
    // amount: number - 移动距离
  }

  // moveBackward - 向后移动
  moveBackward(amount = this.defaultMoveAmount) {
    // amount: number - 移动距离
  }

  // moveUp - 向上移动
  moveUp(amount = this.defaultMoveAmount) {
    // amount: number - 移动距离
  }

  // moveDown - 向下移动
  moveDown(amount = this.defaultMoveAmount) {
    // amount: number - 移动距离
  }

  // moveLeft - 向左移动
  moveLeft(amount = this.defaultMoveAmount) {
    // amount: number - 移动距离
  }

  // moveRight - 向右移动
  moveRight(amount = this.defaultMoveAmount) {
    // amount: number - 移动距离
  }

  // === 旋转方法 ===

  // look - 旋转相机
  look(axis, angle) {
    // axis: Cartesian3
    // 作用: 旋转轴
    // angle: number
    // 作用: 旋转角度（弧度）
  }

  // lookLeft - 向左看
  lookLeft(amount = this.defaultLookAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // lookRight - 向右看
  lookRight(amount = this.defaultLookAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // lookUp - 向上看
  lookUp(amount = this.defaultLookAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // lookDown - 向下看
  lookDown(amount = this.defaultLookAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // rotate - 绕点旋转
  rotate(axis, angle) {
    // axis: Cartesian3
    // 作用: 旋转轴
    // angle: number
    // 作用: 旋转角度（弧度）
  }

  // rotateLeft - 向左旋转
  rotateLeft(amount = this.defaultRotateAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // rotateRight - 向右旋转
  rotateRight(amount = this.defaultRotateAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // rotateUp - 向上旋转
  rotateUp(amount = this.defaultRotateAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // rotateDown - 向下旋转
  rotateDown(amount = this.defaultRotateAmount) {
    // amount: number - 旋转角度（弧度）
  }

  // === 缩放方法 ===

  // zoomIn - 放大
  zoomIn(amount = this.defaultZoomAmount) {
    // amount: number - 缩放距离（米）
  }

  // zoomOut - 缩小
  zoomOut(amount = this.defaultZoomAmount) {
    // amount: number - 缩放距离（米）
  }

  // === 坐标转换方法 ===

  // pickEllipsoid - 拾取椭球面
  pickEllipsoid(windowPosition, ellipsoid = Cesium.Ellipsoid.WGS84) {
    // windowPosition: Cartesian2
    // 作用: 屏幕坐标
    // ellipsoid: Ellipsoid
    // 作用: 椭球体
    // 返回: Cartesian3 | undefined
  }

  // getPickRay - 获取拾取射线
  getPickRay(windowPosition) {
    // windowPosition: Cartesian2
    // 作用: 屏幕坐标
    // 返回: Ray
  }

  // worldToCameraCoordinates - 世界坐标转相机坐标
  worldToCameraCoordinates(cartesian, result) {
    // cartesian: Cartesian3
    // 作用: 世界坐标
    // result: Cartesian3
    // 作用: 结果对象
    // 返回: Cartesian3
  }

  // cameraToWorldCoordinates - 相机坐标转世界坐标
  cameraToWorldCoordinates(cartesian, result) {
    // cartesian: Cartesian3
    // 作用: 相机坐标
    // result: Cartesian3
    // 作用: 结果对象
    // 返回: Cartesian3
  }

  // === 计算属性 ===

  // heading: number
  // 作用: 航向角（弧度）
  // 只读: true
  get heading() {
    return Cesium.Math.TWO_PI - Math.atan2(this.right.y, this.right.x)
  }

  // pitch: number
  // 作用: 俯仰角（弧度）
  // 只读: true
  get pitch() {
    return Math.asin(this.direction.z)
  }

  // roll: number
  // 作用: 翻滚角（弧度）
  // 只读: true
  get roll() {
    return Math.atan2(-this.up.x, this.up.z)
  }

  // positionCartographic: Cartographic
  // 作用: 地理坐标位置
  // 只读: true
  get positionCartographic() {
    return Cesium.Cartographic.fromCartesian(this.position)
  }
}

// 相机使用示例
const camera = viewer.camera

// 设置相机位置
camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 1000),
  orientation: {
    heading: Cesium.Math.toRadians(0), // 正北方向
    pitch: Cesium.Math.toRadians(-45), // 向下45度
    roll: Cesium.Math.toRadians(0), // 无翻滚
  },
})

// 飞行到位置
camera.flyTo({
  destination: Cesium.Rectangle.fromDegrees(115, 39, 117, 41),
  duration: 3.0,
  complete: () => console.log('飞行完成'),
  cancel: () => console.log('飞行取消'),
})

// 相机事件监听
camera.moveStart.addEventListener(() => {
  console.log('相机开始移动')
})

camera.moveEnd.addEventListener(() => {
  console.log('相机停止移动')
})

camera.changed.addEventListener(() => {
  console.log('相机发生变化')
})

// 相机控制
camera.moveForward(1000) // 向前移动1000米
camera.lookLeft(Math.PI / 4) // 向左看45度
camera.zoomIn(500) // 放大500米

// 获取相机信息
console.log('相机位置:', camera.position)
console.log('相机方向:', camera.direction)
console.log('航向角:', Cesium.Math.toDegrees(camera.heading))
console.log('俯仰角:', Cesium.Math.toDegrees(camera.pitch))
console.log('翻滚角:', Cesium.Math.toDegrees(camera.roll))

// 坐标转换
const screenPos = new Cesium.Cartesian2(100, 100)
const worldPos = camera.pickEllipsoid(screenPos)
if (worldPos) {
  const cartographic = Cesium.Cartographic.fromCartesian(worldPos)
  console.log('点击位置:', {
    longitude: Cesium.Math.toDegrees(cartographic.longitude),
    latitude: Cesium.Math.toDegrees(cartographic.latitude),
    height: cartographic.height,
  })
}
```

## 事件系统详解

### ScreenSpaceEventHandler 屏幕空间事件处理器

```javascript
// ScreenSpaceEventHandler - 屏幕空间事件处理器
class ScreenSpaceEventHandler {
  constructor(canvas) {
    // canvas: HTMLCanvasElement
    // 作用: 事件监听的画布元素
    this.canvas = canvas
  }

  // setInputAction - 设置输入动作
  setInputAction(action, type, modifier) {
    // action: function
    // 作用: 事件处理函数
    // 参数: event对象，包含position等信息
    // type: ScreenSpaceEventType
    // 作用: 事件类型
    // 选项: LEFT_CLICK, LEFT_DOUBLE_CLICK, LEFT_DOWN, LEFT_UP,
    //       RIGHT_CLICK, RIGHT_DOWN, RIGHT_UP,
    //       MIDDLE_CLICK, MIDDLE_DOWN, MIDDLE_UP,
    //       MOUSE_MOVE, WHEEL, PINCH_START, PINCH_END, PINCH_MOVE
    // modifier: KeyboardEventModifier (可选)
    // 作用: 键盘修饰符
    // 选项: SHIFT, CTRL, ALT
  }

  // getInputAction - 获取输入动作
  getInputAction(type, modifier) {
    // 返回: function | undefined
  }

  // removeInputAction - 移除输入动作
  removeInputAction(type, modifier) {
    // 移除指定类型的事件处理
  }

  // isDestroyed - 是否已销毁
  isDestroyed() {
    return this._isDestroyed
  }

  // destroy - 销毁处理器
  destroy() {
    // 清理所有事件监听
  }
}

// 事件类型详解
const ScreenSpaceEventType = {
  // 鼠标点击事件
  LEFT_CLICK: 0, // 左键单击
  LEFT_DOUBLE_CLICK: 1, // 左键双击
  LEFT_DOWN: 2, // 左键按下
  LEFT_UP: 3, // 左键抬起

  RIGHT_CLICK: 5, // 右键单击
  RIGHT_DOWN: 6, // 右键按下
  RIGHT_UP: 7, // 右键抬起

  MIDDLE_CLICK: 10, // 中键单击
  MIDDLE_DOWN: 11, // 中键按下
  MIDDLE_UP: 12, // 中键抬起

  // 鼠标移动和滚轮
  MOUSE_MOVE: 15, // 鼠标移动
  WHEEL: 16, // 滚轮滚动

  // 触摸事件
  PINCH_START: 17, // 捏合开始
  PINCH_END: 18, // 捏合结束
  PINCH_MOVE: 19, // 捏合移动
}

// 键盘修饰符
const KeyboardEventModifier = {
  SHIFT: 0, // Shift键
  CTRL: 1, // Ctrl键
  ALT: 2, // Alt键
}

// 事件处理示例
const handler = viewer.cesiumWidget.screenSpaceEventHandler

// 左键点击事件
handler.setInputAction((event) => {
  const position = event.position // Cartesian2屏幕坐标

  // 拾取对象
  const pickedObject = viewer.scene.pick(position)

  if (Cesium.defined(pickedObject)) {
    console.log('点击了对象:', pickedObject.id)

    // 选中实体
    viewer.selectedEntity = pickedObject.id
  } else {
    // 拾取地面位置
    const cartesian = viewer.camera.pickEllipsoid(position, viewer.scene.globe.ellipsoid)

    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      console.log('点击地面位置:', {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      })
    }
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

// 右键点击事件
handler.setInputAction((event) => {
  const position = event.position

  // 显示上下文菜单
  showContextMenu(position)
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

// 鼠标移动事件
handler.setInputAction((event) => {
  const startPosition = event.startPosition // 开始位置
  const endPosition = event.endPosition // 结束位置

  // 拾取悬停对象
  const pickedObject = viewer.scene.pick(endPosition)

  if (Cesium.defined(pickedObject)) {
    document.body.style.cursor = 'pointer'

    // 显示工具提示
    showTooltip(endPosition, pickedObject.id.name)
  } else {
    document.body.style.cursor = 'default'
    hideTooltip()
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

// 滚轮事件
handler.setInputAction((event) => {
  const delta = event // 滚轮增量

  console.log('滚轮滚动:', delta)

  // 自定义缩放逻辑
  if (delta > 0) {
    viewer.camera.zoomIn(viewer.camera.defaultZoomAmount * 0.5)
  } else {
    viewer.camera.zoomOut(viewer.camera.defaultZoomAmount * 0.5)
  }
}, Cesium.ScreenSpaceEventType.WHEEL)

// 左键拖拽事件
let isDragging = false
let startPosition

handler.setInputAction((event) => {
  isDragging = true
  startPosition = event.position

  // 禁用默认相机控制
  viewer.scene.screenSpaceCameraController.enableRotate = false
}, Cesium.ScreenSpaceEventType.LEFT_DOWN)

handler.setInputAction((event) => {
  if (isDragging) {
    const endPosition = event.endPosition

    // 计算拖拽距离
    const deltaX = endPosition.x - startPosition.x
    const deltaY = endPosition.y - startPosition.y

    console.log('拖拽距离:', { deltaX, deltaY })

    // 自定义拖拽逻辑
    customDragLogic(deltaX, deltaY)
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

handler.setInputAction((event) => {
  isDragging = false

  // 恢复默认相机控制
  viewer.scene.screenSpaceCameraController.enableRotate = true
}, Cesium.ScreenSpaceEventType.LEFT_UP)

// 带修饰符的事件
handler.setInputAction(
  (event) => {
    console.log('Ctrl + 左键点击')

    // 多选模式
    toggleEntitySelection(event.position)
  },
  Cesium.ScreenSpaceEventType.LEFT_CLICK,
  Cesium.KeyboardEventModifier.CTRL,
)

handler.setInputAction(
  (event) => {
    console.log('Shift + 左键点击')

    // 框选模式
    startBoxSelection(event.position)
  },
  Cesium.ScreenSpaceEventType.LEFT_CLICK,
  Cesium.KeyboardEventModifier.SHIFT,
)

// 触摸事件（移动设备）
handler.setInputAction((event) => {
  const position1 = event.position1 // 第一个触摸点
  const position2 = event.position2 // 第二个触摸点

  console.log('开始捏合手势')
}, Cesium.ScreenSpaceEventType.PINCH_START)

handler.setInputAction((event) => {
  const position1 = event.position1
  const position2 = event.position2

  // 计算缩放比例
  const distance = Cesium.Cartesian2.distance(position1, position2)
  console.log('捏合距离:', distance)
}, Cesium.ScreenSpaceEventType.PINCH_MOVE)

// 自定义工具提示
function showTooltip(position, text) {
  const tooltip = document.getElementById('tooltip')
  if (!tooltip) {
    const div = document.createElement('div')
    div.id = 'tooltip'
    div.style.position = 'absolute'
    div.style.background = 'rgba(0,0,0,0.8)'
    div.style.color = 'white'
    div.style.padding = '5px'
    div.style.borderRadius = '3px'
    div.style.pointerEvents = 'none'
    div.style.zIndex = '1000'
    document.body.appendChild(div)
  }

  const tooltip = document.getElementById('tooltip')
  tooltip.textContent = text
  tooltip.style.left = position.x + 10 + 'px'
  tooltip.style.top = position.y - 30 + 'px'
  tooltip.style.display = 'block'
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip')
  if (tooltip) {
    tooltip.style.display = 'none'
  }
}

// 移除事件处理
handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.CTRL)
```

## 材质系统详解

### Material 材质类

```javascript
// Material - 材质基类
class Material {
  constructor(options = {}) {
    // fabric: Object
    // 作用: 材质描述对象
    // 包含: type, uniforms, source等
    this.fabric = options.fabric

    // translucent: boolean | function
    // 作用: 是否透明
    // 默认: 根据材质类型确定
    this.translucent = options.translucent
  }

  // 静态方法

  // fromType - 从类型创建材质
  static fromType(type, uniforms) {
    // type: string - 材质类型
    // uniforms: Object - 材质参数
    return new Cesium.Material({
      fabric: {
        type: type,
        uniforms: uniforms,
      },
    })
  }

  // 内置材质类型
  static get ColorType() {
    return 'Color'
  } // 纯色
  static get ImageType() {
    return 'Image'
  } // 图片
  static get DiffuseMapType() {
    return 'DiffuseMap'
  } // 漫反射贴图
  static get AlphaMapType() {
    return 'AlphaMap'
  } // 透明贴图
  static get SpecularMapType() {
    return 'SpecularMap'
  } // 镜面贴图
  static get EmissionMapType() {
    return 'EmissionMap'
  } // 发射贴图
  static get BumpMapType() {
    return 'BumpMap'
  } // 凹凸贴图
  static get NormalMapType() {
    return 'NormalMap'
  } // 法线贴图
  static get GridType() {
    return 'Grid'
  } // 网格
  static get StripeType() {
    return 'Stripe'
  } // 条纹
  static get CheckerboardType() {
    return 'Checkerboard'
  } // 棋盘
  static get DotType() {
    return 'Dot'
  } // 点
  static get WaterType() {
    return 'Water'
  } // 水面
  static get RimLightingType() {
    return 'RimLighting'
  } // 边缘光照
  static get FadeType() {
    return 'Fade'
  } // 渐变
  static get PolylineArrowType() {
    return 'PolylineArrow'
  } // 箭头线
  static get PolylineGlowType() {
    return 'PolylineGlow'
  } // 发光线
  static get PolylineOutlineType() {
    return 'PolylineOutline'
  } // 轮廓线
}

// 颜色材质
const colorMaterial = new Cesium.ColorMaterialProperty(Cesium.Color.RED)

// 图片材质
const imageMaterial = new Cesium.ImageMaterialProperty({
  image: 'path/to/texture.jpg', // 图片路径
  repeat: new Cesium.Cartesian2(2.0, 2.0), // 重复次数
  color: Cesium.Color.WHITE, // 混合颜色
  transparent: false, // 是否透明
})

// 网格材质
const gridMaterial = new Cesium.GridMaterialProperty({
  color: Cesium.Color.YELLOW, // 网格颜色
  cellAlpha: 0.1, // 单元格透明度
  lineCount: new Cesium.Cartesian2(8, 8), // 网格数量
  lineThickness: new Cesium.Cartesian2(2.0, 2.0), // 线条粗细
  lineOffset: new Cesium.Cartesian2(0.5, 0.5), // 线条偏移
})

// 条纹材质
const stripeMaterial = new Cesium.StripeMaterialProperty({
  evenColor: Cesium.Color.WHITE, // 偶数条纹颜色
  oddColor: Cesium.Color.BLACK, // 奇数条纹颜色
  repeat: 16.0, // 条纹数量
  offset: 0.0, // 偏移量
  orientation: Cesium.StripeOrientation.HORIZONTAL, // 方向
})

// 棋盘材质
const checkerboardMaterial = new Cesium.CheckerboardMaterialProperty({
  evenColor: Cesium.Color.WHITE, // 偶数格颜色
  oddColor: Cesium.Color.BLACK, // 奇数格颜色
  repeat: new Cesium.Cartesian2(4.0, 4.0), // 重复次数
})

// 点材质
const dotMaterial = new Cesium.DotMaterialProperty({
  color: Cesium.Color.YELLOW, // 点颜色
  repeat: new Cesium.Cartesian2(16.0, 16.0), // 点的重复次数
})

// 水面材质
const waterMaterial = new Cesium.WaterMaterialProperty({
  baseWaterColor: Cesium.Color.AQUA, // 基础水色
  blendColor: Cesium.Color.BLUE, // 混合颜色
  specularMap: 'path/to/specular.jpg', // 镜面贴图
  normalMap: 'path/to/normal.jpg', // 法线贴图
  frequency: 10.0, // 波浪频率
  animationSpeed: 0.01, // 动画速度
  amplitude: 1.0, // 波幅
  specularIntensity: 0.5, // 镜面强度
})

// 边缘光照材质
const rimLightingMaterial = new Cesium.RimLightingMaterialProperty({
  color: Cesium.Color.LIME, // 边缘颜色
  rimColor: Cesium.Color.RED, // 边缘光颜色
  alpha: 1.0, // 透明度
})

// 渐变材质
const fadeMaterial = new Cesium.FadeMaterialProperty({
  fadeInColor: Cesium.Color.RED, // 渐入颜色
  fadeOutColor: Cesium.Color.BLUE, // 渐出颜色
  maximumDistance: 500000.0, // 最大距离
  repeat: true, // 是否重复
  fadeDirection: {
    // 渐变方向
    x: 1.0,
    y: 0.0,
  },
})

// 多段线材质

// 箭头线材质
const arrowMaterial = new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)

// 发光线材质
const glowMaterial = new Cesium.PolylineGlowMaterialProperty({
  glowPower: 0.2, // 发光强度
  taperPower: 0.5, // 锥形强度
  color: Cesium.Color.BLUE, // 颜色
})

// 虚线材质
const dashMaterial = new Cesium.PolylineDashMaterialProperty({
  color: Cesium.Color.CYAN, // 颜色
  gapColor: Cesium.Color.TRANSPARENT, // 间隙颜色
  dashLength: 16.0, // 虚线长度
  dashPattern: 255, // 虚线模式（二进制）
})

// 轮廓线材质
const outlineMaterial = new Cesium.PolylineOutlineMaterialProperty({
  color: Cesium.Color.ORANGE, // 内部颜色
  outlineColor: Cesium.Color.BLACK, // 轮廓颜色
  outlineWidth: 2.0, // 轮廓宽度
})

// 自定义着色器材质
const customMaterial = new Cesium.Material({
  fabric: {
    type: 'CustomShader',
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      time: 0.0,
    },
    source: `
      uniform vec4 color;
      uniform float time;
      
      czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        
        vec2 st = materialInput.st;
        
        // 动画波纹效果
        float wave = sin(st.s * 10.0 + time) * 0.5 + 0.5;
        
        material.diffuse = color.rgb * wave;
        material.alpha = color.a;
        
        return material;
      }
    `,
  },
})

// 应用材质到实体
const entity = viewer.entities.add({
  rectangle: {
    coordinates: Cesium.Rectangle.fromDegrees(116.0, 39.0, 117.0, 40.0),
    material: imageMaterial, // 应用图片材质
    height: 0,
  },
})

// 动态改变材质
entity.rectangle.material = new Cesium.CallbackProperty(() => {
  // 根据时间变化返回不同材质
  const time = viewer.clock.currentTime
  const seconds = Cesium.JulianDate.secondsDifference(time, viewer.clock.startTime)

  if (seconds % 4 < 2) {
    return Cesium.Color.RED
  } else {
    return Cesium.Color.BLUE
  }
}, false)
```

## 动画系统详解

### Animation 动画

```javascript
// Clock - 时钟类
class Clock {
  constructor(options = {}) {
    // startTime: JulianDate
    // 作用: 开始时间
    // 默认: JulianDate.now()
    this.startTime = options.startTime || Cesium.JulianDate.now()

    // stopTime: JulianDate
    // 作用: 结束时间
    // 默认: 开始时间 + 1天
    this.stopTime =
      options.stopTime || Cesium.JulianDate.addDays(this.startTime, 1, new Cesium.JulianDate())

    // currentTime: JulianDate
    // 作用: 当前时间
    // 默认: 开始时间
    this.currentTime = options.currentTime || Cesium.JulianDate.clone(this.startTime)

    // multiplier: number
    // 作用: 时间倍率
    // 默认: 1.0（实时）
    // 正值: 正向播放，负值: 反向播放
    this.multiplier = options.multiplier !== undefined ? options.multiplier : 1.0

    // clockStep: ClockStep
    // 作用: 时钟步进模式
    // 默认: ClockStep.SYSTEM_CLOCK_MULTIPLIER
    // 选项: TICK_DEPENDENT, SYSTEM_CLOCK_MULTIPLIER, SYSTEM_CLOCK
    this.clockStep = options.clockStep || Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER

    // clockRange: ClockRange
    // 作用: 时钟范围行为
    // 默认: ClockRange.UNBOUNDED
    // 选项: UNBOUNDED, CLAMPED, LOOP_STOP
    this.clockRange = options.clockRange || Cesium.ClockRange.UNBOUNDED

    // canAnimate: boolean
    // 作用: 是否可以动画
    // 默认: true
    this.canAnimate = options.canAnimate !== undefined ? options.canAnimate : true

    // shouldAnimate: boolean
    // 作用: 是否应该动画
    // 默认: false
    this.shouldAnimate = options.shouldAnimate !== undefined ? options.shouldAnimate : false
  }

  // 事件
  // onTick: Event
  // 作用: 时钟滴答事件
  // 参数: clock对象
  onTick = new Cesium.Event()

  // onStop: Event
  // 作用: 时钟停止事件
  onStop = new Cesium.Event()

  // 方法

  // tick - 时钟滴答
  tick() {
    // 更新当前时间并触发事件
    const currentTime = this.currentTime
    this.onTick.raiseEvent(this)
    return currentTime
  }
}

// 时间相关类型
const ClockStep = {
  TICK_DEPENDENT: 0, // 依赖滴答
  SYSTEM_CLOCK_MULTIPLIER: 1, // 系统时钟倍率
  SYSTEM_CLOCK: 2, // 系统时钟
}

const ClockRange = {
  UNBOUNDED: 0, // 无界限
  CLAMPED: 1, // 钳制
  LOOP_STOP: 2, // 循环停止
}

// Property - 属性类（动画基础）
class Property {
  constructor() {
    // definitionChanged: Event
    // 作用: 定义变化事件
    this.definitionChanged = new Cesium.Event()

    // isConstant: boolean
    // 作用: 是否为常量
    this.isConstant = false
  }

  // getValue - 获取指定时间的值
  getValue(time, result) {
    // time: JulianDate - 时间
    // result: Object - 结果对象
    // 返回: 属性值
  }

  // equals - 比较相等
  equals(other) {
    // other: Property - 其他属性
    // 返回: boolean
  }
}

// ConstantProperty - 常量属性
class ConstantProperty extends Property {
  constructor(value) {
    super()
    this._value = value
    this.isConstant = true
  }

  getValue(time, result) {
    return this._value
  }

  setValue(value) {
    const oldValue = this._value
    if (oldValue !== value) {
      this._value = value
      this.definitionChanged.raiseEvent(this)
    }
  }
}

// SampledProperty - 采样属性（关键帧动画）
class SampledProperty extends Property {
  constructor(type) {
    super()
    this._type = type
    this._times = []
    this._values = []
    this._interpolationDegree = 1
    this._interpolationAlgorithm = Cesium.LinearApproximation
  }

  // addSample - 添加采样点
  addSample(time, value) {
    // time: JulianDate - 时间
    // value: Object - 值
  }

  // addSamples - 批量添加采样点
  addSamples(times, values) {
    // times: Array<JulianDate> - 时间数组
    // values: Array<Object> - 值数组
  }

  // removeSample - 移除采样点
  removeSample(time) {
    // time: JulianDate - 时间
  }

  // setInterpolationOptions - 设置插值选项
  setInterpolationOptions(options) {
    // options.interpolationDegree: number - 插值度数
    // options.interpolationAlgorithm: InterpolationAlgorithm - 插值算法
  }
}

// CallbackProperty - 回调属性（程序化动画）
class CallbackProperty extends Property {
  constructor(callback, isConstant) {
    super()
    this._callback = callback
    this.isConstant = isConstant || false
  }

  getValue(time, result) {
    return this._callback(time, result)
  }
}

// CompositeProperty - 复合属性（分段动画）
class CompositeProperty extends Property {
  constructor() {
    super()
    this._intervals = new Cesium.TimeIntervalCollection()
  }

  // addInterval - 添加时间间隔
  addInterval(interval) {
    // interval: TimeInterval - 时间间隔（包含data属性）
    this._intervals.addInterval(interval)
  }
}

// 动画示例

// 1. 位置动画（关键帧）
const positionProperty = new Cesium.SampledPositionProperty()

// 添加关键帧
const start = Cesium.JulianDate.now()
const stop = Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate())

positionProperty.addSample(start, Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 0))
positionProperty.addSample(
  Cesium.JulianDate.addSeconds(start, 30, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(116.5, 39.95, 1000),
)
positionProperty.addSample(stop, Cesium.Cartesian3.fromDegrees(116.6, 40.0, 0))

// 设置插值方式
positionProperty.setInterpolationOptions({
  interpolationDegree: 2,
  interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
})

// 创建移动实体
const movingEntity = viewer.entities.add({
  position: positionProperty,
  model: {
    uri: './models/airplane.gltf',
    scale: 2.0,
  },
  path: {
    show: true,
    leadTime: 10,
    trailTime: 60,
    width: 5,
    material: Cesium.Color.CYAN,
    resolution: 1,
  },
})

// 2. 旋转动画（程序化）
const rotationProperty = new Cesium.CallbackProperty((time) => {
  const seconds = Cesium.JulianDate.secondsDifference(time, start)
  const angle = (seconds * Math.PI) / 10 // 每20秒转一圈

  return Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, angle)
}, false)

const rotatingEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 100),
  orientation: rotationProperty,
  model: {
    uri: './models/building.gltf',
  },
})

// 3. 颜色动画（关键帧）
const colorProperty = new Cesium.SampledProperty(Cesium.Color)

colorProperty.addSample(start, Cesium.Color.RED)
colorProperty.addSample(
  Cesium.JulianDate.addSeconds(start, 15, new Cesium.JulianDate()),
  Cesium.Color.GREEN,
)
colorProperty.addSample(
  Cesium.JulianDate.addSeconds(start, 30, new Cesium.JulianDate()),
  Cesium.Color.BLUE,
)
colorProperty.addSample(
  Cesium.JulianDate.addSeconds(start, 45, new Cesium.JulianDate()),
  Cesium.Color.YELLOW,
)
colorProperty.addSample(stop, Cesium.Color.RED)

const coloredEntity = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 200),
  box: {
    dimensions: new Cesium.Cartesian3(100, 100, 100),
    material: colorProperty,
  },
})

// 4. 复合动画（分段）
const compositePosition = new Cesium.CompositePositionProperty()

// 第一段：静止
compositePosition.addInterval(
  new Cesium.TimeInterval({
    start: start,
    stop: Cesium.JulianDate.addSeconds(start, 20, new Cesium.JulianDate()),
    data: new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 0)),
  }),
)

// 第二段：移动
const movingInterval = new Cesium.TimeInterval({
  start: Cesium.JulianDate.addSeconds(start, 20, new Cesium.JulianDate()),
  stop: Cesium.JulianDate.addSeconds(start, 40, new Cesium.JulianDate()),
  data: new Cesium.SampledPositionProperty(),
})

movingInterval.data.addSample(
  movingInterval.start,
  Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 0),
)
movingInterval.data.addSample(movingInterval.stop, Cesium.Cartesian3.fromDegrees(116.5, 40.0, 1000))

compositePosition.addInterval(movingInterval)

// 第三段：再次静止
compositePosition.addInterval(
  new Cesium.TimeInterval({
    start: Cesium.JulianDate.addSeconds(start, 40, new Cesium.JulianDate()),
    stop: stop,
    data: new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(116.5, 40.0, 1000)),
  }),
)

const compositeEntity = viewer.entities.add({
  position: compositePosition,
  point: {
    pixelSize: 10,
    color: Cesium.Color.LIME,
  },
})

// 5. 时钟控制
viewer.clock.startTime = start
viewer.clock.stopTime = stop
viewer.clock.currentTime = start
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
viewer.clock.multiplier = 1
viewer.clock.shouldAnimate = true

// 时钟事件监听
viewer.clock.onTick.addEventListener((clock) => {
  console.log('当前时间:', Cesium.JulianDate.toDate(clock.currentTime))
})

viewer.clock.onStop.addEventListener((clock) => {
  console.log('动画停止')
})

// 6. 插值算法详解
const InterpolationAlgorithm = {
  // 线性插值
  LINEAR: Cesium.LinearApproximation,

  // 拉格朗日插值
  LAGRANGE: Cesium.LagrangePolynomialApproximation,

  // 埃尔米特插值（平滑）
  HERMITE: Cesium.HermitePolynomialApproximation,
}

// 设置不同的插值算法
positionProperty.setInterpolationOptions({
  interpolationDegree: 1,
  interpolationAlgorithm: Cesium.LinearApproximation, // 线性插值，直线运动
})

positionProperty.setInterpolationOptions({
  interpolationDegree: 3,
  interpolationAlgorithm: Cesium.HermitePolynomialApproximation, // 平滑曲线运动
})

// 7. 外推（Extrapolation）
const extrapolationTypes = {
  NONE: Cesium.ExtrapolationType.NONE, // 无外推
  HOLD: Cesium.ExtrapolationType.HOLD, // 保持最后值
  EXTRAPOLATE: Cesium.ExtrapolationType.EXTRAPOLATE, // 继续外推
}

positionProperty.forwardExtrapolationType = Cesium.ExtrapolationType.EXTRAPOLATE
positionProperty.forwardExtrapolationDuration = 10 // 外推10秒

positionProperty.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD
positionProperty.backwardExtrapolationDuration = 5

// 8. 动画控制函数
function playAnimation() {
  viewer.clock.shouldAnimate = true
}

function pauseAnimation() {
  viewer.clock.shouldAnimate = false
}

function resetAnimation() {
  viewer.clock.currentTime = viewer.clock.startTime
}

function setAnimationSpeed(multiplier) {
  viewer.clock.multiplier = multiplier
}

function reverseAnimation() {
  viewer.clock.multiplier = -Math.abs(viewer.clock.multiplier)
}

// 9. 粒子系统动画（基于CallbackProperty）
const particlePositions = []
for (let i = 0; i < 100; i++) {
  particlePositions.push({
    position: Cesium.Cartesian3.fromDegrees(
      116.4074 + (Math.random() - 0.5) * 0.01,
      39.9042 + (Math.random() - 0.5) * 0.01,
      Math.random() * 1000,
    ),
    velocity: new Cesium.Cartesian3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 50,
    ),
  })
}

const particleProperty = new Cesium.CallbackProperty((time) => {
  const seconds = Cesium.JulianDate.secondsDifference(time, start)
  const positions = []

  particlePositions.forEach((particle) => {
    const newPos = Cesium.Cartesian3.add(
      particle.position,
      Cesium.Cartesian3.multiplyByScalar(particle.velocity, seconds, new Cesium.Cartesian3()),
      new Cesium.Cartesian3(),
    )
    positions.push(newPos.x, newPos.y, newPos.z)
  })

  return positions
}, false)

// 应用粒子动画到PointPrimitiveCollection
```

## 几何体系统详解

### Primitive 图元

```javascript
// Primitive - 图元基类
class Primitive {
  constructor(options = {}) {
    // geometryInstances: Array<GeometryInstance> | GeometryInstance
    // 作用: 几何实例数组
    // 用途: 定义图元的几何形状
    this.geometryInstances = options.geometryInstances

    // appearance: Appearance
    // 作用: 外观定义
    // 用途: 控制图元的渲染方式
    this.appearance = options.appearance

    // show: boolean
    // 作用: 是否显示
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // modelMatrix: Matrix4
    // 作用: 模型变换矩阵
    // 默认: Matrix4.IDENTITY
    this.modelMatrix = options.modelMatrix || Cesium.Matrix4.IDENTITY

    // vertexCacheOptimize: boolean
    // 作用: 是否优化顶点缓存
    // 默认: false
    this.vertexCacheOptimize =
      options.vertexCacheOptimize !== undefined ? options.vertexCacheOptimize : false

    // interleave: boolean
    // 作用: 是否交错顶点属性
    // 默认: false
    this.interleave = options.interleave !== undefined ? options.interleave : false

    // compressVertices: boolean
    // 作用: 是否压缩顶点
    // 默认: true
    this.compressVertices = options.compressVertices !== undefined ? options.compressVertices : true

    // releaseGeometryInstances: boolean
    // 作用: 是否在渲染后释放几何实例
    // 默认: true
    this.releaseGeometryInstances =
      options.releaseGeometryInstances !== undefined ? options.releaseGeometryInstances : true

    // allowPicking: boolean
    // 作用: 是否允许拾取
    // 默认: true
    this.allowPicking = options.allowPicking !== undefined ? options.allowPicking : true

    // cull: boolean
    // 作用: 是否启用视锥剔除
    // 默认: true
    this.cull = options.cull !== undefined ? options.cull : true

    // asynchronous: boolean
    // 作用: 是否异步创建
    // 默认: true
    this.asynchronous = options.asynchronous !== undefined ? options.asynchronous : true

    // debugShowBoundingVolume: boolean
    // 作用: 是否显示包围体（调试）
    // 默认: false
    this.debugShowBoundingVolume =
      options.debugShowBoundingVolume !== undefined ? options.debugShowBoundingVolume : false

    // shadows: ShadowMode
    // 作用: 阴影模式
    // 默认: ShadowMode.DISABLED
    this.shadows = options.shadows || Cesium.ShadowMode.DISABLED
  }

  // 方法

  // update - 更新图元
  update(frameState) {
    // frameState: FrameState - 帧状态
    // 返回: void
  }

  // isDestroyed - 是否已销毁
  isDestroyed() {
    return false
  }

  // destroy - 销毁图元
  destroy() {
    // 清理资源
  }

  // getGeometryInstanceAttributes - 获取几何实例属性
  getGeometryInstanceAttributes(id) {
    // id: string - 实例ID
    // 返回: Object - 属性对象
  }
}

// GeometryInstance - 几何实例
class GeometryInstance {
  constructor(options = {}) {
    // geometry: Geometry
    // 作用: 几何体
    // 必需: true
    this.geometry = options.geometry

    // modelMatrix: Matrix4
    // 作用: 模型变换矩阵
    // 默认: Matrix4.IDENTITY
    this.modelMatrix = options.modelMatrix || Cesium.Matrix4.IDENTITY

    // id: Object
    // 作用: 实例标识符
    // 用途: 拾取和属性更新
    this.id = options.id

    // attributes: Object
    // 作用: 每实例属性
    // 用途: 颜色、显示状态等
    this.attributes = options.attributes || {}
  }
}

// 基础几何体

// BoxGeometry - 盒子几何体
class BoxGeometry {
  constructor(options = {}) {
    // dimensions: Cartesian3
    // 作用: 盒子尺寸（长、宽、高）
    // 必需: true
    this.dimensions = options.dimensions

    // vertexFormat: VertexFormat
    // 作用: 顶点格式
    // 默认: VertexFormat.DEFAULT
    this.vertexFormat = options.vertexFormat || Cesium.VertexFormat.DEFAULT
  }

  // 静态方法

  // createGeometry - 创建几何体
  static createGeometry(boxGeometry) {
    // 返回: Geometry | undefined
  }

  // packedLength - 打包长度
  static get packedLength() {
    return 4
  }

  // pack - 打包
  static pack(value, array, startingIndex = 0) {}

  // unpack - 解包
  static unpack(array, startingIndex = 0, result) {}
}

// SphereGeometry - 球体几何体
class SphereGeometry {
  constructor(options = {}) {
    // radius: number
    // 作用: 球体半径
    // 默认: 1.0
    this.radius = options.radius !== undefined ? options.radius : 1.0

    // stackPartitions: number
    // 作用: 堆叠分区数（纬度方向）
    // 默认: 64
    this.stackPartitions = options.stackPartitions !== undefined ? options.stackPartitions : 64

    // slicePartitions: number
    // 作用: 切片分区数（经度方向）
    // 默认: 64
    this.slicePartitions = options.slicePartitions !== undefined ? options.slicePartitions : 64

    // vertexFormat: VertexFormat
    // 作用: 顶点格式
    // 默认: VertexFormat.DEFAULT
    this.vertexFormat = options.vertexFormat || Cesium.VertexFormat.DEFAULT
  }
}

// CylinderGeometry - 圆柱体几何体
class CylinderGeometry {
  constructor(options = {}) {
    // length: number
    // 作用: 圆柱体长度（高度）
    // 必需: true
    this.length = options.length

    // topRadius: number
    // 作用: 顶部半径
    // 必需: true
    this.topRadius = options.topRadius

    // bottomRadius: number
    // 作用: 底部半径
    // 必需: true
    this.bottomRadius = options.bottomRadius

    // slices: number
    // 作用: 切片数量
    // 默认: 128
    this.slices = options.slices !== undefined ? options.slices : 128

    // vertexFormat: VertexFormat
    // 作用: 顶点格式
    // 默认: VertexFormat.DEFAULT
    this.vertexFormat = options.vertexFormat || Cesium.VertexFormat.DEFAULT
  }
}

// PlaneGeometry - 平面几何体
class PlaneGeometry {
  constructor(options = {}) {
    // vertexFormat: VertexFormat
    // 作用: 顶点格式
    // 默认: VertexFormat.DEFAULT
    this.vertexFormat = options.vertexFormat || Cesium.VertexFormat.DEFAULT
  }
}

// EllipsoidGeometry - 椭球体几何体
class EllipsoidGeometry {
  constructor(options = {}) {
    // radii: Cartesian3
    // 作用: 椭球体半径（x, y, z）
    // 默认: Cartesian3(1, 1, 1)
    this.radii = options.radii || new Cesium.Cartesian3(1, 1, 1)

    // innerRadii: Cartesian3
    // 作用: 内部半径（用于创建空心椭球）
    // 默认: undefined
    this.innerRadii = options.innerRadii

    // minimumClock: number
    // 作用: 最小时钟角（弧度）
    // 默认: 0.0
    this.minimumClock = options.minimumClock !== undefined ? options.minimumClock : 0.0

    // maximumClock: number
    // 作用: 最大时钟角（弧度）
    // 默认: 2π
    this.maximumClock =
      options.maximumClock !== undefined ? options.maximumClock : Cesium.Math.TWO_PI

    // minimumCone: number
    // 作用: 最小锥角（弧度）
    // 默认: 0.0
    this.minimumCone = options.minimumCone !== undefined ? options.minimumCone : 0.0

    // maximumCone: number
    // 作用: 最大锥角（弧度）
    // 默认: π
    this.maximumCone = options.maximumCone !== undefined ? options.maximumCone : Math.PI

    // stackPartitions: number
    // 作用: 堆叠分区数
    // 默认: 64
    this.stackPartitions = options.stackPartitions !== undefined ? options.stackPartitions : 64

    // slicePartitions: number
    // 作用: 切片分区数
    // 默认: 64
    this.slicePartitions = options.slicePartitions !== undefined ? options.slicePartitions : 64

    // vertexFormat: VertexFormat
    // 作用: 顶点格式
    // 默认: VertexFormat.DEFAULT
    this.vertexFormat = options.vertexFormat || Cesium.VertexFormat.DEFAULT
  }
}

// Appearance - 外观类

// MaterialAppearance - 材质外观
class MaterialAppearance {
  constructor(options = {}) {
    // material: Material
    // 作用: 材质
    // 默认: Material.ColorType
    this.material = options.material || Cesium.Material.fromType(Cesium.Material.ColorType)

    // translucent: boolean
    // 作用: 是否透明
    // 默认: 根据材质确定
    this.translucent = options.translucent

    // vertexShaderSource: string
    // 作用: 顶点着色器源码
    // 默认: 使用内置着色器
    this.vertexShaderSource = options.vertexShaderSource

    // fragmentShaderSource: string
    // 作用: 片段着色器源码
    // 默认: 使用内置着色器
    this.fragmentShaderSource = options.fragmentShaderSource

    // renderState: RenderState
    // 作用: 渲染状态
    // 默认: 默认渲染状态
    this.renderState = options.renderState

    // closed: boolean
    // 作用: 几何体是否封闭
    // 默认: false
    this.closed = options.closed !== undefined ? options.closed : false

    // vertexFormat: VertexFormat
    // 作用: 顶点格式
    // 默认: MaterialAppearance.vertexFormat
    this.vertexFormat = options.vertexFormat || MaterialAppearance.vertexFormat

    // flat: boolean
    // 作用: 是否使用平面着色
    // 默认: false
    this.flat = options.flat !== undefined ? options.flat : false

    // faceForward: boolean
    // 作用: 是否面向前方
    // 默认: !closed
    this.faceForward = options.faceForward !== undefined ? options.faceForward : !this.closed
  }
}

// PerInstanceColorAppearance - 每实例颜色外观
class PerInstanceColorAppearance {
  constructor(options = {}) {
    // flat: boolean
    // 作用: 是否使用平面着色
    // 默认: false
    this.flat = options.flat !== undefined ? options.flat : false

    // faceForward: boolean
    // 作用: 是否面向前方
    // 默认: !closed
    this.faceForward = options.faceForward !== undefined ? options.faceForward : true

    // translucent: boolean
    // 作用: 是否透明
    // 默认: true
    this.translucent = options.translucent !== undefined ? options.translucent : true

    // closed: boolean
    // 作用: 几何体是否封闭
    // 默认: false
    this.closed = options.closed !== undefined ? options.closed : false

    // vertexShaderSource: string
    // 作用: 顶点着色器源码
    this.vertexShaderSource = options.vertexShaderSource

    // fragmentShaderSource: string
    // 作用: 片段着色器源码
    this.fragmentShaderSource = options.fragmentShaderSource

    // renderState: RenderState
    // 作用: 渲染状态
    this.renderState = options.renderState
  }
}

// 几何体使用示例

// 1. 创建盒子图元
const boxInstances = []
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    boxInstances.push(
      new Cesium.GeometryInstance({
        geometry: new Cesium.BoxGeometry({
          dimensions: new Cesium.Cartesian3(1000, 1000, 1000),
        }),
        modelMatrix: Cesium.Matrix4.multiplyByTranslation(
          Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(116.4074 + i * 0.01, 39.9042 + j * 0.01),
          ),
          new Cesium.Cartesian3(0, 0, 500),
          new Cesium.Matrix4(),
        ),
        id: `box_${i}_${j}`,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromRandom({ alpha: 0.8 }),
          ),
        },
      }),
    )
  }
}

const boxPrimitive = new Cesium.Primitive({
  geometryInstances: boxInstances,
  appearance: new Cesium.PerInstanceColorAppearance({
    translucent: true,
    closed: true,
  }),
})

viewer.scene.primitives.add(boxPrimitive)

// 2. 创建球体图元
const sphereInstance = new Cesium.GeometryInstance({
  geometry: new Cesium.SphereGeometry({
    radius: 500.0,
  }),
  modelMatrix: Cesium.Matrix4.multiplyByTranslation(
    Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.4074, 39.9042)),
    new Cesium.Cartesian3(0, 0, 1000),
    new Cesium.Matrix4(),
  ),
  attributes: {
    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA),
  },
})

const spherePrimitive = new Cesium.Primitive({
  geometryInstances: sphereInstance,
  appearance: new Cesium.PerInstanceColorAppearance(),
})

viewer.scene.primitives.add(spherePrimitive)

// 3. 材质外观图元
const planePrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: new Cesium.PlaneGeometry({
      vertexFormat: Cesium.MaterialAppearance.vertexFormat,
    }),
    modelMatrix: Cesium.Matrix4.multiplyByScale(
      Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.4074, 39.9042)),
        new Cesium.Cartesian3(0, 0, 2000),
        new Cesium.Matrix4(),
      ),
      new Cesium.Cartesian3(1000, 1000, 1),
      new Cesium.Matrix4(),
    ),
  }),
  appearance: new Cesium.MaterialAppearance({
    material: new Cesium.Material({
      fabric: {
        type: 'Image',
        uniforms: {
          image: 'path/to/texture.jpg',
        },
      },
    }),
  }),
})

viewer.scene.primitives.add(planePrimitive)

// 4. 动态修改属性
const attributes = boxPrimitive.getGeometryInstanceAttributes('box_0_0')
attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW)

// 5. 分类图元（贴地）
const classifiedPrimitive = new Cesium.ClassificationPrimitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray([116.4, 39.9, 116.5, 39.9, 116.5, 40.0, 116.4, 40.0]),
      ),
    }),
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED.withAlpha(0.5)),
    },
  }),
  appearance: new Cesium.PerInstanceColorAppearance({
    translucent: true,
  }),
})

viewer.scene.primitives.add(classifiedPrimitive)
```

## 场景控制详解

### Scene 场景类

```javascript
// Scene - 场景类
class Scene {
  constructor(canvas, contextOptions, creditContainer) {
    // canvas: HTMLCanvasElement
    // 作用: 渲染画布
    this.canvas = canvas

    // === 渲染控制属性 ===

    // backgroundColor: Color
    // 作用: 背景颜色
    // 默认: Color.BLACK
    this.backgroundColor = Cesium.Color.BLACK

    // fog: Fog
    // 作用: 雾效
    // 默认: new Fog()
    this.fog = new Cesium.Fog()

    // skyBox: SkyBox
    // 作用: 天空盒
    // 默认: undefined（使用默认天空）
    this.skyBox = undefined

    // skyAtmosphere: SkyAtmosphere
    // 作用: 大气散射
    // 默认: new SkyAtmosphere()
    this.skyAtmosphere = new Cesium.SkyAtmosphere()

    // sun: Sun
    // 作用: 太阳
    // 默认: new Sun()
    this.sun = new Cesium.Sun()

    // moon: Moon
    // 作用: 月亮
    // 默认: new Moon()
    this.moon = new Cesium.Moon()

    // sunBloom: boolean
    // 作用: 太阳光晕效果
    // 默认: true
    this.sunBloom = true

    // === 地球相关属性 ===

    // globe: Globe
    // 作用: 地球对象
    // 默认: new Globe(Ellipsoid.WGS84)
    this.globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84)

    // === 渲染性能属性 ===

    // requestRenderMode: boolean
    // 作用: 按需渲染模式
    // 默认: false
    this.requestRenderMode = false

    // maximumRenderTimeChange: number
    // 作用: 最大渲染时间变化
    // 默认: 0.0
    this.maximumRenderTimeChange = 0.0

    // debugShowFramesPerSecond: boolean
    // 作用: 显示FPS调试信息
    // 默认: false
    this.debugShowFramesPerSecond = false

    // debugCommandFilter: function
    // 作用: 调试命令过滤器
    // 默认: undefined
    this.debugCommandFilter = undefined

    // === 拾取相关属性 ===

    // pickTranslucentDepth: boolean
    // 作用: 拾取透明物体深度
    // 默认: false
    this.pickTranslucentDepth = false

    // === 后处理效果 ===

    // postProcessStages: PostProcessStageCollection
    // 作用: 后处理阶段集合
    // 默认: new PostProcessStageCollection()
    this.postProcessStages = new Cesium.PostProcessStageCollection()

    // === 光照属性 ===

    // light: Light
    // 作用: 场景光源
    // 默认: new SunLight()
    this.light = new Cesium.SunLight()

    // shadows: boolean
    // 作用: 是否启用阴影
    // 默认: false
    this.shadows = false

    // shadowMap: ShadowMap
    // 作用: 阴影贴图
    // 默认: new ShadowMap()
    this.shadowMap = new Cesium.ShadowMap({
      context: this.context,
    })

    // === 高动态范围渲染 ===

    // highDynamicRange: boolean
    // 作用: 是否启用HDR
    // 默认: true
    this.highDynamicRange = true

    // gamma: number
    // 作用: 伽马校正值
    // 默认: 1.0
    this.gamma = 1.0

    // === 地下模式 ===

    // underground: boolean
    // 作用: 地下模式
    // 默认: false
    this.underground = false

    // undergroundColor: Color
    // 作用: 地下背景颜色
    // 默认: Color.BLACK
    this.undergroundColor = Cesium.Color.BLACK

    // === 地球透明度 ===

    // globeTranslucencyState: GlobeTranslucencyState
    // 作用: 地球透明度状态
    // 默认: {}
    this.globeTranslucencyState = {}

    // === 相机控制器 ===

    // screenSpaceCameraController: ScreenSpaceCameraController
    // 作用: 屏幕空间相机控制器
    this.screenSpaceCameraController = new Cesium.ScreenSpaceCameraController(this)

    // === 图元集合 ===

    // primitives: PrimitiveCollection
    // 作用: 图元集合
    this.primitives = new Cesium.PrimitiveCollection()

    // groundPrimitives: PrimitiveCollection
    // 作用: 地面图元集合
    this.groundPrimitives = new Cesium.PrimitiveCollection()
  }

  // === 渲染方法 ===

  // render - 渲染场景
  render(time) {
    // time: JulianDate - 渲染时间
    // 返回: void
  }

  // requestRender - 请求渲染
  requestRender() {
    // 在按需渲染模式下请求一次渲染
  }

  // === 拾取方法 ===

  // pick - 拾取对象
  pick(windowPosition) {
    // windowPosition: Cartesian2 - 屏幕坐标
    // 返回: Object | undefined
  }

  // drillPick - 钻取拾取（获取所有对象）
  drillPick(windowPosition, limit) {
    // windowPosition: Cartesian2 - 屏幕坐标
    // limit: number - 最大数量限制
    // 返回: Array<Object>
  }

  // pickPosition - 拾取位置
  pickPosition(windowPosition, result) {
    // windowPosition: Cartesian2 - 屏幕坐标
    // result: Cartesian3 - 结果对象
    // 返回: Cartesian3 | undefined
  }

  // sampleHeight - 采样高度
  sampleHeight(position, objectsToExclude, width) {
    // position: Cartesian3 - 世界坐标
    // objectsToExclude: Array - 排除的对象
    // width: number - 采样宽度
    // 返回: number | undefined
  }

  // clampToHeight - 贴合到高度
  clampToHeight(cartesian, objectsToExclude, width, result) {
    // cartesian: Cartesian3 - 世界坐标
    // objectsToExclude: Array - 排除的对象
    // width: number - 采样宽度
    // result: Cartesian3 - 结果对象
    // 返回: Cartesian3 | undefined
  }

  // === 相机方法 ===

  // cartesianToCanvasCoordinates - 笛卡尔坐标转画布坐标
  cartesianToCanvasCoordinates(position, result) {
    // position: Cartesian3 - 世界坐标
    // result: Cartesian2 - 结果对象
    // 返回: Cartesian2 | undefined
  }

  // === 事件 ===

  // preUpdate: Event
  // 作用: 更新前事件
  preUpdate = new Cesium.Event()

  // postUpdate: Event
  // 作用: 更新后事件
  postUpdate = new Cesium.Event()

  // preRender: Event
  // 作用: 渲染前事件
  preRender = new Cesium.Event()

  // postRender: Event
  // 作用: 渲染后事件
  postRender = new Cesium.Event()

  // morphStart: Event
  // 作用: 变形开始事件
  morphStart = new Cesium.Event()

  // morphComplete: Event
  // 作用: 变形完成事件
  morphComplete = new Cesium.Event()

  // terrainProviderChanged: Event
  // 作用: 地形提供者变化事件
  terrainProviderChanged = new Cesium.Event()
}

// Globe - 地球类
class Globe {
  constructor(ellipsoid) {
    // ellipsoid: Ellipsoid
    // 作用: 椭球体
    this.ellipsoid = ellipsoid || Cesium.Ellipsoid.WGS84

    // show: boolean
    // 作用: 是否显示地球
    // 默认: true
    this.show = true

    // maximumScreenSpaceError: number
    // 作用: 最大屏幕空间误差
    // 默认: 2
    // 性能影响: 值越小质量越高，性能越低
    this.maximumScreenSpaceError = 2

    // tileCacheSize: number
    // 作用: 瓦片缓存大小
    // 默认: 100
    this.tileCacheSize = 100

    // loadingDescendantLimit: number
    // 作用: 加载后代限制
    // 默认: 20
    this.loadingDescendantLimit = 20

    // preloadAncestors: boolean
    // 作用: 是否预加载祖先瓦片
    // 默认: true
    this.preloadAncestors = true

    // preloadSiblings: boolean
    // 作用: 是否预加载兄弟瓦片
    // 默认: false
    this.preloadSiblings = false

    // enableLighting: boolean
    // 作用: 是否启用光照
    // 默认: false
    this.enableLighting = false

    // lightingFadeOutDistance: number
    // 作用: 光照淡出距离
    // 默认: 6500000.0
    this.lightingFadeOutDistance = 6500000.0

    // lightingFadeInDistance: number
    // 作用: 光照淡入距离
    // 默认: 9000000.0
    this.lightingFadeInDistance = 9000000.0

    // showWaterEffect: boolean
    // 作用: 是否显示水体效果
    // 默认: true
    this.showWaterEffect = true

    // shadows: ShadowMode
    // 作用: 阴影模式
    // 默认: ShadowMode.RECEIVE_ONLY
    this.shadows = Cesium.ShadowMode.RECEIVE_ONLY

    // atmosphereLightIntensity: number
    // 作用: 大气光照强度
    // 默认: 10.0
    this.atmosphereLightIntensity = 10.0

    // atmosphereRayleighCoefficient: Cartesian3
    // 作用: 瑞利散射系数
    // 默认: Cartesian3(5.5e-6, 13.0e-6, 28.4e-6)
    this.atmosphereRayleighCoefficient = new Cesium.Cartesian3(5.5e-6, 13.0e-6, 28.4e-6)

    // atmosphereMieCoefficient: Cartesian3
    // 作用: 米氏散射系数
    // 默认: Cartesian3(21e-6, 21e-6, 21e-6)
    this.atmosphereMieCoefficient = new Cesium.Cartesian3(21e-6, 21e-6, 21e-6)

    // atmosphereRayleighScaleHeight: number
    // 作用: 瑞利散射高度
    // 默认: 8000.0
    this.atmosphereRayleighScaleHeight = 8000.0

    // atmosphereMieScaleHeight: number
    // 作用: 米氏散射高度
    // 默认: 1200.0
    this.atmosphereMieScaleHeight = 1200.0

    // atmosphereMieAnisotropy: number
    // 作用: 米氏散射各向异性
    // 默认: 0.9
    this.atmosphereMieAnisotropy = 0.9

    // baseColor: Color
    // 作用: 基础颜色
    // 默认: Color.BLUE
    this.baseColor = Cesium.Color.BLUE

    // clippingPlanes: ClippingPlaneCollection
    // 作用: 裁剪平面集合
    // 默认: undefined
    this.clippingPlanes = undefined

    // cartographicLimitRectangle: Rectangle
    // 作用: 地理限制矩形
    // 默认: undefined
    this.cartographicLimitRectangle = undefined

    // backFaceCulling: boolean
    // 作用: 背面剔除
    // 默认: true
    this.backFaceCulling = true

    // showSkirts: boolean
    // 作用: 是否显示裙边
    // 默认: true
    this.showSkirts = true
  }

  // 方法

  // getHeight - 获取高度
  getHeight(cartographic) {
    // cartographic: Cartographic - 地理坐标
    // 返回: number | undefined
  }

  // pick - 拾取地球表面
  pick(ray, scene, result) {
    // ray: Ray - 射线
    // scene: Scene - 场景
    // result: Cartesian3 - 结果对象
    // 返回: Cartesian3 | undefined
  }
}

// 场景使用示例

// 1. 基础场景配置
const scene = viewer.scene

// 设置背景色
scene.backgroundColor = Cesium.Color.DARKSLATEGRAY

// 开启阴影
scene.shadows = true
scene.shadowMap.maximumDistance = 10000.0

// 开启雾效
scene.fog.enabled = true
scene.fog.density = 0.0001

// 2. 地球配置
const globe = scene.globe

// 地形细节级别
globe.maximumScreenSpaceError = 1 // 更高质量
globe.tileCacheSize = 200 // 更大缓存

// 开启地球光照
globe.enableLighting = true
globe.atmosphereLightIntensity = 15.0

// 水体效果
globe.showWaterEffect = true
globe.baseColor = Cesium.Color.NAVY

// 3. 后处理效果
const postProcess = scene.postProcessStages

// 添加FXAA抗锯齿
const fxaa = Cesium.PostProcessStageLibrary.createFXAAStage()
postProcess.add(fxaa)

// 添加轮廓线效果
const silhouette = Cesium.PostProcessStageLibrary.createSilhouetteStage()
postProcess.add(silhouette)

// 自定义后处理效果
const customStage = new Cesium.PostProcessStage({
  fragmentShader: `
    uniform sampler2D colorTexture;
    in vec2 v_textureCoordinates;
    out vec4 fragColor;
    
    void main() {
      vec4 color = texture(colorTexture, v_textureCoordinates);
      
      // 简单的灰度效果
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      fragColor = vec4(gray, gray, gray, color.a);
    }
  `,
  uniforms: {},
})

postProcess.add(customStage)

// 4. 事件监听
scene.preRender.addEventListener(() => {
  // 渲染前的自定义逻辑
  customStage.enabled = viewer.clock.currentTime.secondsOfDay > 43200 // 下午启用灰度效果
})

scene.postRender.addEventListener(() => {
  // 渲染后的统计信息
  if (scene.debugShowFramesPerSecond) {
    console.log('FPS:', scene.debugShowFramesPerSecond)
  }
})

// 5. 拾取增强
scene.pickTranslucentDepth = true // 拾取透明物体

// 自定义拾取处理
function enhancedPick(windowPosition) {
  const picked = scene.pick(windowPosition)

  if (Cesium.defined(picked)) {
    console.log('拾取到对象:', picked.id)

    // 获取精确位置
    const position = scene.pickPosition(windowPosition)
    if (position) {
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      console.log('精确位置:', {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height,
      })
    }

    // 钻取拾取（获取所有层级的对象）
    const allPicked = scene.drillPick(windowPosition, 10)
    console.log('所有拾取对象:', allPicked)
  }
}

// 6. 性能优化配置
// 按需渲染
scene.requestRenderMode = true
scene.maximumRenderTimeChange = 1.0

// 手动请求渲染
function requestRenderIfNeeded() {
  if (scene.requestRenderMode && needsUpdate) {
    scene.requestRender()
    needsUpdate = false
  }
}

// 7. 调试配置
scene.debugShowFramesPerSecond = true
scene.debugCommandFilter = (command) => {
  // 过滤调试命令
  return command.pass === Cesium.Pass.OPAQUE
}

// 8. HDR和色调映射
scene.highDynamicRange = true
scene.gamma = 2.2

// 9. 地下模式
scene.underground = true
scene.undergroundColor = Cesium.Color.BLACK.withAlpha(0.5)

// 10. 全球透明度
scene.globe.translucency.enabled = true
scene.globe.translucency.frontFaceAlpha = 0.5
scene.globe.translucency.backFaceAlpha = 0.1
```

## 数据源详解

### DataSource 数据源

```javascript
// DataSource - 数据源基类
class DataSource {
  constructor(name) {
    // name: string
    // 作用: 数据源名称
    this.name = name

    // show: boolean
    // 作用: 是否显示
    // 默认: true
    this.show = true

    // entities: EntityCollection
    // 作用: 实体集合
    this.entities = new Cesium.EntityCollection()

    // isLoading: boolean
    // 作用: 是否正在加载
    // 只读: true
    this.isLoading = false

    // changedEvent: Event
    // 作用: 变化事件
    this.changedEvent = new Cesium.Event()

    // errorEvent: Event
    // 作用: 错误事件
    this.errorEvent = new Cesium.Event()

    // loadingEvent: Event
    // 作用: 加载事件
    this.loadingEvent = new Cesium.Event()

    // clock: DataSourceClock
    // 作用: 数据源时钟
    this.clock = undefined

    // clustering: EntityCluster
    // 作用: 实体聚类
    this.clustering = new Cesium.EntityCluster()
  }

  // 方法

  // update - 更新数据源
  update(time) {
    // time: JulianDate - 当前时间
    // 返回: boolean - 是否需要渲染
  }
}

// CzmlDataSource - CZML数据源
class CzmlDataSource extends DataSource {
  constructor(name) {
    super(name)
  }

  // 静态方法

  // load - 加载CZML数据
  static load(czml, options) {
    // czml: Object | string | Resource
    // 作用: CZML数据
    // options: Object
    // sourceUri: string - 源URI
    // credit: Credit - 版权信息
    // 返回: Promise<CzmlDataSource>
  }

  // process - 处理CZML数据
  process(czml, options) {
    // czml: Object | string
    // 作用: CZML数据
    // options: Object
    // sourceUri: string - 源URI
    // isUpdating: boolean - 是否更新模式
    // 返回: Promise<CzmlDataSource>
  }
}

// GeoJsonDataSource - GeoJSON数据源
class GeoJsonDataSource extends DataSource {
  constructor(name) {
    super(name)

    // markerSize: number
    // 作用: 标记大小
    // 默认: 48
    this.markerSize = 48

    // markerSymbol: string
    // 作用: 标记符号
    // 默认: undefined
    this.markerSymbol = undefined

    // markerColor: Color
    // 作用: 标记颜色
    // 默认: Color.ROYALBLUE
    this.markerColor = Cesium.Color.ROYALBLUE

    // stroke: Color
    // 作用: 描边颜色
    // 默认: Color.YELLOW
    this.stroke = Cesium.Color.YELLOW

    // strokeWidth: number
    // 作用: 描边宽度
    // 默认: 2
    this.strokeWidth = 2

    // fill: Color
    // 作用: 填充颜色
    // 默认: Color.YELLOW.withAlpha(0.5)
    this.fill = Cesium.Color.YELLOW.withAlpha(0.5)

    // clampToGround: boolean
    // 作用: 是否贴地
    // 默认: false
    this.clampToGround = false
  }

  // 静态方法

  // load - 加载GeoJSON数据
  static load(data, options) {
    // data: Resource | string | Object
    // 作用: GeoJSON数据
    // options: Object
    // sourceUri: string - 源URI
    // markerSize: number - 标记大小
    // markerSymbol: string - 标记符号
    // markerColor: Color - 标记颜色
    // stroke: Color - 描边颜色
    // strokeWidth: number - 描边宽度
    // fill: Color - 填充颜色
    // clampToGround: boolean - 是否贴地
    // credit: Credit - 版权信息
    // 返回: Promise<GeoJsonDataSource>
  }
}

// KmlDataSource - KML数据源
class KmlDataSource extends DataSource {
  constructor(name) {
    super(name)

    // refreshEvent: Event
    // 作用: 刷新事件
    this.refreshEvent = new Cesium.Event()

    // unsupportedNodeEvent: Event
    // 作用: 不支持节点事件
    this.unsupportedNodeEvent = new Cesium.Event()
  }

  // 静态方法

  // load - 加载KML数据
  static load(data, options) {
    // data: Resource | string | Document | Blob
    // 作用: KML数据
    // options: Object
    // sourceUri: string - 源URI
    // clampToGround: boolean - 是否贴地
    // ellipsoid: Ellipsoid - 椭球体
    // credit: Credit - 版权信息
    // 返回: Promise<KmlDataSource>
  }
}

// GpxDataSource - GPX数据源
class GpxDataSource extends DataSource {
  constructor(name) {
    super(name)

    // trackColor: Color
    // 作用: 轨迹颜色
    // 默认: Color.YELLOW
    this.trackColor = Cesium.Color.YELLOW

    // routeColor: Color
    // 作用: 路线颜色
    // 默认: Color.ORANGE
    this.routeColor = Cesium.Color.ORANGE

    // waypointImage: string
    // 作用: 路点图像
    // 默认: undefined
    this.waypointImage = undefined

    // clampToGround: boolean
    // 作用: 是否贴地
    // 默认: false
    this.clampToGround = false
  }

  // 静态方法

  // load - 加载GPX数据
  static load(data, options) {
    // data: Resource | string | Document | Blob
    // 作用: GPX数据
    // options: Object
    // 返回: Promise<GpxDataSource>
  }
}

// CustomDataSource - 自定义数据源
class CustomDataSource extends DataSource {
  constructor(name) {
    super(name)
  }
}

// 数据源使用示例

// 1. CZML数据源
const czmlData = [
  {
    id: 'document',
    name: 'CZML示例',
    version: '1.0',
  },
  {
    id: 'satellite',
    name: '卫星',
    availability: '2023-01-01T00:00:00Z/2023-01-02T00:00:00Z',
    position: {
      epoch: '2023-01-01T00:00:00Z',
      cartographicDegrees: [0, 116.4074, 39.9042, 400000, 3600, 121.4737, 31.2304, 400000],
    },
    billboard: {
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      scale: 2.0,
    },
    path: {
      material: {
        polylineOutline: {
          color: { rgba: [255, 0, 255, 255] },
          outlineColor: { rgba: [0, 255, 255, 255] },
          outlineWidth: 5,
        },
      },
      width: 8,
      leadTime: 10,
      trailTime: 1000,
      resolution: 5,
    },
  },
]

Cesium.CzmlDataSource.load(czmlData).then((dataSource) => {
  viewer.dataSources.add(dataSource)
  viewer.zoomTo(dataSource)
})

// 2. GeoJSON数据源
const geoJsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: '北京市',
        population: 21540000,
      },
      geometry: {
        type: 'Point',
        coordinates: [116.4074, 39.9042],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: '故宫',
        area: 720000,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.3906, 39.9097],
            [116.3971, 39.9097],
            [116.3971, 39.9208],
            [116.3906, 39.9208],
            [116.3906, 39.9097],
          ],
        ],
      },
    },
  ],
}

Cesium.GeoJsonDataSource.load(geoJsonData, {
  markerSize: 64,
  markerColor: Cesium.Color.RED,
  stroke: Cesium.Color.BLUE,
  strokeWidth: 3,
  fill: Cesium.Color.BLUE.withAlpha(0.3),
  clampToGround: true,
}).then((dataSource) => {
  viewer.dataSources.add(dataSource)

  // 自定义样式
  const entities = dataSource.entities.values
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    if (entity.billboard) {
      // 自定义点样式
      entity.billboard.image = createCustomIcon(entity.properties.name)
      entity.billboard.scale = 1.5
    }

    if (entity.polygon) {
      // 自定义多边形样式
      entity.polygon.material = Cesium.Color.fromCssColorString('#ff6b6b').withAlpha(0.4)
      entity.polygon.outline = true
      entity.polygon.outlineColor = Cesium.Color.fromCssColorString('#ff4757')
      entity.polygon.height = 50
    }

    // 添加标签
    entity.label = {
      text: entity.properties.name,
      font: '16pt Microsoft YaHei',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -50),
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
    }
  }
})

// 3. KML数据源（从文件加载）
Cesium.KmlDataSource.load('./data/sample.kml', {
  clampToGround: true,
}).then((dataSource) => {
  viewer.dataSources.add(dataSource)

  // 监听不支持的KML节点
  dataSource.unsupportedNodeEvent.addEventListener(
    (dataSource, parentEntity, node, entityCollection, styleCollection) => {
      console.warn('不支持的KML节点:', node.nodeName)
    },
  )
})

// 4. 自定义数据源
class RealtimeDataSource extends Cesium.CustomDataSource {
  constructor() {
    super('实时数据')

    this._timer = undefined
    this._isLoading = false
  }

  // 开始实时数据更新
  startRealtime() {
    this._timer = setInterval(() => {
      this.updateData()
    }, 1000)
  }

  // 停止实时数据更新
  stopRealtime() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = undefined
    }
  }

  // 更新数据
  async updateData() {
    if (this._isLoading) return

    this._isLoading = true
    this.loadingEvent.raiseEvent(this, true)

    try {
      // 模拟从API获取数据
      const response = await fetch('/api/realtime-data')
      const data = await response.json()

      // 更新实体
      data.vehicles.forEach((vehicle) => {
        let entity = this.entities.getById(vehicle.id)

        if (!entity) {
          // 创建新实体
          entity = this.entities.add({
            id: vehicle.id,
            name: vehicle.name,
            position: Cesium.Cartesian3.fromDegrees(vehicle.lon, vehicle.lat, vehicle.alt),
            billboard: {
              image: './icons/vehicle.png',
              scale: 1.0,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            label: {
              text: vehicle.name,
              font: '12pt sans-serif',
              pixelOffset: new Cesium.Cartesian2(0, -40),
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            },
          })
        } else {
          // 更新位置
          entity.position = Cesium.Cartesian3.fromDegrees(vehicle.lon, vehicle.lat, vehicle.alt)
        }

        // 更新属性
        entity.description = `
          <div>
            <h3>${vehicle.name}</h3>
            <p>速度: ${vehicle.speed} km/h</p>
            <p>方向: ${vehicle.heading}°</p>
            <p>更新时间: ${new Date(vehicle.timestamp).toLocaleString()}</p>
          </div>
        `
      })

      this.changedEvent.raiseEvent(this)
    } catch (error) {
      console.error('更新实时数据失败:', error)
      this.errorEvent.raiseEvent(this, error)
    } finally {
      this._isLoading = false
      this.loadingEvent.raiseEvent(this, false)
    }
  }
}

// 使用自定义数据源
const realtimeDataSource = new RealtimeDataSource()
viewer.dataSources.add(realtimeDataSource)
realtimeDataSource.startRealtime()

// 5. 数据源管理
const dataSources = viewer.dataSources

// 添加数据源
dataSources.add(dataSource)

// 移除数据源
dataSources.remove(dataSource)

// 获取数据源
const firstDataSource = dataSources.get(0)
const dataSourceByName = dataSources.getByName('实时数据')[0]

// 显示/隐藏数据源
dataSource.show = false

// 监听数据源变化
dataSources.dataSourceAdded.addEventListener((collection, dataSource) => {
  console.log('添加数据源:', dataSource.name)
})

dataSources.dataSourceRemoved.addEventListener((collection, dataSource) => {
  console.log('移除数据源:', dataSource.name)
})

// 6. 实体聚类
const clustering = dataSource.clustering
clustering.enabled = true
clustering.pixelRange = 15
clustering.minimumClusterSize = 3

// 自定义聚类样式
clustering.clusterBillboards = false
clustering.clusterLabels = false
clustering.clusterPoints = true

// 聚类事件
clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
  cluster.billboard.show = false
  cluster.label.show = true
  cluster.label.text = clusteredEntities.length.toString()
  cluster.label.font = '16pt sans-serif'
  cluster.label.fillColor = Cesium.Color.WHITE
  cluster.label.outlineColor = Cesium.Color.BLACK
  cluster.label.outlineWidth = 2
  cluster.label.style = Cesium.LabelStyle.FILL_AND_OUTLINE

  // 添加自定义点
  cluster.point = {
    pixelSize: 30,
    color: Cesium.Color.CYAN,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
  }
})

function createCustomIcon(name) {
  // 创建自定义图标
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  // 绘制背景圆
  ctx.fillStyle = '#ff6b6b'
  ctx.beginPath()
  ctx.arc(32, 32, 30, 0, 2 * Math.PI)
  ctx.fill()

  // 绘制边框
  ctx.strokeStyle = '#ff4757'
  ctx.lineWidth = 3
  ctx.stroke()

  // 绘制文字
  ctx.fillStyle = 'white'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(name.substring(0, 2), 32, 38)

  return canvas.toDataURL()
}
```

## 时间系统详解

### JulianDate 儒略日期

```javascript
// JulianDate - 儒略日期类
class JulianDate {
  constructor(julianDayNumber, secondsOfDay, timeStandard) {
    // julianDayNumber: number
    // 作用: 儒略日数
    // 默认: 0
    this.julianDayNumber = julianDayNumber || 0

    // secondsOfDay: number
    // 作用: 一天中的秒数
    // 默认: 0.0
    this.secondsOfDay = secondsOfDay || 0.0

    // timeStandard: TimeStandard
    // 作用: 时间标准
    // 默认: TimeStandard.UTC
    this.timeStandard = timeStandard || Cesium.TimeStandard.UTC
  }

  // 静态方法

  // now - 获取当前时间
  static now(result) {
    // result: JulianDate - 结果对象
    // 返回: JulianDate
    return Cesium.JulianDate.now(result)
  }

  // fromDate - 从JavaScript Date创建
  static fromDate(date, result) {
    // date: Date - JavaScript日期对象
    // result: JulianDate - 结果对象
    // 返回: JulianDate
    return Cesium.JulianDate.fromDate(date, result)
  }

  // fromIso8601 - 从ISO 8601字符串创建
  static fromIso8601(iso8601String, result) {
    // iso8601String: string - ISO 8601格式字符串
    // 例如: "2023-01-01T12:00:00Z"
    // result: JulianDate - 结果对象
    // 返回: JulianDate
    return Cesium.JulianDate.fromIso8601(iso8601String, result)
  }

  // toDate - 转换为JavaScript Date
  toDate() {
    // 返回: Date
    return Cesium.JulianDate.toDate(this)
  }

  // toIso8601 - 转换为ISO 8601字符串
  toIso8601(precision) {
    // precision: number - 精度（小数位数）
    // 返回: string
    return Cesium.JulianDate.toIso8601(this, precision)
  }

  // addSeconds - 添加秒数
  static addSeconds(julianDate, seconds, result) {
    // julianDate: JulianDate - 儒略日期
    // seconds: number - 秒数
    // result: JulianDate - 结果对象
    // 返回: JulianDate
    return Cesium.JulianDate.addSeconds(julianDate, seconds, result)
  }

  // addMinutes - 添加分钟数
  static addMinutes(julianDate, minutes, result) {
    return Cesium.JulianDate.addMinutes(julianDate, minutes, result)
  }

  // addHours - 添加小时数
  static addHours(julianDate, hours, result) {
    return Cesium.JulianDate.addHours(julianDate, hours, result)
  }

  // addDays - 添加天数
  static addDays(julianDate, days, result) {
    return Cesium.JulianDate.addDays(julianDate, days, result)
  }

  // secondsDifference - 计算秒数差
  static secondsDifference(left, right) {
    // left: JulianDate - 左操作数
    // right: JulianDate - 右操作数
    // 返回: number - 秒数差 (left - right)
    return Cesium.JulianDate.secondsDifference(left, right)
  }

  // daysDifference - 计算天数差
  static daysDifference(left, right) {
    return Cesium.JulianDate.daysDifference(left, right)
  }

  // compare - 比较两个日期
  static compare(left, right) {
    // 返回: number
    // -1: left < right
    //  0: left === right
    //  1: left > right
    return Cesium.JulianDate.compare(left, right)
  }

  // equals - 判断相等
  static equals(left, right) {
    // 返回: boolean
    return Cesium.JulianDate.equals(left, right)
  }

  // equalsEpsilon - 在指定精度内判断相等
  static equalsEpsilon(left, right, epsilon) {
    // epsilon: number - 误差范围（秒）
    // 返回: boolean
    return Cesium.JulianDate.equalsEpsilon(left, right, epsilon)
  }

  // clone - 克隆
  static clone(julianDate, result) {
    return Cesium.JulianDate.clone(julianDate, result)
  }
}

// TimeInterval - 时间间隔
class TimeInterval {
  constructor(options = {}) {
    // start: JulianDate
    // 作用: 开始时间
    // 默认: new JulianDate()
    this.start = options.start || new Cesium.JulianDate()

    // stop: JulianDate
    // 作用: 结束时间
    // 默认: new JulianDate()
    this.stop = options.stop || new Cesium.JulianDate()

    // isStartIncluded: boolean
    // 作用: 是否包含开始时间
    // 默认: true
    this.isStartIncluded = options.isStartIncluded !== undefined ? options.isStartIncluded : true

    // isStopIncluded: boolean
    // 作用: 是否包含结束时间
    // 默认: true
    this.isStopIncluded = options.isStopIncluded !== undefined ? options.isStopIncluded : true

    // data: Object
    // 作用: 关联数据
    // 默认: undefined
    this.data = options.data
  }

  // 方法

  // contains - 是否包含指定时间
  contains(julianDate) {
    // julianDate: JulianDate - 要检查的时间
    // 返回: boolean
    return Cesium.TimeInterval.contains(this, julianDate)
  }

  // intersect - 求交集
  static intersect(left, right, result) {
    // left: TimeInterval - 左间隔
    // right: TimeInterval - 右间隔
    // result: TimeInterval - 结果对象
    // 返回: TimeInterval
    return Cesium.TimeInterval.intersect(left, right, result)
  }

  // isEmpty - 是否为空间隔
  get isEmpty() {
    return Cesium.TimeInterval.isEmpty(this)
  }
}

// TimeIntervalCollection - 时间间隔集合
class TimeIntervalCollection {
  constructor(intervals) {
    // intervals: Array<TimeInterval> - 时间间隔数组
    this._intervals = intervals || []

    // changed: Event
    // 作用: 集合变化事件
    this.changed = new Cesium.Event()

    // changedEventHelper: EventHelper
    this.changedEventHelper = new Cesium.EventHelper()
  }

  // 属性

  // start: JulianDate
  // 作用: 第一个间隔的开始时间
  // 只读: true
  get start() {
    return this.length > 0 ? this._intervals[0].start : undefined
  }

  // stop: JulianDate
  // 作用: 最后一个间隔的结束时间
  // 只读: true
  get stop() {
    return this.length > 0 ? this._intervals[this.length - 1].stop : undefined
  }

  // length: number
  // 作用: 间隔数量
  // 只读: true
  get length() {
    return this._intervals.length
  }

  // isEmpty: boolean
  // 作用: 是否为空集合
  // 只读: true
  get isEmpty() {
    return this.length === 0
  }

  // 方法

  // addInterval - 添加间隔
  addInterval(interval, dataComparer) {
    // interval: TimeInterval - 要添加的间隔
    // dataComparer: function - 数据比较函数
    this._intervals.push(interval)
    this.changed.raiseEvent()
  }

  // removeInterval - 移除间隔
  removeInterval(interval) {
    // interval: TimeInterval - 要移除的间隔
    const index = this._intervals.indexOf(interval)
    if (index !== -1) {
      this._intervals.splice(index, 1)
      this.changed.raiseEvent()
    }
  }

  // contains - 是否包含指定时间
  contains(julianDate) {
    // julianDate: JulianDate - 要检查的时间
    // 返回: boolean
    return this._intervals.some((interval) => interval.contains(julianDate))
  }

  // findInterval - 查找包含指定时间的间隔
  findInterval(julianDate) {
    // julianDate: JulianDate - 要查找的时间
    // 返回: TimeInterval | undefined
    return this._intervals.find((interval) => interval.contains(julianDate))
  }

  // findDataForIntervalContainingDate - 查找包含指定时间的间隔数据
  findDataForIntervalContainingDate(julianDate) {
    // julianDate: JulianDate - 要查找的时间
    // 返回: Object | undefined
    const interval = this.findInterval(julianDate)
    return interval ? interval.data : undefined
  }

  // get - 获取指定索引的间隔
  get(index) {
    // index: number - 索引
    // 返回: TimeInterval
    return this._intervals[index]
  }

  // removeAll - 移除所有间隔
  removeAll() {
    this._intervals.length = 0
    this.changed.raiseEvent()
  }

  // intersect - 求与另一个集合的交集
  intersect(other, dataComparer, mergeCallback) {
    // other: TimeIntervalCollection - 另一个集合
    // dataComparer: function - 数据比较函数
    // mergeCallback: function - 合并回调
    // 返回: TimeIntervalCollection
  }
}

// 时间系统使用示例

// 1. 基础时间操作
const now = Cesium.JulianDate.now()
console.log('当前时间:', Cesium.JulianDate.toDate(now))

// 从不同格式创建时间
const fromDate = Cesium.JulianDate.fromDate(new Date('2023-01-01T12:00:00Z'))
const fromIso = Cesium.JulianDate.fromIso8601('2023-01-01T12:00:00Z')
const fromComponents = new Cesium.JulianDate(2459945, 43200) // 2023-01-01 12:00:00 UTC

// 时间运算
const futureTime = Cesium.JulianDate.addHours(now, 24, new Cesium.JulianDate())
const pastTime = Cesium.JulianDate.addDays(now, -7, new Cesium.JulianDate())

// 时间差计算
const secondsDiff = Cesium.JulianDate.secondsDifference(futureTime, now)
const daysDiff = Cesium.JulianDate.daysDifference(futureTime, now)

console.log(`未来时间相差 ${secondsDiff} 秒，${daysDiff} 天`)

// 时间比较
if (Cesium.JulianDate.compare(futureTime, now) > 0) {
  console.log('futureTime 在 now 之后')
}

// 2. 时间间隔操作
const interval1 = new Cesium.TimeInterval({
  start: Cesium.JulianDate.fromIso8601('2023-01-01T00:00:00Z'),
  stop: Cesium.JulianDate.fromIso8601('2023-01-01T12:00:00Z'),
  data: { period: '上午' },
})

const interval2 = new Cesium.TimeInterval({
  start: Cesium.JulianDate.fromIso8601('2023-01-01T12:00:00Z'),
  stop: Cesium.JulianDate.fromIso8601('2023-01-02T00:00:00Z'),
  data: { period: '下午' },
})

// 检查时间是否在间隔内
const testTime = Cesium.JulianDate.fromIso8601('2023-01-01T10:00:00Z')
console.log('测试时间在interval1内:', interval1.contains(testTime))

// 求交集
const intersection = Cesium.TimeInterval.intersect(interval1, interval2, new Cesium.TimeInterval())
console.log('交集是否为空:', intersection.isEmpty)

// 3. 时间间隔集合
const collection = new Cesium.TimeIntervalCollection()

// 添加多个间隔
collection.addInterval(interval1)
collection.addInterval(interval2)

// 添加更多间隔（模拟一天的时间段）
const hourlyIntervals = []
for (let hour = 0; hour < 24; hour++) {
  const startTime = Cesium.JulianDate.fromIso8601(
    `2023-01-01T${hour.toString().padStart(2, '0')}:00:00Z`,
  )
  const stopTime = Cesium.JulianDate.addHours(startTime, 1, new Cesium.JulianDate())

  const interval = new Cesium.TimeInterval({
    start: startTime,
    stop: stopTime,
    data: {
      hour: hour,
      period: hour < 6 ? '凌晨' : hour < 12 ? '上午' : hour < 18 ? '下午' : '晚上',
    },
  })

  collection.addInterval(interval)
}

// 查找特定时间的数据
const queryTime = Cesium.JulianDate.fromIso8601('2023-01-01T15:30:00Z')
const intervalData = collection.findDataForIntervalContainingDate(queryTime)
console.log('15:30的时间段数据:', intervalData)

// 监听集合变化
collection.changed.addEventListener(() => {
  console.log('时间间隔集合发生变化，当前包含', collection.length, '个间隔')
})

// 4. 实体可用性时间
const entity = viewer.entities.add({
  name: '限时显示的实体',
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 0),
  point: {
    pixelSize: 10,
    color: Cesium.Color.YELLOW,
  },
  // 设置可用性时间
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start: Cesium.JulianDate.fromIso8601('2023-01-01T08:00:00Z'),
      stop: Cesium.JulianDate.fromIso8601('2023-01-01T18:00:00Z'),
    }),
  ]),
})

// 5. 时钟控制
const clock = viewer.clock

// 设置时间范围
clock.startTime = Cesium.JulianDate.fromIso8601('2023-01-01T00:00:00Z')
clock.stopTime = Cesium.JulianDate.fromIso8601('2023-01-02T00:00:00Z')
clock.currentTime = clock.startTime.clone()

// 时间控制
clock.multiplier = 3600 // 1秒代表1小时
clock.clockRange = Cesium.ClockRange.LOOP_STOP // 循环播放
clock.shouldAnimate = true

// 监听时钟事件
clock.onTick.addEventListener((clock) => {
  const currentHour = Cesium.JulianDate.toDate(clock.currentTime).getHours()

  // 根据时间改变场景
  if (currentHour >= 6 && currentHour < 18) {
    // 白天
    viewer.scene.skyAtmosphere.show = true
    viewer.scene.sun.show = true
    viewer.scene.moon.show = false
  } else {
    // 夜晚
    viewer.scene.skyAtmosphere.show = false
    viewer.scene.sun.show = false
    viewer.scene.moon.show = true
  }
})

// 6. 时间相关的属性动画
const timeBasedPosition = new Cesium.CallbackProperty((time) => {
  const secondsIntoDay = Cesium.JulianDate.secondsOfDay(time)
  const angle = (secondsIntoDay / 86400) * Cesium.Math.TWO_PI // 一天转一圈

  const radius = 1000
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)

  return Cesium.Cartesian3.fromDegrees(
    116.4074 + x / 111320, // 转换为经度偏移
    39.9042 + y / 110540, // 转换为纬度偏移
    100,
  )
}, false)

const orbitingEntity = viewer.entities.add({
  position: timeBasedPosition,
  point: {
    pixelSize: 8,
    color: Cesium.Color.LIME,
  },
  path: {
    show: true,
    leadTime: 3600, // 显示未来1小时的轨迹
    trailTime: 3600, // 显示过去1小时的轨迹
    width: 2,
    material: Cesium.Color.LIME,
    resolution: 60,
  },
})

// 7. 时区转换
function convertToLocalTime(julianDate, timezoneOffset) {
  // timezoneOffset: 时区偏移（小时）
  const offsetSeconds = timezoneOffset * 3600
  return Cesium.JulianDate.addSeconds(julianDate, offsetSeconds, new Cesium.JulianDate())
}

// 转换为北京时间（UTC+8）
const utcTime = Cesium.JulianDate.now()
const beijingTime = convertToLocalTime(utcTime, 8)

console.log('UTC时间:', Cesium.JulianDate.toDate(utcTime))
console.log('北京时间:', Cesium.JulianDate.toDate(beijingTime))

// 8. 性能时间测量
function measurePerformance(fn, name) {
  const start = Cesium.JulianDate.now()

  fn()

  const end = Cesium.JulianDate.now()
  const elapsed = Cesium.JulianDate.secondsDifference(end, start)

  console.log(`${name} 执行时间: ${elapsed * 1000} 毫秒`)
}

// 使用示例
measurePerformance(() => {
  // 一些计算密集的操作
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i)
  }
}, '数学计算')
```

## 绘制功能详解

### 绘制工具基类

```javascript
// Cesium绘制工具基类
class CesiumDrawTool {
  constructor(viewer, options = {}) {
    this.viewer = viewer
    this.scene = viewer.scene
    this.camera = viewer.camera
    this.canvas = viewer.canvas

    // type: string
    // 作用: 绘制类型
    // 选项: 'point', 'polyline', 'polygon', 'rectangle', 'circle', 'billboard', 'model'
    this.type = options.type || 'point'

    // style: Object
    // 作用: 绘制样式配置
    this.style = options.style || {}

    // clampToGround: boolean
    // 作用: 是否贴地
    this.clampToGround = options.clampToGround !== undefined ? options.clampToGround : true

    // enableEdit: boolean
    // 作用: 绘制完成后是否可编辑
    this.enableEdit = options.enableEdit !== undefined ? options.enableEdit : true

    // heightOffset: number
    // 作用: 高度偏移量（米）
    this.heightOffset = options.heightOffset || 0

    this.isActive = false
    this.positions = []
    this.activeEntity = null
    this.tempEntities = []
    this.handler = null
  }

  // 激活绘制工具
  activate() {
    if (this.isActive) return

    this.isActive = true
    this.positions = []
    this.clearTempEntities()

    // 创建事件处理器
    this.handler = new Cesium.ScreenSpaceEventHandler(this.canvas)

    // 绑定事件
    this.bindEvents()

    // 改变鼠标样式
    this.canvas.style.cursor = 'crosshair'

    // 触发激活事件
    this.onActivate()
  }

  // 停用绘制工具
  deactivate() {
    if (!this.isActive) return

    this.isActive = false

    // 解绑事件
    this.unbindEvents()

    // 清理临时实体
    this.clearTempEntities()

    // 恢复鼠标样式
    this.canvas.style.cursor = 'default'

    // 触发停用事件
    this.onDeactivate()
  }

  // 绑定鼠标事件
  bindEvents() {
    // 左键点击
    this.handler.setInputAction((click) => {
      const position = this.pickPosition(click.position)
      if (position) {
        this.handleClick(position)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 鼠标移动
    this.handler.setInputAction((movement) => {
      const position = this.pickPosition(movement.endPosition)
      if (position) {
        this.handleMouseMove(position)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 右键完成
    this.handler.setInputAction((click) => {
      this.finishDrawing()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    // 双击完成
    this.handler.setInputAction((click) => {
      this.finishDrawing()
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }

  // 解绑事件
  unbindEvents() {
    if (this.handler) {
      this.handler.destroy()
      this.handler = null
    }
  }

  // 拾取位置
  pickPosition(windowPosition) {
    let pickedPosition

    if (this.clampToGround) {
      // 贴地模式 - 拾取地形
      const ray = this.camera.getPickRay(windowPosition)
      pickedPosition = this.scene.globe.pick(ray, this.scene)
    } else {
      // 空间模式 - 拾取椭球面
      pickedPosition = this.camera.pickEllipsoid(windowPosition, this.scene.globe.ellipsoid)
    }

    if (pickedPosition) {
      // 添加高度偏移
      if (this.heightOffset !== 0) {
        const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition)
        cartographic.height += this.heightOffset
        pickedPosition = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height,
        )
      }
    }

    return pickedPosition
  }

  // 处理点击事件
  handleClick(position) {
    this.positions.push(position)
    this.updateDrawing()

    // 检查是否满足完成条件
    if (this.shouldFinish()) {
      this.finishDrawing()
    }
  }

  // 处理鼠标移动
  handleMouseMove(position) {
    if (this.positions.length > 0) {
      this.updatePreview(position)
    }
  }

  // 更新绘制状态
  updateDrawing() {
    // 子类实现
  }

  // 更新预览
  updatePreview(position) {
    // 子类实现
  }

  // 是否应该完成绘制
  shouldFinish() {
    switch (this.type) {
      case 'point':
      case 'billboard':
      case 'model':
        return this.positions.length >= 1
      case 'polyline':
        return this.positions.length >= 2
      case 'polygon':
        return this.positions.length >= 3
      case 'rectangle':
      case 'circle':
        return this.positions.length >= 2
      default:
        return false
    }
  }

  // 完成绘制
  finishDrawing() {
    if (this.positions.length < this.getMinPointCount()) {
      return null
    }

    // 创建最终实体
    const entity = this.createFinalEntity()

    // 清理临时实体
    this.clearTempEntities()

    // 停用工具
    this.deactivate()

    // 触发完成事件
    this.onComplete(entity)

    return entity
  }

  // 获取最小点数
  getMinPointCount() {
    switch (this.type) {
      case 'point':
      case 'billboard':
      case 'model':
        return 1
      case 'polyline':
        return 2
      case 'polygon':
        return 3
      case 'rectangle':
      case 'circle':
        return 2
      default:
        return 1
    }
  }

  // 创建最终实体（子类实现）
  createFinalEntity() {
    return null
  }

  // 清理临时实体
  clearTempEntities() {
    this.tempEntities.forEach((entity) => {
      this.viewer.entities.remove(entity)
    })
    this.tempEntities = []
  }

  // 事件回调
  onActivate() {
    console.log(`${this.type} 绘制工具已激活`)
  }

  onDeactivate() {
    console.log(`${this.type} 绘制工具已停用`)
  }

  onComplete(entity) {
    console.log(`${this.type} 绘制完成:`, entity)
  }
}

// 点绘制工具
class PointDrawTool extends CesiumDrawTool {
  constructor(viewer, options = {}) {
    super(viewer, { ...options, type: 'point' })

    // 默认点样式
    this.style = Object.assign(
      {
        // pixelSize: number - 点的像素大小
        pixelSize: 10,

        // color: Cesium.Color - 点的颜色
        color: Cesium.Color.YELLOW,

        // outlineColor: Cesium.Color - 轮廓颜色
        outlineColor: Cesium.Color.BLACK,

        // outlineWidth: number - 轮廓宽度
        outlineWidth: 2,

        // heightReference: Cesium.HeightReference - 高度参考
        heightReference: this.clampToGround
          ? Cesium.HeightReference.CLAMP_TO_GROUND
          : Cesium.HeightReference.NONE,

        // disableDepthTestDistance: number - 禁用深度测试距离
        disableDepthTestDistance: Number.POSITIVE_INFINITY,

        // scaleByDistance: Cesium.NearFarScalar - 基于距离的缩放
        scaleByDistance: undefined,

        // distanceDisplayCondition: Cesium.DistanceDisplayCondition - 距离显示条件
        distanceDisplayCondition: undefined,
      },
      options.style,
    )
  }

  createFinalEntity() {
    const entity = this.viewer.entities.add({
      name: 'DrawPoint',
      position: this.positions[0],
      point: {
        pixelSize: this.style.pixelSize,
        color: this.style.color,
        outlineColor: this.style.outlineColor,
        outlineWidth: this.style.outlineWidth,
        heightReference: this.style.heightReference,
        disableDepthTestDistance: this.style.disableDepthTestDistance,
        scaleByDistance: this.style.scaleByDistance,
        distanceDisplayCondition: this.style.distanceDisplayCondition,
      },
    })

    return entity
  }
}

// 线绘制工具
class PolylineDrawTool extends CesiumDrawTool {
  constructor(viewer, options = {}) {
    super(viewer, { ...options, type: 'polyline' })

    this.style = Object.assign(
      {
        // width: number - 线宽
        width: 3,

        // material: Cesium.MaterialProperty - 材质
        material: Cesium.Color.YELLOW,

        // clampToGround: boolean - 是否贴地
        clampToGround: this.clampToGround,

        // classificationType: Cesium.ClassificationType - 分类类型
        classificationType: this.clampToGround ? Cesium.ClassificationType.TERRAIN : undefined,

        // shadows: Cesium.ShadowMode - 阴影模式
        shadows: Cesium.ShadowMode.DISABLED,

        // distanceDisplayCondition: Cesium.DistanceDisplayCondition
        distanceDisplayCondition: undefined,

        // zIndex: number - 层级（贴地时有效）
        zIndex: 0,
      },
      options.style,
    )
  }

  updateDrawing() {
    if (this.positions.length < 2) return

    // 移除之前的临时线
    this.clearTempEntities()

    // 创建临时线
    const tempEntity = this.viewer.entities.add({
      name: 'TempPolyline',
      polyline: {
        positions: this.positions,
        width: this.style.width,
        material: this.style.material,
        clampToGround: this.style.clampToGround,
        classificationType: this.style.classificationType,
      },
    })

    this.tempEntities.push(tempEntity)
  }

  updatePreview(position) {
    if (this.positions.length === 0) return

    // 创建预览位置数组
    const previewPositions = [...this.positions, position]

    // 更新临时线的位置
    if (this.tempEntities.length > 0) {
      this.tempEntities[0].polyline.positions = previewPositions
    }
  }

  createFinalEntity() {
    const entity = this.viewer.entities.add({
      name: 'DrawPolyline',
      polyline: {
        positions: this.positions,
        width: this.style.width,
        material: this.style.material,
        clampToGround: this.style.clampToGround,
        classificationType: this.style.classificationType,
        shadows: this.style.shadows,
        distanceDisplayCondition: this.style.distanceDisplayCondition,
        zIndex: this.style.zIndex,
      },
    })

    return entity
  }
}

// 面绘制工具
class PolygonDrawTool extends CesiumDrawTool {
  constructor(viewer, options = {}) {
    super(viewer, { ...options, type: 'polygon' })

    this.style = Object.assign(
      {
        // material: Cesium.MaterialProperty - 填充材质
        material: Cesium.Color.YELLOW.withAlpha(0.5),

        // outline: boolean - 是否显示轮廓
        outline: true,

        // outlineColor: Cesium.Color - 轮廓颜色
        outlineColor: Cesium.Color.YELLOW,

        // outlineWidth: number - 轮廓宽度
        outlineWidth: 2,

        // height: number - 高度
        height: 0,

        // extrudedHeight: number - 拉伸高度
        extrudedHeight: undefined,

        // heightReference: Cesium.HeightReference - 高度参考
        heightReference: this.clampToGround
          ? Cesium.HeightReference.CLAMP_TO_GROUND
          : Cesium.HeightReference.NONE,

        // extrudedHeightReference: Cesium.HeightReference - 拉伸高度参考
        extrudedHeightReference: Cesium.HeightReference.NONE,

        // fill: boolean - 是否填充
        fill: true,

        // shadows: Cesium.ShadowMode - 阴影模式
        shadows: Cesium.ShadowMode.DISABLED,

        // distanceDisplayCondition: Cesium.DistanceDisplayCondition
        distanceDisplayCondition: undefined,

        // classificationType: Cesium.ClassificationType - 分类类型
        classificationType: this.clampToGround ? Cesium.ClassificationType.TERRAIN : undefined,

        // zIndex: number - 层级
        zIndex: 0,
      },
      options.style,
    )
  }

  updateDrawing() {
    if (this.positions.length < 3) return

    this.clearTempEntities()

    const tempEntity = this.viewer.entities.add({
      name: 'TempPolygon',
      polygon: {
        hierarchy: this.positions,
        material: this.style.material,
        outline: this.style.outline,
        outlineColor: this.style.outlineColor,
        outlineWidth: this.style.outlineWidth,
        height: this.style.height,
        heightReference: this.style.heightReference,
        fill: this.style.fill,
        classificationType: this.style.classificationType,
      },
    })

    this.tempEntities.push(tempEntity)
  }

  updatePreview(position) {
    if (this.positions.length < 2) return

    const previewPositions = [...this.positions, position]

    if (this.tempEntities.length > 0) {
      this.tempEntities[0].polygon.hierarchy = previewPositions
    }
  }

  createFinalEntity() {
    const entity = this.viewer.entities.add({
      name: 'DrawPolygon',
      polygon: {
        hierarchy: this.positions,
        material: this.style.material,
        outline: this.style.outline,
        outlineColor: this.style.outlineColor,
        outlineWidth: this.style.outlineWidth,
        height: this.style.height,
        extrudedHeight: this.style.extrudedHeight,
        heightReference: this.style.heightReference,
        extrudedHeightReference: this.style.extrudedHeightReference,
        fill: this.style.fill,
        shadows: this.style.shadows,
        distanceDisplayCondition: this.style.distanceDisplayCondition,
        classificationType: this.style.classificationType,
        zIndex: this.style.zIndex,
      },
    })

    return entity
  }
}
```

### 绘制管理器

```javascript
// Cesium绘制管理器
class CesiumDrawManager {
  constructor(viewer, options = {}) {
    this.viewer = viewer
    this.options = options

    // 当前激活的绘制工具
    this.activeTool = null

    // 绘制工具实例
    this.tools = {
      point: new PointDrawTool(viewer),
      polyline: new PolylineDrawTool(viewer),
      polygon: new PolygonDrawTool(viewer),
    }

    // 绘制结果存储
    this.drawResults = []

    // 绑定事件
    this.bindToolEvents()
  }

  // 绑定工具事件
  bindToolEvents() {
    Object.values(this.tools).forEach((tool) => {
      // 重写完成事件
      const originalOnComplete = tool.onComplete.bind(tool)
      tool.onComplete = (entity) => {
        originalOnComplete(entity)
        this.onDrawComplete(entity, tool.type)
      }
    })
  }

  // 开始绘制
  startDraw(type, style = {}) {
    // 停止当前绘制
    this.stopDraw()

    // 检查工具类型
    if (!this.tools[type]) {
      console.error('不支持的绘制类型:', type)
      return false
    }

    // 更新工具样式
    if (Object.keys(style).length > 0) {
      Object.assign(this.tools[type].style, style)
    }

    // 激活工具
    this.activeTool = this.tools[type]
    this.activeTool.activate()

    console.log(`开始绘制 ${type}`)
    return true
  }

  // 停止绘制
  stopDraw() {
    if (this.activeTool) {
      this.activeTool.deactivate()
      this.activeTool = null
      console.log('停止绘制')
    }
  }

  // 绘制完成处理
  onDrawComplete(entity, type) {
    // 添加到结果数组
    this.drawResults.push({
      entity: entity,
      type: type,
      timestamp: new Date(),
      id: entity.id,
    })

    console.log(`${type} 绘制完成`, entity)
  }

  // 清空所有绘制
  clearAll() {
    this.drawResults.forEach((result) => {
      this.viewer.entities.remove(result.entity)
    })
    this.drawResults = []
  }

  // 撤销上一步绘制
  undo() {
    if (this.drawResults.length > 0) {
      const lastResult = this.drawResults.pop()
      this.viewer.entities.remove(lastResult.entity)
    }
  }
}
```

### 绘制工具栏

```javascript
// 绘制工具栏控件
class DrawToolbar {
  constructor(viewer, options = {}) {
    this.viewer = viewer
    this.drawManager = new CesiumDrawManager(viewer, options)

    // 工具栏配置
    this.tools = options.tools || [
      { type: 'point', name: '点', icon: '📍', title: '绘制点' },
      { type: 'polyline', name: '线', icon: '📝', title: '绘制线' },
      { type: 'polygon', name: '面', icon: '🔲', title: '绘制多边形' },
    ]

    this.container = null
    this.activeToolType = null

    this.createToolbar()
  }

  // 创建工具栏
  createToolbar() {
    // 创建容器
    this.container = document.createElement('div')
    this.container.className = 'cesium-draw-toolbar'

    // 设置样式
    Object.assign(this.container.style, {
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: '1000',
      backgroundColor: 'rgba(42, 42, 42, 0.9)',
      borderRadius: '5px',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    })

    // 创建工具按钮
    this.createToolButtons()

    // 创建操作按钮
    this.createActionButtons()

    // 添加到页面
    document.body.appendChild(this.container)
  }

  // 创建工具按钮
  createToolButtons() {
    this.tools.forEach((tool) => {
      const button = document.createElement('button')
      button.innerHTML = `${tool.icon} ${tool.name}`
      button.title = tool.title

      Object.assign(button.style, {
        padding: '6px 12px',
        border: 'none',
        borderRadius: '3px',
        backgroundColor: 'transparent',
        color: '#ffffff',
        cursor: 'pointer',
      })

      button.addEventListener('click', () => {
        this.selectTool(tool.type, button)
      })

      this.container.appendChild(button)
    })
  }

  // 创建操作按钮
  createActionButtons() {
    const actions = [
      { name: '停止', action: () => this.stopDraw() },
      { name: '撤销', action: () => this.drawManager.undo() },
      { name: '清空', action: () => this.drawManager.clearAll() },
    ]

    actions.forEach((action) => {
      const button = document.createElement('button')
      button.innerHTML = action.name

      Object.assign(button.style, {
        padding: '4px 8px',
        border: 'none',
        borderRadius: '3px',
        backgroundColor: 'transparent',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '11px',
      })

      button.addEventListener('click', action.action)
      this.container.appendChild(button)
    })
  }

  // 选择工具
  selectTool(toolType, buttonElement) {
    if (this.activeToolType === toolType) {
      this.stopDraw()
    } else {
      this.activeToolType = toolType
      this.drawManager.startDraw(toolType)
    }
  }

  // 停止绘制
  stopDraw() {
    this.activeToolType = null
    this.drawManager.stopDraw()
  }
}

// 使用示例
const viewer = new Cesium.Viewer('cesiumContainer')
const drawToolbar = new DrawToolbar(viewer)
```

## 性能优化详解

### 渲染优化

```javascript
// 1. 按需渲染
viewer.scene.requestRenderMode = true
viewer.scene.maximumRenderTimeChange = 0.0

// 手动触发渲染
function requestRenderIfNeeded() {
  if (needsUpdate) {
    viewer.scene.requestRender()
    needsUpdate = false
  }
}

// 监听数据变化
viewer.entities.collectionChanged.addEventListener(() => {
  needsUpdate = true
  requestRenderIfNeeded()
})

// 2. LOD (Level of Detail) 优化
viewer.scene.globe.maximumScreenSpaceError = 1 // 降低地形细节
viewer.scene.globe.tileCacheSize = 200 // 增加瓦片缓存

// 3. 视锥剔除优化
viewer.scene.globe.showSkirts = false // 禁用地形裙边
viewer.scene.fog.enabled = true // 启用雾效隐藏远处细节

// 4. 实体优化
// 使用 Primitive 替代大量 Entity
const instances = []
for (let i = 0; i < 10000; i++) {
  instances.push(
    new Cesium.GeometryInstance({
      geometry: new Cesium.BoxGeometry({
        dimensions: new Cesium.Cartesian3(100, 100, 100),
      }),
      modelMatrix: Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(
            116.4074 + (Math.random() - 0.5) * 0.1,
            39.9042 + (Math.random() - 0.5) * 0.1,
          ),
        ),
        new Cesium.Cartesian3(0, 0, 50),
        new Cesium.Matrix4(),
      ),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom()),
      },
    }),
  )
}

const primitive = new Cesium.Primitive({
  geometryInstances: instances,
  appearance: new Cesium.PerInstanceColorAppearance({
    translucent: false,
    closed: true,
  }),
})

viewer.scene.primitives.add(primitive)

// 5. 聚类优化
const dataSource = new Cesium.CustomDataSource('优化数据源')
const clustering = dataSource.clustering

clustering.enabled = true
clustering.pixelRange = 15
clustering.minimumClusterSize = 2

// 自定义聚类样式
clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
  cluster.label.show = true
  cluster.label.text = clusteredEntities.length.toString()
  cluster.billboard.show = false

  cluster.point = {
    pixelSize: Math.min(clusteredEntities.length * 2 + 10, 50),
    color: Cesium.Color.YELLOW,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
  }
})

// 6. 材质优化
// 使用颜色而非纹理
const colorMaterial = Cesium.Color.RED
const imageMaterial = new Cesium.ImageMaterialProperty({
  image: 'texture.jpg', // 避免大纹理
})

// 7. 模型优化
const optimizedModel = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042),
  model: {
    uri: './models/optimized.glb', // 使用 glb 格式
    scale: 1.0,
    minimumPixelSize: 128, // 设置最小像素大小
    maximumScale: 20000, // 限制最大缩放
    incrementallyLoadTextures: true, // 渐进式纹理加载
    runAnimations: false, // 禁用不必要的动画
    clampAnimations: true, // 限制动画
    shadows: Cesium.ShadowMode.DISABLED, // 禁用阴影
  },
})

// 8. 内存管理
// 定期清理未使用的资源
function cleanupResources() {
  // 清理实体
  const entities = viewer.entities.values
  for (let i = entities.length - 1; i >= 0; i--) {
    const entity = entities[i]
    if (!isEntityVisible(entity)) {
      viewer.entities.remove(entity)
    }
  }

  // 清理图元
  const primitives = viewer.scene.primitives
  for (let i = primitives.length - 1; i >= 0; i--) {
    const primitive = primitives.get(i)
    if (!isPrimitiveVisible(primitive)) {
      primitives.remove(primitive)
      if (!primitive.isDestroyed()) {
        primitive.destroy()
      }
    }
  }

  // 强制垃圾回收
  if (window.gc) {
    window.gc()
  }
}

function isEntityVisible(entity) {
  // 检查实体是否在视野内
  const position = entity.position
  if (!position) return false

  const cartesian = position.getValue(viewer.clock.currentTime)
  if (!cartesian) return false

  const distance = Cesium.Cartesian3.distance(cartesian, viewer.camera.position)
  return distance < 10000000 // 10,000 km
}

function isPrimitiveVisible(primitive) {
  // 检查图元是否可见
  return primitive.show && !primitive.isDestroyed()
}

// 定期清理
setInterval(cleanupResources, 30000) // 每30秒清理一次

// 9. 事件节流
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 节流鼠标移动事件
const throttledMouseMove = throttle((event) => {
  const pickedObject = viewer.scene.pick(event.endPosition)
  updateTooltip(pickedObject)
}, 100)

viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(
  throttledMouseMove,
  Cesium.ScreenSpaceEventType.MOUSE_MOVE,
)

// 10. 异步加载优化
async function loadLargeDataset(url) {
  const loadingIndicator = showLoadingIndicator()

  try {
    // 分批加载数据
    const batchSize = 1000
    let offset = 0
    let hasMore = true

    while (hasMore) {
      const response = await fetch(`${url}?offset=${offset}&limit=${batchSize}`)
      const batch = await response.json()

      if (batch.length === 0) {
        hasMore = false
        break
      }

      // 异步处理批次
      await new Promise((resolve) => {
        setTimeout(() => {
          processBatch(batch)
          resolve()
        }, 0)
      })

      offset += batchSize

      // 更新进度
      updateProgress(offset)

      // 让浏览器有机会更新UI
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    hideLoadingIndicator(loadingIndicator)
  }
}

function processBatch(data) {
  const entities = []

  data.forEach((item) => {
    entities.push({
      position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, item.alt),
      point: {
        pixelSize: 5,
        color: Cesium.Color.fromCssColorString(item.color),
      },
    })
  })

  viewer.entities.add(entities)
}

// 11. WebWorker 优化
// 主线程
const worker = new Worker('./workers/dataProcessor.js')

worker.postMessage({
  type: 'PROCESS_LARGE_DATASET',
  data: largeDataArray,
})

worker.onmessage = function (event) {
  const { type, result } = event.data

  if (type === 'PROCESSING_COMPLETE') {
    // 在主线程中添加处理结果
    result.forEach((item) => {
      viewer.entities.add(item)
    })
  }
}

// dataProcessor.js (WebWorker)
self.onmessage = function (event) {
  const { type, data } = event.data

  if (type === 'PROCESS_LARGE_DATASET') {
    const result = []

    // 在Worker中进行重计算
    for (let i = 0; i < data.length; i++) {
      const item = data[i]

      // 复杂的数据处理
      const processed = complexCalculation(item)
      result.push(processed)

      // 定期发送进度更新
      if (i % 1000 === 0) {
        self.postMessage({
          type: 'PROGRESS_UPDATE',
          progress: i / data.length,
        })
      }
    }

    self.postMessage({
      type: 'PROCESSING_COMPLETE',
      result: result,
    })
  }
}

function complexCalculation(item) {
  // 执行复杂计算
  return {
    position: [item.x * 1.5, item.y * 1.5, item.z * 1.5],
    color: generateColor(item.value),
    properties: processProperties(item.attributes),
  }
}

// 12. 视口优化
function optimizeForViewport() {
  const canvas = viewer.canvas
  const rect = canvas.getBoundingClientRect()

  // 调整画布分辨率
  const devicePixelRatio = window.devicePixelRatio || 1
  const displayWidth = rect.width
  const displayHeight = rect.height

  // 限制最大分辨率以提高性能
  const maxPixelRatio = 2
  const actualPixelRatio = Math.min(devicePixelRatio, maxPixelRatio)

  canvas.width = displayWidth * actualPixelRatio
  canvas.height = displayHeight * actualPixelRatio

  // 更新WebGL视口
  viewer.scene.context._gl.viewport(0, 0, canvas.width, canvas.height)
}

// 响应窗口大小变化
window.addEventListener('resize', throttle(optimizeForViewport, 250))

// 13. 缓存策略
class ResourceCache {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  get(key) {
    if (this.cache.has(key)) {
      // LRU: 移到末尾
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return null
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // 删除最少使用的项目
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, value)
  }

  clear() {
    this.cache.clear()
  }
}

const resourceCache = new ResourceCache(200)

// 缓存纹理加载
async function loadTextureWithCache(url) {
  const cached = resourceCache.get(url)
  if (cached) {
    return cached
  }

  const texture = await loadTexture(url)
  resourceCache.set(url, texture)
  return texture
}

// 14. 性能监控
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      primitiveCount: 0,
      entityCount: 0,
    }

    this.lastTime = performance.now()
    this.frameCount = 0
    this.fpsUpdateInterval = 1000 // 1秒更新一次FPS
  }

  update() {
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastTime

    this.frameCount++

    if (deltaTime >= this.fpsUpdateInterval) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime)
      this.metrics.frameTime = deltaTime / this.frameCount

      this.frameCount = 0
      this.lastTime = currentTime

      // 更新其他指标
      this.updateMemoryUsage()
      this.updateCounts()

      // 触发性能警告
      this.checkPerformance()
    }
  }

  updateMemoryUsage() {
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024 // MB
    }
  }

  updateCounts() {
    this.metrics.primitiveCount = viewer.scene.primitives.length
    this.metrics.entityCount = viewer.entities.values.length
  }

  checkPerformance() {
    if (this.metrics.fps < 30) {
      console.warn('性能警告: FPS过低', this.metrics.fps)
      this.suggestOptimizations()
    }

    if (this.metrics.memoryUsage > 500) {
      // 500MB
      console.warn('内存警告: 内存使用过高', this.metrics.memoryUsage, 'MB')
      this.suggestMemoryOptimizations()
    }
  }

  suggestOptimizations() {
    const suggestions = []

    if (this.metrics.entityCount > 10000) {
      suggestions.push('实体数量过多，考虑使用Primitive或聚类')
    }

    if (this.metrics.primitiveCount > 100) {
      suggestions.push('图元数量过多，考虑合并几何体')
    }

    if (!viewer.scene.requestRenderMode) {
      suggestions.push('启用按需渲染模式')
    }

    console.log('性能优化建议:', suggestions)
  }

  suggestMemoryOptimizations() {
    console.log('内存优化建议:')
    console.log('- 清理未使用的实体和图元')
    console.log('- 减少高分辨率纹理的使用')
    console.log('- 启用瓦片缓存限制')
    console.log('- 检查内存泄漏')
  }

  getReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
    }
  }
}

const performanceMonitor = new PerformanceMonitor()

// 在渲染循环中更新性能监控
viewer.scene.postRender.addEventListener(() => {
  performanceMonitor.update()
})

// 显示性能信息
function displayPerformanceInfo() {
  const report = performanceMonitor.getReport()

  const infoDiv = document.getElementById('performance-info') || createPerformanceInfoDiv()
  infoDiv.innerHTML = `
    <div>FPS: ${report.fps}</div>
    <div>帧时间: ${report.frameTime.toFixed(2)}ms</div>
    <div>内存使用: ${report.memoryUsage.toFixed(2)}MB</div>
    <div>图元数量: ${report.primitiveCount}</div>
    <div>实体数量: ${report.entityCount}</div>
  `
}

function createPerformanceInfoDiv() {
  const div = document.createElement('div')
  div.id = 'performance-info'
  div.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 1000;
  `
  document.body.appendChild(div)
  return div
}

// 定期更新显示
setInterval(displayPerformanceInfo, 1000)

// 15. 最佳实践总结
const PERFORMANCE_BEST_PRACTICES = {
  // 渲染优化
  rendering: ['启用按需渲染模式', '使用适当的LOD设置', '启用视锥剔除', '合理使用后处理效果'],

  // 实体优化
  entities: [
    '大量几何体使用Primitive',
    '启用实体聚类',
    '设置距离显示条件',
    '使用简单材质而非复杂纹理',
  ],

  // 内存管理
  memory: [
    '定期清理未使用的资源',
    '限制同时加载的数据量',
    '使用对象池重用资源',
    '监控内存使用情况',
  ],

  // 数据加载
  dataLoading: [
    '异步分批加载大数据集',
    '使用WebWorker处理复杂计算',
    '实现资源缓存策略',
    '压缩和优化数据格式',
  ],

  // 用户交互
  interaction: ['节流高频事件', '防抖用户输入', '异步处理UI更新', '提供加载进度反馈'],
}

console.log('Cesium性能优化最佳实践:', PERFORMANCE_BEST_PRACTICES)
```

---

## 📚 总结

本指南涵盖了Cesium离线开发的所有核心概念和详细属性说明，包括：

- **环境配置**: 完整的离线开发环境搭建
- **Viewer配置**: 详细的构造参数和渲染选项
- **坐标系统**: 完整的坐标转换和数学运算
- **实体系统**: 所有图形类型的详细属性
- **影像地形**: 各种提供者的配置选项
- **相机控制**: 完整的相机操作方法
- **事件处理**: 屏幕空间事件的详细处理
- **材质系统**: 各种内置和自定义材质
- **动画系统**: 属性动画和时间控制
- **几何图元**: 低级别图形渲染
- **场景控制**: 场景和地球的高级配置
- **数据源**: 各种格式数据的加载和处理
- **时间系统**: 时间操作和动画控制
- **性能优化**: 全面的性能优化策略

这份指南为离线Cesium开发提供了完整的参考，每个属性都包含了作用说明、默认值、使用示例，帮助开发者在无网络环境下也能高效开发Cesium应用。
