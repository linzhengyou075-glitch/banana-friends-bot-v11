const db=require('./db');
const {getLevel}=require('./level');
function all(){ return db.read('users',{}); }
function save(users){ db.write('users', users); }
function get(id,name='蕉友'){ const users=all(); if(!users[id]) users[id]={id,name,exp:0,coins:0,signDays:0,chatCount:0,lastSign:'',title:'',photoUrl:'',cardText:'',mutedUntil:0,blacklisted:false,inventory:[]}; if(name && users[id].name==='蕉友') users[id].name=name; save(users); return users[id]; }
function update(id, patch){ const users=all(); users[id]={...(users[id]||{id}),...patch}; save(users); return users[id]; }
function addExp(id,name,amount){ const u=get(id,name); const old=getLevel(u.exp); u.exp+=amount; const nw=getLevel(u.exp); update(id,u); return {user:u,oldLevel:old,newLevel:nw,levelUp:nw>old}; }
function addCoins(id,name,amount){ const u=get(id,name); u.coins+=amount; update(id,u); return u; }
module.exports={all,get,update,addExp,addCoins};
