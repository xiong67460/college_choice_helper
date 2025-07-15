// main.js - 前后端分离版本

const API_BASE_URL = 'http://localhost:3000/api';

// 获取JSON数据
async function fetchUniversities() {
  try {
    const res = await fetch(`${API_BASE_URL}/universities`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('获取大学数据失败:', error);
    return [];
  }
}

// 获取单个大学详情
async function fetchUniversityDetail(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/universities/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('获取大学详情失败:', error);
    return null;
  }
}

// 搜索大学
async function searchUniversities(keyword) {
  try {
    const res = await fetch(`${API_BASE_URL}/universities/search/${encodeURIComponent(keyword)}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('搜索大学失败:', error);
    return [];
  }
}

// 添加评价
async function addReview(universityId, user, content) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        university_id: universityId,
        user: user,
        content: content
      })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('添加评价失败:', error);
    throw error;
  }
}

// 首页精选大学
async function renderFeatured() {
  const featuredDiv = document.getElementById('featured-universities');
  if (!featuredDiv) return;
  
  const data = await fetchUniversities();
  if (data.length === 0) {
    featuredDiv.innerHTML = '<p>暂无数据</p>';
    return;
  }
  
  // 取前两所大学
  featuredDiv.innerHTML = data.slice(0, 2).map(u => `
    <div class="univ-card">
      <img src="${u.image}" alt="${u.name}" class="univ-logo" onerror="this.src='image/default.png'">
      <h3>${u.name}</h3>
      <p>${u.features}</p>
      <p><small>评价数: ${u.review_count || 0}</small></p>
      <a href="detail.html?id=${u.id}">查看详情</a>
    </div>
  `).join('');
}

// 大学列表页
async function renderUniversitiesTable() {
  const tableBody = document.querySelector('#universities-table tbody');
  const searchInput = document.getElementById('search');
  if (!tableBody) return;
  
  let allData = await fetchUniversities();
  if (allData.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4">暂无数据</td></tr>';
    return;
  }

  function renderTable(data) {
    tableBody.innerHTML = data.map(u => `
      <tr>
        <td>${u.name}</td>
        <td>${u.location}</td>
        <td>${u.type}</td>
        <td>
          <a href="detail.html?id=${u.id}">详情</a>
          <span class="review-count">(${u.review_count || 0}条评价)</span>
        </td>
      </tr>
    `).join('');
  }

  renderTable(allData);
  
  // 搜索功能
  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      const keyword = e.target.value.trim();
      if (keyword.length === 0) {
        renderTable(allData);
      } else {
        const searchResults = await searchUniversities(keyword);
        renderTable(searchResults);
      }
    });
  }
}

// 详情页
async function renderUniversityDetail() {
  const detailSection = document.getElementById('university-detail');
  const reviewsDiv = document.getElementById('reviews');
  const nameHeader = document.getElementById('university-name');
  if (!detailSection) return;
  
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  
  if (!id) {
    detailSection.innerHTML = '<p>参数错误</p>';
    return;
  }
  
  const univ = await fetchUniversityDetail(id);
  if (!univ) {
    detailSection.innerHTML = '<p>未找到该大学信息</p>';
    return;
  }
  
  nameHeader.textContent = univ.name;
  detailSection.innerHTML = `
    <img src="${univ.image}" alt="${univ.name}" class="univ-logo-large" onerror="this.src='image/default.png'">
    <p><strong>地区：</strong>${univ.location}<span class="detail-gap"></span><span class="avg-score-align"><strong>综合评分：</strong>${univ.avg_score ? univ.avg_score : '暂无'}</span></p>
    <p><strong>类型：</strong>${univ.type}<span class="detail-gap"></span><span class="adv-major-align"><strong>优势专业：</strong>${univ.advantage_major ? univ.advantage_major : '暂无'}</span></p>
    <p><strong>特色：</strong>${univ.features}</p>
    <p><a href="${univ.website}" target="_blank">官方网站</a></p>
  `;
  
  // 评价
  if (reviewsDiv) {
    if (univ.reviews && univ.reviews.length > 0) {
      reviewsDiv.innerHTML = univ.reviews.map(r => `
        <div class="review">
          <strong>${r.user}：</strong>${r.content}
          <span class="review-score">（${r.score ? r.score : 5}分）</span>
          <div class="review-time">${new Date(r.created_at).toLocaleDateString()}</div>
        </div>
      `).join('');
    } else {
      reviewsDiv.innerHTML = '<p>暂无评价</p>';
    }
    
    // 添加评价表单
    reviewsDiv.innerHTML += `
      <div class="add-review">
        <h3>添加评价</h3>
        <form id="review-form">
          <input type="text" id="review-user" placeholder="您的姓名" required>
          <textarea id="review-content" placeholder="评价内容" required></textarea>
          <label for="review-score">评分：</label>
          <select id="review-score" required>
            <option value="5">5分</option>
            <option value="4">4分</option>
            <option value="3">3分</option>
            <option value="2">2分</option>
            <option value="1">1分</option>
          </select>
          <button type="submit">提交评价</button>
        </form>
      </div>
    `;
    
    // 处理评价提交
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('review-user').value;
        const content = document.getElementById('review-content').value;
        const score = parseInt(document.getElementById('review-score').value);
        try {
          await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ university_id: id, user, content, score })
          });
          alert('评价提交成功！');
          // 重新加载页面以显示新评价
          location.reload();
        } catch (error) {
          alert('评价提交失败，请重试');
        }
      });
    }
  }
  
  // 分数线图表
  if (window.renderScoreChart && univ.score_years && univ.score_trend) {
    window.renderScoreChart(univ.score_years, univ.score_trend, univ.name);
  }
}

// 页面初始化
window.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderUniversitiesTable();
  renderUniversityDetail();

  // 添加大学表单逻辑
  const addUnivForm = document.getElementById('add-univ-form');
  if (addUnivForm) {
    addUnivForm.onsubmit = async function(e) {
      e.preventDefault();
      const form = e.target;
      const data = {
        name: form.name.value,
        location: form.location.value,
        type: form.type.value,
        website: form.website.value,
        image: form.image.value,
        features: form.features.value,
        advantage_major: form.advantage_major.value,
        score_years: form.score_years.value.split(',').map(s=>parseInt(s.trim())),
        score_trend: form.score_trend.value.split(',').map(s=>parseInt(s.trim()))
      };
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      document.getElementById('add-univ-result').innerText = result.message || result.error;
      if (result.id) {
        form.reset();
        // 自动刷新大学列表
        if (typeof renderUniversitiesTable === 'function') renderUniversitiesTable();
      }
    }
  }

  // 智能匹配院校表单逻辑
  const matchForm = document.getElementById('match-form');
  if (matchForm) {
    matchForm.onsubmit = async function(e) {
      e.preventDefault();
      const form = e.target;
      const data = {
        name: form.studentName.value,
        score: parseInt(form.score.value),
        subjectType: form.subjectType.value,
        gender: form.gender.value,
        homeLocation: form.homeLocation.value,
        targetLocation: form.targetLocation.value,
        major: form.major.value,
        type: form.type.value
      };
      const res = await fetch('/api/universities/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      const resultDiv = document.getElementById('match-result');
      if (Array.isArray(result) && result.length > 0) {
        resultDiv.innerHTML = result.map(u => `<div class=\"match-item\"><strong>${u.name}</strong><br><span>${u.reason}</span></div>`).join('');
      } else if (result.error) {
        resultDiv.innerText = result.error;
      } else {
        resultDiv.innerText = '未找到匹配院校';
      }
    }
  }

  // 多条件搜索大学
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.onsubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('search-name').value.trim();
      const location = document.getElementById('search-location').value.trim();
      const type = document.getElementById('search-type').value;
      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (location) params.append('location', location);
      if (type) params.append('type', type);
      const res = await fetch(`/api/universities/search?${params.toString()}`);
      const data = await res.json();
      if (typeof renderTable === 'function') {
        renderTable(data);
      }
    }
  }
}); 