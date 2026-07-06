const express=require('express');
const router=express.Router();
const userSvc=require('./user');
const settings=require('./settings');
const shop=require('./shop');
function auth(req,res,next){ if(req.query.p===settings.get().adminPassword || req.headers.cookie?.includes('admin=1')){ res.cookie?.('admin','1'); return next(); } res.send(`<!doctype html><meta name=viewport content='width=device-width,initial-scale=1'><link rel=stylesheet href='/css/admin.css'><div class=card><h1>🍌 後台登入</h1><form><input name=p placeholder='密碼' type=password><button>登入</button></form><p>預設密碼 banana123，可在後台修改。</p></div>`); }
router.get('/',auth,(req,res)=>{ const users=Object.values(userSvc.all()); res.render('dashboard',{settings:settings.get(),users,items:shop.items()}); });
router.post('/settings',auth,express.urlencoded({extended:true}),(req,res)=>{ settings.set(req.body); res.redirect('/admin'); });
router.post('/shop',auth,express.urlencoded({extended:true}),(req,res)=>{ const items=shop.items(); items.push({category:req.body.category,name:req.body.name,price:Number(req.body.price||0)}); shop.save(items); res.redirect('/admin'); });
router.post('/user',auth,express.urlencoded({extended:true}),(req,res)=>{ const u=userSvc.get(req.body.id); if(req.body.coins) u.coins=Number(req.body.coins); if(req.body.exp) u.exp=Number(req.body.exp); if(req.body.blacklisted) u.blacklisted=req.body.blacklisted==='true'; userSvc.update(req.body.id,u); res.redirect('/admin'); });
module.exports=router;
