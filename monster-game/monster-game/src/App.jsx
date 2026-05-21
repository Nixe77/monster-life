import { useState, useEffect, useRef, useReducer } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@700;900&display=swap');
  * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body { margin:0; }
  @keyframes pop    { 0%{transform:scale(0) rotate(-8deg);opacity:0} 65%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes glow   { 0%,100%{filter:drop-shadow(0 0 5px #ff9fcf)} 50%{filter:drop-shadow(0 0 18px #bf88ff)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  @keyframes slash  { 0%{opacity:0;transform:scale(0.4) rotate(-30deg)} 50%{opacity:1;transform:scale(1.3) rotate(5deg)} 100%{opacity:0;transform:scale(0.9) rotate(10deg)} }
  @keyframes coinPop{ 0%{transform:translate(-50%,-50%);opacity:1} 100%{transform:translate(-50%,-200%);opacity:0} }
  @keyframes levelUp{ 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.4)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
`;

// ─── MONSTER SPRITES ──────────────────────────────────────
const SP = {
  slime(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#6ee6a8',D='#38b870',L='#b8f5d4',W='#fff',P='#0a2318',M='#ff6b9d';f(7,0,L);f(8,0,L);f(7,1,B);f(8,1,B);f(8,2,D);[[4,11],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[4,11],[4,11],[5,10],[6,9]].forEach(([lo,hi],i)=>{for(let x=lo;x<=hi;x++)f(x,i+3,B)});for(let y=5;y<=7;y++){f(5,y,W);f(6,y,W);f(9,y,W);f(10,y,W)}f(6,6,P);f(9,6,P);f(7,9,M);f(8,9,M)},
  moko(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#ffafd7',D='#ff75b5',W='#fff',P='#400a2e',M='#e91e8c';[4,7,10].forEach(x=>f(x,1,B));[4,5,7,8,9,10,11].forEach(x=>f(x,2,B));[[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[4,11],[5,10]].forEach(([lo,hi],i)=>{for(let x=lo;x<=hi;x++)f(x,i+3,B)});for(let y=4;y<=6;y++){f(5,y,W);f(6,y,W);f(9,y,W);f(10,y,W)}f(6,5,P);f(9,5,P);f(4,7,D);f(11,7,D);for(let x=5;x<=9;x++)f(x,8,M)},
  nyara(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#60b8f0',D='#2191d8',W='#fff',P='#0c1a5e',M='#ff85b3',E='#ffc2cc';f(2,0,B);f(3,0,B);f(10,0,B);f(11,0,B);f(2,1,B);f(3,1,E);f(10,1,E);f(11,1,B);for(let y=2;y<=8;y++)for(let x=2;x<=11;x++)f(x,y,B);for(let y=3;y<=5;y++){f(4,y,W);f(5,y,W);f(8,y,W);f(9,y,W)}f(5,4,P);f(8,4,P);f(5,6,M);f(6,6,D);f(7,6,D);f(8,6,M);for(let y=9;y<=11;y++)for(let x=3;x<=10;x++)f(x,y,B);f(11,9,B);f(12,9,B);f(13,10,B);[4,5,8,9].forEach(x=>f(x,12,B))},
  usapi(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const W='#f0ecff',P='#ffc2cc',PK='#ff8fab',PU='#1a1020',M='#ff6b9d',CK='#ffd0e0';for(let y=0;y<=5;y++){f(4,y,W);f(5,y,W);f(9,y,W);f(10,y,W)}for(let y=1;y<=4;y++){f(4,y,P);f(9,y,P)}for(let y=4;y<=10;y++)for(let x=3;x<=11;x++)f(x,y,W);for(let y=5;y<=7;y++){f(5,y,P);f(6,y,P);f(8,y,P);f(9,y,P)}f(6,6,PU);f(8,6,PU);f(7,8,PK);[3,4,10,11].forEach(x=>{f(x,7,CK);f(x,8,CK)});f(6,9,M);f(7,9,M);f(8,9,M);for(let y=11;y<=13;y++)for(let x=4;x<=10;x++)f(x,y,W)},
  hanako(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#a8e4a0',D='#5cb85c',PK='#ff9fcf',Y='#ffd54f',W='#fff',PU='#1a2a1a',M='#ff6b9d';[[5,0],[4,1],[3,2],[5,1],[7,0],[8,1],[9,2],[7,1],[6,0]].forEach(([x,y])=>f(x,y,PK));f(6,1,Y);f(7,2,Y);for(let y=3;y<=10;y++)for(let x=4;x<=10;x++)f(x,y,B);for(let x=4;x<=10;x++)f(x,3,D);for(let y=5;y<=7;y++){f(5,y,W);f(6,y,W);f(8,y,W);f(9,y,W)}f(6,6,PU);f(8,6,PU);f(6,8,M);f(7,8,M);f(8,8,M);[3,2,3].forEach((x,i)=>f(x,5+i,D));[11,12,11].forEach((x,i)=>f(x,5+i,D));for(let y=11;y<=13;y++)for(let x=5;x<=9;x++)f(x,y,B)},
  denpi(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#ffd54f',D='#ffa000',L='#fff9c4',W='#fff',PU='#1a1a0a',M='#ff8c00',Z='#42a5f5';f(4,1,B);f(5,1,B);f(9,1,B);f(10,1,B);f(4,0,D);f(10,0,D);for(let y=2;y<=8;y++)for(let x=3;x<=11;x++)f(x,y,B);for(let x=4;x<=7;x++)f(x,2,L);for(let y=3;y<=5;y++){f(5,y,W);f(6,y,W);f(8,y,W);f(9,y,W)}f(6,4,PU);f(8,4,PU);f(5,4,L);f(9,4,L);for(let y=5;y<=8;y++){f(3,y,D);f(11,y,D)}f(4,6,M);f(5,6,M);f(9,6,M);f(10,6,M);f(6,7,M);f(7,7,M);f(8,7,M);for(let y=9;y<=12;y++)for(let x=4;x<=10;x++)f(x,y,B);f(6,9,Z);f(7,9,Z);f(8,10,Z);f(6,11,Z);f(7,11,Z);f(11,10,D);f(12,11,D);for(let x=4;x<=6;x++)f(x,13,B);for(let x=8;x<=10;x++)f(x,13,B)},
  ryuu(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#66bb6a',D='#2e7d32',W='#fff',P='#1b5e20',M='#f06292',Y='#ffd54f',R='#ef5350';f(4,0,Y);f(8,0,Y);f(4,1,Y);f(8,1,Y);[5,6,7].forEach(x=>f(x,1,B));for(let y=2;y<=7;y++)for(let x=3;x<=9;x++)f(x,y,B);for(let y=3;y<=5;y++){f(4,y,W);f(5,y,W);f(7,y,W);f(8,y,W)}f(5,4,P);f(7,4,P);f(5,6,M);f(6,6,M);for(let y=8;y<=10;y++){[1,2].forEach(x=>f(x,y,R));for(let x=3;x<=9;x++)f(x,y,B);[10,11].forEach(x=>f(x,y,R))}f(0,9,R);f(12,9,R);for(let x=4;x<=8;x++)f(x,11,B);for(let x=5;x<=7;x++)f(x,12,B);f(5,13,D);f(6,13,D)},
  koorin(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#b3e5fc',D='#0288d1',L='#e1f5fe',W='#fff',PU='#01579b',CR='#f0f8ff',IC='#80deea';f(5,0,L);f(6,0,CR);f(7,0,CR);f(8,0,L);f(4,1,IC);f(9,1,IC);for(let y=2;y<=9;y++)for(let x=4;x<=10;x++)f(x,y,B);for(let x=3;x<=11;x++){f(x,4,B);f(x,5,B)}for(let x=4;x<=7;x++){f(x,2,L);f(x,3,L)}for(let y=4;y<=6;y++){f(5,y,W);f(6,y,W);f(8,y,W);f(9,y,W)}f(5,5,PU);f(6,5,PU);f(8,5,PU);f(9,5,PU);f(5,4,CR);f(9,4,CR);f(7,7,W);f(6,7,L);f(8,7,L);f(7,6,L);f(7,8,L);for(let y=10;y<=12;y++)for(let x=5;x<=9;x++)f(x,y,B);f(3,6,D);f(11,6,D);f(5,13,IC);f(7,13,L);f(9,13,IC)},
  luna(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#ffd700',L='#fffde7',W='#fff',P='#4a148c',M='#e91e8c',A='#40c4ff',S='#ce93d8';f(1,0,S);f(14,0,S);f(7,0,L);f(8,0,L);for(let x=0;x<=4;x++)f(x,1,A);for(let x=11;x<=15;x++)f(x,1,A);for(let x=0;x<=5;x++)f(x,2,A);for(let x=10;x<=15;x++)f(x,2,A);f(6,1,B);f(7,1,L);f(8,1,B);for(let x=5;x<=9;x++)f(x,2,B);for(let y=3;y<=9;y++)for(let x=3;x<=11;x++)f(x,y,B);for(let y=4;y<=6;y++){f(5,y,W);f(6,y,W);f(9,y,W);f(10,y,W)}f(6,5,P);f(9,5,P);f(6,8,M);f(7,8,M);f(8,8,M);for(let y=10;y<=12;y++)for(let x=4;x<=10;x++)f(x,y,B);for(let x=3;x<=5;x++)f(x,13,B);for(let x=9;x<=11;x++)f(x,13,B);f(1,13,S);f(14,13,S)},
  honoo(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const R='#ef5350',O='#ff7043',Y='#ffd54f',L='#fffde7',W='#fff',PU='#1a0505',M='#ff1744',FL='#ff9800';f(6,0,Y);f(7,0,L);f(8,0,Y);f(4,1,O);f(5,1,Y);f(6,1,L);f(7,1,W);f(8,1,Y);f(9,1,O);f(3,2,R);f(4,2,O);f(5,2,Y);f(6,2,L);f(7,2,W);f(8,2,Y);f(9,2,O);f(10,2,R);[[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[4,11],[5,10]].forEach(([lo,hi],i)=>{for(let x=lo;x<=hi;x++)f(x,i+3,O)});for(let y=3;y<=7;y++)for(let x=5;x<=9;x++)f(x,y,FL);for(let y=4;y<=6;y++)for(let x=6;x<=8;x++)f(x,y,Y);f(7,4,L);f(7,5,W);for(let y=5;y<=7;y++){f(5,y,W);f(6,y,W);f(8,y,W);f(9,y,W)}f(6,6,PU);f(8,6,PU);f(6,8,M);f(7,8,M);f(8,8,M);for(let y=11;y<=13;y++)for(let x=5;x<=9;x++)f(x,y,O);f(7,14,R)},
};

function MonsterSprite({type,size=64,anim='float',style={}}){
  const ref=useRef(null);
  useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,16,16);ctx.imageSmoothingEnabled=false;SP[type]?.(ctx)},[type]);
  return <canvas ref={ref} width={16} height={16} style={{width:size,height:size,imageRendering:'pixelated',animation:anim!=='none'?`${anim} 1.4s ease-in-out infinite`:'none',...style}}/>;
}

// ─── NPC PIXEL ART ───────────────────────────────────────
function drawNPC(ctx,ox,oy,type,frame,flip){
  const W=8;
  const p=(rx,ry,c,w=1,h=1)=>{ctx.fillStyle=c;ctx.fillRect(ox+(flip?W-rx-w:rx),oy+ry,w,h)};
  switch(type){
    case'villager':p(2,0,'#f5c5a0',4,4);p(2,0,'#8b5a2b',4,2);p(0,4,'#1e88e5',8,5);p(1,4,'#f5c5a0',1,4);p(6,4,'#f5c5a0',1,4);p(2,9,'#37474f',2,frame?3:5);p(4,9,'#37474f',2,frame?5:3);break;
    case'grandma':p(2,1,'#f0d0b0',4,3);p(1,0,'#d0d0d0',6,3);p(0,4,'#795548',8,5);p(0,4,'#f0d0b0',1,3);p(7,4,'#f0d0b0',1,3);p(2,9,'#5d4037',2,frame?4:5);p(4,9,'#5d4037',2,frame?5:4);p(7,5,'#bcaaa4',1,6);break;
    case'kid':p(2,1,'#ffe0b2',4,3);p(2,1,'#ff8f00',4,2);p(1,4,'#f9a825',6,4);p(1,4,'#ffe0b2',1,3);p(6,4,'#ffe0b2',1,3);p(2,8,'#f57f17',2,frame?3:4);p(4,8,'#f57f17',2,frame?4:3);break;
    case'knight':p(1,0,'#90a4ae',6,4);p(1,1,'#546e7a',6,2);p(0,4,'#78909c',8,5);p(0,4,'#546e7a',1,5);p(7,4,'#546e7a',1,5);p(2,9,'#607d8b',2,frame?4:5);p(4,9,'#607d8b',2,frame?5:4);p(7,2,'#ff9800',1,7);break;
    case'merchant':p(2,0,'#f5c5a0',4,4);p(1,0,'#2e7d32',6,3);p(0,3,'#2e7d32',8,2);p(0,5,'#ff8f00',8,5);p(0,5,'#f5c5a0',1,4);p(7,5,'#f5c5a0',1,4);p(2,10,'#e65100',2,frame?4:5);p(4,10,'#e65100',2,frame?5:4);break;
  }
}

// ─── SHOP BACKGROUND ─────────────────────────────────────
function drawShopBG(ctx){
  ctx.imageSmoothingEnabled=false;
  // Sky
  ctx.fillStyle='#b3d9f0';ctx.fillRect(0,0,200,55);
  ctx.fillStyle='#d6eeff';ctx.fillRect(0,0,200,30);
  // Clouds
  ctx.fillStyle='#fff';
  [[18,7,22,5],[60,5,16,4],[110,10,20,5],[155,7,14,4]].forEach(([x,y,w,h])=>{ctx.fillRect(x,y,w,h);ctx.fillRect(x-2,y+2,w+4,h-1)});
  // Left building
  ctx.fillStyle='#9e8070';ctx.fillRect(0,28,55,72);
  ctx.fillStyle='#7a6050';ctx.fillRect(0,24,55,6);
  ctx.fillStyle='#ae9080';ctx.fillRect(2,30,51,70);
  ctx.fillStyle='#87ceeb';ctx.fillRect(5,33,13,11);ctx.fillRect(28,33,13,11);
  ctx.fillStyle='rgba(255,255,255,0.45)';ctx.fillRect(5,33,7,6);ctx.fillRect(28,33,7,6);
  ctx.fillStyle='#5d4037';ctx.fillRect(16,58,20,42);
  // Tree
  ctx.fillStyle='#5d4037';ctx.fillRect(66,48,4,27);
  ctx.fillStyle='#2e7d32';ctx.fillRect(57,30,22,20);ctx.fillRect(60,23,16,14);ctx.fillRect(63,17,10,10);
  ctx.fillStyle='#388e3c';ctx.fillRect(59,27,20,16);
  // Right shop
  ctx.fillStyle='#e8c090';ctx.fillRect(122,22,78,78);
  ctx.fillStyle='#d4a870';ctx.fillRect(118,19,82,5);
  // Roof
  ctx.fillStyle='#8b5e3c';ctx.fillRect(125,14,70,8);ctx.fillRect(128,12,64,4);ctx.fillRect(132,10,56,4);ctx.fillRect(136,8,48,4);
  // Awning
  ctx.fillStyle='#ff7043';ctx.fillRect(118,32,84,8);
  for(let x=120;x<202;x+=10){ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fillRect(x,32,5,8)}
  // Windows
  ctx.fillStyle='#87ceeb';ctx.fillRect(128,44,22,17);ctx.fillRect(166,44,22,17);
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillRect(128,44,11,8);ctx.fillRect(166,44,11,8);
  // Door
  ctx.fillStyle='#5d3a1a';ctx.fillRect(148,68,24,32);
  ctx.fillStyle='#7a5030';ctx.fillRect(150,70,10,28);ctx.fillRect(162,70,9,28);
  ctx.fillStyle='#ffd700';ctx.fillRect(160,84,2,2);
  // Sign
  ctx.fillStyle='#5d3a1a';ctx.fillRect(130,23,60,10);
  ctx.fillStyle='#ffd700';ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText('★ MATERIAL SHOP ★',160,29);
  // Ground
  ctx.fillStyle='#b09060';ctx.fillRect(0,78,200,22);
  for(let x=0;x<200;x+=13)for(let y=78;y<100;y+=7){
    ctx.fillStyle=(Math.floor(x/13)+Math.floor(y/7))%2===0?'#a08050':'#c0a870';
    ctx.fillRect(x,y,12,6);
    ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(x,y,12,1);ctx.fillRect(x,y,1,6);
  }
  ctx.fillStyle='rgba(255,255,255,0.12)';ctx.fillRect(122,78,78,22);
}

// ─── GAME CONSTANTS ───────────────────────────────────────
const MONS={
  slime: {name:'スライム', rarity:'C',  color:'#6ee6a8',bg:'#d6fff0'},
  moko:  {name:'もこ',     rarity:'C',  color:'#ffafd7',bg:'#ffe8f4'},
  nyara: {name:'にゃら',   rarity:'UC', color:'#60b8f0',bg:'#d6efff'},
  usapi: {name:'うさぴ',   rarity:'UC', color:'#f0d0ff',bg:'#f5e8ff'},
  hanako:{name:'はなこ',   rarity:'R',  color:'#a8e4a0',bg:'#e8ffe8'},
  denpi: {name:'でんぴ',   rarity:'R',  color:'#ffd54f',bg:'#fffde7'},
  ryuu:  {name:'りゅう',   rarity:'SR', color:'#66bb6a',bg:'#d4f0d4'},
  koorin:{name:'こおりん', rarity:'SR', color:'#b3e5fc',bg:'#e0f7ff'},
  luna:  {name:'るな',     rarity:'UR', color:'#ffd700',bg:'#fff9d4'},
  honoo: {name:'ほのお',   rarity:'UR', color:'#ff7043',bg:'#fff3e0'},
};
const RO=['C','UC','R','SR','UR'];
const RC={C:'#9e9e9e',UC:'#4caf50',R:'#2196f3',SR:'#9c27b0',UR:'#ff9800'};
const RW={C:40,UC:28,R:18,SR:10,UR:4};
const POOL=Object.entries(MONS).flatMap(([k,m])=>Array(RW[m.rarity]).fill(k));

const BASE_STATS={
  slime: {hp:60, atk:8,  def:5,  spd:7,  luk:8},
  moko:  {hp:55, atk:9,  def:4,  spd:9,  luk:10},
  nyara: {hp:70, atk:12, def:7,  spd:11, luk:7},
  usapi: {hp:65, atk:10, def:6,  spd:12, luk:9},
  hanako:{hp:75, atk:11, def:8,  spd:7,  luk:8},
  denpi: {hp:65, atk:14, def:5,  spd:13, luk:7},
  ryuu:  {hp:90, atk:16, def:10, spd:9,  luk:6},
  koorin:{hp:85, atk:13, def:12, spd:8,  luk:7},
  luna:  {hp:95, atk:18, def:8,  spd:14, luk:12},
  honoo: {hp:100,atk:20, def:9,  spd:12, luk:8},
};
const EQUIP={
  ribbon:    {name:'リボン',      slot:'hat',icon:'🎀',rarity:'C', cost:150,stats:{def:2,luk:5}},
  flowerhat: {name:'はなかんむり',slot:'hat',icon:'🌸',rarity:'UC',cost:350,stats:{def:4,luk:8,spd:2}},
  crown:     {name:'おうかん',    slot:'hat',icon:'👑',rarity:'R', cost:0,  stats:{def:6,luk:10,atk:3}},
  starcrown: {name:'ほしかんむり',slot:'hat',icon:'⭐',rarity:'SR',cost:0,  stats:{def:10,luk:15,atk:5,spd:3}},
  clover:    {name:'クローバー',  slot:'acc',icon:'🍀',rarity:'C', cost:150,stats:{luk:10,spd:3}},
  heartgem:  {name:'ハートジェム',slot:'acc',icon:'💎',rarity:'UC',cost:350,stats:{luk:8,spd:5,def:3}},
  moonstone: {name:'ムーンストーン',slot:'acc',icon:'🌙',rarity:'R',cost:0, stats:{spd:8,luk:12,def:4}},
  rainbow:   {name:'レインボー',  slot:'acc',icon:'🌈',rarity:'SR',cost:0,  stats:{spd:10,luk:15,atk:4,def:5}},
  wand:      {name:'スターワンド',slot:'wpn',icon:'🪄',rarity:'C', cost:150,stats:{atk:5,spd:2}},
  lightning: {name:'かみなりの杖',slot:'wpn',icon:'⚡',rarity:'UC',cost:350,stats:{atk:8,spd:5}},
  sword:     {name:'にじの剣',    slot:'wpn',icon:'⚔️',rarity:'R', cost:0,  stats:{atk:12,def:3}},
  orb:       {name:'うちゅうのオーブ',slot:'wpn',icon:'🔮',rarity:'UR',cost:0,stats:{atk:15,spd:8,luk:8}},
};
const ITEMS={
  herb:    {name:'やくそう',   icon:'🌿',basePrice:15},
  bone:    {name:'ほね',       icon:'🦴',basePrice:12},
  feather: {name:'はね',       icon:'🪶',basePrice:25},
  mushroom:{name:'きのこ',     icon:'🍄',basePrice:20},
  stone:   {name:'まほうせき', icon:'💠',basePrice:40},
  fang:    {name:'きば',       icon:'🦷',basePrice:30},
  scale:   {name:'うろこ',     icon:'🐠',basePrice:35},
  iron:    {name:'てっこう',   icon:'⚙️',basePrice:55},
  crystal: {name:'クリスタル', icon:'🔮',basePrice:80},
  potion:  {name:'ポーション', icon:'🧪',basePrice:50},
};
const ENEMIES={
  slimeE: {name:'スライム',hp:25,atk:4,def:1,xp:10,icon:'🫧',loot:['herb','mushroom'],col:'#a5d6a7'},
  bat:    {name:'コウモリ',hp:22,atk:5,def:1,xp:12,icon:'🦇',loot:['feather','bone'],col:'#ce93d8'},
  goblin: {name:'ゴブリン',hp:35,atk:6,def:2,xp:18,icon:'👺',loot:['bone','herb','stone'],col:'#a5d6a7'},
  wolf:   {name:'オオカミ',hp:50,atk:9,def:3,xp:28,icon:'🐺',loot:['fang','feather','bone'],col:'#cfd8dc'},
  fishE:  {name:'サカナB',  hp:40,atk:8,def:4,xp:22,icon:'🐡',loot:['scale','stone','feather'],col:'#80deea'},
  golem:  {name:'ゴーレム',hp:85,atk:13,def:9,xp:55,icon:'🪨',loot:['stone','iron','iron'],col:'#bcaaa4'},
  witch:  {name:'まじょ',  hp:65,atk:15,def:6,xp:50,icon:'🧙',loot:['crystal','mushroom','potion'],col:'#ce93d8'},
  dragon: {name:'ドラゴン',hp:130,atk:20,def:12,xp:90,icon:'🐉',loot:['crystal','iron','scale','fang'],col:'#ffab91'},
};
const QUESTS={
  meadow:{name:'牧草地探索',rank:'E',rankCol:'#9e9e9e',bg:'linear-gradient(135deg,#1b3a10 0%,#2d5a1b 100%)',reqLv:1,
    nodes:[{t:'enemy',e:'slimeE'},{t:'chest',items:['herb','herb']},{t:'enemy',e:'bat'},{t:'rest',hp:25},{t:'enemy',e:'goblin'},{t:'chest',items:['feather','mushroom']}]},
  forest:{name:'深い森',rank:'D',rankCol:'#4caf50',bg:'linear-gradient(135deg,#0d2b0a 0%,#1b3a12 100%)',reqLv:3,
    nodes:[{t:'enemy',e:'goblin'},{t:'enemy',e:'wolf'},{t:'chest',items:['fang','stone']},{t:'rest',hp:35},{t:'enemy',e:'wolf'},{t:'boss',e:'witch'}]},
  cave:{name:'洞窟採掘',rank:'C',rankCol:'#2196f3',bg:'linear-gradient(135deg,#0d0d24 0%,#1a1a3e 100%)',reqLv:6,
    nodes:[{t:'enemy',e:'golem'},{t:'chest',items:['iron','stone']},{t:'enemy',e:'wolf'},{t:'enemy',e:'golem'},{t:'rest',hp:40},{t:'boss',e:'dragon'}]},
  ocean:{name:'海底神殿',rank:'B',rankCol:'#ff9800',bg:'linear-gradient(135deg,#0a1030 0%,#0d1f60 100%)',reqLv:10,
    nodes:[{t:'enemy',e:'fishE'},{t:'enemy',e:'fishE'},{t:'chest',items:['scale','scale','crystal']},{t:'rest',hp:50},{t:'enemy',e:'fishE'},{t:'boss',e:'dragon'}]},
};

// ─── STAT CALCULATION ────────────────────────────────────
function calcStats(m){
  const b=BASE_STATS[m.type];if(!b)return{maxHp:50,hp:50,atk:8,def:5,spd:8,luk:8};
  const lm=1+(m.level-1)*0.09;const bm=1+m.lb*0.12;
  let atk=0,def=0,spd=0,luk=0;
  Object.values(m.equip||{}).forEach(k=>{if(!k)return;const e=EQUIP[k];if(!e)return;
    atk+=e.stats.atk||0;def+=e.stats.def||0;spd+=e.stats.spd||0;luk+=e.stats.luk||0;});
  return{
    maxHp:Math.ceil(b.hp*lm*bm),
    atk:Math.ceil(b.atk*lm*bm)+atk,
    def:Math.ceil(b.def*lm*bm)+def,
    spd:Math.ceil(b.spd*lm*bm)+spd,
    luk:Math.ceil(b.luk*lm*bm)+luk,
  };
}

// ─── GLOBAL REDUCER ──────────────────────────────────────
const mkMon=(type,id)=>({id,type,name:`${MONS[type].name}${Math.floor(Math.random()*999)+1}`,level:1,xp:0,lb:0,rarity:MONS[type].rarity,equip:{hat:null,acc:null,wpn:null}});
const SAVE_KEY='mlg_save_v2';
const DEFAULT_STATE={coins:400,monsters:[{...mkMon('slime',1),name:'スライちゃん'}],party:1,
  materials:{herb:3,bone:2,feather:1},equipInventory:['ribbon','clover','wand'],
  shop:{listings:[],pendingGold:0},screen:'home',toast:null};
const INIT=()=>{
  try{const s=localStorage.getItem(SAVE_KEY);if(s){const p=JSON.parse(s);return{...DEFAULT_STATE,...p,screen:'home',toast:null};}}catch(e){}
  return{...DEFAULT_STATE};
};
function addXP(m,xp){const nx=m.xp+xp;const lu=nx>=100*(m.level);return lu?{...m,xp:0,level:m.level+1}:{...m,xp:nx};}
function reducer(s,a){
  switch(a.type){
    case 'SCREEN':return{...s,screen:a.v};
    case 'TOAST_CLEAR':return{...s,toast:null};
    case 'QUEST_COMPLETE':{
      const mat={...s.materials};
      a.loot.forEach(k=>{mat[k]=(mat[k]||0)+1});
      const mons=s.monsters.map(m=>m.id===s.party?addXP(m,a.xp):m);
      return{...s,materials:mat,monsters:mons,toast:`クエスト完了！ ${a.loot.map(k=>ITEMS[k]?.icon).join('')}`};
    }
    case 'SHOP_SET_LISTING':{
      const listings=a.listings;
      return{...s,shop:{...s.shop,listings}};
    }
    case 'NPC_BUY':{
      const {listIdx}=a;
      const l=[...s.shop.listings];
      if(!l[listIdx])return s;
      const earned=l[listIdx].price;
      const mat={...s.materials,[l[listIdx].itemKey]:(s.materials[l[listIdx].itemKey]||0)-1};
      if(l[listIdx].qty<=1) l.splice(listIdx,1);
      else l[listIdx]={...l[listIdx],qty:l[listIdx].qty-1};
      return{...s,materials:mat,shop:{...s.shop,listings:l,pendingGold:s.shop.pendingGold+earned}};
    }
    case 'COLLECT_GOLD':return{...s,coins:s.coins+s.shop.pendingGold,shop:{...s.shop,pendingGold:0},toast:`💰 ${s.shop.pendingGold}コイン 回収！`};
    case 'BUY_EQUIP':{const e=EQUIP[a.key];if(!e||s.coins<e.cost)return{...s,toast:'コインが足りない！'};return{...s,coins:s.coins-e.cost,equipInventory:[...s.equipInventory,a.key],toast:`${e.icon} ${e.name}入手！`};}
    case 'EQUIP':{return{...s,monsters:s.monsters.map(m=>m.id!==a.mId?m:{...m,equip:{...m.equip,[a.slot]:a.key}}),toast:a.key?`${EQUIP[a.key]?.icon} 装備！`:'外した'};}
    case 'SET_PARTY':return{...s,party:a.id,screen:'home',toast:'✨ 編成した！'};
    case 'GACHA':{
      const cost=a.n===10?900:100;if(s.coins<cost)return{...s,toast:'コインが足りない！'};
      const pulled=Array.from({length:a.n},()=>POOL[Math.floor(Math.random()*POOL.length)]);
      let mons=[...s.monsters];const results=[];
      for(const type of pulled){const dup=mons.find(m=>m.type===type&&m.lb<5);
        if(dup){const nlb=Math.min(5,dup.lb+1);const nr=(nlb===3||nlb===5)&&RO.indexOf(dup.rarity)<4?RO[RO.indexOf(dup.rarity)+1]:dup.rarity;mons=mons.map(m=>m.id===dup.id?{...m,lb:nlb,rarity:nr}:m);results.push({type,isLB:true,rarity:nr});}
        else{const nm={...mkMon(type,Date.now()+Math.random()*9999)};mons.push(nm);results.push({type,isLB:false,rarity:MONS[type].rarity});}}
      return{...s,coins:s.coins-cost,monsters:mons,gacha:{results,idx:0}};
    }
    case 'GACHA_NEXT':{if(!s.gacha)return s;const ni=s.gacha.idx+1;if(ni>=s.gacha.results.length)return{...s,gacha:null};return{...s,gacha:{...s.gacha,idx:ni}};}
    case 'GACHA_DONE':return{...s,gacha:null};
    case 'LIMIT_BREAK':{const m=s.monsters.find(m=>m.id===a.keepId);if(!m||m.lb>=5)return s;const nlb=m.lb+1;const nr=(nlb===3||nlb===5)&&RO.indexOf(m.rarity)<4?RO[RO.indexOf(m.rarity)+1]:m.rarity;return{...s,monsters:s.monsters.filter(mm=>mm.id!==a.consumeId).map(mm=>mm.id===a.keepId?{...mm,lb:nlb,rarity:nr}:mm),toast:`★${nlb} 限界突破！${nr!==m.rarity?' レアUP!':''}`};}
    case 'BG_SHOP_TICK':{
      const ls=s.shop.listings;if(!ls.length)return s;
      if(Math.random()>0.45)return s;
      const li=Math.floor(Math.random()*ls.length);
      const l=[...ls];const earned=l[li].price;
      const mat={...s.materials,[l[li].itemKey]:Math.max(0,(s.materials[l[li].itemKey]||0)-1)};
      if(l[li].qty<=1)l.splice(li,1);else l[li]={...l[li],qty:l[li].qty-1};
      return{...s,materials:mat,shop:{...s.shop,listings:l,pendingGold:s.shop.pendingGold+earned}};
    }
    case 'RESET':return{...DEFAULT_STATE,monsters:[{...mkMon('slime',1),name:'スライちゃん'}]};
    default:return s;
  }
}

// ─── UI HELPERS ───────────────────────────────────────────
const CARD={background:'rgba(255,255,255,0.07)',backdropFilter:'blur(12px)',borderRadius:20,border:'1px solid rgba(255,255,255,0.12)',padding:14};
const FF={fontFamily:"'M PLUS Rounded 1c',sans-serif"};
function Bar({val,max=100,color='#ff80ab',label}){return <div style={{marginBottom:5}}>{label&&<div style={{fontSize:10,opacity:0.65,marginBottom:2}}>{label}</div>}<div style={{height:9,background:'rgba(255,255,255,0.1)',borderRadius:8,overflow:'hidden'}}><div style={{width:`${Math.max(0,(val/max)*100)}%`,height:'100%',background:color,borderRadius:8,transition:'width 0.35s'}}/></div></div>}
function Pill({label,color}){return <span style={{fontSize:9,fontWeight:900,background:color,borderRadius:20,padding:'2px 7px'}}>{label}</span>}
function Btn({onClick,children,color='#bf88ff',text='#fff',disabled=false,style={}}){return <button onClick={onClick} disabled={disabled} style={{...FF,border:'none',borderRadius:14,padding:'12px 0',fontWeight:900,fontSize:13,cursor:disabled?'default':'pointer',background:disabled?'rgba(255,255,255,0.08)':color,color:disabled?'rgba(255,255,255,0.3)':text,width:'100%',opacity:disabled?0.5:1,...style}}>{children}</button>}
function Toast({msg,onDone}){useEffect(()=>{const t=setTimeout(onDone,2100);return()=>clearTimeout(t)},[]);return <div style={{position:'fixed',top:18,left:'50%',transform:'translateX(-50%)',background:'rgba(20,0,50,0.96)',border:'1px solid #bf88ff',borderRadius:24,padding:'10px 22px',fontSize:12,fontWeight:700,animation:'pop 0.3s ease-out',zIndex:1000,whiteSpace:'nowrap',maxWidth:'92vw',textAlign:'center'}}>{msg}</div>}

function EquippedMonster({monster,size=80,anim='float'}){
  const eq=monster.equip||{};const hat=eq.hat&&EQUIP[eq.hat];const acc=eq.acc&&EQUIP[eq.acc];const wpn=eq.wpn&&EQUIP[eq.wpn];
  return <div style={{position:'relative',display:'inline-block',width:size,height:size}}>
    <MonsterSprite type={monster.type} size={size} anim={anim}/>
    {hat&&<span style={{position:'absolute',top:-size*0.2,left:'50%',transform:'translateX(-50%)',fontSize:size*0.28,filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',pointerEvents:'none'}}>{hat.icon}</span>}
    {acc&&<span style={{position:'absolute',bottom:0,right:-size*0.1,fontSize:size*0.24,filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',pointerEvents:'none'}}>{acc.icon}</span>}
    {wpn&&<span style={{position:'absolute',bottom:0,left:-size*0.1,fontSize:size*0.28,filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',pointerEvents:'none'}}>{wpn.icon}</span>}
  </div>;
}

// ─── HOME SCREEN ─────────────────────────────────────────
function HomeScreen({s,d}){
  const pm=s.monsters.find(m=>m.id===s.party)||s.monsters[0];
  if(!pm)return null;
  const st=calcStats(pm);const mi=MONS[pm.type];
  const STAT_DEFS=[['HP',st.maxHp,'#ef5350'],['ATK',st.atk,'#ff7043'],['DEF',st.def,'#42a5f5'],['SPD',st.spd,'#66bb6a'],['LUK',st.luk,'#ab47bc']];
  const MAX_S=120;
  return <div style={{width:'100%',padding:14,animation:'fadeIn 0.4s ease-out'}}>
    {/* Monster display */}
    <div style={{...CARD,marginBottom:12,background:`linear-gradient(135deg,${mi.bg}22,rgba(255,255,255,0.04))`,textAlign:'center',padding:24}}>
      <div style={{display:'inline-block',marginBottom:10,animation:'glow 2s ease-in-out infinite'}}>
        <EquippedMonster monster={pm} size={96} anim="float"/>
      </div>
      <div style={{fontWeight:900,fontSize:16,color:mi.color}}>{pm.name}</div>
      <div style={{display:'flex',justifyContent:'center',gap:5,marginTop:5}}>
        <Pill label={pm.rarity} color={RC[pm.rarity]}/>
        {pm.lb>0&&<Pill label={`★${pm.lb}`} color='#ff9800'/>}
        <Pill label={`Lv.${pm.level}`} color='#42a5f5'/>
      </div>
      <div style={{marginTop:8}}>
        <Bar val={pm.xp} max={100*pm.level} color='#bf88ff' label={`EXP ${pm.xp}/${100*pm.level}`}/>
      </div>
    </div>
    {/* Stats panel */}
    <div style={{...CARD,marginBottom:12}}>
      <div style={{fontSize:11,fontWeight:700,opacity:0.6,marginBottom:10}}>⚔ ステータス</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
        {STAT_DEFS.map(([label,val,col])=><div key={label} style={{textAlign:'center'}}>
          <div style={{fontSize:11,fontWeight:900,color:col}}>{label}</div>
          <div style={{width:'100%',height:50,display:'flex',alignItems:'flex-end',justifyContent:'center',marginTop:3}}>
            <div style={{width:16,background:col,borderRadius:4,height:`${Math.min(100,(val/MAX_S)*100)}%`,minHeight:4,transition:'height 0.5s'}}/>
          </div>
          <div style={{fontSize:11,fontWeight:700,marginTop:3}}>{val}</div>
        </div>)}
      </div>
    </div>
    {/* Quick info */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
      <div style={{...CARD,textAlign:'center'}}>
        <div style={{fontSize:10,opacity:0.6}}>所持素材</div>
        <div style={{fontSize:22,margin:'4px 0'}}>🎒</div>
        <div style={{fontSize:13,fontWeight:900}}>{Object.values(s.materials).reduce((a,b)=>a+b,0)}個</div>
      </div>
      <div style={{...CARD,textAlign:'center'}}>
        <div style={{fontSize:10,opacity:0.6}}>ショップ収入</div>
        <div style={{fontSize:22,margin:'4px 0'}}>🏪</div>
        <div style={{fontSize:13,fontWeight:900,color:'#ffd700'}}>{s.shop.pendingGold}G 待機中</div>
      </div>
    </div>
  </div>;
}

// ─── QUEST SCREEN ────────────────────────────────────────
function QuestScreen({s,d}){
  const [phase,setPhase]=useState('select');
  const [qKey,setQKey]=useState(null);
  const [nodeIdx,setNodeIdx]=useState(0);
  const [monHp,setMonHp]=useState(100);
  const [enemyHp,setEnemyHp]=useState(0);
  const [loot,setLoot]=useState([]);
  const [log,setLog]=useState([]);
  const [cphase,setCphase]=useState('ready'); // ready|enemy|done
  const [dmg,setDmg]=useState(null);
  const [shakeE,setShakeE]=useState(false);
  const [shakeM,setShakeM]=useState(false);
  const [auto,setAuto]=useState(false);
  const pm=s.monsters.find(m=>m.id===s.party)||s.monsters[0];
  const stats=pm?calcStats(pm):null;

  // Shared mutable refs so callbacks always see latest values
  const R=useRef({monHp:0,enemyHp:0,loot:[],xp:0,qKey:null,nodeIdx:0,cphase:'ready',phase:'select'});

  function startQuest(key,resetHp=true){
    if(!pm||!stats)return;
    const maxHp=stats.maxHp;
    const hp=resetHp?maxHp:Math.max(1,R.current.monHp);
    R.current={monHp:hp,enemyHp:0,loot:[],xp:0,qKey:key,nodeIdx:0,cphase:'ready',phase:'quest'};
    setQKey(key);setNodeIdx(0);setMonHp(hp);setLoot([]);setLog([`${pm.name}が${QUESTS[key].name}へ出発！`]);
    setPhase('quest');setCphase('ready');setDmg(null);
    processNodeFn(key,0,hp,[]);
  }

  function processNodeFn(key,idx,hp,curLoot){
    const q=QUESTS[key];
    if(idx>=q.nodes.length){R.current.phase='complete';setPhase('complete');return;}
    const node=q.nodes[idx];
    R.current.nodeIdx=idx;setNodeIdx(idx);
    if(node.t==='enemy'||node.t==='boss'){
      const ehp=ENEMIES[node.e].hp;R.current.enemyHp=ehp;R.current.cphase='ready';
      setEnemyHp(ehp);setCphase('ready');
    } else if(node.t==='chest'){
      const nl=[...curLoot,...node.items];R.current.loot=nl;setLoot(nl);
      setLog(p=>[...p.slice(-6),`📦 ${node.items.map(k=>ITEMS[k]?.icon||'?').join('')} 入手！`]);
      setTimeout(()=>processNodeFn(key,idx+1,hp,nl),auto?400:1000);
    } else if(node.t==='rest'){
      const nh=Math.min(stats.maxHp,hp+node.hp);R.current.monHp=nh;setMonHp(nh);
      setLog(p=>[...p.slice(-6),`⛺ HP +${node.hp} 回復！`]);
      setTimeout(()=>processNodeFn(key,idx+1,nh,curLoot),auto?300:800);
    }
  }

  // Single attack step
  function doAttack(){
    if(R.current.cphase!=='ready'||R.current.phase!=='quest')return;
    const q=QUESTS[R.current.qKey];if(!q)return;
    const node=q.nodes[R.current.nodeIdx];if(!node||(node.t!=='enemy'&&node.t!=='boss'))return;
    const e=ENEMIES[node.e];
    // Player hits
    const crit=Math.random()*100<stats.luk;
    let pdmg=Math.max(1,stats.atk-Math.floor(e.def/2));
    pdmg=Math.floor(pdmg*(0.82+Math.random()*0.36))*(crit?2:1);
    const newEHp=Math.max(0,R.current.enemyHp-pdmg);
    R.current.enemyHp=newEHp;R.current.cphase='enemy';
    setEnemyHp(newEHp);setShakeE(true);setTimeout(()=>setShakeE(false),300);
    setDmg({v:pdmg,crit,who:'e'});setTimeout(()=>setDmg(null),500);
    setLog(p=>[...p.slice(-6),crit?`✨ CRIT ${pdmg}!`:`${pm.name} → ${e.name} ${pdmg}dmg`]);
    setCphase('enemy');

    if(newEHp<=0){
      const drops=e.loot.filter(()=>Math.random()<0.72);
      const nl=[...R.current.loot,...drops];
      const nx=R.current.xp+e.xp;
      R.current.loot=nl;R.current.xp=nx;
      setLoot(nl);
      if(drops.length)setLog(p=>[...p.slice(-6),`💀 ${e.name} ${drops.map(k=>ITEMS[k]?.icon).join('')}`]);
      R.current.cphase='done';setCphase('done');
      const ni=R.current.nodeIdx+1;
      setTimeout(()=>processNodeFn(R.current.qKey,ni,R.current.monHp,nl),auto?350:1000);
      return;
    }
    // Enemy counter after short delay
    const delay=auto?180:450;
    setTimeout(()=>{
      let edmg=Math.max(0,e.atk-Math.floor(stats.def/2));
      edmg=Math.floor(edmg*(0.8+Math.random()*0.4));
      const nm=Math.max(0,R.current.monHp-edmg);
      R.current.monHp=nm;setMonHp(nm);
      setShakeM(true);setTimeout(()=>setShakeM(false),300);
      setDmg({v:edmg,crit:false,who:'m'});setTimeout(()=>setDmg(null),500);
      setLog(p=>[...p.slice(-6),`${e.name} → ${pm.name} ${edmg}dmg`]);
      if(nm<=0){R.current.phase='fail';setPhase('fail');return;}
      R.current.cphase='ready';setCphase('ready');
    },delay);
  }

  // Auto-battle driver
  useEffect(()=>{
    if(!auto||cphase!=='ready'||phase!=='quest')return;
    const t=setTimeout(doAttack,320);
    return()=>clearTimeout(t);
  },[auto,cphase,phase]);

  const q=qKey&&QUESTS[qKey];
  const node=q&&q.nodes[nodeIdx];
  const enemy=node&&(node.t==='enemy'||node.t==='boss')&&ENEMIES[node.e];
  const totalNodes=q?q.nodes.length:1;
  const lootSummary=Object.entries(loot.reduce((a,k)=>{a[k]=(a[k]||0)+1;return a},{}));

  if(phase==='select') return <div style={{width:'100%',padding:14,animation:'fadeIn 0.4s ease-out'}}>
    <div style={{...CARD,textAlign:'center',marginBottom:14}}>
      <div style={{fontSize:17,fontWeight:900}}>⚔ 素材クエスト</div>
      <div style={{fontSize:11,opacity:0.55,marginTop:2}}>冒険して素材を集め、お店で売ろう</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {Object.entries(QUESTS).map(([key,q])=>{
        const locked=pm&&pm.level<q.reqLv;
        return <button key={key} onClick={()=>!locked&&startQuest(key)}
          style={{...CARD,...FF,display:'flex',gap:12,alignItems:'center',cursor:locked?'default':'pointer',
            opacity:locked?0.32:1,border:`1px solid ${locked?'rgba(255,255,255,0.06)':q.rankCol+'88'}`,
            background:locked?undefined:q.bg}}>
          <div style={{textAlign:'center',minWidth:38}}>
            <div style={{fontSize:10,fontWeight:900,background:q.rankCol,borderRadius:8,padding:'2px 7px',display:'inline-block'}}>{q.rank}</div>
            <div style={{fontSize:9,opacity:0.55,marginTop:2}}>Lv{q.reqLv}+</div>
          </div>
          <div style={{flex:1,textAlign:'left'}}>
            <div style={{fontWeight:900,fontSize:14}}>{q.name}</div>
            <div style={{fontSize:10,opacity:0.6,marginTop:2}}>
              {q.nodes.filter(n=>n.t==='enemy'||n.t==='boss').map(n=>ENEMIES[n.e]?.icon).join(' ')}
              {'  '}{[...new Set(q.nodes.flatMap(n=>n.items||ENEMIES[n.e]?.loot||[]))].slice(0,5).map(k=>ITEMS[k]?.icon).join('')}
            </div>
          </div>
          {!locked&&<div style={{fontSize:18,opacity:0.7}}>▶</div>}
        </button>;
      })}
    </div>
  </div>;

  if(phase==='complete'||phase==='fail') return <div style={{width:'100%',padding:14,animation:'fadeIn 0.4s ease-out',textAlign:'center'}}>
    <div style={{...CARD,marginBottom:14,background:phase==='complete'?'rgba(100,200,100,0.1)':'rgba(200,50,50,0.1)',
      border:`1px solid ${phase==='complete'?'#66bb6a':'#ef5350'}`}}>
      <div style={{fontSize:44,marginBottom:6}}>{phase==='complete'?'🎉':'💀'}</div>
      <div style={{fontSize:18,fontWeight:900,color:phase==='complete'?'#66bb6a':'#ef5350',marginBottom:10}}>
        {phase==='complete'?'クエスト完了！':'力尽きた...'}
      </div>
      {phase==='complete'&&lootSummary.length>0&&<div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:6,marginBottom:8}}>
        {lootSummary.map(([k,n])=><div key={k} style={{background:'rgba(255,255,255,0.08)',borderRadius:10,padding:'4px 10px',fontSize:13}}>{ITEMS[k]?.icon}×{n}</div>)}
      </div>}
      {phase==='complete'&&<div style={{color:'#bf88ff',fontWeight:900,fontSize:13}}>EXP +{R.current.xp}</div>}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
      {phase==='complete'&&<Btn onClick={()=>{d({type:'QUEST_COMPLETE',loot:R.current.loot,xp:R.current.xp});startQuest(qKey);}}
        color='linear-gradient(135deg,#ff9800,#e65100)'>🔁 もう一度</Btn>}
      <Btn onClick={()=>{if(phase==='complete')d({type:'QUEST_COMPLETE',loot:R.current.loot,xp:R.current.xp});setPhase('select');setQKey(null);}}
        color={phase==='complete'?'linear-gradient(135deg,#66bb6a,#2e7d32)':'#ef5350'}>
        {phase==='complete'?'✅ 受け取って戻る':'← もどる'}
      </Btn>
    </div>
    {phase==='fail'&&qKey&&<Btn onClick={()=>startQuest(qKey)} color='rgba(255,255,255,0.1)'>🔄 リトライ（HP全回復）</Btn>}
  </div>;

  return <div style={{width:'100%',padding:12,animation:'fadeIn 0.4s ease-out'}}>
    {/* Top bar: progress + auto toggle */}
    <div style={{...CARD,marginBottom:8,padding:'8px 12px',background:q?.bg||undefined}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
        <span style={{fontWeight:900,fontSize:12}}>{q?.name}</span>
        <button onClick={()=>setAuto(a=>!a)} style={{...FF,padding:'3px 10px',borderRadius:12,border:`1px solid ${auto?'#ffd700':'rgba(255,255,255,0.3)'}`,background:auto?'rgba(255,215,0,0.2)':'rgba(255,255,255,0.06)',cursor:'pointer',fontSize:10,fontWeight:700,color:auto?'#ffd700':'rgba(255,255,255,0.6)'}}>
          {auto?'⚡ AUTO ON':'AUTO OFF'}
        </button>
      </div>
      <div style={{display:'flex',gap:3}}>
        {q?.nodes.map((_,i)=><div key={i} style={{flex:1,height:5,borderRadius:2,background:i<nodeIdx?'#66bb6a':i===nodeIdx?'#ffd700':'rgba(255,255,255,0.12)'}}/>)}
      </div>
    </div>

    {/* Mon HP */}
    <div style={{...CARD,marginBottom:8,padding:'8px 12px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{animation:shakeM?'shake 0.3s ease-out':'none'}}><EquippedMonster monster={pm} size={38} anim="none"/></div>
        <div style={{flex:1}}>
          <Bar val={monHp} max={stats?.maxHp||100} color={monHp/(stats?.maxHp||1)>0.5?'#66bb6a':monHp/(stats?.maxHp||1)>0.25?'#ffd700':'#ef5350'}/>
          <div style={{fontSize:9,opacity:0.55,marginTop:1}}>{monHp}/{stats?.maxHp} HP</div>
        </div>
        {dmg?.who==='m'&&<div style={{fontSize:14,fontWeight:900,color:'#ef5350',minWidth:28,textAlign:'right',animation:'pop 0.3s ease-out'}}>-{dmg.v}</div>}
      </div>
    </div>

    {/* Event area */}
    {enemy&&<div style={{...CARD,marginBottom:8,textAlign:'center',padding:'16px 12px',position:'relative',overflow:'hidden',background:q?.bg||undefined,minHeight:130}}>
      {node.t==='boss'&&<div style={{position:'absolute',top:8,right:10,fontSize:9,fontWeight:900,color:'#ff5722',background:'rgba(0,0,0,0.45)',borderRadius:8,padding:'2px 8px'}}>👑 BOSS</div>}
      <div style={{animation:shakeE?'shake 0.3s ease-out':'float 1.4s ease-in-out infinite',fontSize:60,lineHeight:1,filter:`drop-shadow(0 0 14px ${enemy.col})`}}>
        {enemy.icon}
      </div>
      {dmg?.who==='e'&&<div style={{position:'absolute',top:'20%',left:'50%',fontSize:16,fontWeight:900,color:dmg.crit?'#ffd700':'#fff',animation:'coinPop 0.5s ease-out forwards'}}>{dmg.crit?'✨':''}-{dmg.v}</div>}
      <div style={{fontWeight:900,fontSize:13,marginTop:6}}>{enemy.name}</div>
      <div style={{marginTop:5}}>
        <Bar val={enemyHp} max={ENEMIES[node.e]?.hp||1} color={enemy.col}/>
        <div style={{fontSize:9,opacity:0.55}}>{enemyHp}/{ENEMIES[node.e]?.hp}</div>
      </div>
    </div>}

    {node?.t==='chest'&&<div style={{...CARD,textAlign:'center',padding:'20px 12px',marginBottom:8,fontSize:50}}>📦<div style={{fontWeight:900,fontSize:13,marginTop:6}}>宝箱！</div></div>}
    {node?.t==='rest'&&<div style={{...CARD,textAlign:'center',padding:'20px 12px',marginBottom:8,fontSize:50}}>⛺<div style={{fontWeight:900,fontSize:13,marginTop:6}}>休憩中...</div></div>}

    {/* Log */}
    <div style={{...CARD,marginBottom:8,padding:'6px 10px',maxHeight:60,overflowY:'auto'}}>
      {log.slice(-3).map((l,i)=><div key={i} style={{fontSize:10,opacity:i===log.slice(-3).length-1?1:0.4,lineHeight:1.5}}>{l}</div>)}
    </div>

    {/* Action buttons */}
    {enemy&&cphase==='ready'&&!auto&&(
      <div style={{display:'grid',gridTemplateColumns:'3fr 1fr',gap:8}}>
        <Btn onClick={doAttack} color='linear-gradient(135deg,#ef5350,#bf360c)' style={{animation:'pulse 1s ease-in-out infinite'}}>⚔ たたかう！</Btn>
        <Btn onClick={()=>{R.current.phase='fail';setPhase('fail')}} color='rgba(255,255,255,0.08)' style={{fontSize:11}}>にげる</Btn>
      </div>
    )}
    {enemy&&cphase==='ready'&&auto&&<div style={{...CARD,textAlign:'center',padding:10,color:'#ffd700',fontWeight:900,fontSize:12,animation:'pulse 0.6s ease-in-out infinite'}}>⚡ オートバトル中...</div>}
    {enemy&&cphase==='enemy'&&<div style={{...CARD,textAlign:'center',padding:10,color:'#ef5350',fontWeight:900,fontSize:12}}>⚠️ 敵の反撃！</div>}
    {enemy&&cphase==='done'&&<div style={{...CARD,textAlign:'center',padding:10,color:'#66bb6a',fontWeight:900,fontSize:12}}>✅ 撃破！</div>}

    {/* Loot tally */}
    {lootSummary.length>0&&<div style={{marginTop:7,display:'flex',gap:4,flexWrap:'wrap'}}>
      {lootSummary.map(([k,n])=><span key={k} style={{fontSize:13,background:'rgba(255,255,255,0.09)',borderRadius:8,padding:'2px 6px'}}>{ITEMS[k]?.icon}×{n}</span>)}
    </div>}
  </div>;
}

// ─── SHOP SCREEN ─────────────────────────────────────────
function ShopScreen({s,d}){
  const cvRef=useRef(null);const npcsRef=useRef([]);const rafRef=useRef(null);const lastRef=useRef(null);const idRef=useRef(0);const listingsRef=useRef(s.shop.listings);const dRef=useRef(d);
  useEffect(()=>{listingsRef.current=s.shop.listings},[s.shop.listings]);
  useEffect(()=>{dRef.current=d},[d]);

  useEffect(()=>{
    const cv=cvRef.current;if(!cv)return;const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
    const spawnT=setInterval(()=>{
      if(npcsRef.current.length<5&&listingsRef.current.length>0){
        const types=['villager','grandma','kid','knight','merchant'];
        npcsRef.current.push({id:idRef.current++,x:-10,type:types[Math.floor(Math.random()*types.length)],state:'walk_in',spd:15+Math.random()*20,buyTimer:0,hasBought:false});
      }
    },2500);
    const loop=(ts)=>{
      if(!lastRef.current)lastRef.current=ts;
      const dt=Math.min((ts-lastRef.current)/1000,0.05);lastRef.current=ts;
      const frame=Math.floor(ts/250)%2;
      npcsRef.current=npcsRef.current.map(n=>{
        if(n.state==='walk_in'){
          const nx=n.x+n.spd*dt;
          if(nx>=110){
            if(!n.hasBought&&listingsRef.current.length>0){
              const li=Math.floor(Math.random()*listingsRef.current.length);
              dRef.current({type:'NPC_BUY',listIdx:li});
            }
            return{...n,x:110,state:'buying',buyTimer:1.6,hasBought:true};
          }
          return{...n,x:nx};
        }
        if(n.state==='buying'){const nt=n.buyTimer-dt;if(nt<=0)return{...n,state:'walk_out',spd:n.spd*1.1};return{...n,buyTimer:nt};}
        if(n.state==='walk_out'){const nx=n.x-n.spd*dt;if(nx<-12)return null;return{...n,x:nx};}
        return n;
      }).filter(Boolean);
      ctx.clearRect(0,0,200,100);drawShopBG(ctx);
      npcsRef.current.forEach(n=>{const flip=n.state==='walk_out';drawNPC(ctx,Math.floor(n.x),64,n.type,frame,flip);});
      rafRef.current=requestAnimationFrame(loop);
    };
    rafRef.current=requestAnimationFrame(loop);
    return()=>{clearInterval(spawnT);cancelAnimationFrame(rafRef.current)};
  },[]);

  const listedKeys=new Set(s.shop.listings.map(l=>l.itemKey));
  const hasMat=Object.values(s.materials).some(v=>v>0);
  const totalVal=s.shop.listings.reduce((a,l)=>a+l.qty*l.price,0);

  function listOne(k){
    const qty=s.materials[k]||0;if(qty<=0)return;
    const newListings=listedKeys.has(k)
      ? s.shop.listings.filter(l=>l.itemKey!==k)
      : [...s.shop.listings,{itemKey:k,qty,price:ITEMS[k].basePrice}];
    d({type:'SHOP_SET_LISTING',listings:newListings});
  }
  function listAll(){
    const newListings=Object.entries(s.materials).filter(([,v])=>v>0)
      .map(([k,qty])=>({itemKey:k,qty,price:ITEMS[k].basePrice}));
    d({type:'SHOP_SET_LISTING',listings:newListings});
  }
  function delistAll(){d({type:'SHOP_SET_LISTING',listings:[]});}

  return <div style={{width:'100%',padding:12,animation:'fadeIn 0.4s ease-out'}}>
    <div style={{borderRadius:16,overflow:'hidden',marginBottom:10,border:'1px solid rgba(255,255,255,0.15)'}}>
      <canvas ref={cvRef} width={200} height={100} style={{width:'100%',display:'block',imageRendering:'pixelated'}}/>
    </div>
    {s.shop.pendingGold>0&&<div style={{...CARD,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid #ffd70044'}}>
      <div><div style={{fontSize:10,opacity:0.6}}>売上待機中</div><div style={{fontSize:18,fontWeight:900,color:'#ffd700'}}>+{s.shop.pendingGold}G</div></div>
      <Btn onClick={()=>d({type:'COLLECT_GOLD'})} color='linear-gradient(135deg,#ffd700,#ff9800)' text='#1a0a00' style={{width:84,padding:'8px 0',fontSize:12}}>回収する</Btn>
    </div>}
    <div style={{...CARD,marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,opacity:0.6}}>🎒 素材 — タップで出品 / 取消</div>
        {totalVal>0&&<div style={{fontSize:10,color:'#ffd700'}}>出品総額 {totalVal}G</div>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:7}}>
        {Object.entries(ITEMS).map(([k,it])=>{
          const qty=s.materials[k]||0;
          const listed=listedKeys.has(k);
          return <button key={k} onClick={()=>listOne(k)}
            style={{...FF,display:'flex',alignItems:'center',gap:8,padding:'9px 10px',borderRadius:14,
              cursor:qty>0?'pointer':'default',
              background:listed?'rgba(102,187,106,0.15)':'rgba(255,255,255,0.04)',
              border:`1.5px solid ${listed?'#66bb6a':qty>0?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.05)'}`,
              opacity:qty>0?1:0.25}}>
            <div style={{fontSize:24}}>{it.icon}</div>
            <div style={{flex:1,textAlign:'left'}}>
              <div style={{fontSize:11,fontWeight:700}}>{it.name}</div>
              <div style={{fontSize:10,color:listed?'#ffd700':'rgba(255,255,255,0.45)'}}>
                ×{qty} @ {it.basePrice}G
              </div>
            </div>
            <div style={{fontSize:18,opacity:qty>0?1:0.3}}>{listed?'✅':'➕'}</div>
          </button>;
        })}
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:8}}>
      <Btn onClick={listAll} color='linear-gradient(135deg,#66bb6a,#2e7d32)' disabled={!hasMat}>
        📦 全部まとめて出品
      </Btn>
      <Btn onClick={delistAll} color='rgba(255,255,255,0.06)' style={{border:'1px solid #ef5350',color:'#ef5350',fontSize:11}} disabled={s.shop.listings.length===0}>
        全部外す
      </Btn>
    </div>
  </div>;
}


