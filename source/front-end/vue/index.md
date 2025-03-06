---
title: Vue.js 实战指南
date: 2023-01-01
layout: page
comment: true
aside: true
top_img: /img/vue-bg.jpg
---

{% raw %}{% tabs vue-frame,3 %}
<!-- tab 核心概念 -->
{% folding 响应式原理 :: cyan open %}
```typescript Vue响应式原理
// 简化的响应式实现
class Dep {
  static target: Watcher | null
  subs: Watcher[] = []
  // ...实现依赖收集
}

class Watcher {
  // ...实现更新机制
}
```
{% endfolding %}
<!-- endtab -->

<!-- tab 状态管理 -->
```mermaid
graph TD
A[Vue Component] -->|dispatch| B(Action)
B --> C(Mutation)
C --> D(State)
D -->|render| A
```
<!-- endtab -->
{% endtabs %}{% endraw %}