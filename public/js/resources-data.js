// 资源数据文件
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
      "url": "https://getadblock.com/zh_CN/",
      "features": [
        "屏蔽网页中的广告内容",
        "防止广告跟踪",
        "提升页面加载速度",
        "减少数据消耗",
        "可自定义规则和白名单"
      ]
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
    {
      "title": "Pexels",
      "description": "免费高品质照片和视频素材",
      "category": "design",
      "tags": ["照片", "视频"],
      "icon": {
        "type": "fas fa-image",
        "gradient": "linear-gradient(135deg, #05a081, #048271)"
      },
      "url": "https://www.pexels.com/"
    },
    {
      "title": "Blender",
      "description": "免费开源的3D创作套件，支持整个3D流程",
      "category": "design",
      "tags": ["3D", "建模"],
      "icon": {
        "type": "fas fa-cube",
        "gradient": "linear-gradient(135deg, #f5792a, #ea4c0f)"
      },
      "url": "https://www.blender.org/"
    },

    // 实用工具
    {
      "title": "Visual Studio Code",
      "description": "微软为Windows、Linux和macOS制作的免费源代码编辑器",
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
      "description": "用于版本控制和协作的代码托管平台",
      "category": "tool",
      "tags": ["Git", "代码仓库"],
      "icon": {
        "type": "fab fa-github",
        "gradient": "linear-gradient(135deg, #333, #111)"
      },
      "url": "https://github.com/"
    },
    {
      "title": "Postman",
      "description": "用于构建和使用API的API平台",
      "category": "tool",
      "tags": ["API", "测试"],
      "icon": {
        "type": "fas fa-paper-plane",
        "gradient": "linear-gradient(135deg, #ff6c37, #df4912)"
      },
      "url": "https://www.postman.com/"
    },
    {
      "title": "Trello",
      "description": "组织工作和生活的视觉工具",
      "category": "tool",
      "tags": ["生产力", "组织"],
      "icon": {
        "type": "fab fa-trello",
        "gradient": "linear-gradient(135deg, #0079bf, #026aa7)"
      },
      "url": "https://trello.com/"
    },
    {
      "title": "Vercel",
      "description": "前端和全栈应用的部署平台",
      "category": "tool",
      "tags": ["部署", "托管"],
      "icon": {
        "type": "fas fa-upload",
        "gradient": "linear-gradient(135deg, #000000, #333333)"
      },
      "url": "https://vercel.com/"
    },
    {
      "title": "Netlify",
      "description": "一键部署现代静态网站的平台",
      "category": "tool",
      "tags": ["部署", "托管"],
      "icon": {
        "type": "fas fa-globe",
        "gradient": "linear-gradient(135deg, #00ad9f, #00c2b1)"
      },
      "url": "https://www.netlify.com/"
    },
    {
      "title": "Obsidian",
      "description": "强大的知识库，在本地Markdown文件上工作",
      "category": "tool",
      "tags": ["笔记", "知识管理"],
      "icon": {
        "type": "fas fa-brain",
        "gradient": "linear-gradient(135deg, #7e6bca, #584eb7)"
      },
      "url": "https://obsidian.md/"
    },
    {
      "title": "Insomnia",
      "description": "API设计平台和客户端",
      "category": "tool",
      "tags": ["API", "开发工具"],
      "icon": {
        "type": "fas fa-satellite-dish",
        "gradient": "linear-gradient(135deg, #7400e1, #4600bc)"
      },
      "url": "https://insomnia.rest/"
    },

    // 学习资源
    {
      "title": "freeCodeCamp",
      "description": "通过互动教程免费学习编程",
      "category": "learning",
      "tags": ["编程", "教程"],
      "icon": {
        "type": "fab fa-free-code-camp",
        "gradient": "linear-gradient(135deg, #0a0a23, #1b1b32)"
      },
      "url": "https://www.freecodecamp.org/chinese/"
    },
    {
      "title": "Coursera",
      "description": "通过世界级大学的在线课程、证书和学位构建技能",
      "category": "learning",
      "tags": ["课程", "教育"],
      "icon": {
        "type": "fas fa-graduation-cap",
        "gradient": "linear-gradient(135deg, #2a73cc, #0056d2)"
      },
      "url": "https://www.coursera.org/"
    },
    {
      "title": "edX",
      "description": "访问来自全球顶尖大学和机构的教育",
      "category": "learning",
      "tags": ["课程", "教育"],
      "icon": {
        "type": "fas fa-university",
        "gradient": "linear-gradient(135deg, #02262b, #036b82)"
      },
      "url": "https://www.edx.org/"
    },
    {
      "title": "Stack Overflow",
      "description": "构建编程问题和答案权威集合的公共平台",
      "category": "learning",
      "tags": ["社区", "问答"],
      "icon": {
        "type": "fab fa-stack-overflow",
        "gradient": "linear-gradient(135deg, #f48024, #d77215)"
      },
      "url": "https://stackoverflow.com/"
    },
    {
      "title": "Codecademy",
      "description": "提供编程、数据科学和Web开发课程的互动学习平台",
      "category": "learning",
      "tags": ["互动学习", "编程"],
      "icon": {
        "type": "fas fa-laptop-code",
        "gradient": "linear-gradient(135deg, #204056, #0c2b3e)"
      },
      "url": "https://www.codecademy.com/"
    },
    {
      "title": "LeetCode",
      "description": "帮助你提升编程技能的平台，为技术面试做准备",
      "category": "learning",
      "tags": ["算法", "面试准备"],
      "icon": {
        "type": "fas fa-code",
        "gradient": "linear-gradient(135deg, #ffa116, #e78907)"
      },
      "url": "https://leetcode.cn/"
    },
    {
      "title": "掘金",
      "description": "中国质量很高的技术社区，帮助开发者成长的社区",
      "category": "learning",
      "tags": ["技术社区", "博客"],
      "icon": {
        "type": "fas fa-book",
        "gradient": "linear-gradient(135deg, #1e80ff, #007fff)"
      },
      "url": "https://juejin.cn/"
    },
    {
      "title": "慕课网",
      "description": "实战视频教程，轻松掌握IT技能",
      "category": "learning",
      "tags": ["视频教程", "实战"],
      "icon": {
        "type": "fas fa-play",
        "gradient": "linear-gradient(135deg, #2ecc71, #27ae60)"
      },
      "url": "https://www.imooc.com/"
    },

    // AI工具 (新分类)
    {
      "title": "ChatGPT",
      "description": "OpenAI开发的对话型AI，可以回答问题和生成文本",
      "category": "ai",
      "tags": ["AI对话", "文本生成"],
      "icon": {
        "type": "fas fa-robot",
        "gradient": "linear-gradient(135deg, #10a37f, #0d8b6c)"
      },
      "url": "https://chat.openai.com/"
    },
    {
      "title": "Midjourney",
      "description": "AI艺术和图像生成工具，创建惊人的视觉效果",
      "category": "ai",
      "tags": ["AI艺术", "图像生成"],
      "icon": {
        "type": "fas fa-paint-brush",
        "gradient": "linear-gradient(135deg, #7209b7, #480ca8)"
      },
      "url": "https://www.midjourney.com/"
    },
    {
      "title": "Hugging Face",
      "description": "机器学习模型和数据集的开源平台",
      "category": "ai",
      "tags": ["机器学习", "平台"],
      "icon": {
        "type": "fas fa-smile",
        "gradient": "linear-gradient(135deg, #ffce00, #ffb700)"
      },
      "url": "https://huggingface.co/"
    },
    {
      "title": "Claude",
      "description": "Anthropic开发的对话型AI助手，注重有益、无害和诚实",
      "category": "ai",
      "tags": ["AI对话", "文本生成"],
      "icon": {
        "type": "fas fa-comment-alt",
        "gradient": "linear-gradient(135deg, #8e44ad, #6c3483)"
      },
      "url": "https://claude.ai/"
    },
    {
      "title": "Copy.ai",
      "description": "AI驱动的文案写作工具，帮助创建市场内容",
      "category": "ai",
      "tags": ["文案", "营销"],
      "icon": {
        "type": "fas fa-copy",
        "gradient": "linear-gradient(135deg, #1da1f2, #0d8ecf)"
      },
      "url": "https://www.copy.ai/"
    },
    {
      "title": "Stable Diffusion",
      "description": "强大的开源文本到图像AI模型",
      "category": "ai",
      "tags": ["图像生成", "开源"],
      "icon": {
        "type": "fas fa-image",
        "gradient": "linear-gradient(135deg, #ef4444, #dc2626)"
      },
      "url": "https://stability.ai/"
    },
    {
      "title": "GitHub Copilot",
      "description": "AI配对程序员，在编写代码时提供建议",
      "category": "ai",
      "tags": ["编程", "代码生成"],
      "icon": {
        "type": "fas fa-laptop-code",
        "gradient": "linear-gradient(135deg, #171515, #333333)"
      },
      "url": "https://github.com/features/copilot"
    },
    {
      "title": "Runway",
      "description": "强大的创意工具套件，用于视频编辑和生成",
      "category": "ai",
      "tags": ["视频生成", "创意工具"],
      "icon": {
        "type": "fas fa-film",
        "gradient": "linear-gradient(135deg, #e03131, #c92a2a)"
      },
      "url": "https://runway.com/"
    },
    {
      "title": "Grok",
      "description": "由xAI开发的有趣且叛逆的AI聊天机器人，具有实时网络访问能力",
      "category": "ai",
      "tags": ["LLM", "实时访问"],
      "icon": {
        "type": "fas fa-bolt",
        "gradient": "linear-gradient(135deg, #4a69bd, #1e3799)"
      },
      "url": "https://grok.x.ai/"
    },
    {
      "title": "DeepSeek",
      "description": "中国开发的先进大语言模型，拥有强大的代码和文本生成能力",
      "category": "ai",
      "tags": ["LLM", "开源"],
      "icon": {
        "type": "fas fa-brain",
        "gradient": "linear-gradient(135deg, #3498db, #2980b9)"
      },
      "url": "https://deepseek.com/"
    },
    {
      "title": "腾讯混元",
      "description": "腾讯推出的大规模语言模型，针对中文进行了深度优化",
      "category": "ai",
      "tags": ["LLM", "中文优化"],
      "icon": {
        "type": "fab fa-hubspot",
        "gradient": "linear-gradient(135deg, #12b886, #087f5b)"
      },
      "url": "https://hunyuan.tencent.com/"
    }
  ]
};