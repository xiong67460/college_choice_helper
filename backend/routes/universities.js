const express = require('express');
const router = express.Router();
const { db } = require('../database');
const axios = require('axios');

// 获取所有大学
router.get('/', async (req, res) => {
  const dbConn = db();
  const rows = await dbConn.all(`
    SELECT u.*, 
      (SELECT COUNT(*) FROM reviews r WHERE r.university_id = u.id) as review_count
    FROM universities u
    ORDER BY u.name
  `);
  const universities = rows.map(row => ({
    ...row,
    score_trend: JSON.parse(row.score_trend || '[]'),
    score_years: JSON.parse(row.score_years || '[]')
  }));
  res.json(universities);
});

// 搜索大学
router.get('/search/:keyword', async (req, res) => {
  const dbConn = db();
  const keyword = `%${req.params.keyword}%`;
  const rows = await dbConn.all(`
    SELECT u.*, 
      (SELECT COUNT(*) FROM reviews r WHERE r.university_id = u.id) as review_count
    FROM universities u
    WHERE u.name LIKE ? OR u.location LIKE ? OR u.features LIKE ?
    ORDER BY u.name
  `, keyword, keyword, keyword);
  const universities = rows.map(row => ({
    ...row,
    score_trend: JSON.parse(row.score_trend || '[]'),
    score_years: JSON.parse(row.score_years || '[]')
  }));
  res.json(universities);
});

// 按地区筛选大学
router.get('/location/:location', async (req, res) => {
  const dbConn = db();
  const location = `%${req.params.location}%`;
  const rows = await dbConn.all(`
    SELECT u.*, 
      (SELECT COUNT(*) FROM reviews r WHERE r.university_id = u.id) as review_count
    FROM universities u
    WHERE u.location LIKE ?
    ORDER BY u.name
  `, location);
  const universities = rows.map(row => ({
    ...row,
    score_trend: JSON.parse(row.score_trend || '[]'),
    score_years: JSON.parse(row.score_years || '[]')
  }));
  res.json(universities);
});

// 获取单个大学详情（必须放最后）
router.get('/:id', async (req, res) => {
  const dbConn = db();
  const universityId = req.params.id;
  const university = await dbConn.get('SELECT * FROM universities WHERE id = ?', universityId);
  if (!university) {
    return res.status(404).json({ error: '大学不存在' });
  }
  const reviews = await dbConn.all('SELECT * FROM reviews WHERE university_id = ? ORDER BY created_at DESC', universityId);
  // 计算平均分
  let avg_score = null;
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + (r.score || 5), 0);
    avg_score = (sum / reviews.length).toFixed(2);
  }
  const result = {
    ...university,
    score_trend: JSON.parse(university.score_trend || '[]'),
    score_years: JSON.parse(university.score_years || '[]'),
    advantage_major: university.advantage_major,
    avg_score,
    reviews: reviews
  };
  res.json(result);
});

// 新增大学
router.post('/', async (req, res) => {
  console.log('收到 POST /api/universities 请求');
  const dbConn = db();
  const { name, location, type, website, image, features, score_trend, score_years, advantage_major } = req.body;
  if (!name || !location || !type) {
    return res.status(400).json({ error: '缺少必填字段' });
  }
  const result = await dbConn.run(
    `INSERT INTO universities (name, location, type, website, image, features, score_trend, score_years, advantage_major)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    name, location, type, website, image, features, JSON.stringify(score_trend), JSON.stringify(score_years), advantage_major
  );
  res.json({ id: result.lastID, message: '大学添加成功' });
});

// 智能匹配院校（DeepSeek大模型）
router.post('/match', async (req, res) => {
  const { name, score, subjectType, gender, homeLocation, targetLocation, major, type } = req.body;

  const prompt = `
学生信息：
姓名：${name}
分数：${score}
文理科：${subjectType}
性别：${gender}
所在地：${homeLocation}
目标地区：${targetLocation}
意向专业：${major}
类型：${type}

请根据中国大陆范围内的高校，结合学生信息，推荐3-5所最合适的院校，并用简短理由说明。返回JSON数组，每个对象包含name、reason字段。
`;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': 'Bearer your_api_key',
          'Content-Type': 'application/json'
        }
      }
    );
    let text = response.data.choices[0].message.content;
    text = text.replace(/```json|```/g, '').trim();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = [{ name: "解析失败", reason: text }];
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "DeepSeek API 调用失败", detail: err.message });
  }
});

module.exports = router; 