// ─── BAG SCREEN ──────────────────────────────────────────
function BagScreen({s,d}){
  const [tab,setTab]=useState('mat');
  const [equipSel,setEquipSel]=useState(null);
  const pm=s.monsters.find(m=>m.id===s.party)||s.monsters[0];
  const SLOTS=[['hat','頭🎩'],['acc','首💎'],['wpn','手⚔']];
  return <div style={{width:'100%',padding:14,animation:'fadeIn 0.4s ease-out'}}>
    <div style={{...CARD,marginBottom:12}}>
      <div style={{display:'flex',gap:7}}>
        {[['mat','🎒 素材'],['equip','⚔ 装備'],['shop','🏪 購入']].map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{...FF,flex:1,padding:'7px 0',borderRadius:12,border:'none',fontWeight:700,fontSize:11,cursor:'pointer',background:tab===k?'rgba(191,136,255,0.3)':'rgba(255,255,255,0.06)',color:tab===k?'#bf88ff':'rgba(255,255,255,0.45)'}}>{l}</button>)}
      </div>
    </div>
    {tab==='mat'&&<div>
      <div style={{fontSize:11,opacity:0.6,marginBottom:8}}>所持素材 — クエストで集めてショップで販売しよう</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
        {Object.entries(ITEMS).map(([k,it])=>{const qty=s.materials[k]||0;return <div key={k} style={{...CARD,textAlign:'center',padding:10,opacity:qty>0?1:0.3,border:`1px solid ${qty>0?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.06)'}`}}>
          <div style={{fontSize:28}}>{it.icon}</div>
          <div style={{fontSize:10,fontWeight:700,marginTop:4}}>{it.name}</div>
          <div style={{fontSize:11,color:'#ffd700',fontWeight:900}}>×{qty}</div>
          <div style={{fontSize:9,opacity:0.5}}>{it.basePrice}G</div>
        </div>})}
      </div>
    </div>}
    {tab==='equip'&&pm&&<div>
      <div style={{...CARD,marginBottom:12,display:'flex',alignItems:'center',gap:12}}>
        <EquippedMonster monster={pm} size={56} anim="float"/>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:14}}>{pm.name}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginTop:8}}>
            {SLOTS.map(([slot,lbl])=>{const k=pm.equip?.[slot];const e=k&&EQUIP[k];return <button key={slot} onClick={()=>setEquipSel(slot===equipSel?null:slot)} style={{...CARD,...FF,padding:'6px 4px',textAlign:'center',cursor:'pointer',border:`2px solid ${equipSel===slot?'#bf88ff':e?MONS[pm.type]?.color+'55':'rgba(255,255,255,0.1)'}`}}>
              <div style={{fontSize:20}}>{e?e.icon:'➕'}</div>
              <div style={{fontSize:8,marginTop:2,opacity:0.7}}>{e?e.name:lbl}</div>
            </button>})}
          </div>
        </div>
      </div>
      {equipSel&&<div style={{...CARD,animation:'pop 0.25s ease-out'}}>
        <div style={{fontSize:11,opacity:0.6,marginBottom:8}}>▼ {equipSel==='hat'?'頭':equipSel==='acc'?'首':'手'}装備を選ぶ</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <button onClick={()=>{d({type:'EQUIP',mId:pm.id,slot:equipSel,key:null});setEquipSel(null)}} style={{...FF,padding:'5px 10px',borderRadius:12,border:'1px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.06)',cursor:'pointer',fontSize:11,color:'rgba(255,255,255,0.6)'}}>外す</button>
          {[...new Set(s.equipInventory.filter(k=>EQUIP[k]?.slot===equipSel))].map(k=>{const e=EQUIP[k];const cnt=s.equipInventory.filter(kk=>kk===k).length;return <button key={k} onClick={()=>{d({type:'EQUIP',mId:pm.id,slot:equipSel,key:k});setEquipSel(null)}} style={{...FF,padding:'6px 10px',borderRadius:12,border:`1px solid ${RC[e.rarity]}88`,background:`${RC[e.rarity]}22`,cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',gap:4}}>
            <span>{e.icon}</span><span style={{fontSize:10}}>{e.name}×{cnt}</span>
          </button>})}
          {s.equipInventory.filter(k=>EQUIP[k]?.slot===equipSel).length===0&&<div style={{fontSize:11,opacity:0.4}}>なし（下の購入タブで入手）</div>}
        </div>
      </div>}
    </div>}
    {tab==='shop'&&<div style={{display:'flex',flexDirection:'column',gap:9}}>
      <div style={{fontSize:11,opacity:0.55,textAlign:'center',marginBottom:4}}>コインで装備を購入</div>
      {Object.entries(EQUIP).filter(([,e])=>e.cost>0).map(([k,e])=>{const can=s.coins>=e.cost;return <div key={k} style={{...CARD,display:'flex',alignItems:'center',gap:10,border:`1px solid ${RC[e.rarity]}44`}}>
        <div style={{fontSize:30}}>{e.icon}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:12}}>{e.name}</div>
          <Pill label={e.rarity} color={RC[e.rarity]}/>{' '}<Pill label={e.slot==='hat'?'頭':e.slot==='acc'?'首':'手'} color='rgba(255,255,255,0.2)'/>
          <div style={{fontSize:10,opacity:0.55,marginTop:3}}>
            {Object.entries(e.stats).map(([sk,sv])=><span key={sk} style={{marginRight:5}}>{sk.toUpperCase()}+{sv}</span>)}
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:13,fontWeight:900,color:'#ffd700',marginBottom:4}}>💰{e.cost}</div>
          <Btn onClick={()=>can&&d({type:'BUY_EQUIP',key:k})} color='#7b1fa2' disabled={!can} style={{width:56,padding:'5px 0',fontSize:10}}>購入</Btn>
        </div>
      </div>})}
    </div>}
  </div>;
}

