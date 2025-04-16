// const cheerio = require('cheerio');

// hexo.extend.filter.register('after_render:html', function(html, data) {
//   const $ = cheerio.load(html);

//   if (!data.page) return html;

//   // 获取页面路径和标题用于判断
//   const path = data.page.path || '';
//   const title = data.page.title || '';
//   const layout = data.page.layout || '';

//   // 多种方式检测资源页面
//   const isResourcePage =
//     path.includes('resources') ||
//     title.includes('资源') ||
//     title.includes('Resource') ||
//     layout === 'resources' ||
//     $('#resource-container').length > 0 || // 检查页面中是否有特定容器
//     $('.resource-card').length > 0;        // 检查页面中是否有资源卡片

//   // 为资源页面添加resources.css
//   if (isResourcePage) {
//     // 检查是否已经加载了resources.css
//     const alreadyLoaded = $('link[href*="resources.css"]').length > 0;

//     if (!alreadyLoaded) {
//       $('head').append('<link rel="stylesheet" href="/css/resources.css">');
//       console.log('已为资源页面添加resources.css');
//     }
//   }

//   return $.html();
// });
