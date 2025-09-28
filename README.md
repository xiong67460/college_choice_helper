# 大学择校辅助工具

## 项目简介

本项目是一个面向高考考生和家长的大学信息与择校辅助平台，集成了大学检索、详细信息展示、学生评价、智能择校推荐等功能，帮助用户科学、便捷地选择理想高校。

## 主要功能
- 大学信息检索与筛选
- 大学详细信息（如历年分数线、优势专业展示）
- 学生评价与评分系统
- 智能择校（基于大模型的个性化推荐）

## 技术栈
- 前端：HTML5、CSS3、原生JavaScript
- 后端：Node.js + Express
- 数据库：SQLite
- 智能推荐：集成大模型API（DeepSeek）

## 部署与运行

### 前置要求
- **安装Node.js**（版本12.0以上）
- **确保联网**（智能择校功能需要调用大模型API）
- **配置API Key**：在 `backend/routes/universities.js` 文件的智能匹配院校相关部分，按照注释提示填入你自己的 DeepSeek API Key

### 手动运行
1. **安装依赖**
   ```bash
   npm install
   ```
2. **启动后端服务**
   ```bash
   npm start
   ```
3. **访问前端页面**
   在浏览器地址栏输入 http://localhost:3000/index.html 进入首页

### 一键运行（不推荐）
直接双击运行 `start.bat` 脚本，自动完成依赖安装和服务启动。

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
├── start.bat             # 一键启动脚本
└── README.md             # 项目说明
```

## 说明
- 推荐使用最新版Chrome浏览器获得最佳体验。
- 默认数据库已包含部分高校和评价数据，如需自定义初始数据，可修改 `backend/database.js`。

---
如有建议或问题，欢迎反馈与交流！ 
