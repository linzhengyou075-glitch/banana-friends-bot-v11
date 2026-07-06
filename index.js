const express=require('express');
const line=require('@line/bot-sdk');
const fs = require('fs');
const settings=require('./settings');
const userSvc=require('./user');
const flex=require('./flex');
const shop=require('./shop');
const mod=require('./moderation');
const {getLevel,getTitle}=require('./level');

const config={channelAccessToken:process.env.CHANNEL_ACCESS_TOKEN||process.env.LINE_CHANNEL_ACCESS_TOKEN,channelSecret:process.env.CHANNEL_SECRET||process.env.LINE_CHANNEL_SECRET};
const client=new line.Client(config);
const app=express();
app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.use(express.static(__dirname+'/public'));
const admin = require('./admin');
app.use('/admin', admin);
app.get('/',(req,res)=>res.send('🍌 Banana Friends Bot V11 is running. Admin: /admin'));

function baseUrl(req){ return process.env.BASE_URL || `https://${req.headers.host}`; }
async function reply(token,msg){ try{return await client.replyMessage(token, Array.isArray(msg)?msg:[msg]);}catch(e){console.error('reply error',e.message);} }
function text(t){ return {type:'text',text:t}; }
async function getName(userId){ try{ const p=await client.getProfile(userId); return p.displayName || '蕉友'; }catch(e){return '蕉友';} }
async function handleEvent(event,req){
  if(event.type==='follow') return reply(event.replyToken,text(settings.get().welcome));
  if(event.type==='join') return reply(event.replyToken,text('🍌 蕉個朋友 Bot 已加入群組！輸入「指令」查看功能。'));
  if(event.type!=='message') return null;
  const userId=event.source.userId || event.source.groupId || 'unknown';
  const name=await getName(userId);
  const u=userSvc.get(userId,name);
  if(mod.muted(userId)) return null;
  const msg=event.message;
  const body=(msg.text||'').trim();
  if(body==='公告'){
  let data={announcement:'目前沒有公告'};
  try{ data=JSON.parse(fs.readFileSync('./settings.json','utf8')); }catch(e){}
  return reply(event.replyToken, text('📢 公告\n\n'+(data.announcement||'目前沒有公告')));
}

if(body==='群規'){
  let data={rules:'目前沒有群規'};
  try{ data=JSON.parse(fs.readFileSync('./settings.json','utf8')); }catch(e){}
  return reply(event.replyToken, text('📜 群規\n\n'+(data.rules||'目前沒有群規')));
}
  
  const s=settings.get();

  if(msg.type==='text'){
    if(mod.isAd(body)) return reply(event.replyToken,text('🚫 偵測到疑似廣告連結，已停止計分。'));
    if(!mod.isSpam(userId,body) && !body.startsWith('/')){ u.chatCount++; userSvc.update(userId,u); userSvc.addExp(userId,name,Number(s.chatExp||2)); }

    if(['指令','幫助','教學'].includes(body)) return reply(event.replyToken,text('🍌〔蕉〕個朋友吧！指令\n\n👤 個人：簽到、我的資料、名片、我的背包\n🏆 排行：排行榜、聊天排行、香蕉幣排行\n🎁 商店：商店、購買 商品名稱\n🎮 Pokemon GO：Pokemon GO、兌換碼、社群日、團體戰\n📜 群組：群規、公告\n👑 管理員：/公告 內容、/黑名單 UserID、/解除黑名單 UserID'));
    if(body==='我的ID') return reply(event.replyToken,text(`你的ID：\n${userId}`));
    if(body==='我的資料'||body==='名片') return reply(event.replyToken, flex.profile(u, baseUrl(req)));
    if(body.startsWith('修改名片 ')){ const cardText=body.replace('修改名片 ','').slice(0,300); userSvc.update(userId,{...u,cardText}); return reply(event.replyToken,text('✅ 名片自介已更新')); }
    if(body==='簽到'){
      const today=new Date().toLocaleDateString('zh-TW',{timeZone:'Asia/Taipei'});
      if(u.lastSign===today) return reply(event.replyToken,text('今天已經簽到過囉 🍌'));
      u.lastSign=today; u.signDays++; u.coins+=Number(s.signCoins||20); u.exp+=Number(s.signExp||10); userSvc.update(userId,u);
      return reply(event.replyToken,[text(`🍌 簽到成功！\n⭐ +${s.signExp} EXP\n🍌 +${s.signCoins} 香蕉幣\n🔥 總簽到：${u.signDays} 天`), flex.profile(u, baseUrl(req))]);
    }
    if(body==='排行榜'||body==='等級排行'){
      const rows=Object.values(userSvc.all()).sort((a,b)=>b.exp-a.exp).slice(0,10).map((x,i)=>`${i+1}. ${x.name}｜Lv.${getLevel(x.exp)} ${getTitle(getLevel(x.exp))}｜${x.exp} EXP`).join('\n');
      return reply(event.replyToken,text(rows?`🏆 等級排行榜\n\n${rows}`:'目前沒有排行資料'));
    }
    if(body==='聊天排行'){
      const rows=Object.values(userSvc.all()).sort((a,b)=>b.chatCount-a.chatCount).slice(0,10).map((x,i)=>`${i+1}. ${x.name}｜${x.chatCount} 則`).join('\n');
      return reply(event.replyToken,text(rows?`💬 聊天排行\n\n${rows}`:'目前沒有排行資料'));
    }
    if(body==='香蕉幣排行'){
      const rows=Object.values(userSvc.all()).sort((a,b)=>b.coins-a.coins).slice(0,10).map((x,i)=>`${i+1}. ${x.name}｜${x.coins} 幣`).join('\n');
      return reply(event.replyToken,text(rows?`🍌 香蕉幣排行\n\n${rows}`:'目前沒有排行資料'));
    }
    if(body==='商店'||body==='香蕉幣商店') return reply(event.replyToken, flex.shop(shop.items()));
    if(body.startsWith('購買 ')) return reply(event.replyToken,text(shop.buy(userId, body.replace('購買 ',''))));
    if(body==='我的背包') return reply(event.replyToken,text((u.inventory||[]).length?`🎒 我的背包\n`+u.inventory.map(i=>`${i.category} ${i.name}`).join('\n'):'背包是空的'));
    if(['Pokemon GO','Pokémon GO','社群日','團體戰','兌換碼'].includes(body)) return reply(event.replyToken,text('🎮 Pokémon GO 專區\n目前可在後台設定活動、兌換碼與道具商店。'));

    if(body.startsWith('/公告 ')){ settings.set({announcement:body.replace('/公告 ','')}); return reply(event.replyToken,text('✅ 公告已更新')); }
    if(body.startsWith('/黑名單 ')){ const id=body.replace('/黑名單 ','').trim(); const target=userSvc.get(id); target.blacklisted=true; userSvc.update(id,target); return reply(event.replyToken,text('✅ 已加入黑名單')); }
    if(body.startsWith('/解除黑名單 ')){ const id=body.replace('/解除黑名單 ','').trim(); const target=userSvc.get(id); target.blacklisted=false; userSvc.update(id,target); return reply(event.replyToken,text('✅ 已解除黑名單')); }
  }
  if(msg.type==='image'||msg.type==='sticker'){ userSvc.addExp(userId,name,msg.type==='image'?3:2); return null; }
  return null;
}

app.post('/webhook', line.middleware(config), (req,res)=>{ Promise.all(req.body.events.map(e=>handleEvent(e,req))).then(()=>res.end()).catch(err=>{console.error(err);res.status(500).end();}); });
const port=process.env.PORT||10000;
app.listen(port,()=>console.log(`🍌 Banana Friends Bot V11 running on port ${port}`));
