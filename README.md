# 小冉学长 · PCB 硬件入门课

静态站点，无构建步骤。所有页面由 `gen.js` 从 `data/site.json` 生成。

## 线上地址

https://xiaoran-pcb.github.io

## 目录

```
xiaoran-site/
├── index.html         首页
├── lessons.html       课程大纲（16 节）
├── gallery.html       作品与课堂记录
├── about.html         关于这门课
├── contact.html       联系与报名
├── 404.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/           WebP，全部由 build_images.py 生成
├── data/site.json     内容源（改这里，别改 HTML）
├── build_images.py    源图 → WebP
├── gen.js             生成 HTML
├── robots.txt / sitemap.xml / favicon.svg / .nojekyll
└── _shots/            验收截图（不进版本库）
```

## 怎么改内容

**不要直接改 HTML**——下次跑 `gen.js` 会被覆盖。

1. 改 `data/site.json`（文案、课程、图注、联系方式）
2. 换图：把原图放进源目录，在 `build_images.py` 的 `COVERS` / `GALLERY_PICKS` 里登记
3. 重新生成：

```bash
py build_images.py    # 只在换图时需要
node gen.js           # 重新生成全部 HTML
node _check.js        # 链接与结构自检，必须 0 issue
```

## 本地预览

```bash
py -m http.server 8731
# 打开 http://127.0.0.1:8731
```

## 部署（GitHub Pages）

首次：

```bash
git init
git add .
git commit -m "init: 小冉学长 PCB 教学站"
git branch -M main
git remote add origin https://github.com/<用户名>/<仓库>.git
git push -u origin main
```

然后仓库 Settings → Pages → Source 选 `main` 分支 `/ (root)` → Save。

之后每次更新：

```bash
git add .
git commit -m "更新招新时间"
git push
```

约 1 分钟自动上线。

## 换成自定义域名

1. 域名 NS 托管到 Cloudflare（免费）
2. 仓库 Settings → Pages → Custom domain 填域名
3. 勾选 Enforce HTTPS
4. 同时把 `data/site.json` 的 `siteUrl` 改成新域名，重跑 `node gen.js`

## 交接清单

- [ ] GitHub 账号与仓库管理权限
- [ ] 域名（如有）管理权限
- [ ] 本 README
- [ ] 源图原始文件（未压缩，另存网盘或仓库外）

## 已知边界

- 纯静态：没有后端、没有表单提交。收报名请用问卷/表单服务，链接贴进 `contact.html`
- 图片全部 WebP，单张 ≤ 200KB，照片墙 `loading="lazy"`
- `*.github.io` 在部分网络下访问不稳，招新现场建议准备本地兜底（见下）

## 招新现场兜底

```bash
# 笔记本开热点，手机连热点，然后
py -m http.server 8000
# 手机访问 http://<笔记本热点IP>:8000
```
