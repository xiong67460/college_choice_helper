const express = require('express');
const router = express.Router();
const { db } = require('../database');

// 获取某个大学的所有评价
router.get('/university/:universityId', async (req, res) => {
  const dbConn = db();
  const universityId = req.params.universityId;
  const reviews = await dbConn.all('SELECT * FROM reviews WHERE university_id = ? ORDER BY created_at DESC', universityId);
  res.json(reviews);
});

// 添加新评价
router.post('/', async (req, res) => {
  const dbConn = db();
  const { university_id, user, content, score } = req.body;
  if (!university_id || !user || !content) {
    return res.status(400).json({ error: '缺少必填字段' });
  }
  const university = await dbConn.get('SELECT id FROM universities WHERE id = ?', university_id);
  if (!university) {
    return res.status(404).json({ error: '大学不存在' });
  }
  const result = await dbConn.run('INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)', university_id, user, content, score || 5);
  res.json({ id: result.lastID, message: '评价添加成功' });
});

// 获取所有评价（管理员功能）
router.get('/', async (req, res) => {
  const dbConn = db();
  const reviews = await dbConn.all(`
    SELECT r.*, u.name as university_name
    FROM reviews r
    JOIN universities u ON r.university_id = u.id
    ORDER BY r.created_at DESC
  `);
  res.json(reviews);
});

// 删除评价（管理员功能）
router.delete('/:id', async (req, res) => {
  const dbConn = db();
  const reviewId = req.params.id;
  const result = await dbConn.run('DELETE FROM reviews WHERE id = ?', reviewId);
  if (result.changes === 0) {
    return res.status(404).json({ error: '评价不存在' });
  }
  res.json({ message: '评价删除成功' });
});

module.exports = router; 