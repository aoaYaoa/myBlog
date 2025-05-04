// 这个文件会自动引入脚本
// 可以添加自定义JavaScript

// 优化文章标题显示
document.addEventListener('DOMContentLoaded', function() {
  const title = document.querySelector('.article-sort-title');
  if (title) {
    const text = title.textContent;
    // 查找标题中的数字部分
    const match = text.match(/(\d+)$/);
    if (match) {
      // 分离标题和数字
      const newText = text.replace(/ - \d+$/, '');
      title.innerHTML = `${newText} <span>${match[0]}</span>`;
    }
  }
});

// 年份折叠功能
document.addEventListener('DOMContentLoaded', function() {
  // 找到所有年份项
  const yearItems = document.querySelectorAll('.article-sort-item.year');

  // 为每个年份项添加折叠/展开功能
  yearItems.forEach(yearItem => {
    // 添加折叠图标
    const foldIcon = document.createElement('span');
    foldIcon.className = 'fold-icon';
    foldIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
    yearItem.appendChild(foldIcon);

    // 默认展开当前年份，折叠其他年份
    const currentYear = new Date().getFullYear().toString();
    const yearText = yearItem.textContent.trim();
    const isCurrentYear = yearText.includes(currentYear);

    // 获取该年份后面的所有文章，直到下一个年份
    let nextItem = yearItem.nextElementSibling;
    const articleItems = [];

    while (nextItem && !nextItem.classList.contains('year')) {
      articleItems.push(nextItem);
      nextItem = nextItem.nextElementSibling;
    }

    // 如果不是当前年份，则折叠
    if (!isCurrentYear) {
      foldIcon.innerHTML = '<i class="fas fa-chevron-right"></i>';
      articleItems.forEach(item => {
        item.style.display = 'none';
      });
      yearItem.classList.add('folded');
    }

    // 添加点击事件
    yearItem.addEventListener('click', function(e) {
      // 切换折叠状态
      const isFolded = this.classList.contains('folded');

      // 如果要展开当前年份，则折叠其他所有年份
      if (isFolded) {
        // 先折叠所有其他年份
        yearItems.forEach(otherYearItem => {
          if (otherYearItem !== this && !otherYearItem.classList.contains('folded')) {
            toggleYearFolding(otherYearItem, true);
          }
        });
        // 然后展开当前年份
        toggleYearFolding(this, false);
      } else {
        // 折叠当前年份
        toggleYearFolding(this, true);
      }
    });
  });
});

// 添加全局折叠/展开函数
function toggleYearFolding(yearItem, fold) {
  const foldIcon = yearItem.querySelector('.fold-icon');

  // 获取该年份后面的所有文章，直到下一个年份
  let nextItem = yearItem.nextElementSibling;
  const articleItems = [];

  while (nextItem && !nextItem.classList.contains('year')) {
    articleItems.push(nextItem);
    nextItem = nextItem.nextElementSibling;
  }

  if (fold) {
    // 折叠
    foldIcon.innerHTML = '<i class="fas fa-chevron-right"></i>';
    articleItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(-10px)';
      // 等待动画完成后隐藏
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    });
    yearItem.classList.add('folded');
  } else {
    // 展开
    foldIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
    articleItems.forEach(item => {
      item.style.display = '';
      // 添加动画
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 10);
    });
    yearItem.classList.remove('folded');
  }
}

// 为文章卡片添加"阅读更多"按钮
document.addEventListener('DOMContentLoaded', function() {
  // 为首页文章卡片添加"阅读更多"按钮
  const recentPosts = document.querySelectorAll('.recent-post-item');

  recentPosts.forEach(post => {
    // 如果已经有阅读更多按钮，则不添加
    if (post.querySelector('.read-more-btn')) return;

    const postInfo = post.querySelector('.recent-post-info');
    if (!postInfo) return;

    const articleTitle = post.querySelector('.article-title');
    if (!articleTitle) return;

    const articleLink = articleTitle.getAttribute('href');
    if (!articleLink) return;

    // 创建阅读更多按钮
    const readMoreBtn = document.createElement('a');
    readMoreBtn.className = 'read-more-btn';
    readMoreBtn.href = articleLink;
    readMoreBtn.innerHTML = '阅读全文 <i class="fas fa-angle-right"></i>';

    // 添加到文章信息区域
    postInfo.appendChild(readMoreBtn);
  });
});

