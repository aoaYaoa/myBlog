/* 把resources.html中的JavaScript代码复制到这里 */

// 在文件开头添加这段代码，确保优先执行
(function() {
  // 简单检测是否为资源页面 - 基于URL路径
  if (location.pathname.includes('/resources') ||
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

document.addEventListener('DOMContentLoaded', function() {
  // 如果页面已经初始化过，避免重复执行
  if (window.resourcesInitialized) {
    console.log('资源页面已通过内联脚本初始化，跳过外部初始化');
    return;
  }

  try {
    // 检查resourcesData是否已加载
    if (typeof resourcesData === 'undefined') {
      throw new Error('资源数据加载失败');
    }

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

    // 标记为已初始化
    window.resourcesInitialized = true;

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
        </div>
      `;
    }
  }
});

// 检测当前页面是否为资源页面并确保CSS加载
(function() {
  const isResourcePage =
    window.location.pathname.includes('resources') ||
    document.title.includes('资源') ||
    document.querySelector('.resources-container') !== null;

  // 如果是资源页面，添加CSS
  if (isResourcePage) {
    // 检查CSS是否已加载
    const cssLoaded = Array.from(document.querySelectorAll('link')).some(link => 
      link.href && link.href.includes('resources.css')
    );
    
    if (!cssLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/resources.css';
      document.head.appendChild(link);
      console.log('已通过JS动态加载resources.css');
    }
  }
})();

// 添加资源页面标识符
if (location.pathname.includes('/resources')) {
  document.body.classList.add('resources-page');
}