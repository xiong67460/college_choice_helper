const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'universities.db');
let db;

async function initDatabase() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 创建表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS universities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      website TEXT,
      image TEXT,
      features TEXT,
      score_trend TEXT,
      score_years TEXT,
      advantage_major TEXT
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      university_id INTEGER NOT NULL,
      user TEXT NOT NULL,
      content TEXT NOT NULL,
      score INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (university_id) REFERENCES universities (id)
    );
  `);

  // 检查是否需要插入初始数据
  const row = await db.get('SELECT COUNT(*) as count FROM universities');
  if (row.count === 0) {
    await insertInitialData();
    console.log('初始数据插入成功');
  } else {
    console.log('数据库已存在数据，跳过初始化');
  }
}

async function insertInitialData() {
  const universities = [
    {
      name: '清华大学',
      location: '北京',
      type: '综合',
      website: 'https://www.tsinghua.edu.cn/',
      image: 'image/tsinghua.png',
      features: '工科强，学科齐全，科研实力雄厚',
      score_trend: JSON.stringify([680, 682, 685, 688, 690]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '工科、计算机、建筑学'
    },
    {
      name: '北京大学',
      location: '北京',
      type: '综合',
      website: 'https://www.pku.edu.cn/',
      image: 'image/pku.png',
      features: '文理兼备，历史悠久，学术自由',
      score_trend: JSON.stringify([678, 680, 683, 686, 688]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '理科、法学、经济学'
    },
    {
      name: '复旦大学',
      location: '上海',
      type: '综合',
      website: 'https://www.fudan.edu.cn/',
      image: 'image/fudan.png',
      features: '人文社科见长，学术氛围浓厚',
      score_trend: JSON.stringify([670, 672, 675, 678, 680]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '新闻传播、医学、经济学'
    },
    {
      name: '浙江大学',
      location: '浙江 杭州',
      type: '综合',
      website: 'https://www.zju.edu.cn/',
      image: 'image/zju.png',
      features: '工科优势突出，创新创业氛围浓厚',
      score_trend: JSON.stringify([665, 667, 670, 673, 675]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '农业工程、信息工程、环境科学'
    },
    {
      name: '上海交通大学',
      location: '上海',
      type: '综合',
      website: 'https://www.sjtu.edu.cn/',
      image: 'image/sjtu.png',
      features: '工科实力强，国际交流活跃',
      score_trend: JSON.stringify([668, 670, 673, 676, 678]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '船舶与海洋工程、机械工程、医学'
    },
    {
      name: '华东师范大学',
      location: '上海',
      type: '师范',
      website: 'https://www.ecnu.edu.cn/',
      image: 'image/ecnu.png',
      features: '世界上最好的大学',
      score_trend: JSON.stringify([630, 635, 640, 645, 650]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '教育学、心理学、地理学'
    },
    {
      name: '南京大学',
      location: '江苏 南京',
      type: '综合',
      website: 'https://www.nju.edu.cn/',
      image: 'image/nju.png',
      features: '学科门类齐全，基础研究实力强',
      score_trend: JSON.stringify([650, 652, 655, 658, 660]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '天文学、地球科学、化学'
    },
    {
      name: '四川大学',
      location: '四川 成都',
      type: '综合',
      website: 'https://www.scu.edu.cn/',
      image: 'image/scu.png',
      features: '西部名校，医学和工程学科突出',
      score_trend: JSON.stringify([640, 642, 645, 648, 650]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '口腔医学、材料科学、法学'
    },
    {
      name: '华中科技大学',
      location: '湖北 武汉',
      type: '综合',
      website: 'https://www.hust.edu.cn/',
      image: 'image/hust.png',
      features: '工科优势明显，科研实力强',
      score_trend: JSON.stringify([645, 647, 650, 653, 655]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '机械工程、光电信息、同济医学院'
    },
    {
      name: '武汉大学',
      location: '湖北 武汉',
      type: '综合',
      website: 'https://www.whu.edu.cn/',
      image: 'image/whu.png',
      features: '人文社科与理工并重，校园风景优美',
      score_trend: JSON.stringify([642, 644, 647, 650, 652]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '测绘遥感、法学、新闻传播'
    },
    {
      name: '山东大学',
      location: '山东 济南',
      type: '综合',
      website: 'https://www.sdu.edu.cn/',
      image: 'image/sdu.png',
      features: '历史悠久，学科门类齐全',
      score_trend: JSON.stringify([635, 637, 640, 643, 645]),
      score_years: JSON.stringify([2019, 2020, 2021, 2022, 2023]),
      advantage_major: '材料科学、数学、医学'
    }
  ];

  for (const univ of universities) {
    const result = await db.run(
      `INSERT INTO universities (name, location, type, website, image, features, score_trend, score_years, advantage_major)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      univ.name, univ.location, univ.type, univ.website, univ.image, univ.features, univ.score_trend, univ.score_years, univ.advantage_major
    );
    const univId = result.lastID;
    if (univ.name === '华东师范大学') {
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '小李', '师范专业很强，校园环境优美。', 5);
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '小王', '学风严谨，老师负责。', 5);
    } else if (univ.name === '南京大学') {
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生C', '学术氛围浓厚，基础学科实力强。', 5);
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生D', '校园环境优美，师资力量雄厚。', 5);
    } else if (univ.name === '四川大学') {
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生E', '西部名校，学科齐全。', 5);
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生F', '医学和工程学科很强。', 5);
    } else if (univ.name === '华中科技大学') {
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生G', '工科实力突出，科研氛围好。', 5);
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生H', '校园很大，学生活动丰富。', 5);
    } else if (univ.name === '武汉大学') {
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生I', '校园风景优美，学科实力强。', 5);
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生J', '人文与理工并重，氛围开放。', 5);
    } else if (univ.name === '山东大学') {
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生K', '历史悠久，学科门类齐全。', 5);
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生L', '老师认真负责，学风严谨。', 5);
    } else {
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生A', '学术氛围浓厚，资源丰富。', 5);
      await db.run(`INSERT INTO reviews (university_id, user, content, score) VALUES (?, ?, ?, ?)`, univId, '学生B', '校园环境优美，老师很负责。', 5);
    }
  }
}

module.exports = { db: () => db, initDatabase }; 