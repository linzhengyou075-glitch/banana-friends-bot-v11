const express = require('express');
const fs = require('fs');
const router = express.Router();

const FILE = './settings.json';

function load() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ announcement: '目前沒有公告', rules: '目前沒有群規' }, null, 2));
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  res.send(`
  <body style="font-family:Arial;background:#fff6d8;padding:25px">
    <h1>🍌 蕉個朋友 Bot 後台</h1>
    <div style="background:white;padding:20px;border-radius:20px">
      <h2>管理功能</h2>
      <a href="/admin/announcement">📢 公告管理</a><br><br>
      <a href="/admin/rules">📜 群規管理</a><br><br>
      <a href="/admin/shop">🎁 商店管理</a><br><br>
      <a href="/admin/users">👥 會員管理</a><br><br>
      <a href="/admin/settings">⚙️ 系統設定</a>
    </div>
  </body>
  `);
});

router.get('/announcement', (req, res) => {
  const data = load();
  res.send(`
  <body style="font-family:Arial;background:#fff6d8;padding:25px">
    <h1>📢 公告管理</h1>
    <form method="POST">
      <textarea name="announcement" style="width:100%;height:220px;font-size:18px">${data.announcement || ''}</textarea>
      <br><br>
      <button style="font-size:20px;padding:12px 25px;background:#ffcc33;border:0;border-radius:12px">儲存公告</button>
    </form>
    <br>
    <a href="/admin">返回後台</a>
  </body>
  `);
});

router.post('/announcement', express.urlencoded({ extended: true }), (req, res) => {
  const data = load();
  data.announcement = req.body.announcement || '';
  save(data);
  res.send('<h1>✅ 公告已儲存</h1><a href="/admin">返回後台</a>');
});

router.get('/rules', (req, res) => {
  const data = load();
  res.send(`
  <body style="font-family:Arial;background:#fff6d8;padding:25px">
    <h1>📜 群規管理</h1>
    <form method="POST">
      <textarea name="rules" style="width:100%;height:220px;font-size:18px">${data.rules || ''}</textarea>
      <br><br>
      <button style="font-size:20px;padding:12px 25px;background:#ffcc33;border:0;border-radius:12px">儲存群規</button>
    </form>
    <br>
    <a href="/admin">返回後台</a>
  </body>
  `);
});

router.post('/rules', express.urlencoded({ extended: true }), (req, res) => {
  const data = load();
  data.rules = req.body.rules || '';
  save(data);
  res.send('<h1>✅ 群規已儲存</h1><a href="/admin">返回後台</a>');
});

router.get('/shop', (req,res)=>res.send('<h1>🎁 商店管理</h1><p>下一步製作</p><a href="/admin">返回後台</a>'));
router.get('/users', (req,res)=>res.send('<h1>👥 會員管理</h1><p>下一步製作</p><a href="/admin">返回後台</a>'));
router.get('/settings', (req,res)=>res.send('<h1>⚙️ 系統設定</h1><p>下一步製作</p><a href="/admin">返回後台</a>'));

module.exports = router;
