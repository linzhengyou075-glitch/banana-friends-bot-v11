const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');
function ensure(){ if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir,{recursive:true}); }
function file(name){ ensure(); return path.join(dataDir, name + '.json'); }
function read(name, def){ const f=file(name); if(!fs.existsSync(f)){ write(name, def); return def; } try{return JSON.parse(fs.readFileSync(f,'utf8')||'null') ?? def;}catch(e){return def;} }
function write(name, data){ ensure(); fs.writeFileSync(file(name), JSON.stringify(data,null,2)); return data; }
module.exports={read,write};
