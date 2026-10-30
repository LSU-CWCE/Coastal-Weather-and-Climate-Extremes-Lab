# Coastal Weather and Climate Extremes Lab — 网站

线上网址：https://lsu-cwce.github.io/Coastal-Weather-and-Climate-Extremes-Lab/  
代码仓库：https://github.com/LSU-CWCE/Coastal-Weather-and-Climate-Extremes-Lab （推送到 `main` 分支后约 1 分钟自动更新）

纯静态网站（HTML + CSS + 原生 JS），不需要数据库，也不需要构建步骤，可以直接部署到 GitHub Pages 或学校服务器。

## 目录结构

```
index.html            首页
research.html         研究方向（4 个主题 + 示意图）
people.html           PI（学历、任职、学术服务）与成员
publications.html     论文（可搜索、按年份筛选，含在写稿件）
contact.html          联系方式
data/
  publications.js     ← 论文列表（日常维护主要改这里）
  people.js           ← 成员列表
  news.js             ← 新闻动态
assets/
  css/style.css       全站样式（颜色、字体都在开头的 :root 里）
  js/wxmap.js         各页顶部的天气图（地面图、500 hPa 高度场、海温）和联系页位置图；风的流线动画也在这里（场是虚构的示意，海岸线和州界是简化的）
  js/schematics.js    研究页的 4 张示意图
  js/main.js          读取 data/ 渲染论文、新闻、成员；研究页目录高亮
  img/favicon.svg     网站图标
```

## 日常更新

| 想做的事 | 改哪里 |
|---|---|
| 加一篇论文 | `data/publications.js`，复制一段 `{ ... }` 改内容。填 `doi` 会自动生成链接；`themes` 决定它出现在研究页哪个主题下；在写的稿件用 `status: "in-prep"`，发表后改成 `year` 并删掉这一行 |
| 加 / 删成员 | `data/people.js`，照着 Haoxin Ni 那一条复制修改。每位成员显示成和 PI 一样的“左照片、右信息”，可填：简介 `bio`、学历 `education`、研究 `research`、项目 `projects`、技能 `skills`、课余 `interests`、邮箱 `email`，不填的部分不显示 |
| 成员照片 | 放到 `assets/img/people/`，在成员条目里写 `photo: "assets/img/people/xxx.jpg"`（竖版，约 3:4，宽 700 px 左右即可） |
| PI 照片 | 已放在 `assets/img/people/wengui-liang.jpg`（960 px 宽的网页压缩版）。要换照片，直接用新文件覆盖它即可；竖版、人像在上半部分效果最好，页面按 4:5 显示 |
| 发新闻 | `data/news.js`，最新的放最前面 |

## 本地预览

在本文件夹里运行：

```bash
python serve.py
```

然后打开 http://localhost:5173 。`serve.py` 会告诉浏览器不要缓存，所以改完 `data/` 里的文件，刷新一下就能看到。也可以直接双击 `index.html` 打开。

如果改了内容却没看到变化，多半是浏览器缓存：按 Ctrl+F5（Mac 上是 Cmd+Shift+R）强制刷新。页面里引用 CSS/JS 时带的 `?v=20261027` 是版本号，部署后如果访客看到的还是旧样式，把这个数字改大即可。

## 部署到 GitHub Pages（免费）

GitHub 是存放代码和文件的网站，文件放在一个“仓库”（repository）里；GitHub Pages 是它附带的免费静态网站托管：把这个文件夹放进一个公开仓库并打开 Pages，GitHub 就把这些文件当网站发布出去。以后每次往仓库里更新文件，网站约 1 分钟内自动更新。

**账号建议**：用实验室或梁教授的账号（或建一个 GitHub Organization，教授当 Owner、学生当成员），这样学生毕业后网站也不受影响。免费账号的 Pages 需要仓库是公开的，所以仓库里的所有文件任何人都能看到。

### 方法一：网页上传（不用命令行）

1. 登录 GitHub → 右上角 “+” → New repository → 起名（如 `coastal-extremes-lab`）→ 选 Public → Create。
2. 在新仓库页面点 “uploading an existing file”，把本文件夹里的内容拖进去：所有 `.html`、`assets`、`data`、`README.md`、`.nojekyll`、`serve.py`。
   **不要拖 `assets/logo/`（logo 草稿，未经 LSU 认可）和 `.claude/`**——网页上传不会读 `.gitignore`。
