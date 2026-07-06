const settings=require('./settings');
const userSvc=require('./user');
const last={};
function isAd(text=''){ const s=settings.get(); return s.adKeywords.some(k=>text.toLowerCase().includes(k.toLowerCase())); }
function isSpam(userId,text=''){ const now=Date.now(); const prev=last[userId]; last[userId]={text,at:now}; if(!prev) return false; return now-prev.at < settings.get().antiSpamSeconds*1000 || prev.text===text; }
function muted(userId){ const u=userSvc.get(userId); return u.blacklisted || (u.mutedUntil && u.mutedUntil>Date.now()); }
module.exports={isAd,isSpam,muted};
