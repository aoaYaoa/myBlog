/* 把resources.html中的JavaScript代码复制到这里 */

// 在文件开头添加这段代码，确保优先执行
(function() {
  console.log('resources.js 已加载，当前路径:', location.pathname);
  
  // 简单检测是否为资源页面 - 基于URL路径
  if (location.pathname.includes('/resources') ||
      location.pathname.includes('/resource') ||
      document.referrer.includes('/resources')) {
    // 创建CSS链接元素
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/resources.css';

    // 添加到head
    document.head.appendChild(link);
    console.log('资源页面CSS已加载');
  }
})();

// 尝试直接加载resourcesData
(function() {
  try {
    // 尝试从JSON文件加载资源数据
    fetch('/data/resources.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('资源数据成功加载:', data);
        window.resourcesData = data;
        // 如果页面已加载，立即初始化
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          initResourcesPage();
        }
      })
      .catch(error => {
        console.error('无法加载资源数据:', error);
      });
  } catch (e) {
    console.error('加载资源数据时出错:', e);
  }
})();

// 初始化资源页面的函数
function initResourcesPage() {
  // console.log(document.getElementsByClassName('tk-input'),'123');
  // console.log('尝试初始化资源页面');
  // 检查是否为资源页面，如果不是则直接返回
  const isResourcePage = 
    window.location.pathname.includes('/resources') || 
    window.location.pathname.includes('/resource') || 
    document.querySelector('.resource-container') !== null;
  
  console.log('是否为资源页面:', isResourcePage);
  
  if (!isResourcePage) {
    // console.log('当前不是资源页面，跳过初始化');
    return; // 不是资源页面，不继续执行
  }
  
  // 如果页面已经初始化过，避免重复执行
  if (window.resourcesInitialized) {
    console.log('资源页面已通过内联脚本初始化，跳过外部初始化');
    return;
  }

  try {
    console.log('开始初始化资源页面');
    // 检查resourcesData是否已加载
    if (typeof window.resourcesData === 'undefined') {
      console.log('尝试其他方式获取资源数据');
      // 尝试从页面内联脚本获取数据
      const inlineData = document.querySelector('script[data-resource-data]');
      if (inlineData) {
        try {
          window.resourcesData = JSON.parse(inlineData.textContent);
          console.log('从内联脚本加载资源数据成功');
        } catch (e) {
          console.error('解析内联资源数据失败:', e);
          throw new Error('资源数据加载失败');
        }
      } else {
        // 尝试使用硬编码的资源数据（如resources/index.md中的内联数据）
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const scriptContent = scripts[i].textContent;
          if (scriptContent && scriptContent.includes('resourcesData') && scriptContent.includes('categories')) {
            try {
              // 提取resourcesData对象
              const match = scriptContent.match(/resourcesData\s*=\s*({[\s\S]*?});/);
              if (match && match[1]) {
                eval('window.resourcesData = ' + match[1]);
                console.log('从脚本标签中提取资源数据成功');
                break;
              }
            } catch (e) {
              console.error('从脚本中提取资源数据失败:', e);
            }
          }
        }
        
        if (typeof window.resourcesData === 'undefined') {
          throw new Error('资源数据加载失败');
        }
      }
    }

    // 获取DOM元素
    const filterTabsContainer = document.getElementById('filter-tabs');
    const resourceGridContainer = document.getElementById('resource-grid');

    if (!filterTabsContainer || !resourceGridContainer) {
      console.error('找不到必要的DOM元素:', {
        filterTabsContainer: !!filterTabsContainer,
        resourceGridContainer: !!resourceGridContainer
      });
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

    // 标记为已初始化
    window.resourcesInitialized = true;
    console.log('资源页面初始化完成');

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
          <p>请确保 resources.json 文件存在并且格式正确</p>
        </div>
      `;
    }
  }
}

// 当DOM内容加载完成后初始化资源页面
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM内容已加载完成');
  initResourcesPage();
});

// 添加资源页面标识符
if (location.pathname.includes('/resources') || location.pathname.includes('/resource')) {
  document.body.classList.add('resources-page');
  console.log('添加了resources-page类到body');
}