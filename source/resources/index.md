---
title: 资源导航
date: 2023-01-01
type: "page"
comments: false
aside: true
---

<!-- 优先加载CSS确保样式立即可用 -->
<link rel="stylesheet" href="/css/resources.css">

<div class="resource-container">
  <!-- 分类过滤器 -->
  <div class="filter-tabs" id="filter-tabs">
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>正在加载分类...</p>
    </div>
  </div>

  <!-- 资源网格 -->
  <div class="resource-grid" id="resource-grid">
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>正在加载资源...</p>
    </div>
  </div>
</div>

<script>
// 直接定义资源数据
const resourcesData = {
  "categories": [
    { "id": "all", "name": "全部", "default": true },
    { "id": "extension", "name": "浏览器扩展" },
    { "id": "frontend", "name": "前端开发" },
    { "id": "backend", "name": "后端开发" },
    { "id": "design", "name": "设计资源" },
    { "id": "tool", "name": "实用工具" },
    { "id": "learning", "name": "学习资源" },
    { "id": "ai", "name": "AI工具" }
  ],
  "resources": [
    // 浏览器扩展
    {
      "title": "AdBlock",
      "description": "在YouTube和您访问的网站上屏蔽广告",
      "category": "extension",
      "tags": ["广告拦截", "浏览器扩展"],
      "icon": {
        "type": "fas fa-ban",
        "gradient": "linear-gradient(135deg, #e94133, #c41a1a)"
      },
      "url": "https://getadblock.com/zh_CN/"
    },
    {
      "title": "uBlock Origin",
      "description": "高效的广谱内容拦截器，以CPU和内存效率为主要特点",
      "category": "extension",
      "tags": ["广告拦截", "隐私保护"],
      "icon": {
        "type": "fas fa-shield-alt",
        "gradient": "linear-gradient(135deg, #c41a1a, #e33b2e)"
      },
      "url": "https://github.com/gorhill/uBlock"
    },
    {
      "title": "Awesome Screenshot",
      "description": "远程工作最佳的屏幕录制、截图和编辑工具",
      "category": "extension",
      "tags": ["截图", "录屏"],
      "icon": {
        "type": "fas fa-camera",
        "gradient": "linear-gradient(135deg, #2ecc71, #16a349)"
      },
      "url": "https://www.awesomescreenshot.com/"
    },
    {
      "title": "LastPass",
      "description": "与浏览器无缝集成的安全密码管理器",
      "category": "extension",
      "tags": ["安全", "密码"],
      "icon": {
        "type": "fas fa-key",
        "gradient": "linear-gradient(135deg, #d32d27, #b21e1e)"
      },
      "url": "https://www.lastpass.com/"
    },
    {
      "title": "Grammarly",
      "description": "AI写作助手，检查拼写、语法并帮助您清晰地写作",
      "category": "extension",
      "tags": ["写作", "生产力"],
      "icon": {
        "type": "fas fa-spell-check",
        "gradient": "linear-gradient(135deg, #15c39a, #0d9b79)"
      },
      "url": "https://www.grammarly.com/"
    },
    {
      "title": "OneTab",
      "description": "将所有标签页转换成一个列表，节省内存并减少标签页混乱",
      "category": "extension",
      "tags": ["标签管理", "效率"],
      "icon": {
        "type": "fas fa-list",
        "gradient": "linear-gradient(135deg, #3498db, #2980b9)"
      },
      "url": "https://www.one-tab.com/"
    },
    {
      "title": "Dark Reader",
      "description": "为任何网站创建暗色主题，保护您的眼睛",
      "category": "extension",
      "tags": ["暗色模式", "护眼"],
      "icon": {
        "type": "fas fa-moon",
        "gradient": "linear-gradient(135deg, #2c3e50, #1a252f)"
      },
      "url": "https://darkreader.org/"
    },

    // 前端开发
    {
      "title": "MDN Web 文档",
      "description": "Mozilla的Web技术权威文档",
      "category": "frontend",
      "tags": ["文档", "教程"],
      "icon": {
        "type": "fab fa-html5",
        "gradient": "linear-gradient(135deg, #e44d26, #f16529)"
      },
      "url": "https://developer.mozilla.org/zh-CN/"
    },
    {
      "title": "Vue.js",
      "description": "渐进式JavaScript框架，用于构建用户界面",
      "category": "frontend",
      "tags": ["框架", "JavaScript"],
      "icon": {
        "type": "fab fa-vuejs",
        "gradient": "linear-gradient(135deg, #41b883, #35495e)"
      },
      "url": "https://cn.vuejs.org/"
    },
    {
      "title": "React",
      "description": "用于构建用户界面的JavaScript库",
      "category": "frontend",
      "tags": ["框架", "JavaScript"],
      "icon": {
        "type": "fab fa-react",
        "gradient": "linear-gradient(135deg, #61dafb, #2d91c7)"
      },
      "url": "https://zh-hans.react.dev/"
    },
    {
      "title": "Bootstrap",
      "description": "世界上最流行的前端开源工具包",
      "category": "frontend",
      "tags": ["CSS", "UI框架"],
      "icon": {
        "type": "fab fa-bootstrap",
        "gradient": "linear-gradient(135deg, #7952b3, #553c8b)"
      },
      "url": "https://getbootstrap.com/"
    },
    {
      "title": "Tailwind CSS",
      "description": "一个功能优先的CSS框架，用于快速构建自定义设计",
      "category": "frontend",
      "tags": ["CSS", "UI框架"],
      "icon": {
        "type": "fas fa-wind",
        "gradient": "linear-gradient(135deg, #38bdf8, #0ea5e9)"
      },
      "url": "https://tailwindcss.com/"
    },
    {
      "title": "CodePen",
      "description": "前端开发人员的社交开发环境，在线编辑和分享代码",
      "category": "frontend",
      "tags": ["开发环境", "代码分享"],
      "icon": {
        "type": "fab fa-codepen",
        "gradient": "linear-gradient(135deg, #000000, #333333)"
      },
      "url": "https://codepen.io/"
    },
    {
      "title": "Next.js",
      "description": "用于生产的React框架，支持SSR和静态站点生成",
      "category": "frontend",
      "tags": ["React", "框架"],
      "icon": {
        "type": "fas fa-forward",
        "gradient": "linear-gradient(135deg, #000000, #333333)"
      },
      "url": "https://nextjs.org/"
    },
    {
      "title": "Vite",
      "description": "下一代前端开发与构建工具，快速的热模块更换",
      "category": "frontend",
      "tags": ["构建工具", "开发环境"],
      "icon": {
        "type": "fas fa-bolt",
        "gradient": "linear-gradient(135deg, #646cff, #4851d5)"
      },
      "url": "https://cn.vitejs.dev/"
    },

    // 后端开发
    {
      "title": "Node.js",
      "description": "基于Chrome V8引擎的JavaScript运行时",
      "category": "backend",
      "tags": ["JavaScript", "运行时"],
      "icon": {
        "type": "fab fa-node-js",
        "gradient": "linear-gradient(135deg, #68a063, #3c873a)"
      },
      "url": "https://nodejs.org/zh-cn/"
    },
    {
      "title": "Express",
      "description": "快速、无偏见、极简的Node.js web框架",
      "category": "backend",
      "tags": ["Node.js", "框架"],
      "icon": {
        "type": "fas fa-server",
        "gradient": "linear-gradient(135deg, #444, #222)"
      },
      "url": "https://expressjs.com/"
    },
    {
      "title": "Django",
      "description": "鼓励快速开发的高级Python Web框架",
      "category": "backend",
      "tags": ["Python", "框架"],
      "icon": {
        "type": "fab fa-python",
        "gradient": "linear-gradient(135deg, #092e20, #0c4b33)"
      },
      "url": "https://www.djangoproject.com/"
    },
    {
      "title": "MongoDB",
      "description": "具有所需可扩展性和灵活性的文档数据库",
      "category": "backend",
      "tags": ["数据库", "NoSQL"],
      "icon": {
        "type": "fas fa-database",
        "gradient": "linear-gradient(135deg, #4DB33D, #3F9C35)"
      },
      "url": "https://www.mongodb.com/zh-cn"
    },
    {
      "title": "Docker",
      "description": "用于在容器中开发、交付和运行应用程序的平台",
      "category": "backend",
      "tags": ["DevOps", "容器"],
      "icon": {
        "type": "fab fa-docker",
        "gradient": "linear-gradient(135deg, #2496ed, #0b74c6)"
      },
      "url": "https://www.docker.com/"
    },
    {
      "title": "Spring Boot",
      "description": "简化Spring应用开发的框架，约定优于配置",
      "category": "backend",
      "tags": ["Java", "框架"],
      "icon": {
        "type": "fas fa-leaf",
        "gradient": "linear-gradient(135deg, #6db33f, #3f9c35)"
      },
      "url": "https://spring.io/projects/spring-boot"
    },
    {
      "title": "Laravel",
      "description": "PHP网页应用开发框架，优雅的语法和开发体验",
      "category": "backend",
      "tags": ["PHP", "框架"],
      "icon": {
        "type": "fab fa-laravel",
        "gradient": "linear-gradient(135deg, #ff2d20, #cc2418)"
      },
      "url": "https://laravel.com/"
    },
    {
      "title": "GraphQL",
      "description": "API的查询语言和运行时，让客户端能够准确获取所需数据",
      "category": "backend",
      "tags": ["API", "查询语言"],
      "icon": {
        "type": "fas fa-project-diagram",
        "gradient": "linear-gradient(135deg, #e535ab, #b2298c)"
      },
      "url": "https://graphql.org/"
    },

    // 设计资源
    {
      "title": "Figma",
      "description": "协作界面设计工具",
      "category": "design",
      "tags": ["UI/UX", "原型设计"],
      "icon": {
        "type": "fab fa-figma",
        "gradient": "linear-gradient(135deg, #ff7262, #f24e1e)"
      },
      "url": "https://www.figma.com/"
    },
    {
      "title": "Unsplash",
      "description": "可供下载和用于任何项目的美丽免费图片和照片",
      "category": "design",
      "tags": ["图像", "照片"],
      "icon": {
        "type": "fas fa-camera-retro",
        "gradient": "linear-gradient(135deg, #111, #333)"
      },
      "url": "https://unsplash.com/"
    },
    {
      "title": "Dribbble",
      "description": "设计师分享其作品、过程和当前项目的社区",
      "category": "design",
      "tags": ["灵感", "社区"],
      "icon": {
        "type": "fab fa-dribbble",
        "gradient": "linear-gradient(135deg, #ea4c89, #c32361)"
      },
      "url": "https://dribbble.com/"
    },
    {
      "title": "Coolors",
      "description": "超快速配色方案生成器",
      "category": "design",
      "tags": ["颜色", "调色板"],
      "icon": {
        "type": "fas fa-palette",
        "gradient": "linear-gradient(135deg, #ff7262, #ff4757)"
      },
      "url": "https://coolors.co/"
    },
    {
      "title": "FontAwesome",
      "description": "网络上最流行的图标集和工具包",
      "category": "design",
      "tags": ["图标", "工具包"],
      "icon": {
        "type": "fab fa-font-awesome",
        "gradient": "linear-gradient(135deg, #339af0, #1971c2)"
      },
      "url": "https://fontawesome.com/"
    },
    {
      "title": "Canva",
      "description": "简单易用的在线设计平台，创建精美的设计和文档",
      "category": "design",
      "tags": ["设计工具", "图形设计"],
      "icon": {
        "type": "fas fa-pencil-ruler",
        "gradient": "linear-gradient(135deg, #00c4cc, #0072ef)"
      },
      "url": "https://www.canva.com/"
    },
    {
      "title": "Behance",
      "description": "领先的创意作品展示平台",
      "category": "design",
      "tags": ["作品集", "灵感"],
      "icon": {
        "type": "fab fa-behance",
        "gradient": "linear-gradient(135deg, #1769ff, #0050e6)"
      },
      "url": "https://www.behance.net/"
    },

    // 实用工具
    {
      "title": "Visual Studio Code",
      "description": "微软制作的免费源代码编辑器",
      "category": "tool",
      "tags": ["编辑器", "IDE"],
      "icon": {
        "type": "fas fa-code",
        "gradient": "linear-gradient(135deg, #0078d7, #005ba1)"
      },
      "url": "https://code.visualstudio.com/"
    },
    {
      "title": "Notion",
      "description": "笔记、任务、知识库和数据库的多合一工作空间",
      "category": "tool",
      "tags": ["生产力", "笔记"],
      "icon": {
        "type": "fas fa-sticky-note",
        "gradient": "linear-gradient(135deg, #111, #333)"
      },
      "url": "https://www.notion.so/"
    },
    {
      "title": "GitHub",
      "description": "面向开源及私有软件项目的托管平台",
      "category": "tool",
      "tags": ["代码托管", "版本控制"],
      "icon": {
        "type": "fab fa-github",
        "gradient": "linear-gradient(135deg, #333333, #111111)"
      },
      "url": "https://github.com/"
    },
    {
      "title": "Regex101",
      "description": "在线正则表达式测试和调试工具",
      "category": "tool",
      "tags": ["开发工具", "正则表达式"],
      "icon": {
        "type": "fas fa-slash",
        "gradient": "linear-gradient(135deg, #1e88e5, #0d47a1)"
      },
      "url": "https://regex101.com/"
    },
    {
      "title": "Trello",
      "description": "可视化项目管理工具",
      "category": "tool",
      "tags": ["项目管理", "协作"],
      "icon": {
        "type": "fab fa-trello",
        "gradient": "linear-gradient(135deg, #0079bf, #026aa7)"
      },
      "url": "https://trello.com/"
    },

    // AI工具
    {
      "title": "ChatGPT",
      "description": "OpenAI开发的大型语言模型",
      "category": "ai",
      "tags": ["对话", "文本生成"],
      "icon": {
        "type": "fas fa-robot",
        "gradient": "linear-gradient(135deg, #10a37f, #0d8a6f)"
      },
      "url": "https://chat.openai.com/"
    },
    {
      "title": "DALL-E",
      "description": "OpenAI的AI图像生成系统",
      "category": "ai",
      "tags": ["图像生成", "创意"],
      "icon": {
        "type": "fas fa-image",
        "gradient": "linear-gradient(135deg, #ff3366, #ff5566)"
      },
      "url": "https://openai.com/dall-e-2/"
    },
    {
      "title": "Midjourney",
      "description": "强大的AI图像生成工具",
      "category": "ai",
      "tags": ["图像生成", "艺术"],
      "icon": {
        "type": "fas fa-paint-brush",
        "gradient": "linear-gradient(135deg, #6b48ff, #9b66ff)"
      },
      "url": "https://www.midjourney.com/"
    },
    {
      "title": "Cursor",
      "description": "基于AI的代码编辑器",
      "category": "ai",
      "tags": ["编程", "代码生成"],
      "icon": {
        "type": "fas fa-terminal",
        "gradient": "linear-gradient(135deg, #3a41e3, #2d2dbb)"
      },
      "url": "https://cursor.sh/"
    }
  ]
};

