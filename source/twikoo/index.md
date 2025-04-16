---
title: Twikoo测试
date: 2024-07-16 12:00:00
type: 'twikoo'
comments: true
aside: false
top_img: https://cdn.pixabay.com/photo/2020/04/28/14/08/cloud-5104277_1280.jpg
---

## Twikoo评论测试页面

这是一个用于测试Twikoo评论系统的页面。请在下方留言测试评论功能是否正常工作。

<div id="twikoo-container"></div>

<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.30/dist/twikoo.all.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  twikoo.init({
    envId: 'twikoogo.netlify.app', // 替换为你的环境ID
    el: '#twikoo-container',
    region: 'ap-shanghai', // 腾讯云环境地域，默认为ap-shanghai
    path: 'window.location.pathname', // 用于区分不同文章的自定义 ID
    lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/dev/src/js/utils/i18n/index.js
    onCommentLoaded: function() {
      console.log('评论加载完成');
    }
  });
});
</script>

<style>
/* 美化Twikoo评论区 */
#twikoo-container {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: #fff;
}

.tk-comments-container {
  margin-top: 1rem;
}

.tk-submit {
  border-radius: 4px !important;
  transition: all 0.3s ease !important;
}

.tk-submit:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.tk-avatar {
  border-radius: 50%;
  overflow: hidden;
}

.tk-content {
  margin-top: 0.5rem;
  line-height: 1.6;
}

.tk-action-icon {
  transition: transform 0.2s ease;
}

.tk-action-icon:hover {
  transform: scale(1.2);
}

.tk-comment {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tk-comment:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}
</style> 