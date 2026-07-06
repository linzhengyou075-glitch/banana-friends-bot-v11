const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>蕉個朋友後台</title>
<style>
body{font-family:Arial;background:#fff7d6;margin:0;padding:20px}
.card{background:white;border-radius:16px;padding:20px;margin-bottom:15px;box-shadow:0 3px 10px #0002}
h1{color:#d68b00}
a,button{display:block;background:#ffcc33;color:#000;padding:12px;border-radius:12px;text-decoration:none;margin:8px 0;border:0;font-size:16px}
</style>
</head>
<body>
<h1>🍌 蕉個朋友 Bot 後台</h1>

<div class="card">
<h2>📊 系統狀態</h2>
<p>✅ 後台已成功啟動</p>
<p>✅ Render 正常運行</p>
<p>✅ LINE Bot 已連線</p>
</div>

<div class="card">
<h2>管理功能</h2>
<a href="/admin/announcement">📢 公告管理</a>
<a href="/admin/rules">📜 群規管理</a>
<a href="/admin/shop">🎁 商店管理</a>
<a href="/admin/users">👥 會員管理</a>
<a href="/admin/settings">⚙️ 系統設定</a>
</div>
</body>
</html>
  `);
});

router.get('/announcement', (req,res)=>res.send('<h1>📢 公告管理</h1><p>下一步加入公告編輯功能</p><a href="/admin">返回後台</a>'));
router.get('/rules', (req,res)=>res.send('<h1>📜 群規管理</h1><p>下一步加入群規編輯功能</p><a href="/admin">返回後台</a>'));
router.get('/shop', (req,res)=>res.send('<h1>🎁 商店管理</h1><p>下一步加入商品新增功能</p><a href="/admin">返回後台</a>'));
router.get('/users', (req,res)=>res.send('<h1>👥 會員管理</h1><p>下一步加入會員列表</p><a href="/admin">返回後台</a>'));
router.get('/settings', (req,res)=>res.send('<h1>⚙️ 系統設定</h1><p>下一步加入密碼與設定</p><a href="/admin">返回後台</a>'));

module.exports = router;