// 立即执行函数，无需等待DOMContentLoaded
(function() {
  // 等待一个非常短的时间确保DOM已加载
  setTimeout(function() {
    try {
      // 获取DOM元素
      const filterTabsContainer = document.getElementById('filter-tabs');
      const resourceGridContainer = document.getElementById('resource-grid');

      if (!filterTabsContainer || !resourceGridContainer) {
        throw new Error('无法找到必要的DOM元素');
      }

      // 清除加载动画
      filterTabsContainer.innerHTML = '';
      resourceGridContainer.innerHTML = '';

      // 渲染分类标签
      resourcesData.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `filter-tab ${category.default ? 'active' : ''}`;
        button.setAttribute('data-category', category.id);
        button.textContent = category.name;
        filterTabsContainer.appendChild(button);
      });

      // 渲染资源卡片
      resourcesData.resources.forEach((resource, index) => {
        // 创建卡片元素
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.classList.add('animate-in');
        card.setAttribute('data-category', resource.category);
        card.style.animationDelay = `${index * 0.05}s`;

        // 设置卡片内容
        card.innerHTML = `
          <div class="card-header">
            <div class="resource-icon" style="background: ${resource.icon.gradient};">
              <i class="${resource.icon.type}"></i>
            </div>
            <h3 class="resource-title">${resource.title}</h3>
            <a href="${resource.url}" class="resource-link" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
          <div class="card-body">
            <p class="resource-desc">${resource.description}</p>
            <div class="resource-tags">
              ${resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
        `;

        // 添加到容器
        resourceGridContainer.appendChild(card);
      });

      // 设置分类筛选功能
      const filterTabs = document.querySelectorAll('.filter-tab');
      const resourceCards = document.querySelectorAll('.resource-card');

      filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
          // 更新活跃状态
          filterTabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');

          // 获取分类
          const category = this.getAttribute('data-category');

          // 筛选卡片
          resourceCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 10);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(10px)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          });
        });
      });

      // 标记已初始化
      window.resourcesInitialized = true;
      console.log('资源页面初始化成功');

    } catch (error) {
      console.error('资源页面初始化失败:', error);

      // 显示错误信息
      const resourceGridContainer = document.getElementById('resource-grid');
      if (resourceGridContainer) {
        resourceGridContainer.innerHTML = `
          <div style="text-align: center; padding: 30px; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
            <h3>加载资源时出错</h3>
            <p>${error.message}</p>
            <button onclick="window.location.reload()" style="margin-top:15px; padding:8px 15px; background:#e74c3c; color:white; border:none; border-radius:4px; cursor:pointer;">
              刷新页面
            </button>
          </div>
        `;
      }
    }
  }, 50); // 等待50ms确保DOM已加载
})();

// 添加备份初始化，确保资源加载
document.addEventListener('DOMContentLoaded', function() {
  // 如果已经初始化过，则跳过
  if (window.resourcesInitialized) {
    return;
  }
  
  // 如果50ms后仍未初始化，尝试重新初始化
  console.log('使用DOMContentLoaded备份初始化');
  setTimeout(function() {
    if (!window.resourcesInitialized) {
      console.log('尝试备份初始化');
      const event = new Event('load');
      window.dispatchEvent(event);
      // 强制刷新页面
      window.location.reload();
    }
  }, 500);
});
</script>

<!-- 添加行内样式以确保关键样式立即生效 -->
<style>
.resource-container {
  margin: 0 auto;
  padding: 20px 0;
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-tab {
  background: #f0f0f0;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab.active {
  background: #555;
  color: white;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.loading {
  text-align: center;
  padding: 30px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #555;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>