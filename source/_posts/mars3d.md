---
title: mars3D 开发文档
date: 2025-7-31
tags:
  - mars3d
  - 教程
  - 三维GIS
cover: /img/mars3d.png
---
# Mars3D 完整离线开发指南

## 📋 目录

- [离线环境配置](#离线环境配置)
- [Map 详细配置](#map-详细配置)
- [坐标系统详解](#坐标系统详解)
- [图层系统完整属性](#图层系统完整属性)
- [矢量数据详解](#矢量数据详解)
- [三维模型详解](#三维模型详解)
- [相机控制完整属性](#相机控制完整属性)
- [事件系统详解](#事件系统详解)
- [材质系统详解](#材质系统详解)
- [动画系统详解](#动画系统详解)
- [分析功能详解](#分析功能详解)
- [控件系统详解](#控件系统详解)
- [绘制功能详解](#绘制功能详解)

## 离线环境配置

### 完整离线包下载

```bash
# 1. 下载Mars3D完整包
wget https://github.com/marsgis/mars3d/releases/latest/mars3d.zip

# 2. 解压到项目目录
unzip mars3d.zip -d public/mars3d/

# 3. 项目结构
public/
├── mars3d/
│   ├── dist/
│   │   ├── mars3d.js          # 主库文件
│   │   ├── mars3d.css         # 样式文件
│   │   └── plugins/           # 插件目录
│   ├── Workers/               # WebWorker文件
│   ├── Assets/                # 静态资源
│   └── ThirdParty/            # 第三方库
```

### Vite离线配置

```javascript
// vite.config.js - Mars3D离线开发配置
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  define: {
    // 定义全局常量
    MARS3D_BASE_URL: JSON.stringify('/mars3d/'),
  },

  // 静态资源处理
  publicDir: 'public',

  // 构建配置
  build: {
    rollupOptions: {
      // 排除不需要的依赖
      external: ['@mars/common'],

      // 复制Mars3D静态资源
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
    // 代理配置（如需要）
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  // 优化配置
  optimizeDeps: {
    // 预构建Mars3D
    include: ['mars3d'],
  },
})
```

### 离线初始化

```javascript
// main.js - Mars3D离线初始化配置
// 设置Mars3D基础路径
window.MARS3D_BASE_URL = '/mars3d/'

// 引入Mars3D
import * as mars3d from 'mars3d'

// 离线Map配置
const map = new mars3d.Map('mars3dContainer', {
  // 场景参数
  scene: {
    center: { lat: 31.794, lng: 117.207, alt: 2000, heading: 0, pitch: -45 },
    showSun: true,
    showMoon: true,
    showSkyBox: true,
    showSkyAtmosphere: true,
    fog: true,
    fxaa: true,
    requestRenderMode: false, // 离线建议false
    globe: {
      depthTestAgainstTerrain: false,
      baseColor: '#546a53',
    },
  },

  // 控制参数
  control: {
    baseLayerPicker: false, // 关闭图层选择器
    homeButton: true,
    sceneModePicker: true,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: true,
    vrButton: false,
  },

  // 地形参数
  terrain: {
    url: 'https://data.marsgis.cn/terrain', // 或本地地形服务
    show: true,
  },

  // 图层参数
  basemaps: [
    {
      name: '离线底图',
      icon: 'img/basemaps/offline.png',
      type: 'xyz',
      url: 'http://localhost:8080/tiles/{z}/{x}/{y}.png',
      show: true,
    },
  ],

  // 操作图层
  operationalLayers: [],
})
```

## Map 详细配置

### 构造函数完整参数

```javascript
const map = new mars3d.Map(container, {
  // === 场景配置 ===

  scene: {
    // center: Object
    // 作用: 地图中心点位置
    // 格式: { lat: 纬度, lng: 经度, alt: 高度, heading: 方向角, pitch: 俯仰角, roll: 翻滚角 }
    center: { lat: 31.794, lng: 117.207, alt: 2000, heading: 0, pitch: -45, roll: 0 },

    // showSun: boolean
    // 作用: 是否显示太阳
    // 默认: true
    showSun: true,

    // showMoon: boolean
    // 作用: 是否显示月亮
    // 默认: true
    showMoon: true,

    // showSkyBox: boolean
    // 作用: 是否显示天空盒
    // 默认: true
    showSkyBox: true,

    // showSkyAtmosphere: boolean
    // 作用: 是否显示大气层
    // 默认: true
    showSkyAtmosphere: true,

    // fog: boolean
    // 作用: 是否开启雾效
    // 默认: true
    fog: true,

    // fxaa: boolean
    // 作用: 是否开启抗锯齿
    // 默认: true
    fxaa: true,

    // bloom: boolean
    // 作用: 是否开启泛光效果
    // 默认: false
    bloom: false,

    // brightness: number
    // 作用: 亮度调节
    // 默认: 1.0
    // 范围: 0.0 - 2.0
    brightness: 1.0,

    // contrast: number
    // 作用: 对比度调节
    // 默认: 1.0
    // 范围: 0.0 - 2.0
    contrast: 1.0,

    // hue: number
    // 作用: 色调调节
    // 默认: 0.0
    // 范围: -1.0 - 1.0
    hue: 0.0,

    // saturation: number
    // 作用: 饱和度调节
    // 默认: 1.0
    // 范围: 0.0 - 2.0
    saturation: 1.0,

    // gamma: number
    // 作用: 伽马值调节
    // 默认: 1.0
    // 范围: 0.1 - 5.0
    gamma: 1.0,

    // requestRenderMode: boolean
    // 作用: 是否开启按需渲染
    // 默认: false
    // 性能优化: true可提升性能
    requestRenderMode: false,

    // maximumRenderTimeChange: number
    // 作用: 最大渲染时间变化
    // 默认: 0.0
    maximumRenderTimeChange: 0.0,

    // shadows: boolean
    // 作用: 是否开启阴影
    // 默认: false
    // 性能影响: 较大
    shadows: false,

    // resolutionScale: number
    // 作用: 分辨率缩放比例
    // 默认: 1.0
    // 性能优化: 降低可提升性能
    resolutionScale: 1.0,

    // globe: Object
    // 作用: 地球配置
    globe: {
      // show: boolean
      // 作用: 是否显示地球
      // 默认: true
      show: true,

      // depthTestAgainstTerrain: boolean
      // 作用: 是否对地形进行深度测试
      // 默认: false
      depthTestAgainstTerrain: false,

      // baseColor: string
      // 作用: 地球基础颜色
      // 默认: '#546a53'
      baseColor: '#546a53',

      // showWaterEffect: boolean
      // 作用: 是否显示水体效果
      // 默认: true
      showWaterEffect: true,

      // enableLighting: boolean
      // 作用: 是否启用光照
      // 默认: false
      enableLighting: false,
    },

    // skyBox: Object | boolean
    // 作用: 天空盒配置
    skyBox: {
      // sources: Object
      // 作用: 天空盒贴图
      sources: {
        positiveX: 'img/skybox/px.jpg',
        negativeX: 'img/skybox/nx.jpg',
        positiveY: 'img/skybox/py.jpg',
        negativeY: 'img/skybox/ny.jpg',
        positiveZ: 'img/skybox/pz.jpg',
        negativeZ: 'img/skybox/nz.jpg',
      },
    },

    // contextOptions: Object
    // 作用: WebGL上下文选项
    contextOptions: {
      webgl: {
        alpha: false,
        depth: true,
        stencil: false,
        antialias: true,
        powerPreference: 'high-performance',
      },
    },
  },

  // === 控制配置 ===

  control: {
    // baseLayerPicker: boolean
    // 作用: 是否显示底图切换控件
    // 默认: true
    // 离线建议: false
    baseLayerPicker: false,

    // homeButton: boolean
    // 作用: 是否显示主页按钮
    // 默认: true
    homeButton: true,

    // sceneModePicker: boolean
    // 作用: 是否显示场景模式切换按钮
    // 默认: true
    sceneModePicker: true,

    // navigationHelpButton: boolean
    // 作用: 是否显示导航帮助按钮
    // 默认: true
    navigationHelpButton: false,

    // animation: boolean
    // 作用: 是否显示动画控件
    // 默认: false
    animation: false,

    // timeline: boolean
    // 作用: 是否显示时间轴
    // 默认: false
    timeline: false,

    // fullscreenButton: boolean
    // 作用: 是否显示全屏按钮
    // 默认: true
    fullscreenButton: true,

    // vrButton: boolean
    // 作用: 是否显示VR按钮
    // 默认: false
    vrButton: false,

    // infoBox: boolean
    // 作用: 是否显示信息框
    // 默认: true
    infoBox: true,

    // selectionIndicator: boolean
    // 作用: 是否显示选择指示器
    // 默认: true
    selectionIndicator: true,

    // geocoder: boolean
    // 作用: 是否显示地址搜索
    // 默认: false
    // 离线建议: false
    geocoder: false,

    // compass: Object | boolean
    // 作用: 指南针控件配置
    compass: {
      // top: string
      // 作用: 距离顶部距离
      top: '10px',

      // left: string
      // 作用: 距离左侧距离
      left: '5px',
    },

    // distanceLegend: Object | boolean
    // 作用: 比例尺控件配置
    distanceLegend: {
      // left: string
      left: '10px',

      // bottom: string
      bottom: '25px',
    },

    // locationBar: Object | boolean
    // 作用: 坐标信息栏配置
    locationBar: {
      // format: string
      // 作用: 坐标格式
      // 选项: 'degrees', 'dms', 'utm'
      format: 'degrees',

      // bottom: string
      bottom: '2px',

      // left: string
      left: '10px',
    },

    // contextmenu: Object | boolean
    // 作用: 右键菜单配置
    contextmenu: {
      // hasDefault: boolean
      // 作用: 是否包含默认菜单项
      hasDefault: true,
    },
  },

  // === 地形配置 ===

  terrain: {
    // url: string
    // 作用: 地形服务地址
    url: 'https://data.marsgis.cn/terrain',

    // show: boolean
    // 作用: 是否显示地形
    // 默认: true
    show: true,

    // requestWaterMask: boolean
    // 作用: 是否请求水体遮罩
    // 默认: false
    requestWaterMask: false,

    // requestVertexNormals: boolean
    // 作用: 是否请求顶点法线
    // 默认: false
    requestVertexNormals: false,
  },

  // === 底图配置 ===

  basemaps: [
    {
      // name: string
      // 作用: 底图名称
      name: '天地图影像',

      // icon: string
      // 作用: 底图图标
      icon: 'img/basemaps/tdt_img.png',

      // type: string
      // 作用: 底图类型
      // 选项: 'xyz', 'wms', 'wmts', 'arcgis', 'baidu', 'gaode', 'tencent', 'bing'
      type: 'group',

      // layers: Array
      // 作用: 图层组（用于type为group时）
      layers: [
        {
          name: '底图',
          type: 'tdt',
          layer: 'img_d',
          key: ['your-key-1', 'your-key-2'],
        },
        {
          name: '注记',
          type: 'tdt',
          layer: 'img_z',
          key: ['your-key-1', 'your-key-2'],
        },
      ],

      // show: boolean
      // 作用: 是否默认显示
      show: true,
    },

    {
      name: 'OpenStreetMap',
      icon: 'img/basemaps/osm.png',
      type: 'xyz',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      show: false,
    },

    {
      name: '离线瓦片',
      icon: 'img/basemaps/offline.png',
      type: 'xyz',
      url: 'http://localhost:8080/tiles/{z}/{x}/{y}.png',
      show: false,
    },
  ],

  // === 操作图层配置 ===

  operationalLayers: [
    {
      // name: string
      // 作用: 图层名称
      name: 'GeoJSON数据',

      // type: string
      // 作用: 图层类型
      type: 'geojson',

      // url: string
      // 作用: 数据地址
      url: 'data/sample.geojson',

      // show: boolean
      // 作用: 是否默认显示
      show: true,

      // flyTo: boolean
      // 作用: 加载后是否飞行到数据范围
      flyTo: false,

      // popup: Object | string
      // 作用: 弹窗配置
      popup: 'all',

      // style: Object
      // 作用: 样式配置
      style: {
        color: '#ffff00',
        width: 3,
        opacity: 0.8,
        fill: true,
        fillColor: '#ffff00',
        fillOpacity: 0.3,
      },
    },
  ],

  // === 其他配置 ===

  // lang: string
  // 作用: 语言设置
  // 选项: 'zh', 'en'
  lang: 'zh',

  // templateValues: Object
  // 作用: 模板变量
  templateValues: {},

  // chinaCRS: string
  // 作用: 中国坐标系
  // 选项: 'WGS84', 'GCJ02', 'BD09'
  chinaCRS: 'GCJ02',

  // units: string
  // 作用: 单位制
  // 选项: 'metric', 'imperial'
  units: 'metric',
})
```

## 坐标系统详解

### LngLatPoint 经纬度坐标

```javascript
// LngLatPoint - 经纬度坐标类
class LngLatPoint {
  constructor(lng, lat, alt = 0) {
    // lng: number
    // 作用: 经度
    // 范围: -180 到 180
    this.lng = lng

    // lat: number
    // 作用: 纬度
    // 范围: -90 到 90
    this.lat = lat

    // alt: number
    // 作用: 高度（米）
    // 默认: 0
    this.alt = alt
  }

  // 静态方法

  // fromString - 从字符串创建
  static fromString(str) {
    // str: string - 格式: "lng,lat" 或 "lng,lat,alt"
    const parts = str.split(',').map(Number)
    return new mars3d.LngLatPoint(parts[0], parts[1], parts[2] || 0)
  }

  // fromArray - 从数组创建
  static fromArray(arr) {
    // arr: Array - 格式: [lng, lat] 或 [lng, lat, alt]
    return new mars3d.LngLatPoint(arr[0], arr[1], arr[2] || 0)
  }

  // fromDegrees - 从度数创建（同构造函数）
  static fromDegrees(lng, lat, alt = 0) {
    return new mars3d.LngLatPoint(lng, lat, alt)
  }

  // fromRadians - 从弧度创建
  static fromRadians(lngRad, latRad, alt = 0) {
    return new mars3d.LngLatPoint(
      mars3d.Util.radiansToDegrees(lngRad),
      mars3d.Util.radiansToDegrees(latRad),
      alt,
    )
  }

  // 实例方法

  // toString - 转换为字符串
  toString() {
    return `${this.lng},${this.lat},${this.alt}`
  }

  // toArray - 转换为数组
  toArray() {
    return [this.lng, this.lat, this.alt]
  }

  // clone - 克隆
  clone() {
    return new mars3d.LngLatPoint(this.lng, this.lat, this.alt)
  }

  // equals - 比较相等
  equals(other, epsilon = 1e-6) {
    return (
      Math.abs(this.lng - other.lng) < epsilon &&
      Math.abs(this.lat - other.lat) < epsilon &&
      Math.abs(this.alt - other.alt) < epsilon
    )
  }

  // distanceTo - 计算到另一点的距离
  distanceTo(other) {
    return mars3d.MeasureUtil.getDistance([this, other])
  }

  // format - 格式化显示
  format(type = 'degree') {
    switch (type) {
      case 'degree':
        return `${this.lng.toFixed(6)}°, ${this.lat.toFixed(6)}°`
      case 'dms':
        return mars3d.Util.formatDMS(this.lng, this.lat)
      case 'utm':
        return mars3d.PointTrans.lonlat2utm(this)
      default:
        return this.toString()
    }
  }
}

// 使用示例
const point1 = new mars3d.LngLatPoint(117.207, 31.794, 100)
const point2 = mars3d.LngLatPoint.fromString('116.407,39.904,50')
const point3 = mars3d.LngLatPoint.fromArray([121.473, 31.23, 20])

console.log('点1:', point1.toString())
console.log('点2格式化:', point2.format('dms'))
console.log('距离:', point1.distanceTo(point2), '米')
```

### 坐标系转换

```javascript
// PointTrans - 坐标转换工具类
class PointTrans {
  // WGS84 转 GCJ02 (火星坐标系)
  static wgs84togcj02(lng, lat) {
    // lng: number - WGS84经度
    // lat: number - WGS84纬度
    // 返回: {lng: number, lat: number}
    return mars3d.PointTrans.wgs84togcj02(lng, lat)
  }

  // GCJ02 转 WGS84
  static gcj02towgs84(lng, lat) {
    return mars3d.PointTrans.gcj02towgs84(lng, lat)
  }

  // GCJ02 转 BD09 (百度坐标系)
  static gcj02tobd09(lng, lat) {
    return mars3d.PointTrans.gcj02tobd09(lng, lat)
  }

  // BD09 转 GCJ02
  static bd09togcj02(lng, lat) {
    return mars3d.PointTrans.bd09togcj02(lng, lat)
  }

  // WGS84 转 BD09
  static wgs84tobd09(lng, lat) {
    const gcj = mars3d.PointTrans.wgs84togcj02(lng, lat)
    return mars3d.PointTrans.gcj02tobd09(gcj.lng, gcj.lat)
  }

  // BD09 转 WGS84
  static bd09towgs84(lng, lat) {
    const gcj = mars3d.PointTrans.bd09togcj02(lng, lat)
    return mars3d.PointTrans.gcj02towgs84(gcj.lng, gcj.lat)
  }

  // 经纬度 转 UTM坐标
  static lonlat2utm(point) {
    // point: LngLatPoint
    // 返回: {x: number, y: number, zone: string}
    return mars3d.PointTrans.lonlat2utm(point)
  }

  // UTM坐标 转 经纬度
  static utm2lonlat(utmPoint) {
    // utmPoint: {x: number, y: number, zone: string}
    // 返回: LngLatPoint
    return mars3d.PointTrans.utm2lonlat(utmPoint)
  }

  // 经纬度 转 Web墨卡托
  static lonlat2mercator(lng, lat) {
    return mars3d.PointTrans.lonlat2mercator(lng, lat)
  }

  // Web墨卡托 转 经纬度
  static mercator2lonlat(x, y) {
    return mars3d.PointTrans.mercator2lonlat(x, y)
  }

  // 地理坐标 转 笛卡尔坐标
  static lonlat2cartesian(lng, lat, alt = 0) {
    return mars3d.PointTrans.lonlat2cartesian(lng, lat, alt)
  }

  // 笛卡尔坐标 转 地理坐标
  static cartesian2lonlat(cartesian) {
    return mars3d.PointTrans.cartesian2lonlat(cartesian)
  }
}

// 坐标转换示例
const wgs84Point = { lng: 116.407, lat: 39.904 }

// WGS84 转换为其他坐标系
const gcj02Point = mars3d.PointTrans.wgs84togcj02(wgs84Point.lng, wgs84Point.lat)
const bd09Point = mars3d.PointTrans.wgs84tobd09(wgs84Point.lng, wgs84Point.lat)

console.log('WGS84:', wgs84Point)
console.log('GCJ02:', gcj02Point)
console.log('BD09:', bd09Point)

// UTM坐标转换
const point = new mars3d.LngLatPoint(117.207, 31.794)
const utmPoint = mars3d.PointTrans.lonlat2utm(point)
console.log('UTM坐标:', utmPoint)

// 笛卡尔坐标转换
const cartesian = mars3d.PointTrans.lonlat2cartesian(117.207, 31.794, 100)
console.log('笛卡尔坐标:', cartesian)
```

### Cesium坐标转换

```javascript
// Mars3D中的Cesium坐标转换
class CesiumCoordinate {
  // 屏幕坐标转地理坐标
  static screenToCartographic(map, screenPoint) {
    // screenPoint: {x: number, y: number}
    // 返回: LngLatPoint | undefined
    const cartographic = map.camera.pickEllipsoid(screenPoint)
    if (cartographic) {
      return mars3d.PointTrans.cartesian2lonlat(cartographic)
    }
    return undefined
  }

  // 地理坐标转屏幕坐标
  static cartographicToScreen(map, lngLatPoint) {
    // lngLatPoint: LngLatPoint
    // 返回: {x: number, y: number} | undefined
    const cartesian = mars3d.PointTrans.lonlat2cartesian(
      lngLatPoint.lng,
      lngLatPoint.lat,
      lngLatPoint.alt,
    )
    return mars3d.Cesium.SceneTransforms.worldToWindowCoordinates(map.scene, cartesian)
  }

  // 相机坐标转世界坐标
  static cameraToWorld(map, cameraPoint) {
    return map.camera.cameraToWorldCoordinates(cameraPoint)
  }

  // 世界坐标转相机坐标
  static worldToCamera(map, worldPoint) {
    return map.camera.worldToCameraCoordinates(worldPoint)
  }
}

// 使用示例
map.on('click', (event) => {
  // 获取点击的屏幕坐标
  const screenPoint = { x: event.windowPosition.x, y: event.windowPosition.y }

  // 转换为地理坐标
  const geoPoint = CesiumCoordinate.screenToCartographic(map, screenPoint)

  if (geoPoint) {
    console.log('点击位置:', geoPoint.format('degree'))

    // 反向转换验证
    const backToScreen = CesiumCoordinate.cartographicToScreen(map, geoPoint)
    console.log('屏幕坐标:', backToScreen)
  }
})
```

## 图层系统完整属性

### BaseLayer 底图图层

```javascript
// BaseLayer - 底图图层基类
class BaseLayer {
  constructor(options = {}) {
    // id: string
    // 作用: 图层唯一标识
    // 默认: 自动生成
    this.id = options.id || mars3d.Util.uuid()

    // name: string
    // 作用: 图层名称
    // 默认: undefined
    this.name = options.name

    // type: string
    // 作用: 图层类型
    // 选项: 'xyz', 'wms', 'wmts', 'arcgis', 'tdt', 'baidu', 'gaode', 'tencent'
    this.type = options.type

    // url: string
    // 作用: 服务地址
    // 默认: undefined
    this.url = options.url

    // show: boolean
    // 作用: 是否显示
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // alpha: number
    // 作用: 透明度
    // 默认: 1.0
    // 范围: 0.0 - 1.0
    this.alpha = options.alpha !== undefined ? options.alpha : 1.0

    // brightness: number
    // 作用: 亮度
    // 默认: 1.0
    // 范围: 0.0 - 无限制
    this.brightness = options.brightness !== undefined ? options.brightness : 1.0

    // contrast: number
    // 作用: 对比度
    // 默认: 1.0
    // 范围: 0.0 - 无限制
    this.contrast = options.contrast !== undefined ? options.contrast : 1.0

    // hue: number
    // 作用: 色调
    // 默认: 0.0
    // 范围: 0.0 - 2π
    this.hue = options.hue !== undefined ? options.hue : 0.0

    // saturation: number
    // 作用: 饱和度
    // 默认: 1.0
    // 范围: 0.0 - 无限制
    this.saturation = options.saturation !== undefined ? options.saturation : 1.0

    // gamma: number
    // 作用: 伽马值
    // 默认: 1.0
    // 范围: 0.1 - 无限制
    this.gamma = options.gamma !== undefined ? options.gamma : 1.0

    // maximumLevel: number
    // 作用: 最大层级
    // 默认: undefined
    this.maximumLevel = options.maximumLevel

    // minimumLevel: number
    // 作用: 最小层级
    // 默认: 0
    this.minimumLevel = options.minimumLevel !== undefined ? options.minimumLevel : 0

    // rectangle: Object
    // 作用: 显示范围
    // 格式: {xmin: number, ymin: number, xmax: number, ymax: number}
    this.rectangle = options.rectangle

    // proxy: string
    // 作用: 代理地址
    // 默认: undefined
    this.proxy = options.proxy

    // subdomains: Array<string>
    // 作用: 子域名列表
    // 默认: undefined
    // 用途: 负载均衡
    this.subdomains = options.subdomains

    // maximumAnisotropy: number
    // 作用: 最大各向异性过滤
    // 默认: 16
    this.maximumAnisotropy =
      options.maximumAnisotropy !== undefined ? options.maximumAnisotropy : 16

    // credit: string
    // 作用: 版权信息
    // 默认: undefined
    this.credit = options.credit
  }

  // 方法

  // addTo - 添加到地图
  addTo(map) {
    map.basemap = this
  }

  // remove - 从地图移除
  remove() {
    if (this.map) {
      this.map.basemap = null
    }
  }

  // setOpacity - 设置透明度
  setOpacity(alpha) {
    this.alpha = alpha
    this.update()
  }

  // setBrightness - 设置亮度
  setBrightness(brightness) {
    this.brightness = brightness
    this.update()
  }

  // setContrast - 设置对比度
  setContrast(contrast) {
    this.contrast = contrast
    this.update()
  }

  // update - 更新图层
  update() {
    // 触发图层更新
  }

  // flyTo - 飞行到图层范围
  flyTo(options = {}) {
    if (this.rectangle && this.map) {
      this.map.flyToRectangle(this.rectangle, options)
    }
  }
}

// XYZ图层
const xyzLayer = new mars3d.layer.XyzLayer({
  name: 'OpenStreetMap',
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  maximumLevel: 18,
  show: true,
})

// 天地图图层
const tdtLayer = new mars3d.layer.TdtLayer({
  name: '天地图影像',
  layer: 'img_d',
  key: ['your-key-1', 'your-key-2'],
  show: true,
})

// WMS图层
const wmsLayer = new mars3d.layer.WmsLayer({
  name: 'WMS服务',
  url: 'https://example.com/wms',
  layers: 'layer_name',
  parameters: {
    format: 'image/png',
    transparent: true,
  },
  show: true,
})

// ArcGIS图层
const arcgisLayer = new mars3d.layer.ArcGisLayer({
  name: 'ArcGIS服务',
  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
  maximumLevel: 17,
  show: true,
})

// 使用示例
map.addLayer(xyzLayer)

// 调整图层样式
xyzLayer.setOpacity(0.8)
xyzLayer.setBrightness(1.2)
xyzLayer.setContrast(1.1)
```

### GroupLayer 图层组

```javascript
// GroupLayer - 图层组
class GroupLayer {
  constructor(options = {}) {
    // layers: Array<BaseLayer>
    // 作用: 子图层数组
    // 默认: []
    this.layers = options.layers || []

    // name: string
    // 作用: 图层组名称
    this.name = options.name

    // show: boolean
    // 作用: 是否显示整个图层组
    // 默认: true
    this.show = options.show !== undefined ? options.show : true
  }

  // 方法

  // addLayer - 添加子图层
  addLayer(layer) {
    this.layers.push(layer)
    layer.parent = this
  }

  // removeLayer - 移除子图层
  removeLayer(layer) {
    const index = this.layers.indexOf(layer)
    if (index > -1) {
      this.layers.splice(index, 1)
      layer.parent = null
    }
  }

  // getLayerById - 根据ID获取图层
  getLayerById(id) {
    return this.layers.find((layer) => layer.id === id)
  }

  // getLayerByName - 根据名称获取图层
  getLayerByName(name) {
    return this.layers.find((layer) => layer.name === name)
  }

  // setOpacity - 设置所有子图层透明度
  setOpacity(alpha) {
    this.layers.forEach((layer) => {
      if (layer.setOpacity) {
        layer.setOpacity(alpha)
      }
    })
  }

  // setShow - 设置显示状态
  setShow(show) {
    this.show = show
    this.layers.forEach((layer) => {
      layer.show = show
    })
  }
}

// 使用示例
const groupLayer = new mars3d.layer.GroupLayer({
  name: '天地图影像组',
  layers: [
    new mars3d.layer.TdtLayer({
      name: '底图',
      layer: 'img_d',
      key: ['your-key'],
    }),
    new mars3d.layer.TdtLayer({
      name: '注记',
      layer: 'img_z',
      key: ['your-key'],
    }),
  ],
})

map.addLayer(groupLayer)
```

## 矢量数据详解

### GraphicLayer 矢量图层

```javascript
// GraphicLayer - 矢量图层
class GraphicLayer {
  constructor(options = {}) {
    // id: string
    // 作用: 图层唯一标识
    this.id = options.id || mars3d.Util.uuid()

    // name: string
    // 作用: 图层名称
    this.name = options.name

    // show: boolean
    // 作用: 是否显示
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // allowDrillPick: boolean
    // 作用: 是否允许钻取拾取
    // 默认: true
    this.allowDrillPick = options.allowDrillPick !== undefined ? options.allowDrillPick : true

    // flyTo: boolean
    // 作用: 加载后是否飞行到数据范围
    // 默认: false
    this.flyTo = options.flyTo !== undefined ? options.flyTo : false

    // popup: Object | string | function
    // 作用: 弹窗配置
    // 类型: 'all' | '模板字符串' | 配置对象 | 回调函数
    this.popup = options.popup

    // tooltip: Object | string | function
    // 作用: 工具提示配置
    this.tooltip = options.tooltip

    // contextmenu: Array | function
    // 作用: 右键菜单配置
    this.contextmenu = options.contextmenu

    // enabledEvent: boolean
    // 作用: 是否启用鼠标事件
    // 默认: true
    this.enabledEvent = options.enabledEvent !== undefined ? options.enabledEvent : true

    // clustering: Object
    // 作用: 聚合配置
    this.clustering = options.clustering

    // symbol: Object
    // 作用: 统一样式配置
    this.symbol = options.symbol

    // style: Object | function
    // 作用: 样式配置
    this.style = options.style

    // filter: function
    // 作用: 数据过滤函数
    this.filter = options.filter

    // hasEdit: boolean
    // 作用: 是否支持编辑
    // 默认: true
    this.hasEdit = options.hasEdit !== undefined ? options.hasEdit : true

    // isAutoEditing: boolean
    // 作用: 是否自动进入编辑状态
    // 默认: false
    this.isAutoEditing = options.isAutoEditing !== undefined ? options.isAutoEditing : false
  }

  // 方法

  // addGraphic - 添加矢量数据
  addGraphic(graphic) {
    // graphic: Graphic - 矢量数据对象
    this.graphics.push(graphic)
    graphic.layer = this
    this.fire('addGraphic', { graphic })
  }

  // removeGraphic - 移除矢量数据
  removeGraphic(graphic) {
    const index = this.graphics.indexOf(graphic)
    if (index > -1) {
      this.graphics.splice(index, 1)
      graphic.layer = null
      this.fire('removeGraphic', { graphic })
    }
  }

  // getGraphicById - 根据ID获取矢量数据
  getGraphicById(id) {
    return this.graphics.find((graphic) => graphic.id === id)
  }

  // getGraphicsByAttr - 根据属性获取矢量数据
  getGraphicsByAttr(attrName, attrVal) {
    return this.graphics.filter((graphic) => graphic.attr && graphic.attr[attrName] === attrVal)
  }

  // eachGraphic - 遍历所有矢量数据
  eachGraphic(callback) {
    this.graphics.forEach(callback)
  }

  // clear - 清空所有数据
  clear() {
    this.graphics.forEach((graphic) => graphic.destroy())
    this.graphics = []
    this.fire('clear')
  }

  // load - 加载外部数据
  load(options) {
    // options: Object
    // url: string - 数据地址
    // type: string - 数据类型 ('geojson', 'kml', 'czml', 'json')
    // symbol: Object - 样式配置
    // callback: function - 回调函数

    return mars3d.Util.fetchJson({ url: options.url }).then((data) => {
      this.loadData(data, options)
      if (options.callback) {
        options.callback(data)
      }
    })
  }

  // loadData - 加载数据
  loadData(data, options = {}) {
    if (data.type === 'FeatureCollection') {
      // GeoJSON数据
      this.loadGeoJSON(data, options)
    } else if (Array.isArray(data)) {
      // 数组数据
      this.loadArray(data, options)
    }
  }

  // loadGeoJSON - 加载GeoJSON数据
  loadGeoJSON(geojson, options = {}) {
    geojson.features.forEach((feature) => {
      const graphic = this.createGraphicFromFeature(feature, options)
      if (graphic) {
        this.addGraphic(graphic)
      }
    })

    if (options.flyTo || this.flyTo) {
      this.flyTo()
    }
  }

  // createGraphicFromFeature - 从Feature创建矢量数据
  createGraphicFromFeature(feature, options = {}) {
    const geometry = feature.geometry
    const properties = feature.properties || {}

    let graphic

    switch (geometry.type) {
      case 'Point':
        graphic = new mars3d.graphic.PointEntity({
          position: geometry.coordinates,
          style: Object.assign({}, this.symbol, options.symbol),
          attr: properties,
        })
        break

      case 'LineString':
        graphic = new mars3d.graphic.PolylineEntity({
          positions: geometry.coordinates,
          style: Object.assign({}, this.symbol, options.symbol),
          attr: properties,
        })
        break

      case 'Polygon':
        graphic = new mars3d.graphic.PolygonEntity({
          positions: geometry.coordinates[0], // 暂时只处理外环
          style: Object.assign({}, this.symbol, options.symbol),
          attr: properties,
        })
        break

      default:
        console.warn('不支持的几何类型:', geometry.type)
        return null
    }

    return graphic
  }

  // toGeoJSON - 导出为GeoJSON
  toGeoJSON() {
    const features = this.graphics.map((graphic) => graphic.toGeoJSON()).filter(Boolean)

    return {
      type: 'FeatureCollection',
      features: features,
    }
  }

  // flyTo - 飞行到图层范围
  flyTo(options = {}) {
    if (this.graphics.length === 0) return

    const bounds = this.getBounds()
    if (bounds) {
      this.map.flyToExtent(bounds, options)
    }
  }

  // getBounds - 获取数据范围
  getBounds() {
    if (this.graphics.length === 0) return null

    let xmin = Infinity,
      ymin = Infinity,
      xmax = -Infinity,
      ymax = -Infinity

    this.graphics.forEach((graphic) => {
      const bounds = graphic.getBounds()
      if (bounds) {
        xmin = Math.min(xmin, bounds.xmin)
        ymin = Math.min(ymin, bounds.ymin)
        xmax = Math.max(xmax, bounds.xmax)
        ymax = Math.max(ymax, bounds.ymax)
      }
    })

    return { xmin, ymin, xmax, ymax }
  }

  // enableEdit - 启用编辑
  enableEdit() {
    this.hasEdit = true
    this.graphics.forEach((graphic) => {
      if (graphic.enableEdit) {
        graphic.enableEdit()
      }
    })
  }

  // disableEdit - 禁用编辑
  disableEdit() {
    this.hasEdit = false
    this.graphics.forEach((graphic) => {
      if (graphic.disableEdit) {
        graphic.disableEdit()
      }
    })
  }
}

// 使用示例
const graphicLayer = new mars3d.layer.GraphicLayer({
  name: '矢量数据图层',
  show: true,
  popup: 'all',
  symbol: {
    color: '#ff0000',
    width: 3,
    opacity: 0.8,
  },
})

map.addLayer(graphicLayer)

// 加载GeoJSON数据
graphicLayer.load({
  url: 'data/sample.geojson',
  symbol: {
    color: '#ffff00',
    width: 2,
  },
  flyTo: true,
})

// 添加点数据
const pointGraphic = new mars3d.graphic.PointEntity({
  position: [117.207, 31.794, 100],
  style: {
    color: '#ff0000',
    pixelSize: 10,
  },
  attr: {
    name: '测试点',
    remark: '这是一个测试点',
  },
})

graphicLayer.addGraphic(pointGraphic)
```

### Graphic 矢量图形类型

```javascript
// PointEntity - 点实体
class PointEntity {
  constructor(options = {}) {
    // position: Array | LngLatPoint
    // 作用: 点的位置
    // 格式: [lng, lat, alt] 或 LngLatPoint对象
    this.position = options.position

    // style: Object
    // 作用: 点的样式
    this.style = Object.assign(
      {
        // color: string
        // 作用: 点的颜色
        // 默认: '#ffff00'
        color: '#ffff00',

        // pixelSize: number
        // 作用: 点的像素大小
        // 默认: 10
        pixelSize: 10,

        // outlineColor: string
        // 作用: 轮廓颜色
        // 默认: '#000000'
        outlineColor: '#000000',

        // outlineWidth: number
        // 作用: 轮廓宽度
        // 默认: 0
        outlineWidth: 0,

        // scaleByDistance: Object
        // 作用: 基于距离的缩放
        // 格式: {near: 距离, nearValue: 缩放值, far: 距离, farValue: 缩放值}
        scaleByDistance: null,

        // heightReference: number
        // 作用: 高度参考
        // 选项: 0(NONE), 1(CLAMP_TO_GROUND), 2(RELATIVE_TO_GROUND)
        heightReference: 0,

        // disableDepthTestDistance: number
        // 作用: 禁用深度测试距离
        // 默认: 0
        disableDepthTestDistance: 0,
      },
      options.style,
    )

    // attr: Object
    // 作用: 业务属性数据
    this.attr = options.attr || {}

    // popup: Object | string | function
    // 作用: 弹窗配置
    this.popup = options.popup

    // tooltip: Object | string | function
    // 作用: 工具提示配置
    this.tooltip = options.tooltip
  }
}

// BillboardEntity - 图标实体
class BillboardEntity {
  constructor(options = {}) {
    this.position = options.position

    this.style = Object.assign(
      {
        // image: string
        // 作用: 图标图片地址
        image: 'img/marker.png',

        // scale: number
        // 作用: 缩放比例
        // 默认: 1.0
        scale: 1.0,

        // horizontalOrigin: number
        // 作用: 水平对齐方式
        // 选项: 0(CENTER), 1(LEFT), 2(RIGHT)
        horizontalOrigin: 0,

        // verticalOrigin: number
        // 作用: 垂直对齐方式
        // 选项: 0(CENTER), 1(BOTTOM), 2(BASELINE), 3(TOP)
        verticalOrigin: 1,

        // width: number
        // 作用: 图标宽度
        width: undefined,

        // height: number
        // 作用: 图标高度
        height: undefined,

        // rotation: number
        // 作用: 旋转角度（弧度）
        // 默认: 0
        rotation: 0,

        // opacity: number
        // 作用: 透明度
        // 默认: 1.0
        // 范围: 0.0 - 1.0
        opacity: 1.0,

        // color: string
        // 作用: 混合颜色
        // 默认: '#ffffff'
        color: '#ffffff',

        // pixelOffset: Array
        // 作用: 像素偏移
        // 格式: [x, y]
        pixelOffset: [0, 0],

        // scaleByDistance: Object
        // 作用: 基于距离的缩放
        scaleByDistance: null,

        // distanceDisplayCondition: Object
        // 作用: 距离显示条件
        // 格式: {near: 距离, far: 距离}
        distanceDisplayCondition: null,
      },
      options.style,
    )

    this.attr = options.attr || {}
  }
}

// LabelEntity - 文字标签实体
class LabelEntity {
  constructor(options = {}) {
    this.position = options.position

    this.style = Object.assign(
      {
        // text: string
        // 作用: 显示文字
        text: '',

        // font: string
        // 作用: 字体样式
        // 默认: '28px sans-serif'
        font: '28px sans-serif',

        // color: string
        // 作用: 文字颜色
        // 默认: '#ffffff'
        color: '#ffffff',

        // outlineColor: string
        // 作用: 轮廓颜色
        // 默认: '#000000'
        outlineColor: '#000000',

        // outlineWidth: number
        // 作用: 轮廓宽度
        // 默认: 0
        outlineWidth: 0,

        // backgroundColor: string
        // 作用: 背景颜色
        backgroundColor: undefined,

        // backgroundPadding: Array
        // 作用: 背景内边距
        // 格式: [x, y]
        backgroundPadding: [7, 5],

        // pixelOffset: Array
        // 作用: 像素偏移
        pixelOffset: [0, 0],

        // horizontalOrigin: number
        // 作用: 水平对齐方式
        horizontalOrigin: 0,

        // verticalOrigin: number
        // 作用: 垂直对齐方式
        verticalOrigin: 0,

        // scale: number
        // 作用: 缩放比例
        scale: 1.0,

        // scaleByDistance: Object
        // 作用: 基于距离的缩放
        scaleByDistance: null,
      },
      options.style,
    )

    this.attr = options.attr || {}
  }
}

// PolylineEntity - 线实体
class PolylineEntity {
  constructor(options = {}) {
    // positions: Array
    // 作用: 线的顶点坐标数组
    // 格式: [[lng,lat,alt], [lng,lat,alt], ...]
    this.positions = options.positions

    this.style = Object.assign(
      {
        // color: string
        // 作用: 线条颜色
        // 默认: '#ffff00'
        color: '#ffff00',

        // width: number
        // 作用: 线条宽度
        // 默认: 2
        width: 2,

        // opacity: number
        // 作用: 透明度
        // 默认: 1.0
        opacity: 1.0,

        // outline: boolean
        // 作用: 是否显示轮廓
        // 默认: false
        outline: false,

        // outlineColor: string
        // 作用: 轮廓颜色
        outlineColor: '#000000',

        // outlineWidth: number
        // 作用: 轮廓宽度
        outlineWidth: 1,

        // lineType: string
        // 作用: 线条类型
        // 选项: 'solid', 'dash', 'dot', 'dashdot', 'longdash'
        lineType: 'solid',

        // materialType: string
        // 作用: 材质类型
        // 选项: 'Color', 'PolylineGlow', 'PolylineArrow', 'PolylineDash'
        materialType: 'Color',

        // materialOptions: Object
        // 作用: 材质参数
        materialOptions: {},

        // clampToGround: boolean
        // 作用: 是否贴地
        // 默认: false
        clampToGround: false,

        // zIndex: number
        // 作用: 层级（贴地时有效）
        // 默认: 0
        zIndex: 0,

        // closure: boolean
        // 作用: 是否闭合
        // 默认: false
        closure: false,
      },
      options.style,
    )

    this.attr = options.attr || {}
  }
}

// PolygonEntity - 面实体
class PolygonEntity {
  constructor(options = {}) {
    // positions: Array
    // 作用: 面的边界坐标数组
    // 格式: [[lng,lat,alt], [lng,lat,alt], ...] 或 [外环, 内环1, 内环2, ...]
    this.positions = options.positions

    this.style = Object.assign(
      {
        // color: string
        // 作用: 填充颜色
        // 默认: '#ffff00'
        color: '#ffff00',

        // opacity: number
        // 作用: 填充透明度
        // 默认: 0.6
        opacity: 0.6,

        // outline: boolean
        // 作用: 是否显示轮廓
        // 默认: true
        outline: true,

        // outlineColor: string
        // 作用: 轮廓颜色
        outlineColor: '#ffffff',

        // outlineWidth: number
        // 作用: 轮廓宽度
        outlineWidth: 2,

        // outlineOpacity: number
        // 作用: 轮廓透明度
        outlineOpacity: 1.0,

        // fill: boolean
        // 作用: 是否填充
        // 默认: true
        fill: true,

        // height: number
        // 作用: 高度
        // 默认: 0
        height: 0,

        // extrudedHeight: number
        // 作用: 拉伸高度
        extrudedHeight: undefined,

        // clampToGround: boolean
        // 作用: 是否贴地
        // 默认: false
        clampToGround: false,

        // zIndex: number
        // 作用: 层级（贴地时有效）
        zIndex: 0,

        // materialType: string
        // 作用: 材质类型
        // 选项: 'Color', 'Image', 'Grid', 'Stripe', 'Checkerboard'
        materialType: 'Color',

        // materialOptions: Object
        // 作用: 材质参数
        materialOptions: {},
      },
      options.style,
    )

    this.attr = options.attr || {}
  }
}

// 使用示例
const graphicLayer = new mars3d.layer.GraphicLayer()

// 添加点
const point = new mars3d.graphic.PointEntity({
  position: [117.207, 31.794, 100],
  style: {
    color: '#ff0000',
    pixelSize: 15,
    outlineColor: '#ffffff',
    outlineWidth: 2,
    scaleByDistance: {
      near: 100,
      nearValue: 2.0,
      far: 1000000,
      farValue: 0.5,
    },
  },
  attr: { name: '测试点' },
})

// 添加图标
const billboard = new mars3d.graphic.BillboardEntity({
  position: [117.208, 31.795, 0],
  style: {
    image: 'img/marker/mark-red.png',
    scale: 1.5,
    horizontalOrigin: 0,
    verticalOrigin: 1,
    pixelOffset: [0, -20],
  },
  attr: { name: '标记点' },
})

// 添加标签
const label = new mars3d.graphic.LabelEntity({
  position: [117.209, 31.796, 50],
  style: {
    text: '文字标签',
    font: '24px Microsoft YaHei',
    color: '#ffffff',
    outlineColor: '#000000',
    outlineWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    pixelOffset: [0, -50],
  },
})

// 添加线
const polyline = new mars3d.graphic.PolylineEntity({
  positions: [
    [117.2, 31.79, 0],
    [117.21, 31.8, 100],
    [117.22, 31.79, 200],
  ],
  style: {
    color: '#00ff00',
    width: 5,
    lineType: 'dash',
    materialType: 'PolylineGlow',
    materialOptions: {
      glowPower: 0.2,
      taperPower: 0.5,
    },
  },
})

// 添加面
const polygon = new mars3d.graphic.PolygonEntity({
  positions: [
    [117.18, 31.78],
    [117.19, 31.78],
    [117.19, 31.79],
    [117.18, 31.79],
  ],
  style: {
    color: '#0000ff',
    opacity: 0.4,
    outline: true,
    outlineColor: '#ffffff',
    outlineWidth: 3,
    extrudedHeight: 200,
  },
})

// 批量添加到图层
graphicLayer.addGraphic(point)
graphicLayer.addGraphic(billboard)
graphicLayer.addGraphic(label)
graphicLayer.addGraphic(polyline)
graphicLayer.addGraphic(polygon)

map.addLayer(graphicLayer)
```

## 三维模型详解

### ModelEntity 模型实体

```javascript
// ModelEntity - 3D模型实体
class ModelEntity {
  constructor(options = {}) {
    // position: Array | LngLatPoint
    // 作用: 模型位置
    this.position = options.position

    // style: Object
    // 作用: 模型样式配置
    this.style = Object.assign(
      {
        // url: string
        // 作用: 模型文件地址
        // 支持: glTF(.gltf, .glb), COLLADA(.dae), OBJ(.obj)
        url: '',

        // scale: number
        // 作用: 缩放比例
        // 默认: 1.0
        scale: 1.0,

        // heading: number
        // 作用: 方向角（度）
        // 默认: 0
        heading: 0,

        // pitch: number
        // 作用: 俯仰角（度）
        // 默认: 0
        pitch: 0,

        // roll: number
        // 作用: 翻滚角（度）
        // 默认: 0
        roll: 0,

        // minimumPixelSize: number
        // 作用: 最小像素尺寸
        // 默认: 0
        minimumPixelSize: 0,

        // maximumScale: number
        // 作用: 最大缩放比例
        maximumScale: undefined,

        // color: string
        // 作用: 模型颜色（混合）
        color: '#ffffff',

        // opacity: number
        // 作用: 透明度
        // 默认: 1.0
        opacity: 1.0,

        // silhouetteColor: string
        // 作用: 轮廓颜色
        silhouetteColor: '#ff0000',

        // silhouetteSize: number
        // 作用: 轮廓宽度
        // 默认: 0
        silhouetteSize: 0,

        // heightReference: number
        // 作用: 高度参考
        // 选项: 0(NONE), 1(CLAMP_TO_GROUND), 2(RELATIVE_TO_GROUND)
        heightReference: 0,

        // shadows: number
        // 作用: 阴影模式
        // 选项: 0(DISABLED), 1(ENABLED), 2(CAST_ONLY), 3(RECEIVE_ONLY)
        shadows: 1,

        // runAnimations: boolean
        // 作用: 是否播放模型动画
        // 默认: true
        runAnimations: true,

        // clampAnimations: boolean
        // 作用: 是否限制动画循环
        // 默认: true
        clampAnimations: true,

        // colorBlendMode: number
        // 作用: 颜色混合模式
        // 选项: 0(HIGHLIGHT), 1(REPLACE), 2(MIX)
        colorBlendMode: 0,

        // colorBlendAmount: number
        // 作用: 颜色混合强度
        // 默认: 0.5
        // 范围: 0.0 - 1.0
        colorBlendAmount: 0.5,

        // incrementallyLoadTextures: boolean
        // 作用: 是否渐进式加载纹理
        // 默认: true
        incrementallyLoadTextures: true,
      },
      options.style,
    )

    this.attr = options.attr || {}
  }

  // 方法

  // startAnimation - 开始播放动画
  startAnimation(name) {
    // name: string - 动画名称（可选）
    if (this._cesiumEntity && this._cesiumEntity.model) {
      this._cesiumEntity.model.runAnimations = true
    }
  }

  // stopAnimation - 停止播放动画
  stopAnimation() {
    if (this._cesiumEntity && this._cesiumEntity.model) {
      this._cesiumEntity.model.runAnimations = false
    }
  }

  // setRotation - 设置旋转角度
  setRotation(heading, pitch, roll) {
    this.style.heading = heading
    this.style.pitch = pitch
    this.style.roll = roll
    this.updateStyle()
  }

  // setScale - 设置缩放比例
  setScale(scale) {
    this.style.scale = scale
    this.updateStyle()
  }

  // setColor - 设置颜色
  setColor(color, opacity = 1.0) {
    this.style.color = color
    this.style.opacity = opacity
    this.updateStyle()
  }

  // setSilhouette - 设置轮廓
  setSilhouette(color, size) {
    this.style.silhouetteColor = color
    this.style.silhouetteSize = size
    this.updateStyle()
  }
}

// TilesetLayer - 3D瓦片图层
class TilesetLayer {
  constructor(options = {}) {
    // url: string
    // 作用: 3D Tiles服务地址
    this.url = options.url

    // name: string
    // 作用: 图层名称
    this.name = options.name

    // show: boolean
    // 作用: 是否显示
    // 默认: true
    this.show = options.show !== undefined ? options.show : true

    // maximumScreenSpaceError: number
    // 作用: 最大屏幕空间误差
    // 默认: 16
    // 性能影响: 值越小质量越高，性能越低
    this.maximumScreenSpaceError =
      options.maximumScreenSpaceError !== undefined ? options.maximumScreenSpaceError : 16

    // maximumMemoryUsage: number
    // 作用: 最大内存使用量（MB）
    // 默认: 512
    this.maximumMemoryUsage =
      options.maximumMemoryUsage !== undefined ? options.maximumMemoryUsage : 512

    // shadows: number
    // 作用: 阴影模式
    // 默认: 1 (ENABLED)
    this.shadows = options.shadows !== undefined ? options.shadows : 1

    // style: Object
    // 作用: 3D Tiles样式
    this.style = options.style

    // customShader: Object
    // 作用: 自定义着色器
    this.customShader = options.customShader

    // modelMatrix: Array
    // 作用: 模型变换矩阵
    this.modelMatrix = options.modelMatrix

    // cullWithChildrenBounds: boolean
    // 作用: 是否使用子节点边界进行剔除
    // 默认: true
    this.cullWithChildrenBounds =
      options.cullWithChildrenBounds !== undefined ? options.cullWithChildrenBounds : true

    // skipLevelOfDetail: boolean
    // 作用: 是否跳过LOD
    // 默认: false
    this.skipLevelOfDetail =
      options.skipLevelOfDetail !== undefined ? options.skipLevelOfDetail : false

    // baseScreenSpaceError: number
    // 作用: 基础屏幕空间误差
    // 默认: 1024
    this.baseScreenSpaceError =
      options.baseScreenSpaceError !== undefined ? options.baseScreenSpaceError : 1024

    // skipScreenSpaceErrorFactor: number
    // 作用: 跳过屏幕空间误差因子
    // 默认: 16
    this.skipScreenSpaceErrorFactor =
      options.skipScreenSpaceErrorFactor !== undefined ? options.skipScreenSpaceErrorFactor : 16

    // skipLevels: number
    // 作用: 跳过的层级数
    // 默认: 1
    this.skipLevels = options.skipLevels !== undefined ? options.skipLevels : 1

    // immediatelyLoadDesiredLevelOfDetail: boolean
    // 作用: 是否立即加载所需的LOD
    // 默认: false
    this.immediatelyLoadDesiredLevelOfDetail =
      options.immediatelyLoadDesiredLevelOfDetail !== undefined
        ? options.immediatelyLoadDesiredLevelOfDetail
        : false

    // loadSiblings: boolean
    // 作用: 是否加载兄弟节点
    // 默认: false
    this.loadSiblings = options.loadSiblings !== undefined ? options.loadSiblings : false

    // clippingPlanes: Object
    // 作用: 裁剪平面配置
    this.clippingPlanes = options.clippingPlanes
  }

  // 方法

  // setStyle - 设置样式
  setStyle(style) {
    this.style = style
    if (this._tileset) {
      this._tileset.style = new mars3d.Cesium.Cesium3DTileStyle(style)
    }
  }

  // setCustomShader - 设置自定义着色器
  setCustomShader(shader) {
    this.customShader = shader
    if (this._tileset) {
      this._tileset.customShader = new mars3d.Cesium.CustomShader(shader)
    }
  }

  // setClippingPlanes - 设置裁剪平面
  setClippingPlanes(planes) {
    this.clippingPlanes = planes
    if (this._tileset) {
      this._tileset.clippingPlanes = new mars3d.Cesium.ClippingPlaneCollection(planes)
    }
  }

  // setMaximumScreenSpaceError - 设置最大屏幕空间误差
  setMaximumScreenSpaceError(error) {
    this.maximumScreenSpaceError = error
    if (this._tileset) {
      this._tileset.maximumScreenSpaceError = error
    }
  }
}

// 使用示例

// 添加3D模型
const modelEntity = new mars3d.graphic.ModelEntity({
  position: [117.207, 31.794, 100],
  style: {
    url: 'model/building.gltf',
    scale: 2.0,
    heading: 45,
    minimumPixelSize: 64,
    silhouetteColor: '#00ff00',
    silhouetteSize: 2,
    shadows: 1,
  },
  attr: { name: '建筑模型', type: 'building' },
})

graphicLayer.addGraphic(modelEntity)

// 添加3D瓦片图层
const tilesetLayer = new mars3d.layer.TilesetLayer({
  name: '倾斜摄影',
  url: 'https://example.com/tileset.json',
  maximumScreenSpaceError: 8,
  maximumMemoryUsage: 1024,
  skipLevelOfDetail: true,
  baseScreenSpaceError: 1024,
  skipScreenSpaceErrorFactor: 16,
  skipLevels: 1,
  style: {
    color: "color('#ffffff')",
    show: true,
  },
  customShader: {
    fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        material.diffuse *= 1.2; // 增加亮度
      }
    `,
  },
})

map.addLayer(tilesetLayer)

// 模型操作示例
setTimeout(() => {
  // 旋转模型
  modelEntity.setRotation(90, 0, 0)

  // 改变颜色
  modelEntity.setColor('#ff0000', 0.8)

  // 设置轮廓
  modelEntity.setSilhouette('#ffff00', 3)

  // 停止动画
  modelEntity.stopAnimation()
}, 3000)

// 3D瓦片样式调整
setTimeout(() => {
  // 修改样式
  tilesetLayer.setStyle({
    color: "color('#ff0000', 0.8)",
    show: '${Height} > 100', // 只显示高度大于100的要素
  })

  // 调整性能参数
  tilesetLayer.setMaximumScreenSpaceError(4) // 提高质量
}, 5000)
```

## 相机控制完整属性

### CameraControl 相机控制

```javascript
// CameraControl - 相机控制类
class CameraControl {
  constructor(map) {
    this.map = map
    this.viewer = map.viewer
    this.camera = map.camera
  }

  // 位置控制方法

  // setCameraView - 设置相机视角
  setCameraView(options) {
    // destination: Array | Object
    // 作用: 目标位置
    // 格式: [lng, lat, alt] 或 {lng, lat, alt, heading, pitch, roll}
    const destination = options.destination

    // heading: number
    // 作用: 方向角（度）
    // 默认: 0
    const heading = options.heading || 0

    // pitch: number
    // 作用: 俯仰角（度）
    // 默认: -90
    const pitch = options.pitch !== undefined ? options.pitch : -90

    // roll: number
    // 作用: 翻滚角（度）
    // 默认: 0
    const roll = options.roll || 0

    // duration: number
    // 作用: 动画时间（秒）
    // 默认: 0（立即跳转）
    const duration = options.duration || 0

    if (duration > 0) {
      this.flyToPosition(destination, { heading, pitch, roll, duration })
    } else {
      this.setPosition(destination, { heading, pitch, roll })
    }
  }

  // flyToPosition - 飞行到位置
  flyToPosition(destination, options = {}) {
    const flyOptions = {
      destination: mars3d.LngLatPoint.fromArray(destination).toCartesian(),
      orientation: {
        heading: mars3d.Util.toRadians(options.heading || 0),
        pitch: mars3d.Util.toRadians(options.pitch || -30),
        roll: mars3d.Util.toRadians(options.roll || 0),
      },
      duration: options.duration || 3,
      complete: options.complete,
      cancel: options.cancel,
    }

    this.camera.flyTo(flyOptions)
  }

  // setPosition - 设置位置（立即跳转）
  setPosition(destination, options = {}) {
    this.camera.setView({
      destination: mars3d.LngLatPoint.fromArray(destination).toCartesian(),
      orientation: {
        heading: mars3d.Util.toRadians(options.heading || 0),
        pitch: mars3d.Util.toRadians(options.pitch || -30),
        roll: mars3d.Util.toRadians(options.roll || 0),
      },
    })
  }

  // flyToExtent - 飞行到范围
  flyToExtent(extent, options = {}) {
    // extent: Object
    // 作用: 范围边界
    // 格式: {xmin, ymin, xmax, ymax}

    const rectangle = mars3d.Cesium.Rectangle.fromDegrees(
      extent.xmin,
      extent.ymin,
      extent.xmax,
      extent.ymax,
    )

    this.camera.flyTo({
      destination: rectangle,
      duration: options.duration || 3,
      complete: options.complete,
    })
  }

  // 相机移动方法

  // moveForward - 向前移动
  moveForward(distance = 1000) {
    // distance: number - 移动距离（米）
    this.camera.moveForward(distance)
  }

  // moveBackward - 向后移动
  moveBackward(distance = 1000) {
    this.camera.moveBackward(distance)
  }

  // moveLeft - 向左移动
  moveLeft(distance = 1000) {
    this.camera.moveLeft(distance)
  }

  // moveRight - 向右移动
  moveRight(distance = 1000) {
    this.camera.moveRight(distance)
  }

  // moveUp - 向上移动
  moveUp(distance = 1000) {
    this.camera.moveUp(distance)
  }

  // moveDown - 向下移动
  moveDown(distance = 1000) {
    this.camera.moveDown(distance)
  }

  // 相机旋转方法

  // rotateLeft - 向左旋转
  rotateLeft(angle = 15) {
    // angle: number - 旋转角度（度）
    this.camera.rotateLeft(mars3d.Util.toRadians(angle))
  }

  // rotateRight - 向右旋转
  rotateRight(angle = 15) {
    this.camera.rotateRight(mars3d.Util.toRadians(angle))
  }

  // rotateUp - 向上旋转
  rotateUp(angle = 15) {
    this.camera.rotateUp(mars3d.Util.toRadians(angle))
  }

  // rotateDown - 向下旋转
  rotateDown(angle = 15) {
    this.camera.rotateDown(mars3d.Util.toRadians(angle))
  }

  // lookLeft - 向左看
  lookLeft(angle = 15) {
    this.camera.lookLeft(mars3d.Util.toRadians(angle))
  }

  // lookRight - 向右看
  lookRight(angle = 15) {
    this.camera.lookRight(mars3d.Util.toRadians(angle))
  }

  // lookUp - 向上看
  lookUp(angle = 15) {
    this.camera.lookUp(mars3d.Util.toRadians(angle))
  }

  // lookDown - 向下看
  lookDown(angle = 15) {
    this.camera.lookDown(mars3d.Util.toRadians(angle))
  }

  // 缩放方法

  // zoomIn - 放大
  zoomIn(distance = 1000) {
    this.camera.zoomIn(distance)
  }

  // zoomOut - 缩小
  zoomOut(distance = 1000) {
    this.camera.zoomOut(distance)
  }

  // zoomToLevel - 缩放到指定级别
  zoomToLevel(level) {
    // level: number - 缩放级别
    // 范围: 1-20
    const height = this.getHeightByLevel(level)
    this.setHeight(height)
  }

  // 获取和设置方法

  // getPosition - 获取当前位置
  getPosition() {
    const cartographic = this.camera.positionCartographic
    return {
      lng: mars3d.Util.toDegrees(cartographic.longitude),
      lat: mars3d.Util.toDegrees(cartographic.latitude),
      alt: cartographic.height,
      heading: mars3d.Util.toDegrees(this.camera.heading),
      pitch: mars3d.Util.toDegrees(this.camera.pitch),
      roll: mars3d.Util.toDegrees(this.camera.roll),
    }
  }

  // getHeight - 获取相机高度
  getHeight() {
    return this.camera.positionCartographic.height
  }

  // setHeight - 设置相机高度
  setHeight(height) {
    const cartographic = this.camera.positionCartographic
    const destination = mars3d.Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      height,
    )
    this.camera.setView({ destination })
  }

  // getHeading - 获取方向角
  getHeading() {
    return mars3d.Util.toDegrees(this.camera.heading)
  }

  // setHeading - 设置方向角
  setHeading(heading) {
    const position = this.getPosition()
    this.setPosition([position.lng, position.lat, position.alt], {
      heading: heading,
      pitch: position.pitch,
      roll: position.roll,
    })
  }

  // getPitch - 获取俯仰角
  getPitch() {
    return mars3d.Util.toDegrees(this.camera.pitch)
  }

  // setPitch - 设置俯仰角
  setPitch(pitch) {
    const position = this.getPosition()
    this.setPosition([position.lng, position.lat, position.alt], {
      heading: position.heading,
      pitch: pitch,
      roll: position.roll,
    })
  }

  // 实用方法

  // getHeightByLevel - 根据级别计算高度
  getHeightByLevel(level) {
    // 根据经验公式计算
    return Math.pow(2, 20 - level) * 256
  }

  // getLevelByHeight - 根据高度计算级别
  getLevelByHeight(height) {
    return Math.max(1, Math.min(20, Math.round(20 - Math.log2(height / 256))))
  }

  // isInView - 判断位置是否在视野内
  isInView(position) {
    const cartesian = mars3d.LngLatPoint.fromArray(position).toCartesian()
    const windowPosition = mars3d.Cesium.SceneTransforms.worldToWindowCoordinates(
      this.viewer.scene,
      cartesian,
    )

    if (!windowPosition) return false

    const canvas = this.viewer.canvas
    return (
      windowPosition.x >= 0 &&
      windowPosition.x <= canvas.clientWidth &&
      windowPosition.y >= 0 &&
      windowPosition.y <= canvas.clientHeight
    )
  }

  // pickPosition - 拾取屏幕位置对应的地理坐标
  pickPosition(screenPosition) {
    // screenPosition: Object - 屏幕坐标 {x, y}
    const cartesian = this.viewer.camera.pickEllipsoid(screenPosition)
    if (cartesian) {
      return mars3d.PointTrans.cartesian2lonlat(cartesian)
    }
    return null
  }
}

// 相机控制使用示例
const cameraControl = new CameraControl(map)

// 设置相机位置
cameraControl.setCameraView({
  destination: [117.207, 31.794, 5000],
  heading: 0,
  pitch: -45,
  roll: 0,
  duration: 3,
})

// 飞行到指定范围
cameraControl.flyToExtent(
  {
    xmin: 117.0,
    ymin: 31.5,
    xmax: 117.5,
    ymax: 32.0,
  },
  { duration: 5 },
)

// 相机移动
cameraControl.moveForward(1000)
cameraControl.rotateLeft(30)
cameraControl.zoomIn(500)

// 获取当前位置
const currentPosition = cameraControl.getPosition()
console.log('当前相机位置:', currentPosition)

// 设置相机高度
cameraControl.setHeight(10000)

// 判断位置是否在视野内
const isVisible = cameraControl.isInView([117.207, 31.794, 0])
console.log('位置是否可见:', isVisible)

// 监听相机变化事件
map.on('cameraChanged', (event) => {
  const position = cameraControl.getPosition()
  console.log('相机位置变化:', position)
})
```

## 事件系统详解

### 地图事件监听

```javascript
// Map 事件系统
class MapEvents {
  constructor(map) {
    this.map = map
    this.viewer = map.viewer
  }

  // 鼠标事件

  // click - 鼠标点击事件
  onClick(callback) {
    // callback: function(event) - 回调函数
    // event.position: Object - 屏幕坐标 {x, y}
    // event.pickedObject: Object - 拾取到的对象
    // event.cartesian: Object - 笛卡尔坐标
    // event.cartographic: Object - 地理坐标
    this.map.on('click', callback)
  }

  // rightClick - 鼠标右键点击事件
  onRightClick(callback) {
    this.map.on('rightClick', callback)
  }

  // doubleClick - 鼠标双击事件
  onDoubleClick(callback) {
    this.map.on('doubleClick', callback)
  }

  // mouseMove - 鼠标移动事件
  onMouseMove(callback) {
    // 频繁触发，建议使用节流
    this.map.on('mouseMove', callback)
  }

  // mouseOver - 鼠标悬停事件
  onMouseOver(callback) {
    this.map.on('mouseOver', callback)
  }

  // mouseOut - 鼠标离开事件
  onMouseOut(callback) {
    this.map.on('mouseOut', callback)
  }

  // 相机事件

  // cameraChanged - 相机变化事件
  onCameraChanged(callback) {
    // callback: function(event) - 回调函数
    // event.position: Object - 相机位置信息
    // event.percentage: number - 移动百分比
    this.map.on('cameraChanged', callback)
  }

  // cameraChangedEnd - 相机变化结束事件
  onCameraChangedEnd(callback) {
    this.map.on('cameraChangedEnd', callback)
  }

  // cameraMoveStart - 相机开始移动事件
  onCameraMoveStart(callback) {
    this.map.on('cameraMoveStart', callback)
  }

  // cameraMoveEnd - 相机移动结束事件
  onCameraMoveEnd(callback) {
    this.map.on('cameraMoveEnd', callback)
  }

  // 场景事件

  // renderError - 渲染错误事件
  onRenderError(callback) {
    this.map.on('renderError', callback)
  }

  // terrainChanged - 地形变化事件
  onTerrainChanged(callback) {
    this.map.on('terrainChanged', callback)
  }

  // morphStart - 场景模式变化开始事件
  onMorphStart(callback) {
    this.map.on('morphStart', callback)
  }

  // morphComplete - 场景模式变化完成事件
  onMorphComplete(callback) {
    this.map.on('morphComplete', callback)
  }

  // 图层事件

  // layerAdded - 图层添加事件
  onLayerAdded(callback) {
    // callback: function(event) - 回调函数
    // event.layer: Object - 添加的图层
    this.map.on('layerAdded', callback)
  }

  // layerRemoved - 图层移除事件
  onLayerRemoved(callback) {
    this.map.on('layerRemoved', callback)
  }

  // layerShowHide - 图层显示隐藏事件
  onLayerShowHide(callback) {
    this.map.on('layerShowHide', callback)
  }

  // 矢量数据事件

  // graphicAdded - 矢量数据添加事件
  onGraphicAdded(callback) {
    // callback: function(event) - 回调函数
    // event.graphic: Object - 添加的矢量数据
    // event.layer: Object - 所属图层
    this.map.on('graphicAdded', callback)
  }

  // graphicRemoved - 矢量数据移除事件
  onGraphicRemoved(callback) {
    this.map.on('graphicRemoved', callback)
  }

  // 键盘事件

  // keydown - 键盘按下事件
  onKeyDown(callback) {
    // callback: function(event) - 回调函数
    // event.key: string - 按键值
    // event.keyCode: number - 按键码
    // event.ctrlKey: boolean - 是否按下Ctrl键
    // event.shiftKey: boolean - 是否按下Shift键
    // event.altKey: boolean - 是否按下Alt键
    this.map.on('keydown', callback)
  }

  // keyup - 键盘抬起事件
  onKeyUp(callback) {
    this.map.on('keyup', callback)
  }

  // 自定义事件

  // 触发自定义事件
  fire(eventType, data) {
    this.map.fire(eventType, data)
  }

  // 监听自定义事件
  on(eventType, callback) {
    this.map.on(eventType, callback)
  }

  // 移除事件监听
  off(eventType, callback) {
    this.map.off(eventType, callback)
  }

  // 只监听一次
  once(eventType, callback) {
    this.map.once(eventType, callback)
  }
}

// 事件使用示例
const mapEvents = new MapEvents(map)

// 监听点击事件
mapEvents.onClick((event) => {
  console.log('点击位置:', event.cartographic)
  console.log('拾取对象:', event.pickedObject)

  if (event.pickedObject && event.pickedObject.id) {
    const graphic = event.pickedObject.id
    console.log('点击的矢量数据:', graphic.attr)
  }
})

// 监听相机变化
mapEvents.onCameraChanged((event) => {
  console.log('相机位置:', event.position)
  console.log('移动百分比:', event.percentage)
})

// 监听图层事件
mapEvents.onLayerAdded((event) => {
  console.log('添加图层:', event.layer.name)
})

// 监听键盘事件
mapEvents.onKeyDown((event) => {
  if (event.key === 'Escape') {
    console.log('按下ESC键')
    // 取消当前操作
  }

  if (event.ctrlKey && event.key === 's') {
    console.log('保存操作')
    event.preventDefault() // 阻止默认行为
  }
})

// 自定义事件
mapEvents.on('dataLoaded', (data) => {
  console.log('数据加载完成:', data)
})

// 触发自定义事件
mapEvents.fire('dataLoaded', { count: 100, time: new Date() })

// 节流函数处理高频事件
const throttle = (func, delay) => {
  let timeoutId
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          func.apply(this, args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime),
      )
    }
  }
}

// 使用节流处理鼠标移动事件
mapEvents.onMouseMove(
  throttle((event) => {
    console.log('鼠标位置:', event.position)
  }, 100),
) // 100ms节流
```

### 图层和矢量数据事件

```javascript
// GraphicLayer 事件系统
class GraphicLayerEvents {
  constructor(layer) {
    this.layer = layer
  }

  // 图层事件

  // add - 图层添加到地图事件
  onAdd(callback) {
    this.layer.on('add', callback)
  }

  // remove - 图层从地图移除事件
  onRemove(callback) {
    this.layer.on('remove', callback)
  }

  // show - 图层显示事件
  onShow(callback) {
    this.layer.on('show', callback)
  }

  // hide - 图层隐藏事件
  onHide(callback) {
    this.layer.on('hide', callback)
  }

  // 矢量数据事件

  // addGraphic - 矢量数据添加事件
  onAddGraphic(callback) {
    this.layer.on('addGraphic', callback)
  }

  // removeGraphic - 矢量数据移除事件
  onRemoveGraphic(callback) {
    this.layer.on('removeGraphic', callback)
  }

  // 交互事件

  // click - 图层点击事件
  onClick(callback) {
    this.layer.on('click', callback)
  }

  // mouseOver - 鼠标悬停事件
  onMouseOver(callback) {
    this.layer.on('mouseOver', callback)
  }

  // mouseOut - 鼠标离开事件
  onMouseOut(callback) {
    this.layer.on('mouseOut', callback)
  }

  // 编辑事件

  // editStart - 开始编辑事件
  onEditStart(callback) {
    this.layer.on('editStart', callback)
  }

  // editStop - 停止编辑事件
  onEditStop(callback) {
    this.layer.on('editStop', callback)
  }

  // editMovePoint - 编辑点移动事件
  onEditMovePoint(callback) {
    this.layer.on('editMovePoint', callback)
  }
}

// Graphic 事件系统
class GraphicEvents {
  constructor(graphic) {
    this.graphic = graphic
  }

  // 生命周期事件

  // add - 添加到图层事件
  onAdd(callback) {
    this.graphic.on('add', callback)
  }

  // remove - 从图层移除事件
  onRemove(callback) {
    this.graphic.on('remove', callback)
  }

  // 交互事件

  // click - 点击事件
  onClick(callback) {
    this.graphic.on('click', callback)
  }

  // rightClick - 右键点击事件
  onRightClick(callback) {
    this.graphic.on('rightClick', callback)
  }

  // mouseOver - 鼠标悬停事件
  onMouseOver(callback) {
    this.graphic.on('mouseOver', callback)
  }

  // mouseOut - 鼠标离开事件
  onMouseOut(callback) {
    this.graphic.on('mouseOut', callback)
  }

  // 编辑事件

  // editStart - 开始编辑事件
  onEditStart(callback) {
    this.graphic.on('editStart', callback)
  }

  // editMovePoint - 编辑点移动事件
  onEditMovePoint(callback) {
    this.graphic.on('editMovePoint', callback)
  }

  // editStop - 停止编辑事件
  onEditStop(callback) {
    this.graphic.on('editStop', callback)
  }
}

// 使用示例
const graphicLayer = new mars3d.layer.GraphicLayer()
const layerEvents = new GraphicLayerEvents(graphicLayer)

// 监听图层事件
layerEvents.onAddGraphic((event) => {
  console.log('添加矢量数据:', event.graphic)
})

layerEvents.onClick((event) => {
  console.log('点击图层:', event.graphic.attr)
})

// 创建矢量数据并监听事件
const point = new mars3d.graphic.PointEntity({
  position: [117.207, 31.794, 100],
  style: { color: '#ff0000', pixelSize: 15 },
  attr: { name: '测试点' },
})

const pointEvents = new GraphicEvents(point)

pointEvents.onClick((event) => {
  console.log('点击点数据:', event.target.attr)
})

pointEvents.onMouseOver((event) => {
  // 鼠标悬停时改变颜色
  event.target.setStyle({ color: '#00ff00' })
})

pointEvents.onMouseOut((event) => {
  // 鼠标离开时恢复颜色
  event.target.setStyle({ color: '#ff0000' })
})

graphicLayer.addGraphic(point)
```

## 材质系统详解

### 基础材质类型

```javascript
// 材质系统
class MaterialSystem {
  // Color 颜色材质
  static createColorMaterial(options = {}) {
    return {
      type: 'Color',
      // color: string | Object
      // 作用: 颜色值
      // 格式: '#ff0000' | 'red' | {r: 1, g: 0, b: 0, a: 1}
      color: options.color || '#ffffff',

      // opacity: number
      // 作用: 透明度
      // 默认: 1.0
      // 范围: 0.0 - 1.0
      opacity: options.opacity !== undefined ? options.opacity : 1.0,
    }
  }

  // Image 图片材质
  static createImageMaterial(options = {}) {
    return {
      type: 'Image',
      // image: string
      // 作用: 图片地址
      image: options.image || '',

      // repeat: Object
      // 作用: 重复模式
      // 格式: {x: number, y: number}
      repeat: options.repeat || { x: 1, y: 1 },

      // color: string
      // 作用: 混合颜色
      color: options.color || '#ffffff',

      // opacity: number
      // 作用: 透明度
      opacity: options.opacity !== undefined ? options.opacity : 1.0,

      // transparent: boolean
      // 作用: 是否透明
      transparent: options.transparent !== undefined ? options.transparent : true,
    }
  }

  // Grid 网格材质
  static createGridMaterial(options = {}) {
    return {
      type: 'Grid',
      // color: string
      // 作用: 网格颜色
      color: options.color || '#ffffff',

      // cellAlpha: number
      // 作用: 单元格透明度
      // 默认: 0.1
      cellAlpha: options.cellAlpha !== undefined ? options.cellAlpha : 0.1,

      // lineCount: Object
      // 作用: 线条数量
      // 格式: {x: number, y: number}
      lineCount: options.lineCount || { x: 8, y: 8 },

      // lineThickness: Object
      // 作用: 线条粗细
      // 格式: {x: number, y: number}
      lineThickness: options.lineThickness || { x: 1, y: 1 },

      // lineOffset: Object
      // 作用: 线条偏移
      // 格式: {x: number, y: number}
      lineOffset: options.lineOffset || { x: 0, y: 0 },
    }
  }

  // Stripe 条纹材质
  static createStripeMaterial(options = {}) {
    return {
      type: 'Stripe',
      // evenColor: string
      // 作用: 偶数条纹颜色
      evenColor: options.evenColor || '#ffffff',

      // oddColor: string
      // 作用: 奇数条纹颜色
      oddColor: options.oddColor || '#000000',

      // repeat: number
      // 作用: 重复次数
      // 默认: 5
      repeat: options.repeat !== undefined ? options.repeat : 5,

      // offset: number
      // 作用: 偏移量
      // 默认: 0
      offset: options.offset !== undefined ? options.offset : 0,

      // orientation: number
      // 作用: 方向
      // 选项: 0(HORIZONTAL), 1(VERTICAL)
      orientation: options.orientation !== undefined ? options.orientation : 0,
    }
  }

  // Checkerboard 棋盘材质
  static createCheckerboardMaterial(options = {}) {
    return {
      type: 'Checkerboard',
      // evenColor: string
      // 作用: 偶数格颜色
      evenColor: options.evenColor || '#ffffff',

      // oddColor: string
      // 作用: 奇数格颜色
      oddColor: options.oddColor || '#000000',

      // repeat: Object
      // 作用: 重复次数
      // 格式: {x: number, y: number}
      repeat: options.repeat || { x: 5, y: 5 },
    }
  }

  // Water 水体材质
  static createWaterMaterial(options = {}) {
    return {
      type: 'Water',
      // baseWaterColor: string
      // 作用: 基础水体颜色
      baseWaterColor: options.baseWaterColor || '#006ab4',

      // blendColor: string
      // 作用: 混合颜色
      blendColor: options.blendColor || '#006ab4',

      // specularMap: string
      // 作用: 高光贴图
      specularMap: options.specularMap || '',

      // normalMap: string
      // 作用: 法线贴图
      normalMap: options.normalMap || '',

      // frequency: number
      // 作用: 波浪频率
      // 默认: 100
      frequency: options.frequency !== undefined ? options.frequency : 100,

      // animationSpeed: number
      // 作用: 动画速度
      // 默认: 0.01
      animationSpeed: options.animationSpeed !== undefined ? options.animationSpeed : 0.01,

      // amplitude: number
      // 作用: 波浪幅度
      // 默认: 1.0
      amplitude: options.amplitude !== undefined ? options.amplitude : 1.0,

      // specularIntensity: number
      // 作用: 高光强度
      // 默认: 0.5
      specularIntensity: options.specularIntensity !== undefined ? options.specularIntensity : 0.5,
    }
  }
}

// 线条材质系统
class PolylineMaterialSystem {
  // Color 颜色线条材质
  static createColorMaterial(options = {}) {
    return {
      type: 'Color',
      color: options.color || '#ffff00',
      opacity: options.opacity !== undefined ? options.opacity : 1.0,
    }
  }

  // PolylineGlow 发光线条材质
  static createGlowMaterial(options = {}) {
    return {
      type: 'PolylineGlow',
      // color: string
      // 作用: 发光颜色
      color: options.color || '#00ff00',

      // glowPower: number
      // 作用: 发光强度
      // 默认: 0.25
      // 范围: 0.0 - 1.0
      glowPower: options.glowPower !== undefined ? options.glowPower : 0.25,

      // taperPower: number
      // 作用: 锥化强度
      // 默认: 1.0
      // 范围: 0.0 - 1.0
      taperPower: options.taperPower !== undefined ? options.taperPower : 1.0,
    }
  }

  // PolylineArrow 箭头线条材质
  static createArrowMaterial(options = {}) {
    return {
      type: 'PolylineArrow',
      // color: string
      // 作用: 箭头颜色
      color: options.color || '#ffff00',
    }
  }

  // PolylineDash 虚线材质
  static createDashMaterial(options = {}) {
    return {
      type: 'PolylineDash',
      // color: string
      // 作用: 线条颜色
      color: options.color || '#ffff00',

      // gapColor: string
      // 作用: 间隙颜色
      gapColor: options.gapColor || 'transparent',

      // dashLength: number
      // 作用: 实线长度
      // 默认: 16
      dashLength: options.dashLength !== undefined ? options.dashLength : 16,

      // dashPattern: number
      // 作用: 虚线模式
      // 默认: 255
      dashPattern: options.dashPattern !== undefined ? options.dashPattern : 255,
    }
  }

  // PolylineOutline 轮廓线条材质
  static createOutlineMaterial(options = {}) {
    return {
      type: 'PolylineOutline',
      // color: string
      // 作用: 线条颜色
      color: options.color || '#ffff00',

      // outlineColor: string
      // 作用: 轮廓颜色
      outlineColor: options.outlineColor || '#000000',

      // outlineWidth: number
      // 作用: 轮廓宽度
      // 默认: 1
      outlineWidth: options.outlineWidth !== undefined ? options.outlineWidth : 1,
    }
  }
}

// 材质使用示例

// 面材质示例
const polygon = new mars3d.graphic.PolygonEntity({
  positions: [
    [117.18, 31.78],
    [117.19, 31.78],
    [117.19, 31.79],
    [117.18, 31.79],
  ],
  style: {
    // 使用图片材质
    materialType: 'Image',
    materialOptions: MaterialSystem.createImageMaterial({
      image: 'img/textures/grass.jpg',
      repeat: { x: 4, y: 4 },
      color: '#ffffff',
      opacity: 0.8,
    }),
    outline: true,
    outlineColor: '#ffffff',
    outlineWidth: 2,
  },
})

// 网格材质
const gridPolygon = new mars3d.graphic.PolygonEntity({
  positions: [
    [117.2, 31.78],
    [117.21, 31.78],
    [117.21, 31.79],
    [117.2, 31.79],
  ],
  style: {
    materialType: 'Grid',
    materialOptions: MaterialSystem.createGridMaterial({
      color: '#00ffff',
      cellAlpha: 0.2,
      lineCount: { x: 10, y: 10 },
      lineThickness: { x: 2, y: 2 },
    }),
  },
})

// 水体材质
const waterPolygon = new mars3d.graphic.PolygonEntity({
  positions: [
    [117.22, 31.78],
    [117.23, 31.78],
    [117.23, 31.79],
    [117.22, 31.79],
  ],
  style: {
    materialType: 'Water',
    materialOptions: MaterialSystem.createWaterMaterial({
      baseWaterColor: '#006ab4',
      frequency: 200,
      animationSpeed: 0.02,
      amplitude: 2.0,
      specularIntensity: 0.8,
    }),
  },
})

// 线条材质示例

// 发光线条
const glowPolyline = new mars3d.graphic.PolylineEntity({
  positions: [
    [117.2, 31.79, 0],
    [117.21, 31.8, 100],
    [117.22, 31.79, 200],
  ],
  style: {
    width: 8,
    materialType: 'PolylineGlow',
    materialOptions: PolylineMaterialSystem.createGlowMaterial({
      color: '#00ff00',
      glowPower: 0.3,
      taperPower: 0.8,
    }),
  },
})

// 箭头线条
const arrowPolyline = new mars3d.graphic.PolylineEntity({
  positions: [
    [117.18, 31.8, 0],
    [117.19, 31.81, 50],
    [117.2, 31.8, 100],
  ],
  style: {
    width: 10,
    materialType: 'PolylineArrow',
    materialOptions: PolylineMaterialSystem.createArrowMaterial({
      color: '#ff0000',
    }),
  },
})

// 虚线
const dashPolyline = new mars3d.graphic.PolylineEntity({
  positions: [
    [117.16, 31.79, 0],
    [117.17, 31.8, 50],
    [117.18, 31.79, 100],
  ],
  style: {
    width: 5,
    materialType: 'PolylineDash',
    materialOptions: PolylineMaterialSystem.createDashMaterial({
      color: '#ffff00',
      gapColor: 'transparent',
      dashLength: 20,
      dashPattern: 255,
    }),
  },
})

// 动态材质示例
class DynamicMaterial {
  constructor() {
    this.time = 0
  }

  // 创建动态颜色材质
  createDynamicColorMaterial() {
    return {
      type: 'Color',
      color: () => {
        this.time += 0.1
        const red = Math.sin(this.time) * 0.5 + 0.5
        const green = Math.cos(this.time) * 0.5 + 0.5
        const blue = Math.sin(this.time + Math.PI / 3) * 0.5 + 0.5
        return `rgb(${Math.floor(red * 255)}, ${Math.floor(green * 255)}, ${Math.floor(blue * 255)})`
      },
    }
  }

  // 创建动态水体材质
  createDynamicWaterMaterial() {
    return {
      type: 'Water',
      baseWaterColor: '#006ab4',
      frequency: () => 100 + Math.sin(this.time * 0.5) * 50,
      animationSpeed: 0.02,
      amplitude: () => 1.0 + Math.cos(this.time * 0.3) * 0.5,
    }
  }
}

// 使用动态材质
const dynamicMaterial = new DynamicMaterial()

const dynamicPolygon = new mars3d.graphic.PolygonEntity({
  positions: [
    [117.24, 31.78],
    [117.25, 31.78],
    [117.25, 31.79],
    [117.24, 31.79],
  ],
  style: {
    materialType: 'Color',
    materialOptions: dynamicMaterial.createDynamicColorMaterial(),
  },
})

// 定时更新动态材质
setInterval(() => {
  dynamicPolygon.updateStyle()
}, 100)
```

## 动画系统详解

### 时间轴动画

```javascript
// 时间轴动画系统
class TimelineAnimation {
  constructor(map) {
    this.map = map
    this.viewer = map.viewer
    this.clock = map.clock
  }

  // 设置时间范围
  setTimeRange(start, stop) {
    // start: Date | string - 开始时间
    // stop: Date | string - 结束时间

    const startTime = mars3d.Cesium.JulianDate.fromDate(new Date(start))
    const stopTime = mars3d.Cesium.JulianDate.fromDate(new Date(stop))

    this.clock.startTime = startTime
    this.clock.stopTime = stopTime
    this.clock.currentTime = startTime

    // 设置时间轴可见
    this.viewer.timeline.updateFromClock()
    this.viewer.timeline.zoomTo(startTime, stopTime)
  }

  // 设置时钟属性
  setClockSettings(options = {}) {
    // clockRange: number
    // 作用: 时钟循环模式
    // 选项: 0(UNBOUNDED), 1(CLAMPED), 2(LOOP_STOP)
    if (options.clockRange !== undefined) {
      this.clock.clockRange = options.clockRange
    }

    // clockStep: number
    // 作用: 时钟步进模式
    // 选项: 0(TICK_DEPENDENT), 1(SYSTEM_CLOCK_MULTIPLIER), 2(SYSTEM_CLOCK)
    if (options.clockStep !== undefined) {
      this.clock.clockStep = options.clockStep
    }

    // multiplier: number
    // 作用: 时间倍速
    // 默认: 1.0
    if (options.multiplier !== undefined) {
      this.clock.multiplier = options.multiplier
    }

    // shouldAnimate: boolean
    // 作用: 是否自动播放
    // 默认: true
    if (options.shouldAnimate !== undefined) {
      this.clock.shouldAnimate = options.shouldAnimate
    }
  }

  // 播放控制
  play() {
    this.clock.shouldAnimate = true
  }

  pause() {
    this.clock.shouldAnimate = false
  }

  stop() {
    this.clock.shouldAnimate = false
    this.clock.currentTime = this.clock.startTime
  }

  // 设置当前时间
  setCurrentTime(time) {
    // time: Date | string
    const julianDate = mars3d.Cesium.JulianDate.fromDate(new Date(time))
    this.clock.currentTime = julianDate
  }

  // 获取当前时间
  getCurrentTime() {
    return mars3d.Cesium.JulianDate.toDate(this.clock.currentTime)
  }

  // 设置播放速度
  setSpeed(multiplier) {
    this.clock.multiplier = multiplier
  }

  // 监听时间变化
  onTimeChanged(callback) {
    this.clock.onTick.addEventListener(callback)
  }
}

// 属性动画系统
class PropertyAnimation {
  // 创建位置动画
  static createPositionAnimation(positions, times) {
    // positions: Array - 位置数组 [[lng,lat,alt], ...]
    // times: Array - 时间数组 [Date, ...]

    const property = new mars3d.Cesium.SampledPositionProperty()

    for (let i = 0; i < positions.length; i++) {
      const time = mars3d.Cesium.JulianDate.fromDate(times[i])
      const position = mars3d.LngLatPoint.fromArray(positions[i]).toCartesian()
      property.addSample(time, position)
    }

    // 设置插值算法
    property.setInterpolationOptions({
      interpolationDegree: 2,
      interpolationAlgorithm: mars3d.Cesium.HermitePolynomialApproximation,
    })

    return property
  }

  // 创建方向动画
  static createOrientationAnimation(orientations, times) {
    // orientations: Array - 方向数组 [{heading, pitch, roll}, ...]
    // times: Array - 时间数组 [Date, ...]

    const property = new mars3d.Cesium.SampledProperty(mars3d.Cesium.Quaternion)

    for (let i = 0; i < orientations.length; i++) {
      const time = mars3d.Cesium.JulianDate.fromDate(times[i])
      const hpr = mars3d.Cesium.HeadingPitchRoll.fromDegrees(
        orientations[i].heading,
        orientations[i].pitch,
        orientations[i].roll,
      )
      const quaternion = mars3d.Cesium.Transforms.headingPitchRollQuaternion(
        mars3d.LngLatPoint.fromArray(positions[i]).toCartesian(),
        hpr,
      )
      property.addSample(time, quaternion)
    }

    return property
  }

  // 创建缩放动画
  static createScaleAnimation(scales, times) {
    // scales: Array - 缩放数组 [number, ...]
    // times: Array - 时间数组 [Date, ...]

    const property = new mars3d.Cesium.SampledProperty(Number)

    for (let i = 0; i < scales.length; i++) {
      const time = mars3d.Cesium.JulianDate.fromDate(times[i])
      property.addSample(time, scales[i])
    }

    return property
  }

  // 创建颜色动画
  static createColorAnimation(colors, times) {
    // colors: Array - 颜色数组 ['#ff0000', ...]
    // times: Array - 时间数组 [Date, ...]

    const property = new mars3d.Cesium.SampledProperty(mars3d.Cesium.Color)

    for (let i = 0; i < colors.length; i++) {
      const time = mars3d.Cesium.JulianDate.fromDate(times[i])
      const color = mars3d.Cesium.Color.fromCssColorString(colors[i])
      property.addSample(time, color)
    }

    return property
  }

  // 创建透明度动画
  static createOpacityAnimation(opacities, times) {
    // opacities: Array - 透明度数组 [number, ...]
    // times: Array - 时间数组 [Date, ...]

    const property = new mars3d.Cesium.SampledProperty(Number)

    for (let i = 0; i < opacities.length; i++) {
      const time = mars3d.Cesium.JulianDate.fromDate(times[i])
      property.addSample(time, opacities[i])
    }

    return property
  }
}

// 路径动画
class PathAnimation {
  constructor(graphic, options = {}) {
    this.graphic = graphic
    this.options = options
    this.isPlaying = false
  }

  // 设置路径点
  setPath(path, options = {}) {
    // path: Array - 路径点数组
    // 格式: [{position: [lng,lat,alt], time: Date, ...}, ...]

    this.path = path

    // 提取位置和时间数组
    const positions = path.map((point) => point.position)
    const times = path.map((point) => point.time)

    // 创建位置动画属性
    this.positionProperty = PropertyAnimation.createPositionAnimation(positions, times)

    // 如果有方向信息，创建方向动画
    if (path[0].heading !== undefined) {
      const orientations = path.map((point) => ({
        heading: point.heading || 0,
        pitch: point.pitch || 0,
        roll: point.roll || 0,
      }))
      this.orientationProperty = PropertyAnimation.createOrientationAnimation(orientations, times)
    }

    // 设置可用性
    const startTime = mars3d.Cesium.JulianDate.fromDate(times[0])
    const stopTime = mars3d.Cesium.JulianDate.fromDate(times[times.length - 1])

    this.graphic.availability = new mars3d.Cesium.TimeIntervalCollection([
      new mars3d.Cesium.TimeInterval({
        start: startTime,
        stop: stopTime,
      }),
    ])

    // 应用动画属性
    this.graphic.position = this.positionProperty

    if (this.orientationProperty) {
      this.graphic.orientation = this.orientationProperty
    }

    // 显示路径轨迹
    if (options.showPath !== false) {
      this.graphic.path = {
        show: true,
        width: options.pathWidth || 2,
        material: mars3d.Cesium.Color.fromCssColorString(options.pathColor || '#ffff00'),
        resolution: options.pathResolution || 60,
        leadTime: options.leadTime || 0,
        trailTime: options.trailTime || 60,
        distanceDisplayCondition: options.distanceDisplayCondition,
      }
    }

    return this
  }

  // 播放动画
  play(options = {}) {
    if (!this.path || this.path.length === 0) {
      console.warn('路径为空，无法播放动画')
      return
    }

    const startTime = mars3d.Cesium.JulianDate.fromDate(this.path[0].time)
    const stopTime = mars3d.Cesium.JulianDate.fromDate(this.path[this.path.length - 1].time)

    // 设置时间轴
    this.graphic.layer.map.clock.startTime = startTime
    this.graphic.layer.map.clock.stopTime = stopTime
    this.graphic.layer.map.clock.currentTime = startTime
    this.graphic.layer.map.clock.clockRange = mars3d.Cesium.ClockRange.LOOP_STOP
    this.graphic.layer.map.clock.multiplier = options.speed || 1

    // 开始播放
    this.graphic.layer.map.clock.shouldAnimate = true
    this.isPlaying = true

    // 跟踪相机
    if (options.followCamera) {
      this.graphic.layer.map.trackedEntity = this.graphic._cesiumEntity
    }

    return this
  }

  // 暂停动画
  pause() {
    this.graphic.layer.map.clock.shouldAnimate = false
    this.isPlaying = false
    return this
  }

  // 停止动画
  stop() {
    this.graphic.layer.map.clock.shouldAnimate = false
    this.graphic.layer.map.trackedEntity = undefined
    this.isPlaying = false

    // 重置到起始时间
    if (this.path && this.path.length > 0) {
      const startTime = mars3d.Cesium.JulianDate.fromDate(this.path[0].time)
      this.graphic.layer.map.clock.currentTime = startTime
    }

    return this
  }

  // 设置播放速度
  setSpeed(speed) {
    this.graphic.layer.map.clock.multiplier = speed
    return this
  }

  // 跳转到指定时间
  seekToTime(time) {
    const julianDate = mars3d.Cesium.JulianDate.fromDate(new Date(time))
    this.graphic.layer.map.clock.currentTime = julianDate
    return this
  }

  // 获取当前播放进度 (0-1)
  getProgress() {
    if (!this.path || this.path.length === 0) return 0

    const currentTime = this.graphic.layer.map.clock.currentTime
    const startTime = mars3d.Cesium.JulianDate.fromDate(this.path[0].time)
    const stopTime = mars3d.Cesium.JulianDate.fromDate(this.path[this.path.length - 1].time)

    const totalDuration = mars3d.Cesium.JulianDate.secondsDifference(stopTime, startTime)
    const currentDuration = mars3d.Cesium.JulianDate.secondsDifference(currentTime, startTime)

    return Math.max(0, Math.min(1, currentDuration / totalDuration))
  }
}

// 动画使用示例

// 初始化时间轴动画
const timelineAnimation = new TimelineAnimation(map)

// 设置时间范围（1小时）
const startTime = new Date()
const stopTime = new Date(startTime.getTime() + 3600000) // 1小时后

timelineAnimation.setTimeRange(startTime, stopTime)
timelineAnimation.setClockSettings({
  clockRange: 2, // LOOP_STOP
  multiplier: 10, // 10倍速
  shouldAnimate: true,
})

// 创建移动的飞机模型
const aircraft = new mars3d.graphic.ModelEntity({
  position: [117.207, 31.794, 1000],
  style: {
    url: 'model/aircraft.gltf',
    scale: 1.0,
    heading: 0,
    pitch: 0,
    roll: 0,
  },
  attr: { name: '飞机' },
})

// 定义飞行路径
const flightPath = [
  { position: [117.2, 31.79, 1000], time: new Date(startTime.getTime()), heading: 0 },
  { position: [117.21, 31.8, 1200], time: new Date(startTime.getTime() + 600000), heading: 45 },
  { position: [117.22, 31.79, 1000], time: new Date(startTime.getTime() + 1200000), heading: 90 },
  { position: [117.21, 31.78, 800], time: new Date(startTime.getTime() + 1800000), heading: 135 },
  { position: [117.2, 31.79, 1000], time: new Date(startTime.getTime() + 2400000), heading: 180 },
]

// 创建路径动画
const pathAnimation = new PathAnimation(aircraft, {
  showPath: true,
  pathColor: '#00ff00',
  pathWidth: 3,
  trailTime: 300, // 轨迹保留5分钟
})

// 设置路径并播放
pathAnimation.setPath(flightPath).play({
  speed: 5, // 5倍速
  followCamera: true, // 相机跟踪
})

// 添加到图层
graphicLayer.addGraphic(aircraft)

// 创建属性动画的点
const animatedPoint = new mars3d.graphic.PointEntity({
  position: [117.23, 31.8, 100],
  style: {
    pixelSize: 15,
    color: '#ff0000',
  },
})

// 创建颜色和大小动画
const colorTimes = [
  new Date(startTime.getTime()),
  new Date(startTime.getTime() + 1000000),
  new Date(startTime.getTime() + 2000000),
  new Date(startTime.getTime() + 3000000),
]

const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff0000']
const sizes = [10, 20, 15, 10]

// 应用动画属性
animatedPoint._cesiumEntity.point.color = PropertyAnimation.createColorAnimation(colors, colorTimes)
animatedPoint._cesiumEntity.point.pixelSize = PropertyAnimation.createScaleAnimation(
  sizes,
  colorTimes,
)

graphicLayer.addGraphic(animatedPoint)

// 监听时间变化
timelineAnimation.onTimeChanged(() => {
  const currentTime = timelineAnimation.getCurrentTime()
  const progress = pathAnimation.getProgress()
  console.log('当前时间:', currentTime, '进度:', (progress * 100).toFixed(1) + '%')
})

// 动画控制按钮事件
document.getElementById('playBtn').onclick = () => pathAnimation.play()
document.getElementById('pauseBtn').onclick = () => pathAnimation.pause()
document.getElementById('stopBtn').onclick = () => pathAnimation.stop()
document.getElementById('speedBtn').onclick = () => pathAnimation.setSpeed(10)
```

继续完善剩余章节...

## 分析功能详解

### 测量工具

```javascript
// 测量工具系统
class MeasureUtil {
  // 距离测量
  static measureDistance(positions) {
    // positions: Array - 位置数组 [[lng,lat,alt], ...]
    // 返回: number - 距离（米）

    let totalDistance = 0

    for (let i = 0; i < positions.length - 1; i++) {
      const point1 = mars3d.LngLatPoint.fromArray(positions[i])
      const point2 = mars3d.LngLatPoint.fromArray(positions[i + 1])

      // 计算两点间距离
      const distance = this.getDistance([point1, point2])
      totalDistance += distance
    }

    return totalDistance
  }

  // 面积测量
  static measureArea(positions) {
    // positions: Array - 边界位置数组
    // 返回: number - 面积（平方米）

    if (positions.length < 3) {
      return 0
    }

    // 转换为Cartesian3坐标
    const cartesians = positions.map((pos) => mars3d.LngLatPoint.fromArray(pos).toCartesian())

    // 使用球面几何计算面积
    const area = mars3d.Cesium.PolygonPipeline.computeArea2D(cartesians)
    return Math.abs(area)
  }

  // 高度测量
  static measureHeight(startPosition, endPosition) {
    // startPosition: Array - 起始位置 [lng,lat,alt]
    // endPosition: Array - 结束位置 [lng,lat,alt]
    // 返回: Object - {horizontal: 水平距离, vertical: 垂直距离, slope: 斜距}

    const start = mars3d.LngLatPoint.fromArray(startPosition)
    const end = mars3d.LngLatPoint.fromArray(endPosition)

    // 水平距离
    const horizontalDistance = this.getDistance([
      new mars3d.LngLatPoint(start.lng, start.lat, 0),
      new mars3d.LngLatPoint(end.lng, end.lat, 0),
    ])

    // 垂直距离
    const verticalDistance = Math.abs(end.alt - start.alt)

    // 斜距
    const slopeDistance = this.getDistance([start, end])

    return {
      horizontal: horizontalDistance,
      vertical: verticalDistance,
      slope: slopeDistance,
      angle: (Math.atan2(verticalDistance, horizontalDistance) * 180) / Math.PI,
    }
  }

  // 角度测量
  static measureAngle(centerPosition, startPosition, endPosition) {
    // centerPosition: Array - 角点位置
    // startPosition: Array - 起始边位置
    // endPosition: Array - 结束边位置
    // 返回: number - 角度（度）

    const center = mars3d.LngLatPoint.fromArray(centerPosition).toCartesian()
    const start = mars3d.LngLatPoint.fromArray(startPosition).toCartesian()
    const end = mars3d.LngLatPoint.fromArray(endPosition).toCartesian()

    // 计算向量
    const vector1 = mars3d.Cesium.Cartesian3.subtract(start, center, new mars3d.Cesium.Cartesian3())
    const vector2 = mars3d.Cesium.Cartesian3.subtract(end, center, new mars3d.Cesium.Cartesian3())

    // 计算夹角
    const dot = mars3d.Cesium.Cartesian3.dot(vector1, vector2)
    const magnitude1 = mars3d.Cesium.Cartesian3.magnitude(vector1)
    const magnitude2 = mars3d.Cesium.Cartesian3.magnitude(vector2)

    const cosAngle = dot / (magnitude1 * magnitude2)
    const angle = Math.acos(mars3d.Cesium.Math.clamp(cosAngle, -1, 1))

    return mars3d.Util.toDegrees(angle)
  }

  // 坡度计算
  static calculateSlope(positions) {
    // positions: Array - 地形剖面位置数组
    // 返回: Array - 坡度数组（百分比）

    const slopes = []

    for (let i = 0; i < positions.length - 1; i++) {
      const point1 = mars3d.LngLatPoint.fromArray(positions[i])
      const point2 = mars3d.LngLatPoint.fromArray(positions[i + 1])

      const horizontalDistance = this.getDistance([
        new mars3d.LngLatPoint(point1.lng, point1.lat, 0),
        new mars3d.LngLatPoint(point2.lng, point2.lat, 0),
      ])

      const verticalDistance = point2.alt - point1.alt
      const slope = (verticalDistance / horizontalDistance) * 100

      slopes.push({
        distance: horizontalDistance,
        elevation: verticalDistance,
        slope: slope,
        angle: (Math.atan(slope / 100) * 180) / Math.PI,
      })
    }

    return slopes
  }

  // 两点间距离计算
  static getDistance(positions) {
    if (positions.length < 2) return 0

    let totalDistance = 0

    for (let i = 0; i < positions.length - 1; i++) {
      const point1 = positions[i]
      const point2 = positions[i + 1]

      const cartesian1 = point1.toCartesian
        ? point1.toCartesian()
        : mars3d.LngLatPoint.fromArray(point1).toCartesian()
      const cartesian2 = point2.toCartesian
        ? point2.toCartesian()
        : mars3d.LngLatPoint.fromArray(point2).toCartesian()

      const distance = mars3d.Cesium.Cartesian3.distance(cartesian1, cartesian2)
      totalDistance += distance
    }

    return totalDistance
  }

  // 格式化距离显示
  static formatDistance(distance) {
    if (distance < 1000) {
      return distance.toFixed(2) + ' 米'
    } else if (distance < 1000000) {
      return (distance / 1000).toFixed(2) + ' 千米'
    } else {
      return (distance / 1000000).toFixed(2) + ' 兆米'
    }
  }

  // 格式化面积显示
  static formatArea(area) {
    if (area < 10000) {
      return area.toFixed(2) + ' 平方米'
    } else if (area < 1000000) {
      return (area / 10000).toFixed(2) + ' 公顷'
    } else {
      return (area / 1000000).toFixed(2) + ' 平方千米'
    }
  }
}

// 可视域分析
class ViewshedAnalysis {
  constructor(map) {
    this.map = map
    this.viewer = map.viewer
  }

  // 计算可视域
  calculateViewshed(options) {
    // options: Object
    // viewPosition: Array - 观察点位置 [lng,lat,alt]
    // targetPositions: Array - 目标点位置数组
    // maxDistance: number - 最大可视距离
    // verticalAngle: number - 垂直视角范围（度）
    // horizontalAngle: number - 水平视角范围（度）

    const viewPoint = mars3d.LngLatPoint.fromArray(options.viewPosition)
    const maxDistance = options.maxDistance || 10000
    const results = []

    options.targetPositions.forEach((targetPos, index) => {
      const targetPoint = mars3d.LngLatPoint.fromArray(targetPos)

      // 计算距离
      const distance = MeasureUtil.getDistance([viewPoint, targetPoint])

      if (distance > maxDistance) {
        results.push({
          index: index,
          position: targetPos,
          visible: false,
          reason: '超出最大可视距离',
          distance: distance,
        })
        return
      }

      // 射线检测
      const startCartesian = viewPoint.toCartesian()
      const endCartesian = targetPoint.toCartesian()

      const ray = new mars3d.Cesium.Ray(
        startCartesian,
        mars3d.Cesium.Cartesian3.subtract(
          endCartesian,
          startCartesian,
          new mars3d.Cesium.Cartesian3(),
        ),
      )

      // 检测与地形或模型的交点
      const intersection = this.viewer.scene.pickFromRay(ray)

      let visible = true
      let reason = ''

      if (intersection && intersection.position) {
        const intersectionDistance = mars3d.Cesium.Cartesian3.distance(
          startCartesian,
          intersection.position,
        )

        if (intersectionDistance < distance * 0.95) {
          // 允许5%的误差
          visible = false
          reason = '被地形或建筑遮挡'
        }
      }

      results.push({
        index: index,
        position: targetPos,
        visible: visible,
        reason: reason,
        distance: distance,
      })
    })

    return results
  }

  // 创建可视域锥体
  createViewshedCone(options) {
    // options: Object - 可视域参数
    const position = mars3d.LngLatPoint.fromArray(options.viewPosition)

    return new mars3d.graphic.CylinderEntity({
      position: options.viewPosition,
      style: {
        length: options.maxDistance || 5000,
        topRadius: 0,
        bottomRadius:
          Math.tan(mars3d.Util.toRadians(options.horizontalAngle || 45)) *
          (options.maxDistance || 5000),
        material: mars3d.Cesium.Color.fromCssColorString(options.color || '#ffff00').withAlpha(0.3),
        outline: true,
        outlineColor: options.color || '#ffff00',
      },
    })
  }
}

// 剖面分析
class ProfileAnalysis {
  constructor(map) {
    this.map = map
    this.viewer = map.viewer
  }

  // 地形剖面分析
  analyzeTerrainProfile(startPosition, endPosition, options = {}) {
    // startPosition: Array - 起始位置
    // endPosition: Array - 结束位置
    // options: Object - 分析参数

    const start = mars3d.LngLatPoint.fromArray(startPosition)
    const end = mars3d.LngLatPoint.fromArray(endPosition)

    const sampleCount = options.sampleCount || 100
    const profilePoints = []

    // 生成剖面采样点
    for (let i = 0; i <= sampleCount; i++) {
      const t = i / sampleCount
      const lng = start.lng + (end.lng - start.lng) * t
      const lat = start.lat + (end.lat - start.lat) * t

      // 获取地形高度
      const cartographic = mars3d.Cesium.Cartographic.fromDegrees(lng, lat)
      const height = this.viewer.scene.globe.getHeight(cartographic) || 0

      const distance = MeasureUtil.getDistance([start, new mars3d.LngLatPoint(lng, lat, 0)])

      profilePoints.push({
        position: [lng, lat, height],
        distance: distance,
        elevation: height,
      })
    }

    return {
      points: profilePoints,
      totalDistance: MeasureUtil.getDistance([start, end]),
      elevationRange: {
        min: Math.min(...profilePoints.map((p) => p.elevation)),
        max: Math.max(...profilePoints.map((p) => p.elevation)),
      },
      slopes: MeasureUtil.calculateSlope(profilePoints.map((p) => p.position)),
    }
  }

  // 创建剖面图
  createProfileChart(profileData, containerId) {
    // 使用图表库绘制剖面图（以echarts为例）
    const chartData = profileData.points.map((point) => [point.distance, point.elevation])

    const option = {
      title: {
        text: '地形剖面图',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const point = params[0]
          return `距离: ${(point.data[0] / 1000).toFixed(2)}km<br/>高程: ${point.data[1].toFixed(2)}m`
        },
      },
      xAxis: {
        type: 'value',
        name: '距离(m)',
        axisLabel: {
          formatter: function (value) {
            return (value / 1000).toFixed(1) + 'km'
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '高程(m)',
      },
      series: [
        {
          type: 'line',
          data: chartData,
          smooth: true,
          areaStyle: {
            color: 'rgba(124, 181, 236, 0.3)',
          },
          lineStyle: {
            color: '#7cb5ec',
          },
        },
      ],
    }

    // 假设已引入echarts
    if (typeof echarts !== 'undefined') {
      const chart = echarts.init(document.getElementById(containerId))
      chart.setOption(option)

      // 返回图表实例以便后续操作
      return chart
    }

    return null
  }
}

// 洪水淹没分析
class FloodAnalysis {
  constructor(map) {
    this.map = map
    this.viewer = map.viewer
    this.floodEntity = null
  }

  // 创建洪水淹没分析
  createFloodAnalysis(options) {
    // options: Object
    // bounds: Array - 分析范围 [xmin, ymin, xmax, ymax]
    // waterLevel: number - 水位高度
    // baseHeight: number - 基准高度

    const bounds = options.bounds
    const waterLevel = options.waterLevel || 100
    const baseHeight = options.baseHeight || 0

    // 创建水体面
    const positions = [
      [bounds[0], bounds[1], waterLevel],
      [bounds[2], bounds[1], waterLevel],
      [bounds[2], bounds[3], waterLevel],
      [bounds[0], bounds[3], waterLevel],
    ]

    this.floodEntity = new mars3d.graphic.PolygonEntity({
      positions: positions,
      style: {
        material: {
          type: 'Water',
          baseWaterColor: '#006ab4',
          frequency: 100,
          animationSpeed: 0.01,
          amplitude: 1.0,
          specularIntensity: 0.8,
        },
        opacity: 0.7,
        clampToGround: false,
        height: waterLevel,
      },
      attr: {
        type: 'flood',
        waterLevel: waterLevel,
      },
    })

    return this.floodEntity
  }

  // 动态调整水位
  setWaterLevel(level) {
    if (this.floodEntity) {
      this.floodEntity.attr.waterLevel = level

      // 更新多边形高度
      const newPositions = this.floodEntity.positions.map((pos) => {
        return [pos[0], pos[1], level]
      })

      this.floodEntity.positions = newPositions
      this.floodEntity.style.height = level
      this.floodEntity.updateStyle()
    }
  }

  // 计算淹没体积
  calculateFloodVolume(bounds, waterLevel, terrainData) {
    // 简化计算：将区域分割为网格，计算每个网格的淹没体积
    const gridSize = 100 // 网格大小（米）
    const width = bounds[2] - bounds[0]
    const height = bounds[3] - bounds[1]

    const gridCountX = Math.ceil((width * 111320) / gridSize) // 经度转米的近似值
    const gridCountY = Math.ceil((height * 110540) / gridSize) // 纬度转米的近似值

    let totalVolume = 0

    for (let i = 0; i < gridCountX; i++) {
      for (let j = 0; j < gridCountY; j++) {
        const lng = bounds[0] + (width * i) / gridCountX
        const lat = bounds[1] + (height * j) / gridCountY

        // 获取地形高度
        const cartographic = mars3d.Cesium.Cartographic.fromDegrees(lng, lat)
        const terrainHeight = this.viewer.scene.globe.getHeight(cartographic) || 0

        if (waterLevel > terrainHeight) {
          const depth = waterLevel - terrainHeight
          const cellArea = gridSize * gridSize
          totalVolume += depth * cellArea
        }
      }
    }

    return totalVolume
  }
}

// 分析工具使用示例

// 测量功能示例
const measureTool = new MeasureUtil()

// 距离测量
const positions = [
  [117.2, 31.79, 0],
  [117.21, 31.8, 100],
  [117.22, 31.79, 200],
]

const distance = MeasureUtil.measureDistance(positions)
console.log('总距离:', MeasureUtil.formatDistance(distance))

// 面积测量
const areaPositions = [
  [117.18, 31.78],
  [117.19, 31.78],
  [117.19, 31.79],
  [117.18, 31.79],
]

const area = MeasureUtil.measureArea(areaPositions)
console.log('面积:', MeasureUtil.formatArea(area))

// 可视域分析示例
const viewshed = new ViewshedAnalysis(map)

const viewshedResults = viewshed.calculateViewshed({
  viewPosition: [117.207, 31.794, 100],
  targetPositions: [
    [117.21, 31.8, 50],
    [117.22, 31.79, 80],
    [117.2, 31.785, 60],
  ],
  maxDistance: 5000,
  horizontalAngle: 60,
  verticalAngle: 30,
})

console.log('可视域分析结果:', viewshedResults)

// 剖面分析示例
const profile = new ProfileAnalysis(map)

const profileData = profile.analyzeTerrainProfile([117.2, 31.79, 0], [117.22, 31.8, 0], {
  sampleCount: 50,
})

console.log('剖面分析结果:', profileData)

// 洪水分析示例
const flood = new FloodAnalysis(map)

const floodEntity = flood.createFloodAnalysis({
  bounds: [117.18, 31.78, 117.22, 31.8],
  waterLevel: 50,
  baseHeight: 0,
})

graphicLayer.addGraphic(floodEntity)

// 动态调整水位
setTimeout(() => {
  flood.setWaterLevel(80)
}, 3000)
```

## 控件系统详解

### 基础控件

```javascript
// 控件基类
class BaseControl {
  constructor(options = {}) {
    // position: string
    // 作用: 控件位置
    // 选项: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
    this.position = options.position || 'top-right'

    // className: string
    // 作用: CSS类名
    this.className = options.className || ''

    // style: Object
    // 作用: 内联样式
    this.style = options.style || {}

    // visible: boolean
    // 作用: 是否可见
    this.visible = options.visible !== undefined ? options.visible : true

    // enabled: boolean
    // 作用: 是否启用
    this.enabled = options.enabled !== undefined ? options.enabled : true

    this.domElement = null
    this.map = null
  }

  // 添加到地图
  addTo(map) {
    this.map = map
    this.onCreate()
    this.bindEvents()
    return this
  }

  // 从地图移除
  remove() {
    if (this.domElement && this.domElement.parentNode) {
      this.domElement.parentNode.removeChild(this.domElement)
    }
    this.unbindEvents()
    this.map = null
    return this
  }

  // 创建DOM元素
  onCreate() {
    this.domElement = document.createElement('div')
    this.domElement.className = `mars3d-control ${this.className}`

    // 应用样式
    Object.assign(this.domElement.style, {
      position: 'absolute',
      zIndex: 1000,
      ...this.style,
    })

    // 设置位置
    this.setPosition(this.position)

    // 添加到地图容器
    this.map.container.appendChild(this.domElement)
  }

  // 设置位置
  setPosition(position) {
    this.position = position

    if (this.domElement) {
      // 清除所有位置样式
      this.domElement.style.top = ''
      this.domElement.style.right = ''
      this.domElement.style.bottom = ''
      this.domElement.style.left = ''

      // 根据位置设置样式
      switch (position) {
        case 'top-left':
          this.domElement.style.top = '10px'
          this.domElement.style.left = '10px'
          break
        case 'top-right':
          this.domElement.style.top = '10px'
          this.domElement.style.right = '10px'
          break
        case 'bottom-left':
          this.domElement.style.bottom = '10px'
          this.domElement.style.left = '10px'
          break
        case 'bottom-right':
          this.domElement.style.bottom = '10px'
          this.domElement.style.right = '10px'
          break
        case 'center':
          this.domElement.style.top = '50%'
          this.domElement.style.left = '50%'
          this.domElement.style.transform = 'translate(-50%, -50%)'
          break
      }
    }
  }

  // 显示控件
  show() {
    this.visible = true
    if (this.domElement) {
      this.domElement.style.display = 'block'
    }
  }

  // 隐藏控件
  hide() {
    this.visible = false
    if (this.domElement) {
      this.domElement.style.display = 'none'
    }
  }

  // 启用控件
  enable() {
    this.enabled = true
    if (this.domElement) {
      this.domElement.style.pointerEvents = 'auto'
      this.domElement.style.opacity = '1'
    }
  }

  // 禁用控件
  disable() {
    this.enabled = false
    if (this.domElement) {
      this.domElement.style.pointerEvents = 'none'
      this.domElement.style.opacity = '0.5'
    }
  }

  // 绑定事件
  bindEvents() {
    // 子类实现
  }

  // 解绑事件
  unbindEvents() {
    // 子类实现
  }
}

// 工具栏控件
class ToolbarControl extends BaseControl {
  constructor(options = {}) {
    super(options)

    // tools: Array
    // 作用: 工具配置数组
    this.tools = options.tools || []

    // orientation: string
    // 作用: 工具栏方向
    // 选项: 'horizontal', 'vertical'
    this.orientation = options.orientation || 'horizontal'

    this.activeToolId = null
  }

  onCreate() {
    super.onCreate()

    this.domElement.className += ' mars3d-toolbar'
    this.domElement.style.display = 'flex'
    this.domElement.style.flexDirection = this.orientation === 'horizontal' ? 'row' : 'column'
    this.domElement.style.backgroundColor = 'rgba(42, 42, 42, 0.8)'
    this.domElement.style.borderRadius = '4px'
    this.domElement.style.padding = '5px'

    this.createTools()
  }

  createTools() {
    this.tools.forEach((tool) => {
      const button = document.createElement('button')
      button.id = tool.id
      button.title = tool.title || ''
      button.innerHTML = tool.icon || tool.text || ''
      button.className = 'mars3d-toolbar-button'

      // 按钮样式
      Object.assign(button.style, {
        width: '32px',
        height: '32px',
        margin: '2px',
        border: 'none',
        borderRadius: '3px',
        backgroundColor: 'transparent',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
      })

      // 悬停效果
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
      })

      button.addEventListener('mouseleave', () => {
        if (this.activeToolId !== tool.id) {
          button.style.backgroundColor = 'transparent'
        }
      })

      // 点击事件
      button.addEventListener('click', () => {
        this.activateTool(tool.id)
        if (tool.callback) {
          tool.callback(tool, this.map)
        }
      })

      this.domElement.appendChild(button)
    })
  }

  // 激活工具
  activateTool(toolId) {
    // 重置所有按钮状态
    const buttons = this.domElement.querySelectorAll('.mars3d-toolbar-button')
    buttons.forEach((btn) => {
      btn.style.backgroundColor = 'transparent'
    })

    // 设置当前激活工具
    this.activeToolId = toolId
    const activeButton = this.domElement.querySelector(`#${toolId}`)
    if (activeButton) {
      activeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
    }
  }

  // 添加工具
  addTool(tool) {
    this.tools.push(tool)
    this.createTools()
  }

  // 移除工具
  removeTool(toolId) {
    this.tools = this.tools.filter((tool) => tool.id !== toolId)
    const button = this.domElement.querySelector(`#${toolId}`)
    if (button) {
      button.remove()
    }
  }
}

// 图层控制器
class LayerControl extends BaseControl {
  constructor(options = {}) {
    super(options)

    // title: string
    // 作用: 控件标题
    this.title = options.title || '图层控制'

    // collapsible: boolean
    // 作用: 是否可折叠
    this.collapsible = options.collapsible !== undefined ? options.collapsible : true

    // collapsed: boolean
    // 作用: 初始是否折叠
    this.collapsed = options.collapsed !== undefined ? options.collapsed : false

    this.layers = []
  }

  onCreate() {
    super.onCreate()

    this.domElement.className += ' mars3d-layer-control'
    this.domElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    this.domElement.style.borderRadius = '4px'
    this.domElement.style.color = '#ffffff'
    this.domElement.style.minWidth = '200px'
    this.domElement.style.maxHeight = '300px'
    this.domElement.style.overflow = 'hidden'

    this.createHeader()
    this.createContent()

    if (this.collapsed) {
      this.collapse()
    }
  }

  createHeader() {
    this.headerElement = document.createElement('div')
    this.headerElement.className = 'layer-control-header'
    this.headerElement.style.padding = '8px 12px'
    this.headerElement.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)'
    this.headerElement.style.cursor = this.collapsible ? 'pointer' : 'default'
    this.headerElement.style.display = 'flex'
    this.headerElement.style.justifyContent = 'space-between'
    this.headerElement.style.alignItems = 'center'

    const titleElement = document.createElement('span')
    titleElement.textContent = this.title
    this.headerElement.appendChild(titleElement)

    if (this.collapsible) {
      this.toggleButton = document.createElement('span')
      this.toggleButton.innerHTML = '▼'
      this.toggleButton.style.transition = 'transform 0.3s'
      this.headerElement.appendChild(this.toggleButton)

      this.headerElement.addEventListener('click', () => {
        this.toggle()
      })
    }

    this.domElement.appendChild(this.headerElement)
  }

  createContent() {
    this.contentElement = document.createElement('div')
    this.contentElement.className = 'layer-control-content'
    this.contentElement.style.padding = '8px'
    this.contentElement.style.maxHeight = '250px'
    this.contentElement.style.overflowY = 'auto'

    this.domElement.appendChild(this.contentElement)
  }

  // 添加图层到控制器
  addLayer(layer) {
    this.layers.push(layer)
    this.createLayerItem(layer)
  }

  // 移除图层
  removeLayer(layer) {
    this.layers = this.layers.filter((l) => l !== layer)
    const item = this.contentElement.querySelector(`[data-layer-id="${layer.id}"]`)
    if (item) {
      item.remove()
    }
  }

  // 创建图层项
  createLayerItem(layer) {
    const item = document.createElement('div')
    item.className = 'layer-item'
    item.setAttribute('data-layer-id', layer.id)
    item.style.padding = '4px 0'
    item.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)'
    item.style.display = 'flex'
    item.style.alignItems = 'center'

    // 复选框
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = layer.show
    checkbox.style.marginRight = '8px'
    checkbox.addEventListener('change', () => {
      layer.show = checkbox.checked
    })

    // 图层名称
    const label = document.createElement('label')
    label.textContent = layer.name
    label.style.flex = '1'
    label.style.cursor = 'pointer'
    label.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked
      checkbox.dispatchEvent(new Event('change'))
    })

    // 透明度滑块
    const opacitySlider = document.createElement('input')
    opacitySlider.type = 'range'
    opacitySlider.min = '0'
    opacitySlider.max = '100'
    opacitySlider.value = (layer.alpha || 1) * 100
    opacitySlider.style.width = '60px'
    opacitySlider.style.marginLeft = '8px'
    opacitySlider.addEventListener('input', () => {
      if (layer.setOpacity) {
        layer.setOpacity(opacitySlider.value / 100)
      }
    })

    item.appendChild(checkbox)
    item.appendChild(label)
    item.appendChild(opacitySlider)

    this.contentElement.appendChild(item)
  }

  // 折叠/展开
  toggle() {
    if (this.collapsed) {
      this.expand()
    } else {
      this.collapse()
    }
  }

  // 展开
  expand() {
    this.collapsed = false
    this.contentElement.style.display = 'block'
    if (this.toggleButton) {
      this.toggleButton.style.transform = 'rotate(0deg)'
    }
  }

  // 折叠
  collapse() {
    this.collapsed = true
    this.contentElement.style.display = 'none'
    if (this.toggleButton) {
      this.toggleButton.style.transform = 'rotate(-90deg)'
    }
  }
}

// 指南针控件
class CompassControl extends BaseControl {
  constructor(options = {}) {
    super(options)

    // size: number
    // 作用: 指南针大小
    this.size = options.size || 60

    this.isRotating = false
  }

  onCreate() {
    super.onCreate()

    this.domElement.className += ' mars3d-compass'
    this.domElement.style.width = this.size + 'px'
    this.domElement.style.height = this.size + 'px'
    this.domElement.style.borderRadius = '50%'
    this.domElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    this.domElement.style.border = '2px solid rgba(255, 255, 255, 0.3)'
    this.domElement.style.cursor = 'pointer'
    this.domElement.style.display = 'flex'
    this.domElement.style.alignItems = 'center'
    this.domElement.style.justifyContent = 'center'
    this.domElement.style.transition = 'transform 0.3s'

    // 创建指针
    this.needle = document.createElement('div')
    this.needle.style.width = '2px'
    this.needle.style.height = this.size * 0.7 + 'px'
    this.needle.style.backgroundColor = '#ff0000'
    this.needle.style.position = 'relative'
    this.needle.style.transformOrigin = 'center bottom'

    // 添加北标识
    const northMark = document.createElement('div')
    northMark.textContent = 'N'
    northMark.style.position = 'absolute'
    northMark.style.top = '5px'
    northMark.style.left = '50%'
    northMark.style.transform = 'translateX(-50%)'
    northMark.style.color = '#ffffff'
    northMark.style.fontSize = '12px'
    northMark.style.fontWeight = 'bold'

    this.domElement.appendChild(this.needle)
    this.domElement.appendChild(northMark)
  }

  bindEvents() {
    // 监听相机变化
    this.map.on('cameraChanged', this.updateCompass.bind(this))

    // 点击重置方向
    this.domElement.addEventListener('click', () => {
      this.resetNorth()
    })
  }

  // 更新指南针方向
  updateCompass() {
    if (this.isRotating) return

    const heading = this.map.camera.heading
    const rotation = -mars3d.Util.toDegrees(heading)

    this.domElement.style.transform = `rotate(${rotation}deg)`
  }

  // 重置到北方
  resetNorth() {
    this.isRotating = true

    const currentPosition = this.map.camera.position

    this.map.camera.flyTo({
      destination: currentPosition,
      orientation: {
        heading: 0,
        pitch: this.map.camera.pitch,
        roll: this.map.camera.roll,
      },
      duration: 1,
      complete: () => {
        this.isRotating = false
      },
    })
  }
}

// 控件使用示例

// 创建工具栏
const toolbar = new ToolbarControl({
  position: 'top-left',
  orientation: 'horizontal',
  tools: [
    {
      id: 'measure-distance',
      title: '距离测量',
      icon: '📏',
      callback: (tool, map) => {
        console.log('开始距离测量')
        // 启动距离测量工具
      },
    },
    {
      id: 'measure-area',
      title: '面积测量',
      icon: '📐',
      callback: (tool, map) => {
        console.log('开始面积测量')
        // 启动面积测量工具
      },
    },
    {
      id: 'draw-point',
      title: '画点',
      icon: '📍',
      callback: (tool, map) => {
        console.log('开始画点')
        // 启动画点工具
      },
    },
    {
      id: 'draw-line',
      title: '画线',
      icon: '📝',
      callback: (tool, map) => {
        console.log('开始画线')
        // 启动画线工具
      },
    },
  ],
})

toolbar.addTo(map)

// 创建图层控制器
const layerControl = new LayerControl({
  position: 'top-right',
  title: '图层管理',
  collapsible: true,
  collapsed: false,
})

layerControl.addTo(map)

// 添加图层到控制器
map.eachLayer((layer) => {
  layerControl.addLayer(layer)
})

// 创建指南针
const compass = new CompassControl({
  position: 'bottom-right',
  size: 50,
})

compass.addTo(map)

// 动态添加工具
toolbar.addTool({
  id: 'clear-all',
  title: '清除所有',
  icon: '🗑️',
  callback: (tool, map) => {
    // 清除所有绘制内容
    map.eachLayer((layer) => {
      if (layer.clear) {
        layer.clear()
      }
    })
  },
})
```

继续完善剩余章节...

## 绘制功能详解

### 绘制工具基类

```javascript
// 绘制工具基类
class DrawTool {
  constructor(map, options = {}) {
    this.map = map
    this.viewer = map.viewer
    this.scene = map.scene
    this.camera = map.camera

    // type: string
    // 作用: 绘制类型
    // 选项: 'point', 'polyline', 'polygon', 'rectangle', 'circle', 'ellipse'
    this.type = options.type || 'point'

    // style: Object
    // 作用: 绘制样式
    this.style = options.style || {}

    // clampToGround: boolean
    // 作用: 是否贴地
    this.clampToGround = options.clampToGround !== undefined ? options.clampToGround : true

    // hasMidPoint: boolean
    // 作用: 是否显示中间点
    this.hasMidPoint = options.hasMidPoint !== undefined ? options.hasMidPoint : false

    // hasEdit: boolean
    // 作用: 绘制完成后是否可编辑
    this.hasEdit = options.hasEdit !== undefined ? options.hasEdit : true

    // addHeight: number
    // 作用: 增加的高度偏移
    this.addHeight = options.addHeight || 0

    this.isDrawing = false
    this.drawingPositions = []
    this.drawingGraphic = null
    this.tempGraphics = []
    this.handler = null
  }

  // 开始绘制
  start() {
    if (this.isDrawing) {
      this.stop()
    }

    this.isDrawing = true
    this.drawingPositions = []
    this.tempGraphics = []

    this.createHandler()
    this.bindEvents()

    // 改变鼠标样式
    this.viewer.canvas.style.cursor = 'crosshair'

    // 触发开始绘制事件
    this.fire('drawStart', { type: this.type })
  }

  // 停止绘制
  stop() {
    if (!this.isDrawing) return

    this.isDrawing = false
    this.unbindEvents()

    // 清理临时图形
    this.clearTempGraphics()

    // 恢复鼠标样式
    this.viewer.canvas.style.cursor = 'default'

    // 触发停止绘制事件
    this.fire('drawStop')
  }

  // 创建事件处理器
  createHandler() {
    this.handler = new mars3d.Cesium.ScreenSpaceEventHandler(this.viewer.canvas)
  }

  // 绑定事件
  bindEvents() {
    // 鼠标左键点击
    this.handler.setInputAction((click) => {
      const position = this.getPickPosition(click.position)
      if (position) {
        this.addPosition(position)
      }
    }, mars3d.Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 鼠标移动
    this.handler.setInputAction((movement) => {
      if (this.drawingPositions.length > 0) {
        const position = this.getPickPosition(movement.endPosition)
        if (position) {
          this.updateDrawing(position)
        }
      }
    }, mars3d.Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 鼠标右键结束绘制
    this.handler.setInputAction((click) => {
      this.finishDrawing()
    }, mars3d.Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    // 双击结束绘制
    this.handler.setInputAction((click) => {
      this.finishDrawing()
    }, mars3d.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }

  // 解绑事件
  unbindEvents() {
    if (this.handler) {
      this.handler.destroy()
      this.handler = null
    }
  }

  // 获取拾取位置
  getPickPosition(screenPosition) {
    let cartesian

    if (this.clampToGround) {
      // 贴地模式：拾取地形
      const ray = this.camera.getPickRay(screenPosition)
      cartesian = this.scene.globe.pick(ray, this.scene)
    } else {
      // 空间模式：拾取椭球面
      cartesian = this.camera.pickEllipsoid(screenPosition, this.scene.globe.ellipsoid)
    }

    if (cartesian) {
      // 转换为经纬度坐标
      const cartographic = mars3d.Cesium.Cartographic.fromCartesian(cartesian)
      const lng = mars3d.Cesium.Math.toDegrees(cartographic.longitude)
      const lat = mars3d.Cesium.Math.toDegrees(cartographic.latitude)
      const alt = cartographic.height + this.addHeight

      return [lng, lat, alt]
    }

    return null
  }

  // 添加位置点
  addPosition(position) {
    this.drawingPositions.push(position)

    // 创建或更新绘制图形
    this.createOrUpdateGraphic()

    // 触发添加点事件
    this.fire('addPosition', { position, positions: this.drawingPositions.slice() })
  }

  // 更新绘制过程
  updateDrawing(position) {
    if (this.drawingPositions.length === 0) return

    // 创建临时位置数组
    const tempPositions = this.drawingPositions.slice()
    tempPositions.push(position)

    // 更新临时图形
    this.updateTempGraphic(tempPositions)
  }

  // 完成绘制
  finishDrawing() {
    if (this.drawingPositions.length < this.getMinPositionCount()) {
      console.warn(`${this.type}绘制至少需要${this.getMinPositionCount()}个点`)
      return
    }

    // 创建最终图形
    const graphic = this.createFinalGraphic()

    // 清理临时图形
    this.clearTempGraphics()

    // 停止绘制
    this.stop()

    // 触发完成绘制事件
    this.fire('drawComplete', {
      graphic,
      positions: this.drawingPositions.slice(),
      type: this.type,
    })

    return graphic
  }

  // 获取最小位置点数量
  getMinPositionCount() {
    switch (this.type) {
      case 'point':
        return 1
      case 'polyline':
        return 2
      case 'polygon':
        return 3
      case 'rectangle':
        return 2
      case 'circle':
        return 2
      case 'ellipse':
        return 2
      default:
        return 1
    }
  }

  // 创建或更新图形（子类实现）
  createOrUpdateGraphic() {
    // 子类实现具体逻辑
  }

  // 更新临时图形（子类实现）
  updateTempGraphic(positions) {
    // 子类实现具体逻辑
  }

  // 创建最终图形（子类实现）
  createFinalGraphic() {
    // 子类实现具体逻辑
  }

  // 清理临时图形
  clearTempGraphics() {
    this.tempGraphics.forEach((graphic) => {
      if (graphic.remove) {
        graphic.remove()
      }
    })
    this.tempGraphics = []
  }

  // 事件处理
  fire(eventType, data = {}) {
    if (this.map && this.map.fire) {
      this.map.fire(`draw${eventType}`, data)
    }
  }
}

// 点绘制工具
class DrawPoint extends DrawTool {
  constructor(map, options = {}) {
    super(map, { ...options, type: 'point' })

    // 默认点样式
    this.style = Object.assign(
      {
        color: '#ffff00',
        pixelSize: 12,
        outlineColor: '#000000',
        outlineWidth: 2,
        heightReference: this.clampToGround ? 1 : 0, // CLAMP_TO_GROUND : NONE
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      options.style,
    )
  }

  addPosition(position) {
    this.drawingPositions = [position] // 点只需要一个位置

    // 直接完成绘制
    this.finishDrawing()
  }

  createFinalGraphic() {
    const position = this.drawingPositions[0]

    const graphic = new mars3d.graphic.PointEntity({
      position: position,
      style: this.style,
      attr: {
        type: 'draw-point',
        drawType: this.type,
      },
    })

    return graphic
  }
}

// 线绘制工具
class DrawPolyline extends DrawTool {
  constructor(map, options = {}) {
    super(map, { ...options, type: 'polyline' })

    // 默认线样式
    this.style = Object.assign(
      {
        color: '#ffff00',
        width: 3,
        opacity: 1.0,
        clampToGround: this.clampToGround,
        outline: false,
        outlineColor: '#000000',
        outlineWidth: 1,
        lineType: 'solid', // solid, dash, dot, dashdot, longdash
        materialType: 'Color', // Color, PolylineGlow, PolylineArrow, PolylineDash
        materialOptions: {},
      },
      options.style,
    )
  }

  createOrUpdateGraphic() {
    if (this.drawingPositions.length < 2) return

    if (!this.drawingGraphic) {
      this.drawingGraphic = new mars3d.graphic.PolylineEntity({
        positions: this.drawingPositions,
        style: this.style,
        attr: {
          type: 'draw-polyline-temp',
          drawType: this.type,
        },
      })

      // 添加到临时图形数组
      this.tempGraphics.push(this.drawingGraphic)
    } else {
      this.drawingGraphic.positions = this.drawingPositions
    }
  }

  updateTempGraphic(positions) {
    if (positions.length < 2) return

    if (this.drawingGraphic) {
      this.drawingGraphic.positions = positions
    }
  }

  createFinalGraphic() {
    const graphic = new mars3d.graphic.PolylineEntity({
      positions: this.drawingPositions,
      style: this.style,
      attr: {
        type: 'draw-polyline',
        drawType: this.type,
      },
    })

    // 如果需要编辑功能
    if (this.hasEdit) {
      graphic.hasEdit = true
    }

    return graphic
  }
}

// 面绘制工具
class DrawPolygon extends DrawTool {
  constructor(map, options = {}) {
    super(map, { ...options, type: 'polygon' })

    // 默认面样式
    this.style = Object.assign(
      {
        color: '#ffff00',
        opacity: 0.6,
        outline: true,
        outlineColor: '#ffffff',
        outlineWidth: 2,
        outlineOpacity: 1.0,
        fill: true,
        clampToGround: this.clampToGround,
        height: 0,
        extrudedHeight: undefined,
        materialType: 'Color',
        materialOptions: {},
      },
      options.style,
    )
  }

  createOrUpdateGraphic() {
    if (this.drawingPositions.length < 3) return

    if (!this.drawingGraphic) {
      this.drawingGraphic = new mars3d.graphic.PolygonEntity({
        positions: this.drawingPositions,
        style: this.style,
        attr: {
          type: 'draw-polygon-temp',
          drawType: this.type,
        },
      })

      this.tempGraphics.push(this.drawingGraphic)
    } else {
      this.drawingGraphic.positions = this.drawingPositions
    }
  }

  updateTempGraphic(positions) {
    if (positions.length < 3) return

    if (this.drawingGraphic) {
      this.drawingGraphic.positions = positions
    }
  }

  createFinalGraphic() {
    const graphic = new mars3d.graphic.PolygonEntity({
      positions: this.drawingPositions,
      style: this.style,
      attr: {
        type: 'draw-polygon',
        drawType: this.type,
      },
    })

    if (this.hasEdit) {
      graphic.hasEdit = true
    }

    return graphic
  }
}

// 矩形绘制工具
class DrawRectangle extends DrawTool {
  constructor(map, options = {}) {
    super(map, { ...options, type: 'rectangle' })

    this.style = Object.assign(
      {
        color: '#ffff00',
        opacity: 0.6,
        outline: true,
        outlineColor: '#ffffff',
        outlineWidth: 2,
        clampToGround: this.clampToGround,
      },
      options.style,
    )
  }

  getMinPositionCount() {
    return 2 // 矩形需要对角两点
  }

  updateTempGraphic(positions) {
    if (positions.length < 2) return

    // 根据两个对角点计算矩形四个顶点
    const rectanglePositions = this.calculateRectanglePositions(
      positions[0],
      positions[positions.length - 1],
    )

    if (!this.drawingGraphic) {
      this.drawingGraphic = new mars3d.graphic.PolygonEntity({
        positions: rectanglePositions,
        style: this.style,
        attr: {
          type: 'draw-rectangle-temp',
          drawType: this.type,
        },
      })

      this.tempGraphics.push(this.drawingGraphic)
    } else {
      this.drawingGraphic.positions = rectanglePositions
    }
  }

  calculateRectanglePositions(startPos, endPos) {
    // 计算矩形四个顶点
    return [
      [startPos[0], startPos[1], startPos[2] || 0],
      [endPos[0], startPos[1], startPos[2] || 0],
      [endPos[0], endPos[1], endPos[2] || 0],
      [startPos[0], endPos[1], startPos[2] || 0],
    ]
  }

  createFinalGraphic() {
    const rectanglePositions = this.calculateRectanglePositions(
      this.drawingPositions[0],
      this.drawingPositions[1],
    )

    const graphic = new mars3d.graphic.PolygonEntity({
      positions: rectanglePositions,
      style: this.style,
      attr: {
        type: 'draw-rectangle',
        drawType: this.type,
        startPosition: this.drawingPositions[0],
        endPosition: this.drawingPositions[1],
      },
    })

    if (this.hasEdit) {
      graphic.hasEdit = true
    }

    return graphic
  }
}

// 圆形绘制工具
class DrawCircle extends DrawTool {
  constructor(map, options = {}) {
    super(map, { ...options, type: 'circle' })

    this.style = Object.assign(
      {
        color: '#ffff00',
        opacity: 0.6,
        outline: true,
        outlineColor: '#ffffff',
        outlineWidth: 2,
        clampToGround: this.clampToGround,
      },
      options.style,
    )

    // 圆形分段数
    this.segments = options.segments || 32
  }

  updateTempGraphic(positions) {
    if (positions.length < 2) return

    // 计算圆形位置
    const circlePositions = this.calculateCirclePositions(
      positions[0],
      positions[positions.length - 1],
    )

    if (!this.drawingGraphic) {
      this.drawingGraphic = new mars3d.graphic.PolygonEntity({
        positions: circlePositions,
        style: this.style,
        attr: {
          type: 'draw-circle-temp',
          drawType: this.type,
        },
      })

      this.tempGraphics.push(this.drawingGraphic)
    } else {
      this.drawingGraphic.positions = circlePositions
    }
  }

  calculateCirclePositions(centerPos, edgePos) {
    // 计算半径
    const radius = mars3d.MeasureUtil.getDistance([
      mars3d.LngLatPoint.fromArray(centerPos),
      mars3d.LngLatPoint.fromArray(edgePos),
    ])

    const positions = []
    const center = mars3d.LngLatPoint.fromArray(centerPos)

    // 生成圆形上的点
    for (let i = 0; i <= this.segments; i++) {
      const angle = (i / this.segments) * 2 * Math.PI

      // 计算偏移距离（简化计算，实际应考虑地球曲率）
      const offsetLng =
        (radius * Math.cos(angle)) / (111320 * Math.cos(mars3d.Util.toRadians(center.lat)))
      const offsetLat = (radius * Math.sin(angle)) / 110540

      positions.push([center.lng + offsetLng, center.lat + offsetLat, center.alt])
    }

    return positions
  }

  createFinalGraphic() {
    const circlePositions = this.calculateCirclePositions(
      this.drawingPositions[0],
      this.drawingPositions[1],
    )

    // 计算半径
    const radius = mars3d.MeasureUtil.getDistance([
      mars3d.LngLatPoint.fromArray(this.drawingPositions[0]),
      mars3d.LngLatPoint.fromArray(this.drawingPositions[1]),
    ])

    const graphic = new mars3d.graphic.PolygonEntity({
      positions: circlePositions,
      style: this.style,
      attr: {
        type: 'draw-circle',
        drawType: this.type,
        center: this.drawingPositions[0],
        radius: radius,
      },
    })

    if (this.hasEdit) {
      graphic.hasEdit = true
    }

    return graphic
  }
}
```

### 绘制管理器

```javascript
// 绘制管理器
class DrawManager {
  constructor(map, options = {}) {
    this.map = map
    this.options = options

    // 当前绘制工具
    this.currentTool = null

    // 绘制结果图层
    this.drawLayer =
      options.drawLayer ||
      new mars3d.layer.GraphicLayer({
        name: '绘制图层',
        hasEdit: true,
      })

    // 如果图层未添加到地图，则添加
    if (!this.drawLayer.isAdded) {
      this.map.addLayer(this.drawLayer)
    }

    // 绘制历史
    this.drawHistory = []

    // 绑定事件
    this.bindEvents()
  }

  // 绑定事件
  bindEvents() {
    // 监听绘制完成事件
    this.map.on('drawdrawComplete', (event) => {
      this.onDrawComplete(event.graphic, event.type, event.positions)
    })

    // 监听绘制开始事件
    this.map.on('drawdrawStart', (event) => {
      console.log('开始绘制:', event.type)
    })

    // 监听绘制停止事件
    this.map.on('drawdrawStop', () => {
      console.log('停止绘制')
    })
  }

  // 开始绘制
  startDraw(type, options = {}) {
    // 停止当前绘制
    this.stopDraw()

    // 创建对应的绘制工具
    switch (type) {
      case 'point':
        this.currentTool = new DrawPoint(this.map, options)
        break
      case 'polyline':
        this.currentTool = new DrawPolyline(this.map, options)
        break
      case 'polygon':
        this.currentTool = new DrawPolygon(this.map, options)
        break
      case 'rectangle':
        this.currentTool = new DrawRectangle(this.map, options)
        break
      case 'circle':
        this.currentTool = new DrawCircle(this.map, options)
        break
      default:
        console.warn('不支持的绘制类型:', type)
        return
    }

    // 开始绘制
    this.currentTool.start()
  }

  // 停止绘制
  stopDraw() {
    if (this.currentTool) {
      this.currentTool.stop()
      this.currentTool = null
    }
  }

  // 绘制完成处理
  onDrawComplete(graphic, type, positions) {
    // 添加到绘制图层
    this.drawLayer.addGraphic(graphic)

    // 添加到历史记录
    this.drawHistory.push({
      graphic: graphic,
      type: type,
      positions: positions,
      timestamp: new Date(),
    })

    // 触发自定义事件
    this.fire('drawComplete', { graphic, type, positions })

    console.log(`绘制完成: ${type}`, graphic)
  }

  // 删除指定图形
  deleteGraphic(graphic) {
    this.drawLayer.removeGraphic(graphic)

    // 从历史记录中移除
    this.drawHistory = this.drawHistory.filter((item) => item.graphic !== graphic)

    this.fire('graphicDeleted', { graphic })
  }

  // 清空所有绘制
  clear() {
    this.drawLayer.clear()
    this.drawHistory = []

    this.fire('drawCleared')
  }

  // 撤销上一步绘制
  undo() {
    if (this.drawHistory.length > 0) {
      const lastItem = this.drawHistory.pop()
      this.drawLayer.removeGraphic(lastItem.graphic)

      this.fire('drawUndo', { graphic: lastItem.graphic })
    }
  }

  // 获取绘制结果
  getDrawResults() {
    return this.drawHistory.map((item) => ({
      type: item.type,
      positions: item.positions,
      graphic: item.graphic,
      timestamp: item.timestamp,
    }))
  }

  // 导出为GeoJSON
  exportToGeoJSON() {
    return this.drawLayer.toGeoJSON()
  }

  // 从GeoJSON导入
  importFromGeoJSON(geojson, options = {}) {
    this.drawLayer.loadGeoJSON(geojson, options)
  }

  // 设置绘制样式
  setDrawStyle(type, style) {
    // 保存样式，用于下次绘制
    this.options[`${type}Style`] = style
  }

  // 启用/禁用编辑
  enableEdit(enabled = true) {
    this.drawLayer.hasEdit = enabled

    if (enabled) {
      this.drawLayer.enableEdit()
    } else {
      this.drawLayer.disableEdit()
    }
  }

  // 事件处理
  fire(eventType, data = {}) {
    if (this.map && this.map.fire) {
      this.map.fire(`drawManager${eventType}`, data)
    }
  }
}
```

### 绘制控件

```javascript
// 绘制控件
class DrawControl extends BaseControl {
  constructor(options = {}) {
    super(options)

    // 绘制管理器
    this.drawManager = null

    // 工具配置
    this.tools = options.tools || [
      { type: 'point', name: '点', icon: '📍' },
      { type: 'polyline', name: '线', icon: '📝' },
      { type: 'polygon', name: '面', icon: '🔲' },
      { type: 'rectangle', name: '矩形', icon: '⬛' },
      { type: 'circle', name: '圆', icon: '⭕' },
    ]

    // 当前激活的工具
    this.activeTool = null
  }

  onCreate() {
    super.onCreate()

    this.domElement.className += ' mars3d-draw-control'
    this.domElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    this.domElement.style.borderRadius = '4px'
    this.domElement.style.padding = '8px'
    this.domElement.style.display = 'flex'
    this.domElement.style.flexDirection = 'column'
    this.domElement.style.gap = '4px'

    // 创建绘制管理器
    this.drawManager = new DrawManager(this.map)

    this.createTools()
    this.createActions()
  }

  createTools() {
    const toolsContainer = document.createElement('div')
    toolsContainer.className = 'draw-tools'
    toolsContainer.style.display = 'flex'
    toolsContainer.style.flexDirection = 'column'
    toolsContainer.style.gap = '2px'

    this.tools.forEach((tool) => {
      const button = document.createElement('button')
      button.className = 'draw-tool-button'
      button.setAttribute('data-type', tool.type)
      button.innerHTML = `${tool.icon} ${tool.name}`
      button.title = `绘制${tool.name}`

      // 按钮样式
      Object.assign(button.style, {
        padding: '6px 12px',
        border: 'none',
        borderRadius: '3px',
        backgroundColor: 'transparent',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '12px',
        textAlign: 'left',
        transition: 'background-color 0.3s',
      })

      // 悬停效果
      button.addEventListener('mouseenter', () => {
        if (this.activeTool !== tool.type) {
          button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        }
      })

      button.addEventListener('mouseleave', () => {
        if (this.activeTool !== tool.type) {
          button.style.backgroundColor = 'transparent'
        }
      })

      // 点击事件
      button.addEventListener('click', () => {
        this.selectTool(tool.type, button)
      })

      toolsContainer.appendChild(button)
    })

    this.domElement.appendChild(toolsContainer)
  }

  createActions() {
    const actionsContainer = document.createElement('div')
    actionsContainer.className = 'draw-actions'
    actionsContainer.style.display = 'flex'
    actionsContainer.style.flexDirection = 'column'
    actionsContainer.style.gap = '2px'
    actionsContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.2)'
    actionsContainer.style.paddingTop = '6px'
    actionsContainer.style.marginTop = '6px'

    const actions = [
      { id: 'stop', name: '停止', icon: '⏹️', action: () => this.stopDraw() },
      { id: 'undo', name: '撤销', icon: '↶', action: () => this.drawManager.undo() },
      { id: 'clear', name: '清空', icon: '🗑️', action: () => this.drawManager.clear() },
      { id: 'export', name: '导出', icon: '📤', action: () => this.exportData() },
    ]

    actions.forEach((action) => {
      const button = document.createElement('button')
      button.className = 'draw-action-button'
      button.innerHTML = `${action.icon} ${action.name}`
      button.title = action.name

      Object.assign(button.style, {
        padding: '4px 8px',
        border: 'none',
        borderRadius: '3px',
        backgroundColor: 'transparent',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '11px',
        textAlign: 'left',
      })

      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
      })

      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = 'transparent'
      })

      button.addEventListener('click', action.action)

      actionsContainer.appendChild(button)
    })

    this.domElement.appendChild(actionsContainer)
  }

  // 选择工具
  selectTool(toolType, buttonElement) {
    // 重置所有按钮状态
    const buttons = this.domElement.querySelectorAll('.draw-tool-button')
    buttons.forEach((btn) => {
      btn.style.backgroundColor = 'transparent'
    })

    if (this.activeTool === toolType) {
      // 如果点击的是当前激活的工具，则停止绘制
      this.stopDraw()
    } else {
      // 激活新工具
      this.activeTool = toolType
      buttonElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'

      // 开始绘制
      this.drawManager.startDraw(toolType, this.getToolOptions(toolType))
    }
  }

  // 停止绘制
  stopDraw() {
    this.activeTool = null
    this.drawManager.stopDraw()

    // 重置按钮状态
    const buttons = this.domElement.querySelectorAll('.draw-tool-button')
    buttons.forEach((btn) => {
      btn.style.backgroundColor = 'transparent'
    })
  }

  // 获取工具选项
  getToolOptions(toolType) {
    const options = {
      clampToGround: true,
      hasEdit: true,
    }

    // 根据工具类型设置默认样式
    switch (toolType) {
      case 'point':
        options.style = {
          color: '#ff0000',
          pixelSize: 12,
          outlineColor: '#ffffff',
          outlineWidth: 2,
        }
        break
      case 'polyline':
        options.style = {
          color: '#ffff00',
          width: 3,
          materialType: 'Color',
        }
        break
      case 'polygon':
        options.style = {
          color: '#00ff00',
          opacity: 0.5,
          outline: true,
          outlineColor: '#ffffff',
          outlineWidth: 2,
        }
        break
      case 'rectangle':
        options.style = {
          color: '#0000ff',
          opacity: 0.5,
          outline: true,
          outlineColor: '#ffffff',
          outlineWidth: 2,
        }
        break
      case 'circle':
        options.style = {
          color: '#ff00ff',
          opacity: 0.5,
          outline: true,
          outlineColor: '#ffffff',
          outlineWidth: 2,
        }
        break
    }

    return options
  }

  // 导出数据
  exportData() {
    const geojson = this.drawManager.exportToGeoJSON()

    // 创建下载链接
    const dataStr = JSON.stringify(geojson, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `draw-data-${new Date().getTime()}.geojson`
    link.click()

    URL.revokeObjectURL(url)
  }
}

// 绘制功能使用示例

// 创建绘制控件
const drawControl = new DrawControl({
  position: 'top-left',
  tools: [
    { type: 'point', name: '标注', icon: '📍' },
    { type: 'polyline', name: '路径', icon: '📝' },
    { type: 'polygon', name: '区域', icon: '🔲' },
    { type: 'rectangle', name: '矩形', icon: '⬛' },
    { type: 'circle', name: '圆形', icon: '⭕' },
  ],
})

drawControl.addTo(map)

// 监听绘制事件
map.on('drawManagerdrawComplete', (event) => {
  console.log('绘制完成:', event.graphic)

  // 可以在这里添加自定义处理逻辑
  // 比如保存到数据库、计算面积等
  if (event.type === 'polygon') {
    const area = mars3d.MeasureUtil.measureArea(event.positions)
    console.log('多边形面积:', mars3d.MeasureUtil.formatArea(area))
  }
})

// 程序化绘制示例
const drawManager = new DrawManager(map)

// 直接开始绘制
drawManager.startDraw('polygon', {
  style: {
    color: '#ff0000',
    opacity: 0.6,
    outline: true,
    outlineColor: '#ffffff',
    outlineWidth: 3,
  },
  clampToGround: true,
  hasEdit: true,
})

// 设置绘制样式
drawManager.setDrawStyle('polyline', {
  color: '#00ffff',
  width: 5,
  materialType: 'PolylineGlow',
  materialOptions: {
    glowPower: 0.3,
  },
})
```

这个绘制功能模块提供了完整的绘制解决方案，包括：

1. **绘制工具基类** - 提供统一的绘制接口和事件处理
2. **具体绘制工具** - 点、线、面、矩形、圆形等图形的绘制
3. **绘制管理器** - 统一管理绘制过程和结果
4. **绘制控件** - 提供用户界面和交互功能

每个工具都支持自定义样式、贴地模式、编辑功能等特性，可以满足各种绘制需求。

## 📚 总结

本指南涵盖了Mars3D离线开发的所有核心概念和详细属性说明，包括：

- **环境配置**: 完整的离线开发环境搭建
- **Map配置**: 详细的构造参数和地图选项
- **坐标系统**: 完整的坐标转换和投影系统
- **图层系统**: 各种类型图层的详细配置
- **矢量数据**: 点、线、面等图形的完整属性
- **三维模型**: 模型加载和瓦片集的配置选项
- **相机控制**: 完整的相机操作方法
- **事件处理**: 地图和图形的事件处理机制
- **材质系统**: 各种内置和自定义材质
- **动画系统**: 轨迹动画和属性动画
- **分析功能**: 空间分析和测量工具
- **控件系统**: 各种内置控件的配置和使用
- **绘制功能**: 完整的绘制工具解决方案

这份指南为离线Mars3D开发提供了完整的参考，每个属性都包含了作用说明、默认值、使用示例，帮助开发者在无网络环境下也能高效开发Mars3D应用。
