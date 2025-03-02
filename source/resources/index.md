---
title: 资源导航
date: 2023-01-01
type: "page"
comments: false
aside: true
---

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

<script src="/js/resources-data.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
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
</script>