// 添加图片加载动画
document.addEventListener('DOMContentLoaded', function() {
  const postImages = document.querySelectorAll('.recent-post-item .post_cover img');
  postImages.forEach(img => {
    // 添加加载完成的类
    img.addEventListener('load', function() {
      this.classList.add('img-loaded');
    });

    // 如果图片已经加载完成
    if (img.complete) {
      img.classList.add('img-loaded');
    }
  });
});

// 直接修改DOM元素样式
document.addEventListener('DOMContentLoaded', function() {
  console.log("应用直接DOM样式");

  // 获取所有文章卡片
  const posts = document.querySelectorAll('#recent-posts > .recent-post-item');

  if (posts.length === 0) {
    console.log("没有找到文章卡片");
    return;
  }

  console.log(`找到${posts.length}个文章卡片`);

  // 应用初始样式
  posts.forEach(post => {
    post.style.position = 'relative';
    post.style.opacity = '0';
    post.style.transform = 'translateY(30px)';
    post.style.transition = 'all 0.8s ease-out';
    post.style.borderLeft = '5px solid #ff6b6b';
  });

  // 依次添加动画
  setTimeout(() => {
    posts.forEach((post, index) => {
      setTimeout(() => {
        // 应用动画后样式
        post.style.opacity = '1';
        post.style.transform = 'translateY(0)';
        post.style.borderLeft = '5px solid #51cf66';

        // 添加悬停效果
        post.addEventListener('mouseenter', () => {
          post.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
        });

        post.addEventListener('mouseleave', () => {
          post.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });

        console.log(`已为第${index+1}个卡片应用样式`);
      }, index * 200);
    });
  }, 500);
});

// 简化的动画触发逻辑
document.addEventListener('DOMContentLoaded', function() {
  console.log("启动简化版动画");

  // 找到所有文章卡片
  const recentPosts = document.querySelectorAll('#recent-posts > .recent-post-item');

  if (recentPosts.length === 0) {
    console.log("警告：没有找到文章卡片元素");
    return;
  }

  console.log(`找到${recentPosts.length}个文章卡片`);

  // 立即给第一个卡片添加动画类，作为测试
  setTimeout(() => {
    if (recentPosts[0]) {
      recentPosts[0].classList.add('animated');
      console.log("已给第一个卡片添加animated类");
    }
  }, 1000);

  // 3秒后给所有卡片添加动画类
  setTimeout(() => {
    recentPosts.forEach((post, index) => {
      setTimeout(() => {
        post.classList.add('animated');
        console.log(`已给第${index+1}个卡片添加animated类`);
      }, index * 300);
    });
  }, 3000);

  // 创建一个更醒目的调试按钮
  const debugBtn = document.createElement('button');
  debugBtn.textContent = '立即触发所有动画';
  debugBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px 15px; background: linear-gradient(45deg, #ff6b6b, #ff6b81); color: white; border: none; border-radius: 5px; font-weight: bold; box-shadow: 0 5px 15px rgba(255,107,107,0.3);';

  debugBtn.addEventListener('click', function() {
    recentPosts.forEach(post => {
      post.classList.add('animated');
    });
    console.log('已触发所有卡片动画');
    // 更改按钮样式表示已触发
    this.style.background = 'linear-gradient(45deg, #51cf66, #20bf6b)';
    this.textContent = '动画已触发';
  });

  document.body.appendChild(debugBtn);
});

// 添加此代码以直接应用内联样式
document.addEventListener('DOMContentLoaded', function() {
  // 创建一个<style>元素并添加到头部
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #recent-posts > .recent-post-item {
      position: relative;
      opacity: 0.5 !important;
      transform: translateY(30px) !important;
      transition: all 0.8s ease-out !important;
      border-left: 5px solid red !important;
    }

    #recent-posts > .recent-post-item.animated {
      opacity: 1 !important;
      transform: translateY(0) !important;
      border-left: 5px solid green !important;
    }
  `;
  document.head.appendChild(styleElement);
  console.log("已添加内联样式");
});

// 使用新的类名
document.addEventListener('DOMContentLoaded', function() {
  const posts = document.querySelectorAll('#recent-posts > .recent-post-item');

  posts.forEach(post => {
    post.classList.add('aoa-fade-in');

    setTimeout(() => {
      post.classList.add('active');
    }, 500);
  });
});

// 为文章列表添加动画效果
document.addEventListener('DOMContentLoaded', function() {
  // 找到所有文章项
  const articleItems = document.querySelectorAll('.article-sort-item:not(.year)');

  if (articleItems.length > 0) {
    articleItems.forEach((item, index) => {
      // 设置初始状态
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';

      // 添加延迟动画
      setTimeout(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 + (index * 50)); // 每项延迟50ms
    });
  }
});