// ─── COLLECTION SCREEN ───────────────────────────────────
function CollectionScreen({s,d}){
  const [sel,setSel]=useState(null);
  const selMon=s.monsters.find(m=>m.id===sel);
  const pm=s.monsters.find(m=>m.id===s.party)||s.monsters[0];
  const [spin,setSpin]=useState(false);
  function pull(n){if(spin)return;setSpin(true);setTimeout(()=>{d({type:'GACHA',n});setSpin(false)},1000);}
  const gr=s.gacha;
  if(gr){const r=gr.results[gr.idx];const mi=MONS[r.type];return <div style={{width:'100%',padding:14,textAlign:'center'}}>
    <div style={{fontSize:11,opacity:0.45,marginBottom:6}}>{gr.idx+1}/{gr.results.length}</div>
    <div style={{...CARD,padding:32,marginBottom:14,background:`linear-gradient(135deg,${mi.bg}33,rgba(255,255,255,0.04))`,border:`2px solid ${RC[r.rarity]}`,animation:'pop 0.5s ease-out'}}>
      {r.isLB&&<div style={{fontSize:11,color:'#ff9800',fontWeight:900,marginBottom:8}}>✨ 限界突破！</div>}
      <MonsterSprite type={r.type} size={88} anim="float"/>
      <div style={{marginTop:12,fontSize:20,fontWeight:900,color:mi.color}}>{mi.name}</div>
      <div style={{marginTop:6,display:'flex',justifyContent:'center',gap:6}}><Pill label={r.rarity} color={RC[r.rarity]}/>{r.isLB&&<Pill label='LB UP' color='#ff9800'/>}</div>
    </div>
    <Btn onClick={()=>gr.idx+1<gr.results.length?d({type:'GACHA_NEXT'}):d({type:'GACHA_DONE'})} color='linear-gradient(135deg,#bf88ff,#ff6b9d)'>{gr.idx+1<gr.results.length?'つぎへ →':'✨ おわり'}</Btn>
  </div>;}

  return <div style={{width:'100%',padding:14,animation:'fadeIn 0.4s ease-out'}}>
    {/* Gacha */}
    <div style={{...CARD,marginBottom:14,textAlign:'center',padding:'12px 14px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
        <div style={{fontWeight:900,fontSize:15}}>🎰 ガチャ</div>
        <div style={{fontWeight:900,color:'#ffd700'}}>💰 {s.coins}</div>
      </div>
      <div style={{fontSize:56,animation:spin?'pulse 0.3s ease-in-out infinite':'float 2s ease-in-out infinite'}}>{spin?'🌀':'🎱'}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10}}>
        <Btn onClick={()=>pull(1)} color='linear-gradient(135deg,#bf88ff,#7c3aed)' disabled={spin||s.coins<100}>1回 💰100</Btn>
        <Btn onClick={()=>pull(10)} color='linear-gradient(135deg,#ffd700,#ff9800)' text='#1a0533' disabled={spin||s.coins<900}>10連 💰900</Btn>
      </div>
    </div>
    {/* Party */}
    {pm&&<div style={{...CARD,marginBottom:12,border:'2px solid #bf88ff33'}}>
      <div style={{fontSize:11,fontWeight:700,opacity:0.6,marginBottom:6}}>⚔ 現在のパーティー</div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{animation:'glow 2s ease-in-out infinite'}}><EquippedMonster monster={pm} size={56} anim="float"/></div>
        <div>
          <div style={{fontWeight:900,fontSize:14}}>{pm.name}</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',margin:'4px 0'}}><Pill label={pm.rarity} color={RC[pm.rarity]}/>{pm.lb>0&&<Pill label={`★${pm.lb}`} color='#ff9800'/>}<Pill label={`Lv${pm.level}`} color='#42a5f5'/></div>
          {(()=>{const st=calcStats(pm);return <div style={{fontSize:10,opacity:0.6}}>ATK:{st.atk} DEF:{st.def} SPD:{st.spd}</div>})()}
        </div>
      </div>
    </div>}
    {/* Monster grid */}
    <div style={{fontSize:11,opacity:0.6,marginBottom:8}}>📦 所持 ({s.monsters.length}体)</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7,marginBottom:12}}>
      {s.monsters.map(m=>{const mi=MONS[m.type];const isSel=m.id===sel;const isPty=m.id===s.party;return <button key={m.id} onClick={()=>setSel(isSel?null:m.id)} style={{...CARD,...FF,padding:8,textAlign:'center',cursor:'pointer',border:`2px solid ${isSel?mi.color:isPty?'#bf88ff55':'rgba(255,255,255,0.08)'}`,background:isPty?'rgba(191,136,255,0.07)':'rgba(255,255,255,0.03)'}}>
        {isPty&&<div style={{fontSize:8,color:'#bf88ff',fontWeight:900,marginBottom:2}}>⚔ PARTY</div>}
        <EquippedMonster monster={m} size={50} anim={isPty?'float':'pulse'}/>
        <div style={{fontSize:10,fontWeight:700,marginTop:4,color:mi.color}}>{m.name}</div>
        <div style={{display:'flex',justifyContent:'center',gap:3,marginTop:2,flexWrap:'wrap'}}><Pill label={m.rarity} color={RC[m.rarity]}/>{m.lb>0&&<Pill label={`★${m.lb}`} color='#ff9800'/>}</div>
        <div style={{fontSize:9,opacity:0.45,marginTop:2}}>Lv.{m.level}</div>
      </button>})}
    </div>
    {selMon&&<div style={{...CARD,animation:'pop 0.25s ease-out',border:`2px solid ${MONS[selMon.type]?.color}55`,marginBottom:8}}>
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
        <EquippedMonster monster={selMon} size={56} anim="float"/>
        <div style={{flex:1}}>
          <div style={{fontWeight:900,fontSize:14}}>{selMon.name}</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',margin:'4px 0'}}><Pill label={selMon.rarity} color={RC[selMon.rarity]}/>{selMon.lb>0&&<Pill label={`★${selMon.lb}/5`} color='#ff9800'/>}<Pill label={`Lv${selMon.level}`} color='#42a5f5'/></div>
          {(()=>{const st=calcStats(selMon);return <div style={{fontSize:10,opacity:0.6}}>HP:{st.maxHp} ATK:{st.atk} DEF:{st.def} SPD:{st.spd} LUK:{st.luk}</div>})()}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {selMon.id!==s.party&&<Btn onClick={()=>d({type:'SET_PARTY',id:selMon.id})} color='linear-gradient(135deg,#bf40ff,#ff6b9d)'>⚔ 編成する</Btn>}
        {(()=>{const dup=s.monsters.find(m=>m.type===selMon.type&&m.id!==selMon.id&&selMon.lb<5);if(!dup)return null;const nlb=selMon.lb+1;const wu=(nlb===3||nlb===5)&&RO.indexOf(selMon.rarity)<4;return <Btn onClick={()=>{d({type:'LIMIT_BREAK',keepId:selMon.id,consumeId:dup.id});setSel(null)}} color={wu?'linear-gradient(135deg,#ffd700,#ff9800)':'linear-gradient(135deg,#ff9800,#e65100)'} text={wu?'#1a0a00':'#fff'}>✨ 限界突破{wu?' 🔺':''}</Btn>})()}
      </div>
    </div>}
  </div>;
}

