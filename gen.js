// 静态页面生成器（开发期使用；产物直接提交，站点本身零构建）
const fs = require('fs');
const path = require('path');
const D = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'site.json'), 'utf8'));
const OUT = __dirname;
const SITE = (D.siteUrl || 'https://xiaoran-pcb.github.io').replace(/\/$/, '');

const IMG = (p) => 'assets/img/' + p;
const exists = (p) => fs.existsSync(path.join(__dirname, 'assets', 'img', p));

const NAV = [
  ['index.html', '首页'],
  ['lessons.html', '课程'],
  ['gallery.html', '作品'],
  ['about.html', '关于'],
  ['contact.html', '联系'],
];

function head(title, desc, active) {
  const navHtml = NAV.map(([h, t]) =>
    `<a href="${h}"${h === active ? ' class="active"' : ''}>${t}</a>`
  ).join('\n      ');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>` + title + `</title>
<meta name="description" content="` + desc + `">
<meta property="og:type" content="website">
<meta property="og:title" content="` + title + `">
<meta property="og:description" content="` + desc + `">
<meta property="og:image" content="` + SITE + '/assets/img/hero.webp' + `">
<meta name="theme-color" content="#0e1116">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="index.html"><span class="dot"></span>` + D.brand + `</a>
    <button class="nav-toggle" aria-label="打开菜单" aria-expanded="false" aria-controls="nav">\u2630</button>
    <nav class="nav" id="nav">
      ` + navHtml + `
    </nav>
  </div>
</header>
`;
}

const foot = `
<footer class="site-footer">
  <div class="wrap row">
    <span>\u00a9 2025 ` + D.brand + ` \u00b7 PCB 硬件入门课</span>
    <span><a href="contact.html">联系与报名</a></span>
  </div>
</footer>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;

/* ---------------- index ---------------- */
const stageCards = D.stages.map((s) => `
      <article class="stage">
        <h3>` + s.name + `<span class="wk">` + s.n + ` \u00b7 ` + s.weeks + `</span></h3>
        <dl>
          <div><dt>目标</dt><dd>` + s.goal + `</dd></div>
          <div><dt>产出</dt><dd>` + s.out + `</dd></div>
        </dl>
        <p class="gate">` + s.gate + `</p>
      </article>`).join('');

const galleryPicks = [1, 2, 3, 4, 5, 6, 7, 8]
  .filter(function (n) { return exists('gallery/w0' + n + '.webp'); })
  .map(function (n) {
    return '<figure><img src="' + IMG('gallery/w0' + n + '.webp') + '" alt="课堂与作品记录 ' + n + '" loading="lazy" width="1200" height="900"></figure>';
  })
  .join('\n        ');

const indexHtml = head(D.brand + ' \u00b7 PCB 硬件入门课', D.tagline + '\u3002' + D.sub + '\u3002', '/') + `
<main>
  <section class="hero">
    <div class="wrap grid">
      <div>
        <p class="eyebrow">PCB 硬件入门 \u00b7 小班实操</p>
        <h1>从一块电路板开始，<br><span class="hl">做出属于你的作品</span></h1>
        <p class="lead">` + D.tagline + `\u3002` + D.sub + `，每一节都有动手产出，不靠 PPT 讲完就散。</p>
        <div class="cta">
          <a class="btn" href="lessons.html">看完整课程</a>
          <a class="btn ghost" href="contact.html">如何报名</a>
        </div>
      </div>
      <div class="hero-img">
        <img src="` + IMG('hero.webp') + `" alt="焊接实操课堂" width="1600" height="1067" fetchpriority="high">
      </div>
    </div>
    <div class="wrap">
      <div class="stats">
        <div><b>16</b><span>节实操课</span></div>
        <div><b>4</b><span>个进阶阶段</span></div>
        <div><b>0</b><span>基础要求</span></div>
        <div><b>1</b><span>块自己的板</span></div>
      </div>
    </div>
  </section>

  <section class="tinted">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">课程结构</p>
        <h2>四个阶段，一条完整的成长路径</h2>
        <p>从认识元器件到独立打样，每个阶段都有明确的验收关口。过不了关就补练，不带着问题往下走。</p>
      </div>
      <div class="stages">` + stageCards + `
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">课堂记录</p>
        <h2>真的在动手，不是看视频</h2>
        <p>每人一套工具、一块训练板，焊点不合格就返修。</p>
      </div>
      <div class="gallery-grid">
        ` + galleryPicks + `
      </div>
      <p style="margin-top:28px"><a class="btn ghost" href="gallery.html">看全部作品记录</a></p>
    </div>
  </section>

  <section class="tinted">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">结课目标</p>
        <h2>十周之后，你手上会有什么</h2>
      </div>
      <div class="prose">
        <ul>
          <li>一块<b>自己设计、自己焊接、自己调试点亮</b>的 PCB 作品</li>
          <li>一份完整的原理图与 PCB 工程文件</li>
          <li>一张已经下过单的打样订单（含 Gerber 与 BOM）</li>
          <li>一页调试报告：遇到的问题、怎么定位、怎么解决</li>
        </ul>
        <div class="note"><b>说明：</b>结课作品会公开展示评比，作品照片也会放到这个站点上。想保留隐私提前说明即可。</div>
      </div>
    </div>
  </section>
</main>
` + foot;
fs.writeFileSync(path.join(OUT, 'index.html'), indexHtml);

/* ---------------- lessons ---------------- */
const stageOf = [
  [1, '\u9636\u6bb5\u4e00 \u8ba4\u77e5\u542f\u8499', '\u7b2c 1\u20142 \u5468 \u00b7 \u8ba4\u8bc6\u7535\u8def\u677f\u4e0e\u5143\u5668\u4ef6\uff0c\u4f1a\u7528\u57fa\u7840\u5de5\u5177'],
  [3, '\u9636\u6bb5\u4e8c \u710a\u63a5\u5b9e\u6218', '\u7b2c 2\u20144 \u5468 \u00b7 \u4ece\u710a\u63a5\u57fa\u672c\u529f\u5230\u7b2c\u4e00\u4ef6\u901a\u7535\u4f5c\u54c1'],
  [9, '\u9636\u6bb5\u4e09 EDA \u8bbe\u8ba1', '\u7b2c 5\u20146 \u5468 \u00b7 \u7528\u7acb\u521b EDA \u72ec\u7acb\u5b8c\u6210\u539f\u7406\u56fe\u4e0e PCB'],
  [14, '\u9636\u6bb5\u56db \u7efc\u5408\u9879\u76ee', '\u7b2c 7\u20148 \u5468 \u00b7 \u5b8c\u6210\u4e00\u5757\u5c5e\u4e8e\u81ea\u5df1\u7684\u53ef\u70b9\u4eae\u4f5c\u54c1'],
];
function stageName(i) {
  let name = '';
  for (const s of stageOf) if (i >= s[0]) name = s[1];
  return name;
}

const groups = {};
for (const L of D.lessons) (groups[stageName(L.i)] = groups[stageName(L.i)] || []).push(L);

const lessonHtml = Object.keys(groups).map((name) => {
  const meta = stageOf.filter((s) => s[1] === name)[0];
  const items = groups[name].map((L) => {
    const tag = String(L.i).padStart(2, '0');
    const thumb = exists('lessons/' + tag + '.webp')
      ? `<div class="thumb"><img src="` + IMG('lessons/' + tag + '.webp') + `" alt="` + L.topic + `" loading="lazy"></div>`
      : '';
    return `
        <article class="lesson">` + thumb + `
          <div class="body">
            <p class="no">\u7b2c ` + L.i + ` \u8282 \u00b7 ` + L.week + `</p>
            <h4>` + L.topic + `</h4>
            <dl>
              <div><dt>\u672c\u8282\u76ee\u6807</dt><dd>` + L.goal + `</dd></div>
              <div><dt>\u8bfe\u5802\u6d41\u7a0b</dt><dd>` + L.ops + `</dd></div>
              <div><dt>\u5de5\u5177\u6750\u6599</dt><dd>` + L.tools + `</dd></div>
              <div><dt>\u4ea7\u51fa / \u8003\u6838</dt><dd class="out">` + L.out + `</dd></div>
              <div><dt>\u8bfe\u540e</dt><dd>` + L.hw + `</dd></div>
            </dl>
          </div>
        </article>`;
  }).join('');
  return `
    <div class="lesson-stage">
      <h3>` + name + `</h3>
      <p class="meta">` + (meta ? meta[2] : '') + `</p>
      <div class="lessons">` + items + `
      </div>
    </div>`;
}).join('');

const lessonsPage = head('\u8bfe\u7a0b\u5927\u7eb2 \u00b7 ' + D.brand,
  '\u5b8c\u6574 16 \u8282\u8bfe\u5927\u7eb2\uff1a\u4ece\u8ba4\u8bc6 PCB \u5230\u72ec\u7acb\u6253\u6837\uff0c\u6bcf\u8282\u8bfe\u7684\u76ee\u6807\u3001\u6d41\u7a0b\u3001\u5de5\u5177\u4e0e\u8003\u6838\u6807\u51c6\u3002',
  '/lessons.html') + `
<main>
  <section>
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">\u8bfe\u7a0b\u5927\u7eb2</p>
        <h1>16 \u8282\u8bfe\uff0c\u6bcf\u8282\u90fd\u6709\u52a8\u624b\u4ea7\u51fa</h1>
        <p>\u6bcf\u5468\u4e24\u8282\uff0c\u5171 8 \u5468\u6388\u8bfe\u52a0\u7efc\u5408\u9879\u76ee\u3002\u4e0b\u9762\u662f\u6bcf\u4e00\u8282\u7684\u76ee\u6807\u3001\u6d41\u7a0b\u3001\u5de5\u5177\u548c\u8003\u6838\u65b9\u5f0f\uff0c\u62a5\u540d\u524d\u53ef\u4ee5\u5148\u770b\u6e05\u695a\u8981\u5b66\u4ec0\u4e48\u3001\u8981\u505a\u4ec0\u4e48\u3002</p>
      </div>
      ` + lessonHtml + `
    </div>
  </section>
</main>
` + foot;
fs.writeFileSync(path.join(OUT, 'lessons.html'), lessonsPage);

/* ---------------- gallery ---------------- */
const galItems = (D.gallery || []).filter(function (g) { return exists('gallery/' + g.f + '.webp'); }).map(function (g) {
  return '<figure><img src="' + IMG('gallery/' + g.f + '.webp') + '" alt="' + g.cap + '" loading="lazy"><figcaption>' + g.cap + '</figcaption></figure>';
});

const galleryPage = head('\u4f5c\u54c1\u4e0e\u8bfe\u5802\u8bb0\u5f55 \u00b7 ' + D.brand,
  '\u710a\u63a5\u8bad\u7ec3\u3001\u5723\u8bde\u6811\u5957\u4ef6\u3001EDA \u8bbe\u8ba1\u4e0e\u7ed3\u8bfe\u4f5c\u54c1\u7684\u7167\u7247\u8bb0\u5f55\u3002',
  '/gallery.html') + `
<main>
  <section>
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">\u4f5c\u54c1\u4e0e\u8bfe\u5802</p>
        <h1>\u710a\u8fc7\u7684\u6bcf\u4e00\u5757\u677f\uff0c\u90fd\u7559\u4e86\u8bb0\u5f55</h1>
        <p>\u70b9\u51fb\u4efb\u610f\u56fe\u7247\u653e\u5927\u67e5\u770b\u3002</p>
      </div>
      <div class="gallery-grid">
        ` + galItems.join('\n        ') + `
      </div>
    </div>
  </section>
</main>
<div class="lb" id="lightbox" role="dialog" aria-modal="true" aria-label="\u56fe\u7247\u653e\u5927">
  <button class="close" aria-label="\u5173\u95ed">\u00d7</button>
  <img alt="">
</div>
` + foot;
fs.writeFileSync(path.join(OUT, 'gallery.html'), galleryPage);

/* ---------------- about ---------------- */
const aboutPage = head('\u5173\u4e8e \u00b7 ' + D.brand,
  D.brand + '\u7684 PCB \u786c\u4ef6\u5165\u95e8\u8bfe\uff1a\u4e3a\u4ec0\u4e48\u5f00\u8fd9\u95e8\u8bfe\u3001\u600e\u4e48\u6559\u3001\u9700\u8981\u4ec0\u4e48\u57fa\u7840\u3002',
  '/about.html') + `
<main>
  <section>
    <div class="wrap prose">
      <p class="eyebrow">\u5173\u4e8e\u8fd9\u95e8\u8bfe</p>
      <h1>\u4e3a\u4ec0\u4e48\u5f00\u8fd9\u95e8\u8bfe</h1>
      <p>\u5f88\u591a\u540c\u5b66\u5bf9\u786c\u4ef6\u611f\u5174\u8da3\uff0c\u4f46\u5361\u5728\u7b2c\u4e00\u6b65\uff1a<strong>\u4e0d\u77e5\u9053\u4ece\u54ea\u4e0b\u624b</strong>\u3002\u4e70\u6765\u7684\u5957\u4ef6\u710a\u5b8c\u5c31\u653e\u7740\uff0c\u539f\u7406\u8bf4\u4e0d\u6e05\uff1b\u7f51\u4e0a\u7684\u6559\u7a0b\u8981\u4e48\u8df3\u6b65\uff0c\u8981\u4e48\u76f4\u63a5\u4e0a\u4eff\u771f\uff0c\u624b\u4e0a\u6ca1\u611f\u89c9\u3002</p>
      <p>\u8fd9\u95e8\u8bfe\u628a\u8def\u5f84\u62c6\u7ec6\u4e86\u2014\u2014\u5148\u6478\u6e05\u695a\u4e00\u5757\u677f\u5b50\u957f\u4ec0\u4e48\u6837\uff0c\u518d\u7ec3\u5230\u710a\u70b9\u80fd\u8fc7\u5173\uff0c\u7136\u540e\u5b66\u4f1a\u753b\u56fe\u3001\u4e0b\u5355\u3001\u628a\u677f\u5b50\u505a\u51fa\u6765\u3001\u70b9\u4eae\u5b83\u3002<strong>\u6bcf\u4e00\u8282\u90fd\u5fc5\u987b\u52a8\u624b\uff0c\u6bcf\u4e00\u8282\u90fd\u6709\u53ef\u4ee5\u5e26\u8d70\u7684\u4e1c\u897f\u3002</strong></p>

      <h2>\u600e\u4e48\u6559</h2>
      <ul>
        <li><strong>\u5c0f\u73ed\u5b9e\u64cd</strong>\uff1a\u6bcf\u4eba\u4e00\u5957\u5de5\u5177\u548c\u6750\u6599\uff0c\u4e0d\u662f\u5206\u7ec4\u5171\u7528</li>
        <li><strong>\u5173\u53e3\u5236</strong>\uff1a\u710a\u70b9\u5408\u683c\u7387\u4e0d\u5230 90% \u5c31\u8865\u7ec3\uff0c\u4e0d\u5e26\u7740\u95ee\u9898\u8fdb\u4e0b\u4e00\u9636\u6bb5</li>
        <li><strong>\u771f\u6253\u6837</strong>\uff1a\u7ed3\u8bfe\u4e0d\u662f\u4ea4\u4f5c\u4e1a\uff0c\u662f\u628a\u677f\u5b50\u771f\u7684\u4e0b\u5355\u505a\u51fa\u6765</li>
        <li><strong>\u6545\u969c\u590d\u76d8</strong>\uff1a\u710a\u574f\u4e86\u3001\u70e7\u4e86\u3001\u4e0d\u4eae\uff0c\u90fd\u8981\u5199\u6e05\u695a\u662f\u600e\u4e48\u5b9a\u4f4d\u7684</li>
      </ul>

      <h2>\u9700\u8981\u4ec0\u4e48\u57fa\u7840</h2>
      <p><strong>\u96f6\u57fa\u7840\u5373\u53ef\u3002</strong>\u4e0d\u8981\u6c42\u4f1a\u7f16\u7a0b\u3001\u4e0d\u8981\u6c42\u5b66\u8fc7\u7535\u8def\u3002\u9700\u8981\u7684\u662f\uff1a\u613f\u610f\u52a8\u624b\u3001\u80fd\u6309\u65f6\u6765\u3001\u4e0d\u6015\u628a\u4e1c\u897f\u710a\u574f\u3002</p>
      <div class="note"><b>\u5173\u4e8e\u5b89\u5168\uff1a</b>\u8bfe\u7a0b\u6d89\u53ca\u7535\u70d9\u94c1\u3001\u52a9\u710a\u5242\u548c\u901a\u7535\u6d4b\u8bd5\uff0c\u7b2c\u4e00\u8282\u8bfe\u5c31\u4f1a\u8bb2\u5b89\u5168\u89c4\u8303\u5e76\u7b7e\u5b57\u786e\u8ba4\u3002</div>

      <h2>\u9700\u8981\u51c6\u5907\u4ec0\u4e48</h2>
      <ul>
        <li>\u5de5\u5177\u4e0e\u8017\u6750\u7531\u8bfe\u7a0b\u7edf\u4e00\u63d0\u4f9b\uff08\u7535\u70d9\u94c1\u3001\u4e07\u7528\u8868\u3001\u9521\u4e1d\u3001\u52a9\u710a\u5242\u3001\u8bad\u7ec3\u677f\u7b49\uff09</li>
        <li>EDA \u8bbe\u8ba1\u9636\u6bb5\u9700\u8981\u4e00\u53f0\u80fd\u88c5\u6d4f\u89c8\u5668\u7684\u7535\u8111\uff08\u7acb\u521b EDA \u7f51\u9875\u7248\u5373\u53ef\uff09</li>
        <li>\u6253\u6837\u8d39\u7528\u6309\u5b9e\u9645\u4e0b\u5355\u91d1\u989d\u81ea\u7406\uff0c\u4e00\u822c\u5728\u51e0\u5341\u5143\u4ee5\u5185</li>
      </ul>

      <h2>\u8bfe\u7a0b\u4e4b\u5916</h2>
      <p>\u8fd9\u4e2a\u7ad9\u70b9\u540c\u65f6\u7528\u6765\u6c89\u6dc0\u8bfe\u7a0b\u8d44\u6599\u3001\u8bfe\u5802\u8bb0\u5f55\u548c\u7ed3\u8bfe\u4f5c\u54c1\u3002\u6709\u60f3\u5b66\u7684\u65b9\u5411\u3001\u60f3\u505a\u7684\u9879\u76ee\uff0c\u968f\u65f6\u627e\u6211\u804a\u3002</p>
    </div>
  </section>
</main>
` + foot;
fs.writeFileSync(path.join(OUT, 'about.html'), aboutPage);

/* ---------------- contact ---------------- */
const contactPage = head('\u8054\u7cfb\u4e0e\u62a5\u540d \u00b7 ' + D.brand,
  'PCB \u786c\u4ef6\u5165\u95e8\u8bfe\u7684\u54a8\u8be2\u4e0e\u62a5\u540d\u65b9\u5f0f\u3002',
  '/contact.html') + `
<main>
  <section>
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">\u8054\u7cfb</p>
        <h1>\u60f3\u5b66\u3001\u60f3\u62a5\u540d\u3001\u60f3\u95ee\u95ee\u9898</h1>
        <p>\u8bfe\u7a0b\u7531\u6211\u5e26\uff0c\u62a5\u540d\u8d70\u793e\u56e2\u901a\u9053\u3002</p>
      </div>
      <div class="contact-card">
        <dl>
          <div><dt>\u62a5\u540d\u65b9\u5f0f</dt><dd>\u5148\u52a0\u5165` + (D.club || '\u793e\u56e2') + `\u5e76\u8fdb\u5176\u62db\u65b0\u7fa4\uff0c\u518d\u5728\u7fa4\u91cc\u62a5\u540d\u8bfe\u7a0b</dd></div>
          <div><dt>\u5fae\u4fe1</dt><dd>\u5f00\u8bfe\u65f6\u516c\u5e03\uff0c\u6216\u73b0\u573a\u626b\u7801</dd></div>
          <div><dt>\u90ae\u7bb1</dt><dd><a href="mailto:` + D.email + `">` + D.email + `</a></dd></div>
          <div><dt>\u4e0a\u8bfe\u5730\u70b9</dt><dd>\u5b9e\u8bad\u5ba4\uff08\u62a5\u540d\u540e\u901a\u77e5\u5177\u4f53\u6559\u5ba4\uff09</dd></div>
          <div><dt>\u5f00\u8bfe\u65f6\u95f4</dt><dd>\u6bcf\u5b66\u671f\u521d\u5f00\u73ed\uff0c\u6bcf\u5468\u4e24\u8282\uff0c\u5171 8 \u5468</dd></div>
          <div><dt>\u4eba\u6570</dt><dd>\u5c0f\u73ed\u6559\u5b66\uff0c\u540d\u989d\u6709\u9650</dd></div>
        </dl>
      </div>
      <div class="note" style="margin-top:24px"><b>\u63d0\u793a\uff1a</b>\u8054\u7cfb\u65b9\u5f0f\u8bf7\u4ee5\u6700\u65b0\u901a\u77e5\u4e3a\u51c6\u3002</div>
    </div>
  </section>
</main>
` + foot;
fs.writeFileSync(path.join(OUT, 'contact.html'), contactPage);

/* ---------------- 404 ---------------- */
fs.writeFileSync(path.join(OUT, '404.html'), head('\u9875\u9762\u4e0d\u5b58\u5728 \u00b7 ' + D.brand, '\u8fd9\u4e2a\u9875\u9762\u4e0d\u5b58\u5728\u3002', '') + `
<main>
  <section>
    <div class="wrap prose" style="text-align:center">
      <p class="eyebrow">404</p>
      <h2>\u8fd9\u4e2a\u9875\u9762\u4e0d\u5728\u4e86</h2>
      <p>\u53ef\u80fd\u662f\u94fe\u63a5\u5199\u9519\u4e86\uff0c\u6216\u8005\u5185\u5bb9\u5df2\u7ecf\u8c03\u6574\u3002</p>
      <p style="margin-top:24px"><a class="btn" href="index.html">\u56de\u5230\u9996\u9875</a></p>
    </div>
  </section>
</main>
` + foot);

console.log('generated: index, lessons, gallery, about, contact, 404');

/* ---------------- 后处理：子路径部署 ---------------- */
const BASE = (D.base || '').replace(/\/$/, '');
if (BASE) {
  const files = ['index.html', 'lessons.html', 'gallery.html', 'about.html', 'contact.html', '404.html'];
  for (const f of files) {
    const p = path.join(OUT, f);
    let html = fs.readFileSync(p, 'utf8');
    html = html
      .replace(/(href|src)="\/(?!\/)/g, '$1="' + BASE + '/')
      .replace(/content="(https:\/\/[^"]+?)\/assets/g, 'content="$1' + BASE + '/assets');
    fs.writeFileSync(p, html);
  }
  console.log('base prefix applied:', BASE);
}

