const titles = ['初心之蕉','新芽','萌芽者','初心者','新朋友','活力新星','香蕉夥伴','歡樂旅人','聊天高手','暖心使者','人氣新秀','彩虹旅人','彩虹好友','彩虹使者','彩虹精靈','彩虹守護者','星光達人','活躍達人','榮耀之星','榮耀勇者','榮耀騎士','白金菁英','鑽石菁英','星耀菁英','榮耀領主','彩虹領主','彩虹公爵','彩虹君王','彩虹霸主','永恆之星','永恆守護者','永恆彩虹','永恆璀璨','永恆璀璨彩虹','永恆聖翼','永恆不滅','永恆璀璨彩虹不滅','彩虹神話','彩虹創世者','彩虹至尊神','永恆璀璨彩虹不滅創世神'];
function getLevel(exp=0){ return Math.max(0, Math.min(100, Math.floor(exp/100))); }
function nextExp(level){ return Math.min(100, level+1)*100; }
function getTitle(level){ if(level<=40) return titles[level] || titles[titles.length-1]; if(level<60) return '傳奇冒險家'; if(level<80) return '神聖守護者'; if(level<100) return '星河旅人'; return '至尊蕉王'; }
function badgeUrl(baseUrl, level){ return `${baseUrl}/badges/lv${level}.svg`; }
module.exports={getLevel,nextExp,getTitle,badgeUrl};
