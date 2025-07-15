const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database');
const universitiesRouter = require('./routes/universities');
const reviewsRouter = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 先挂载 API 路由
app.use('/api/universities', universitiesRouter);
console.log('universitiesRouter 挂载到 /api/universities');
app.use('/api/reviews', reviewsRouter);

// 再挂载静态资源
app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}); 