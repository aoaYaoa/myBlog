---
title: vite
date: 2024-02-01
tags:
  - vite
  - 入门
cover: https://tiven.cn/static/img/vite-03-xbVS9jZm.jpg
---

# Vite 完全指南：从入门到精通

## 目录

### 第一部分：基础入门
1. [认识 Vite](#1-认识-vite)
   - 1.1 什么是 Vite
   - 1.2 核心优势
   - 1.3 基本原理
   - 1.4 应用场景

2. [快速开始](#2-快速开始)
   - 2.1 环境准备
   - 2.2 创建项目
   - 2.3 项目结构
   - 2.4 基本命令
   - 2.5 开发调试

### 第二部分：核心概念
3. [构建基础](#3-构建基础)
   - 3.1 开发服务器
   - 3.2 构建过程
   - 3.3 依赖预构建
   - 3.4 HMR 机制

4. [资源处理](#4-资源处理)
   - 4.1 静态资源
   - 4.2 样式处理
   - 4.3 JavaScript/TypeScript
   - 4.4 JSON 和 Web Workers
   - 4.5 动态导入

### 第三部分：进阶使用
5. [配置详解](#5-配置详解)
   - 5.1 基础配置
   - 5.2 开发服务器配置
   - 5.3 构建配置
   - 5.4 依赖优化
   - 5.5 环境变量

6. [插件系统](#6-插件系统)
   - 6.1 插件机制
   - 6.2 常用插件
   - 6.3 插件开发
   - 6.4 插件钩子
   - 6.5 最佳实践

### 第四部分：框架集成
7. [主流框架](#7-主流框架)
   - 7.1 Vue 生态
   - 7.2 React 生态
   - 7.3 其他框架
   - 7.4 迁移指南

8. [工具链集成](#8-工具链集成)
   - 8.1 TypeScript
   - 8.2 CSS 预处理器
   - 8.3 PostCSS
   - 8.4 ESLint/Prettier
   - 8.5 单元测试

### 第五部分：生产优化
9. [性能优化](#9-性能优化)
   - 9.1 构建优化
   - 9.2 代码分割
   - 9.3 懒加载
   - 9.4 预加载
   - 9.5 缓存策略

10. [部署运维](#10-部署运维)
    - 10.1 构建策略
    - 10.2 部署方案
    - 10.3 CI/CD
    - 10.4 监控分析
    - 10.5 安全考虑

## 1. 认识 Vite

### 1.1 什么是 Vite

Vite（法语意为"快速"）是新一代前端构建工具，由 Vue.js 的作者尤雨溪开发。它针对现代 Web 开发的痛点，提供了一套完整的开发解决方案。

#### 核心特点
```javascript
// 1. 极速的服务器启动
import { createApp } from 'vue'
import App from './App.vue'
// Vite 直接提供 ESM 源码

// 2. 轻量快速的热更新
if (import.meta.hot) {
  import.meta.hot.accept()
}

// 3. 开箱即用的各种功能
import styles from './style.module.css'
import data from './data.json'
```

### 1.2 核心优势

#### 开发环境
```mermaid
graph LR
    A[源代码] --> B[Vite Dev Server]
    B --> C[浏览器原生 ESM]
    C --> D[即时编译]
    D --> E[快速更新]
```

#### 生产环境
```mermaid
graph LR
    A[源代码] --> B[Rollup]
    B --> C[优化打包]
    C --> D[高性能产物]
```

### 1.3 基本原理

```javascript
// 开发服务器原理
export default defineConfig({
  server: {
    // 1. 基于 ESM 的开发服务器
    middlewareMode: false,
    
    // 2. 智能的 HMR
    hmr: {
      protocol: 'ws',
      timeout: 1000
    },
    
    // 3. 按需编译
    fs: {
      strict: true,
      allow: ['..']
    }
  }
})
```

### 1.4 应用场景

| 场景 | 特点 | 适用性 |
|-----|------|-------|
| SPA | 快速开发、即时反馈 | 极佳 |
| SSR | 支持服务端渲染 | 良好 |
| 库开发 | 插件化、可扩展 | 适中 |
| MPA | 多页面应用支持 | 良好 |

## 2. 快速开始

### 2.1 环境准备

```bash
# 检查 Node.js 版本（需要 14.18+ / 16+）
node -v

# 包管理器选择
npm -v  # npm 6.14.0+
yarn -v # yarn 1.22.0+
pnpm -v # pnpm 7.0.0+
```

### 2.2 创建项目

```bash
# 使用 npm
npm create vite@latest my-vite-app -- --template vue

# 使用 yarn
yarn create vite my-vite-app --template vue

# 使用 pnpm
pnpm create vite my-vite-app -- --template vue
```

#### 支持的模板
```javascript
const TEMPLATES = {
  vanilla: '原生 JavaScript',
  'vanilla-ts': '原生 TypeScript',
  vue: 'Vue',
  'vue-ts': 'Vue + TypeScript',
  react: 'React',
  'react-ts': 'React + TypeScript',
  preact: 'Preact',
  'preact-ts': 'Preact + TypeScript',
  lit: 'Lit',
  'lit-ts': 'Lit + TypeScript',
  svelte: 'Svelte',
  'svelte-ts': 'Svelte + TypeScript'
}
```

### 2.3 项目结构

```
.
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

#
## 3. 构建基础

### 3.1 开发服务器
```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 3.2 构建配置
```javascript
export default defineConfig({
  build: {
    target: 'modules',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router']
        }
      }
    }
  }
})
```

## 4. 资源处理

### 4.1 静态资源
```javascript
// 图片资源
import imgUrl from './img.png'
document.getElementById('hero').src = imgUrl

// CSS 模块
import styles from './style.module.css'
element.className = styles.heading

// JSON
import data from './data.json'
console.log(data)
```

### 4.2 样式处理
```javascript
// CSS 预处理器
import './style.scss'

// PostCSS 配置
export default {
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPresetEnv()
      ]
    },
    modules: {
      localsConvention: 'camelCase'
    }
  }
}
```

## 5. 配置详解

### 5.1 基础配置
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: process.cwd(),
  base: '/',
  mode: 'development',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  
  plugins: [vue()]
})
```

### 5.2 环境变量
```bash
# .env
VITE_APP_TITLE=My App
VITE_API_URL=http://api.example.com

# .env.development
VITE_APP_TITLE=Dev App
VITE_API_URL=http://dev-api.example.com
```

## 6. 插件系统

### 6.1 插件开发
```javascript
export default function myPlugin() {
  return {
    name: 'my-plugin',
    
    configureServer(server) {
      // 服务器配置
    },
    
    transform(code, id) {
      // 代码转换
      if (id.endsWith('.vue')) {
        return {
          code: transformedCode,
          map: sourceMap
        }
      }
    }
  }
}
```

### 6.2 常用插件
```javascript
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

## 7. 主流框架

### 7.1 Vue 集成
```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }
    })
  ]
})
```

### 7.2 React 集成
```javascript
// vite.config.js
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }]
        ]
      }
    })
  ]
})
```

## 8. 工具链集成

### 8.1 TypeScript
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
})

// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true
  }
}
```

## 9. 性能优化

### 9.1 构建优化
```javascript
export default defineConfig({
  build: {
    target: 'modules',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
```

### 9.2 代码分割

#### 9.2.1 基础配置
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // 1. 手动分块策略
        manualChunks: {
          // 将 Vue 全家桶拆分成单独的 chunk
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // 将 UI 框架拆分
          'element-plus': ['element-plus'],
          // 将大型依赖拆分
          'lodash': ['lodash-es'],
        },
        // 2. 自定义 chunk 文件名
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            return `js/[name]-[hash].js`
          }
          return 'js/vendor-[hash].js'
        },
        // 3. 自定义资源文件名
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
```

#### 9.2.2 动态导入
```javascript
// 1. 路由级别代码分割
// router/index.js
const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    // 添加注释以控制 chunk 名称
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/dashboard',
    // 预加载重要路由
    component: () => import(/* webpackPrefetch: true */ '../views/Dashboard.vue')
  }
]

// 2. 组件级别代码分割
// 按需加载组件
const MyHeavyComponent = defineAsyncComponent(() => 
  import('../components/MyHeavyComponent.vue')
)

// 3. 条件导入
async function loadAnalytics() {
  if (process.env.NODE_ENV === 'production') {
    const analytics = await import('./analytics')
    analytics.init()
  }
}
```

#### 9.2.3 分割策略
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. 将 node_modules 中的代码单独打包
          if (id.includes('node_modules')) {
            // 获取包名
            const packageName = id.toString().split('node_modules/')[1].split('/')[0]
            // 将每个包单独打包
            return `vendor-${packageName}`
          }
          
          // 2. 将公共组件打包到一起
          if (id.includes('src/components')) {
            return 'components'
          }
          
          // 3. 将工具函数打包到一起
          if (id.includes('src/utils')) {
            return 'utils'
          }
        }
      }
    }
  }
})
```

#### 9.2.4 预加载和预获取
```javascript
// 1. 使用 vite-plugin-imagemin 优化图片
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.7, 0.8] },
      svgo: {
        plugins: [
          { removeViewBox: false },
          { removeDimensions: true }
        ]
      }
    })
  ]
})

