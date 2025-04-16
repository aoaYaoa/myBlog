---
title: 关于我
date: 2024-02-20 16:21:30
comments: true
top_img: https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80
aside: false
---

<div class="about-container">
<!-- 引用 artitalk - 更新为稳定版本 -->
<script src="https://cdn.jsdelivr.net/npm/artitalk"></script>
<!-- 确保 jQuery 也被加载 -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>

<!-- 存放说说的容器 -->
<div id="artitalk_main"></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // 确保DOM和脚本都已加载完成
  if (typeof Artitalk === 'undefined') {
    console.error('Artitalk 未加载，尝试重新加载');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/artitalk';
    script.onload = initArtitalk;
    document.head.appendChild(script);
  } else {
    initArtitalk();
  }
  
  function initArtitalk() {
    if (typeof Artitalk !== 'undefined') {
      new Artitalk({
        appId: 'ogP8qj3veMh0LFpFWMPOyF0X-MdYXbMMI',
        appKey: 'nHXLd3N3Jgh460t2iRQKWAtr',
        shuoPla: 'Demo页密码：123456',
        bgImg: 'https://cdn.jsdelivr.net/gh/drew233/cdn/20200409110727.webp',
        atEmoji: {
          huaji: 'https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.9/img/Sakura/images/smilies/icon_huaji.gif',
          baiyan: 'https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/baiyan.png',
          bishi: 'https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/bishi.png',
          bizui: 'https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/bizui.png',
          chan: 'https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/chan.png'
        }
      });
      console.log('Artitalk 初始化成功');
    } else {
      console.error('Artitalk 仍未加载，请检查网络或CDN状态');
    }
  }
});
</script>

<style>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* Artitalk 样式优化 */
#artitalk_main {
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
}

.shuoshuo_text {
  font-size: 1.1rem;
  line-height: 1.8;
}

/* 加载中动画 */
.load_button {
  background-color: #6495ED !important;
}

</style>
