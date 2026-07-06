const db=require('./db');
const userSvc=require('./user');
const defaults=[{category:'🏅稱號',name:'彩虹冒險家',price:300},{category:'✨特效',name:'彩虹光圈',price:500},{category:'👑VIP',name:'VIP 7天',price:1500},{category:'🎮Pokemon GO',name:'遠距團戰券',price:300},{category:'🍌道具',name:'補簽卡',price:100}];
function items(){ return db.read('store', defaults); }
function save(items){ db.write('store',items); }
function buy(userId,name){ const list=items(); const item=list.find(x=>x.name===name); if(!item) return '找不到商品'; const u=userSvc.get(userId); if(u.coins<item.price) return `香蕉幣不足，需要 ${item.price} 幣`; u.coins-=item.price; u.inventory=u.inventory||[]; u.inventory.push({name:item.name,category:item.category,at:new Date().toISOString()}); userSvc.update(userId,u); return `✅ 已購買 ${item.name}\n🍌 剩餘香蕉幣：${u.coins}`; }
module.exports={items,save,buy};