// 2. 资源预加载
// index.html
<link rel="modulepreload" href="/src/heavy-module.js">
<link rel="preload" href="/assets/large-image.jpg" as="image">

// 3. 动态预加载
const preloadComponent = () => {
  const component = import('./BigComponent.vue')
  requestIdleCallback(() => {
    // 在空闲时间预加载其他资源
    import('./non-critical-module.js')
  })
  return component
}
```

#### 9.2.5 分割优化建议

1. **合理的分割粒度**
```javascript
// 不好的实践 - 过度分割
manualChunks: {
  'tiny-lib': ['tiny-lib'], // 这个库太小，不值得单独分割
  'utils': ['./src/utils/format.js'] // 工具函数太小，应该合并
}

// 好的实践 - 适当分割
manualChunks: {
  'core-vendor': ['vue', 'vue-router', 'pinia'], // 核心依赖打包在一起
  'ui-vendor': ['element-plus'], // UI 框架单独打包
  'big-vendor': ['echarts', 'three.js'] // 大型依赖单独打包
}
```

2. **动态导入最佳实践**
```javascript
// 组件动态导入
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'),
    // 使用 webpackPreload 确保关键路由快速加载
    children: [
      {
        path: 'overview',
        component: () => import(/* webpackPrefetch: true */ './views/Overview.vue')
      },
      {
        path: 'analysis',
        component: () => import(/* webpackPreload: true */ './views/Analysis.vue')
      }
    ]
  }
]
```

3. **性能监控**
```javascript
// 监控代码分割性能
import { onLCP, onFID } from 'web-vitals'

// 监控加载性能
onLCP(console.log)
onFID(console.log)

// 监控 chunk 加载失败
window.addEventListener('error', (event) => {
  if (event.target.tagName === 'SCRIPT') {
    // 处理 chunk 加载失败
    console.error('Chunk load failed:', event.target.src)
  }
}, true)
```

这样的代码分割内容更加完整和准确，涵盖了：
- 基础配置
- 动态导入
- 分割策略
- 预加载和预获取
- 最佳实践和性能监控

每个部分都提供了具体的代码示例和实践建议，更有助于理解和实施代码分割。
```

## 10. 部署运维

### 10.1 静态部署
```javascript
// vite.config.js
export default defineConfig({
  base: production ? '/your-repo/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    manifest: true
  }
})
```

### 10.2 CI/CD 配置
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install and Build
        run: |
          npm ci
          npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 10.3 性能监控
```javascript
// 性能指标监控
import { onCLS, onFID, onLCP } from 'web-vitals'

function sendToAnalytics({ name, delta, id }) {
  // 发送性能数据到分析服务
  console.log(`Metric: ${name} ID: ${id} Value: ${delta}`)
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onLCP(sendToAnalytics)
```