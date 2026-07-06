const db=require('./db');
const defaults={adminPassword:'banana123',groupRules:'🍌 群規\n1. 互相尊重\n2. 禁止騷擾與廣告\n3. 請勿洗版\n4. 歡迎每日簽到',welcome:'歡迎加入 🍌〔蕉〕個朋友吧！\n輸入「指令」查看功能。',announcement:'目前沒有公告',chatExp:2,signExp:10,signCoins:20,antiSpamSeconds:30,adKeywords:['http://','https://','line.me','discord.gg','t.me']};
function get(){ return {...defaults,...db.read('settings',defaults)}; }
function set(patch){ const s={...get(),...patch}; db.write('settings',s); return s; }
module.exports={get,set};
