---
title: 关于我
date: 2024-02-20 16:21:30
comments: true
top_img: https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80
aside: false
---

<div class="about-container">

<center><h1>aoaYaoa</h1></center>

{% note success modern %}
**峡谷召唤师 | 现役黄金裔 | 不羡仙少东家**
{% endnote %}

## 🌍 峡谷轨迹
<div class="game-card">
  <div class="timeline-header">
    <img src="https://img.icons8.com/color/48/league-of-legends.png" alt="LOL">
    <h3>征战时间线</h3>
  </div>
  ```timeline
  title: 段位进化史
  section 2021-2022
  英勇黄铜 · 挨打新人期
  日均死亡10+次
  
  section 2023
  不屈白银 · 意识觉醒
  主玩辅助位，擅长插眼
  
  section 2024
  荣耀黄金 · 混分巨兽
  掌握"稳住别送"终极奥义
  ```
</div>

## 🎮 游戏数据
<div class="stats-grid">
  <div class="stat-card">
    <img src="https://img.icons8.com/color/48/kda.png" alt="KDA">
    <h4>2.8</h4>
    <p>场均KDA</p>
  </div>
  <div class="stat-card">
    <img src="https://img.icons8.com/color/48/vision-score.png" alt="视野">
    <h4>35</h4>
    <p>平均视野分</p>
  </div>
  <div class="stat-card">
    <img src="https://img.icons8.com/color/48/poro.png" alt="魄罗">
    <h4>127</h4>
    <p>收集魄罗</p>
  </div>
</div>

## 🌍 我的足迹
```timeline
title: 人生时间轴
section 2021-至今
在峡谷中挨打

section 2023-至今
太空戏剧中开拓！开拓！！还是开拓！！！

section 2024至今
在开封闲逛
```

## 📸 高光时刻
<div class="horizontal-gallery">
  <div class="gallery-scroll">
    <div class="gallery-item">
      <img src="https://picsum.photos/400/300?random=1" alt="战场瞬间">
      <div class="caption">五杀时刻</div>
    </div>
    <div class="gallery-item">
      <img src="https://picsum.photos/400/300?random=2" alt="战略部署">
      <div class="caption">完美眼位</div>
    </div>
    <div class="gallery-item">
      <img src="https://picsum.photos/400/300?random=3" alt="团队协作">
      <div class="caption">龙团决胜</div>
    </div>
    <div class="gallery-item">
      <img src="https://picsum.photos/400/300?random=4" alt="逆风翻盘">
      <div class="caption">水晶丝血反杀</div>
    </div>
  </div>
</div>

## 🎨 生活志趣
<div class="hobbies-grid">
  <div class="hobby-item">
    <img src="https://img.icons8.com/fluency/48/coffee-beans-.png" alt="咖啡">
    <p>每天的手冲仪式</p>
  </div>
  <div class="hobby-item">
    <img src="https://img.icons8.com/fluency/48/book.png" alt="阅读">
    <p>偏爱推理小说</p>
  </div>
  <div class="hobby-item">
    <img src="https://img.icons8.com/fluency/48/bicycle.png" alt="骑行">
    <p>周末西湖环线</p>
  </div>
  <div class="hobby-item">
    <img src="https://img.icons8.com/fluency/48/kitchen.png" alt="料理">
    <p>日式家庭料理</p>
  </div>
</div>

## 都是瞎写的！！！

## ☕ 找到我
<div class="contact-box">
  <div class="contact-item">
    <i class="fas fa-map-marker-alt"></i>
    <span>召唤师峡谷</span>
  </div>
  <div class="contact-item">
    <i class="fas fa-coffee"></i>
    <span>翁法罗斯</span>
  </div>
  <div class="contact-item">
    <i class="fas fa-envelope"></i>
    <a href="mailto:your@email.com">your@email.com</a>
  </div>
</div>

<style>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.horizontal-gallery {
  margin: 2rem 0;
  position: relative;
}

.gallery-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1.5rem;
  padding: 1rem 0;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.gallery-scroll::-webkit-scrollbar {
  display: none;
}

.gallery-item {
  scroll-snap-align: start;
  flex: 0 0 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  position: relative;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  padding: 1rem;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* 游戏风格装饰 */
.gallery-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid rgba(255,215,0,0.3);
  border-radius: 12px;
  pointer-events: none;
}

.hobbies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

.hobby-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.hobby-item:hover {
  transform: translateY(-5px);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.contact-box {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  font-size: 1.1rem;
}

.contact-item i {
  width: 30px;
  color: #555;
}

.timeline-wrapper {
  border-left: 3px solid #ddd;
  padding-left: 2rem;
  margin: 2rem 0;
}

/* 游戏主题配色 */
:root {
  --gold: #ffd700;
  --blue: #1da1f2;
  --dark-bg: #1a1a1a;
}

.game-card {
  background: rgba(255,215,0,0.1);
  border: 2px solid var(--gold);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.timeline-header img {
  filter: drop-shadow(0 0 5px var(--gold));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

.stat-card {
  background: var(--dark-bg);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255,255,255,0.1);
}

.stat-card:hover {
  transform: translateY(-5px);
  background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
}

.stat-card img {
  filter: drop-shadow(0 0 8px var(--blue));
}

.stat-card h4 {
  color: var(--gold);
  font-size: 2rem;
  margin: 0.5rem 0;
}

/* 动态边框效果 */
.game-card::after {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, 
    var(--gold) 20%, 
    transparent 40%,
    transparent 60%,
    var(--blue) 80%);
  z-index: -1;
  animation: borderGlow 3s linear infinite;
  border-radius: 15px;
}

@keyframes borderGlow {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .game-card {
    margin: 1rem 0;
    padding: 1rem;
  }
  
  .gallery-item {
    flex: 0 0 250px;
  }
  
  .caption {
    font-size: 1rem;
    padding: 0.8rem;
  }
}
</style>