---
title: webpack
date: 2023-05-026

tags:
  - webpack
  - 入门
cover: https://img0.baidu.com/it/u=3179744413,569264497&fm=253&fmt=auto&app=138&f=PNG?w=1285&h=500
---

# Webpack 完全指南：从入门到精通

## 目录
- [1. 基础概念](#1-基础概念)
- [2. 核心功能](#2-核心功能)
- [3. 打包原理](#3-打包原理)
- [4. 配置详解](#4-配置详解)
- [5. Loader 体系](#5-loader-体系)
- [6. Plugin 体系](#6-plugin-体系)
- [7. 性能优化](#7-性能优化)
- [8. 实战应用](#8-实战应用)
- [9. 高级特性](#9-高级特性)
- [10. 最佳实践](#10-最佳实践)

## 1. 基础概念

### 1.1 什么是 Webpack？

![Webpack工作原理](https://webpack.js.org/assets/what-is-webpack.png)

Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。它将项目中的所有资源视为模块，通过依赖关系图构建应用。

### 1.2 核心概念

#### 1.2.1 入口(Entry)
```javascript
// 单入口
module.exports = {
  entry: './src/index.js'
}

// 多入口
module.exports = {
  entry: {
    main: './src/main.js',
    vendor: './src/vendor.js'
  }
}
```

#### 1.2.2 输出(Output)
```javascript
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    publicPath: '/'
  }
}
```

#### 1.2.3 模块(Module)
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

#### 1.2.4 插件(Plugin)
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin()
  ]
}
```

## 2. 核心功能

### 2.1 模块解析
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    // 模块别名
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    // 扩展名
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // 模块查找目录
    modules: ['node_modules']
  }
}
```

### 2.2 代码分割
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

### 2.3 资源模块
```javascript
module.exports = {
  module: {
    rules: [
      // 图片处理
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      // 字体处理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  }
}
```

## 3. 打包原理

### 3.1 构建流程

![Webpack构建流程](https://webpack.js.org/assets/compilation.png)

```javascript
class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      emit: new AsyncSeriesHook(['compilation']),
      done: new AsyncSeriesHook(['stats'])
    };
  }

  run() {
    // 1. 初始化参数
    this.hooks.run.call();

    // 2. 开始编译
    const compilation = new Compilation(this.options);

    // 3. 构建模块
    compilation.build();

    // 4. 优化
    compilation.optimize();

    // 5. 输出资源
    this.hooks.emit.callAsync(compilation, err => {
      if (err) return callback(err);

      // 6. 完成构建
      this.hooks.done.callAsync(compilation.getStats(), err => {
        if (err) return callback(err);
      });
    });
  }
}
```

### 3.2 模块依赖图
```javascript
class DependencyGraph {
  constructor() {
    this.modules = new Map();
  }

  addModule(module) {
    this.modules.set(module.id, {
      id: module.id,
      dependencies: module.dependencies,
      code: module.code
    });
  }

  createBundle() {
    let modules = '';
    this.modules.forEach(module => {
      modules += `
        ${module.id}: function(module, exports, require) {
          ${module.code}
        },
      `;
    });

    return `
      (function(modules) {
        function require(id) {
          const module = { exports: {} };
          modules[id](module, module.exports, require);
          return module.exports;
        }
        require(0);
      })({${modules}})
    `;
  }
}
```

## 4. 配置详解

### 4.1 基础配置
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // 模式
  mode: 'production',

  // 入口
  entry: './src/index.js',

  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },

  // 模块处理
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },

  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    })
  ],

  // 优化
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  }
};
```

## 5. Loader 体系

### 5.1 Loader 原理
```javascript
// 自定义 loader 示例
module.exports = function(source) {
  // loader 上下文
  const options = this.getOptions();
  
  // 异步处理
  const callback = this.async();
  
  // 源码转换
  const transformedSource = transform(source, options);
  
  // 返回转换后的代码
  callback(null, transformedSource);
};
```

### 5.2 常用 Loader

#### 5.2.1 样式处理
```javascript
module.exports = {
  module: {
    rules: [
      // CSS处理
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      // SASS处理
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: false,
              },
            }
          }
        ]
      }
    ]
  }
}
```

#### 5.2.2 文件处理
```javascript
module.exports = {
  module: {
    rules: [
      // 图片优化
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              }
            }
          }
        ]
      },
      // SVG处理
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  }
}
```

## 6. Plugin 体系

### 6.1 Plugin 原理
```javascript
class MyPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // 注册钩子
    compiler.hooks.emit.tapAsync(
      'MyPlugin',
      (compilation, callback) => {
        // 添加资源
        compilation.assets['file.txt'] = {
          source: () => 'generated content',
          size: () => 'generated content'.length
        };
        
        callback();
      }
    );
  }
}

module.exports = MyPlugin;
```

### 6.2 常用 Plugin

#### 6.2.1 优化类
```javascript
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    // Gzip压缩
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    
    // 包分析
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
}
```

#### 6.2.2 功能增强类
```javascript
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  plugins: [
    // 复制静态资源
    new CopyPlugin({
      patterns: [
        { from: 'public', to: 'assets' }
      ],
    }),
    
    // PWA支持
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
}
```

## 7. 性能优化

### 7.1 构建性能优化

#### 7.1.1 缓存优化
```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    },
    name: 'production-cache'
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false
            }
          }
        ]
      }
    ]
  }
}
```

#### 7.1.2 多进程构建
```javascript
const thread = require('thread-loader');

thread.warmup({
  workers: 4,
  workerParallelJobs: 50,
}, [
  'babel-loader',
  'css-loader',
  'vue-loader'
]);

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 4
            }
          },
          'babel-loader'
        ]
      }
    ]
  }
}
```

### 7.2 运行时性能优化

#### 7.2.1 代码分割
```javascript
module.exports = {
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  }
}
```

#### 7.2.2 懒加载
```javascript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import(
      /* webpackChunkName: "dashboard" */
      /* webpackPrefetch: true */
      './views/Dashboard.vue'
    )
  }
];

// 组件懒加载
const MyComponent = () => import('./components/MyComponent.vue');
```

## 8. 实战应用

### 8.1 Vue项目配置
```javascript
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ]
}
```

### 8.2 React项目配置
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      }
    ]
  }
}
```

## 9. 高级特性

### 9.1 模块联邦
```javascript
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js'
      },
      shared: {
        react: { singleton: true }
      }
    })
  ]
}
```

### 9.2 Tree Shaking 增强
```javascript
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: true,
    innerGraph: true,
    concatenateModules: true
  }
}
```

## 10. 最佳实践

### 10.1 项目结构
```
project/
├── build/                # webpack配置
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/         # 资源文件
│   ├── components/     # 组件
│   ├── views/          # 页面
│   ├── router/         # 路由
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── tests/              # 测试文件
├── .env.*              # 环境变量
├── package.json        # 项目配置
└── README.md           # 项目说明
```

### 10.2 性能检查清单
- [ ] 使用最新版本的 Webpack
- [ ] 配置合适的 sourceMap
- [ ] 启用压缩和代码分割
- [ ] 利用缓存机制
- [ ] 优化图片资源
- [ ] 配置 CDN
- [ ] 使用 Tree Shaking
- [ ] 配置合理的 splitChunks
- [ ] 使用动态导入
- [ ] 优化第三方库的使用

## 注意事项
⚠️ 定期更新依赖包  
⚠️ 关注构建性能指标  
⚠️ 避免过度优化  
⚠️ 保持配置的可维护性  
⚠️ 做好错误处理和降级策略