3. 点 Commit changes。
4. 仓库 → Settings → Pages → Source 选 “Deploy from a branch”，Branch 选 `main`、目录 `/ (root)` → Save。
5. 1–2 分钟后网站出现在 `https://<账号名>.github.io/coastal-extremes-lab/`。

以后改内容：在仓库里点开 `data/publications.js` 等文件，点铅笔图标直接编辑，Commit 后自动更新。

### 方法二：用 git 命令推送

本文件夹已带 `.gitignore`（自动排除 logo 草稿和本地工具）。先在 GitHub 上建好空仓库（同上第 1 步，不要勾选添加 README），然后：

```bash
git init
git add .
git commit -m "First version of the lab website"
git branch -M main
git remote add origin https://github.com/<账号名>/coastal-extremes-lab.git
git push -u origin main
```

第一次 push 会弹出浏览器窗口让你登录 GitHub。推完后同样去 Settings → Pages 打开发布。

### 上线后

- 每个页面的 `og:image`、`og:url` 已经写成线上的完整网址；以后如果换了网址（比如改仓库名或绑定自己的域名），记得同步改这两行，否则分享链接时不显示预览图。
- 想用短一点的网址：仓库名改成 `<账号名>.github.io`，网站就是 `https://<账号名>.github.io/`。
- 想用自己的域名（如 `coastalextremeslab.org`，每年约 10–15 美元）：在 Settings → Pages 填 Custom domain，再到域名服务商加一条 CNAME 记录。
- 想用 lsu.edu 下的网址：需要问学院 IT 是否能托管静态网页，这个文件夹可以原样交给他们。

## 需要确认 / 补充的内容

- **在研项目（Current projects）**：根据梁教授 CV 的 “Recent collaborations” 写的两个合作项目，目前已从研究页撤下，等教授确认后再放。内容保存在 `drafts/current-projects.html`（不会随网站上传），文件开头写了放回研究页的两步做法。

- **成员名单**：组里是两名硕士、一名本科生。Haoxin Ni（M.S.，2026 年加入）的信息和照片已放上，内容取自本人 CV，只放了与实验室相关的部分。另一名硕士和本科生目前是带斜纹的占位，在 `data/people.js` 里替换文字并删掉 `placeholder: true` 即可。
- **招生**：目前没有招生计划，所以网站上没有任何招生内容（原 Join 页面已改为纯联系页 `contact.html`）。以后需要时可以再加回来。
- **简历**：学历、任职经历、学术服务、在研项目、在写稿件都已按 CV 写进网页；网站没有放 CV 文件下载，CV 里的个人联系方式等内部信息也没有放上网站。
- **地址、邮箱、论文**：与 LSU 官网教师主页和 CV 一致，DOI 都已逐条验证过。

## 设计说明

像一间气象图室：每页顶部是深色的“天气图”区块，下面是骨白纸色的阅读区。图都是按真实天气图的画法原创绘制的，不是通用的装饰背景。

- 配色：深石板色（图区、“How we work” 区块和页脚）+ 骨白纸色（阅读区），黑色墨线、细线分隔。唯一的强调色是哑光陶土色，用在 *Extremes* 这类关键词和天气图上“最强降水”的位置。颜色变量在 `style.css` 开头的 `:root`，图的配色在 `wxmap.js`、`schematics.js` 开头。
- 字体：Newsreader（正文和标题，书报衬线体）、Libre Franklin（导航、图注、小标签，源自美国报刊常用的 Franklin Gothic），来自 Google Fonts。
- 首页主图：一张原创的墨西哥湾北部地面天气图，仿照美国气象局印刷版每日天气图：兰伯特投影、经纬网、海岸线和州界、每 4 hPa 一条等压线、静止锋、气压中心 H/L、站点填图（风羽、云量、温度/露点、气压、天气现象），以及阴影线表示的雨区。设定是“低压沿停滞锋缓慢移动，把墨西哥湾的水汽送上岸，最强降水落在 Baton Rouge 附近”，这是墨西哥湾沿岸极端降水的典型形势。细细的流线是按这张图自己的风场计算并缓慢流动的。
- 内页顶部：研究页和论文页是 500 hPa 高度场（高空槽脊和急流），成员页是墨西哥湾海温和环流（Loop Current 与暖涡），联系页是地面图。联系页正文里还有一张路易斯安那南部位置图。
- 所有图里的天气和海洋场都是示意，不是观测数据，页面上已经注明。
- 动画会尊重系统的“减少动态效果”设置（此时显示静止的流线），访客也可以点 “Pause motion” 暂停，选择会被记住。