// ─── APP ─────────────────────────────────────────────────
const TABS=[['home','🏠','ホーム'],['quest','⚔','クエスト'],['shop','🏪','ショップ'],['bag','🎒','バッグ'],['collection','📖','モンスター']];
export default function App(){
  const [s,d]=useReducer(reducer,null,INIT);
  const [showSave,setShowSave]=useState(false);
  // Auto-save
  useEffect(()=>{
    try{const{toast,...sv}=s;localStorage.setItem(SAVE_KEY,JSON.stringify(sv));}catch(e){}
  },[s]);
  // Background shop tick (works on any screen)
  useEffect(()=>{const id=setInterval(()=>d({type:'BG_SHOP_TICK'}),3200);return()=>clearInterval(id)},[]);
  useEffect(()=>{if(!s.toast)return;const id=setTimeout(()=>d({type:'TOAST_CLEAR'}),2200);return()=>clearTimeout(id)},[s.toast]);
  const pm=s.monsters.find(m=>m.id===s.party)||s.monsters[0];
  function hardReset(){if(window.confirm('データを全消去してリセットしますか？')){localStorage.removeItem(SAVE_KEY);d({type:'RESET'});setShowSave(false);}}
  return <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#1a0533 0%,#2d1054 50%,#1a0533 100%)',fontFamily:"'M PLUS Rounded 1c',sans-serif",color:'#fff',display:'flex',flexDirection:'column',alignItems:'center',maxWidth:430,margin:'0 auto',paddingBottom:72}}>
    <style>{CSS}</style>
    {s.toast&&<Toast msg={s.toast} onDone={()=>d({type:'TOAST_CLEAR'})}/>}
    {/* Save panel */}
    {showSave&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:900,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setShowSave(false)}>
      <div style={{...CARD,width:280,animation:'pop 0.25s ease-out',...FF}} onClick={e=>e.stopPropagation()}>
        <div style={{fontWeight:900,fontSize:16,marginBottom:14,textAlign:'center'}}>💾 セーブ</div>
        <div style={{fontSize:11,opacity:0.6,marginBottom:4,textAlign:'center'}}>自動セーブ中（ページ変更のたびに保存）</div>
        <div style={{background:'rgba(102,187,106,0.15)',border:'1px solid #66bb6a',borderRadius:12,padding:'8px 12px',fontSize:11,marginBottom:14,textAlign:'center'}}>✅ {s.monsters.length}体 / 💰{s.coins}G / {Object.values(s.materials).reduce((a,b)=>a+b,0)}素材</div>
        <button onClick={hardReset} style={{...FF,width:'100%',padding:'10px 0',borderRadius:12,border:'1px solid #ef5350',background:'rgba(239,83,80,0.1)',color:'#ef5350',cursor:'pointer',fontWeight:700,fontSize:12}}>🗑 データを初期化する</button>
        <button onClick={()=>setShowSave(false)} style={{...FF,width:'100%',padding:'10px 0',borderRadius:12,border:'none',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontWeight:700,fontSize:12,marginTop:8}}>閉じる</button>
      </div>
    </div>}
    <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px 8px',background:'linear-gradient(180deg,rgba(20,5,45,0.88) 0%,transparent 100%)'}}>
      <button onClick={()=>setShowSave(true)} style={{background:'none',border:'none',cursor:'pointer',fontSize:14,opacity:0.7,...FF}}>💾</button>
      <div style={{fontWeight:900,fontSize:13,background:'linear-gradient(90deg,#ff9fcf,#bf88ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>✨ モンスターライフ</div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {s.shop.pendingGold>0&&<div style={{fontSize:10,color:'#ffd700',fontWeight:900,opacity:0.8}}>+{s.shop.pendingGold}G</div>}
        <div style={{background:'rgba(255,215,0,0.15)',border:'1px solid #ffd700',borderRadius:20,padding:'4px 10px',fontSize:13,fontWeight:900,color:'#ffd700'}}>💰{s.coins}</div>
      </div>
    </div>
    <div style={{width:'100%',flex:1,overflowY:'auto'}}>
      {s.screen==='home'       &&<HomeScreen s={s} d={d}/>}
      {s.screen==='quest'      &&<QuestScreen s={s} d={d}/>}
      {s.screen==='shop'       &&<ShopScreen s={s} d={d}/>}
      {s.screen==='bag'        &&<BagScreen s={s} d={d}/>}
      {s.screen==='collection' &&<CollectionScreen s={s} d={d}/>}
    </div>
    <nav style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:430,background:'rgba(12,4,28,0.97)',backdropFilter:'blur(16px)',borderTop:'1px solid rgba(255,255,255,0.1)',display:'flex',justifyContent:'space-around',padding:'7px 0 14px'}}>
      {TABS.map(([id,ico,lbl])=><button key={id} onClick={()=>d({type:'SCREEN',v:id})} style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'M PLUS Rounded 1c',sans-serif",display:'flex',flexDirection:'column',alignItems:'center',gap:1,color:s.screen===id?'#ff9fcf':'rgba(255,255,255,0.35)',transition:'color 0.15s'}}>
        <span style={{fontSize:20,filter:s.screen===id?'drop-shadow(0 0 6px #ff9fcf)':'none'}}>{ico}</span>
        <span style={{fontSize:8,fontWeight:700}}>{lbl}</span>
      </button>)}
    </nav>
  </div>;
}
