---
title: 日常琐事
date: 2024-07-15 09:30:28
type: 'artitalk'
comments: 'false'
aside: false
top_img: https://cdn.pixabay.com/photo/2023/06/20/01/31/ai-generated-8075771_640.jpg
---
<!-- 引用 artitalk -->
<!-- 存放说说的容器 -->
<div id="artitalk_main"></div>
<script type="text/javascript" src="https://unpkg.com/artitalk"></script>
<script>
new Artitalk({
  serverURL: '',// Your 
  appId: '5pB5BIvFu3QTOgB2inesJkUe-MdYXbMMI', // Your LeanCloud 
  appKey: 'PR2rQBGitw6P7d8LF0GwrrdY', // Your LeanCloud appKey
  color1: 'linear-gradient(45deg,rgba(109,208,242,0.75) 15%,rgba(245,154,190,0.75) 85%)',
  color2: 'linear-gradient(45deg,rgba(109,208,242,0.75) 15%,rgba(245,154,190,0.75) 85%)',
  color3: 'linear-gradient(45deg,rgba(109,208,242,0.75) 15%,rgba(245,154,190,0.75) 85%)',
  lang:'zh',
  pageSize:'5',
  shuoPla:"",
  avatarPla:"",
  motion:1,
  bgImg:"",
  atEmoji: {
    baiyan: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/baiyan.png",
    bishi: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/bishi.png",
    bizui: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/bizui.png",
    chan: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/chan.png",
    daku: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/daku.png",
    dalao: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/dalao.png",
    dalian: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/dalian.png",
    dianzan: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/dianzan.png",
    doge: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/doge.png",
    facai: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/facai.png",
    fadai: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/fadai.png",
    fanu: "https://cdn.jsdelivr.net/gh/Artitalk/Artitalk-emoji/fanu.png",
  },
  cssUrl:"",
  atComment:1
});
// 动态设置按钮样式，使用color1的值
document.addEventListener('DOMContentLoaded', function() {
  // 等待Artitalk加载完成
  setTimeout(function() {
    const buttons = document.querySelectorAll('#artitalk_main .at_button');
    buttons.forEach(button => {
      button.style.backgroundColor = 'linear-gradient(45deg,rgba(109,208,242,0.75) 15%,rgba(245,154,190,0.75) 85%)';
      button.style.color = '#fff';
      button.style.borderRadius = '4px';
    });
  }, 1000);
});
</script>
<style>
    #artitalk_main .at_button {
      transition: all 0.3s ease !important;
    }
    
    #artitalk_main .at_button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    /* 美化表情 */
    .atemoji {
      transition: transform 0.2s ease;
    }
    .atemoji:hover {
      transform: scale(1.2);
    }
</style>

