# 大学择校辅助工具

## 项目简介

本项目是一个面向高考考生和家长的大学信息与择校辅助平台，集成了大学检索、详细信息展示、学生评价、智能择校推荐等功能，帮助用户科学、便捷地选择理想高校。

## 主要功能
- 大学信息检索与筛选
- 大学详细信息、历年分数线、优势专业展示
- 学生评价与评分系统
- 智能择校（基于大模型的个性化推荐）
- 支持大学与评价的增删改查

## 技术栈
- 前端：HTML5、CSS3、原生JavaScript
- 后端：Node.js + Express
- 数据库：SQLite
- 智能推荐：集成大模型API（如DeepSeek）

## 部署与运行
1. **安装依赖**
   ```bash
   npm install
   ```
2. **启动后端服务**
   ```bash
   node backend/server.js
   ```
3. **访问前端页面**
   直接用浏览器打开 `index.html` 即可体验全部功能。

> 默认数据库已包含部分高校和评价数据，支持动态增删改查。

## 目录结构说明
```
college_choice_helper/
├── backend/              # 后端Node.js服务与数据库
│   ├── database.js       # 数据库初始化与操作
│   ├── routes/           # API路由
│   │   ├── reviews.js    # 评价相关API
│   │   └── universities.js # 大学相关API
│   ├── server.js         # Express服务入口
│   └── universities.db   # SQLite数据库文件
├── css/                  # 样式文件
│   └── style.css
├── js/                   # 前端JS逻辑
│   ├── main.js
│   └── chart.js
├── image/                # 校徽、背景等图片
├── index.html            # 首页
├── universities.html     # 大学列表页
├── detail.html           # 大学详情页
├── match.html            # 智能择校页
├── package.json          # Node依赖配置
└── README.md             # 项目说明
```

## 说明
- 推荐使用最新版Chrome浏览器获得最佳体验。
- 如需自定义初始数据，可修改 `backend/database.js`。
- 智能择校功能需联网调用大模型API。

---
如有建议或问题，欢迎反馈与交流！ 