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
  slime(ctx){
  // ぷに (C) - 水のかたまり・めだまプルん
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#0a3820',B='#30dc80',L='#78f0b0',H='#c0fcd8',W='#fff',P='#ff6090',EI='#1060e8';
  // Wobbly droplet tip
  q(D,14,2,4,1,13,3,6,1,13,4,6,3);q(B,14,3,4,1,14,4,4,2);q(L,15,3,2,1,15,4,2,1);
  // Main body (plump oval)
  q(D,9,7,14,1,7,8,18,1,5,9,22,1,4,10,1,16,27,10,1,16,5,26,1,7,27,18,1,9,28,14,1,12,29,8,1);
  q(B,10,8,12,1,8,9,16,1,6,10,20,1,5,10,22,14,6,24,20,1,7,25,18,1,8,26,16,1,10,27,12,1,13,28,6,1);
  q(L,7,11,8,1,6,12,10,1,6,13,9,1,7,14,7,1,7,15,5,1);
  q(H,8,11,5,1,7,12,6,1,7,13,6,1,8,14,4,1);
  // Left eye
  q(D,7,15,8,1,7,22,8,1,7,16,1,6,14,16,1,6);q(W,8,16,6,6);
  q(EI,9,17,5,5);q('#050f08',10,18,3,4);f(9,17,W);f(9,18,W);f(10,17,W);
  // Right eye
  q(D,17,15,8,1,17,22,8,1,17,16,1,6,24,16,1,6);q(W,18,16,6,6);
  q(EI,19,17,5,5);q('#050f08',20,18,3,4);f(19,17,W);f(19,18,W);f(20,17,W);
  // Smile
  q(P,12,24,8,1,11,25,3,1,21,25,3,1,11,26,2,1,22,26,2,1);
  // Cheek blush
  q('#ffb0cc',5,20,3,2,24,20,3,2);
},
  moko(ctx){
  // もこ (C) - ふわふわコットンボール生き物
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#7a1840',B='#ffb8d8',L='#ffd8e8',H='#fff0f5',W='#fff',M='#e01870',EY='#280820';
  // Fluffy bumpy outline (irregular circle)
  q(D,13,0,6,2,11,1,2,2,19,1,2,2,9,2,2,2,21,2,2,2,8,3,2,2,22,3,2,2);
  q(D,7,4,2,2,23,4,2,2,6,6,2,16,24,6,2,16,7,5,2,2,21,5,2,2,6,22,2,4,24,22,2,4);
  q(D,7,26,2,2,23,26,2,2,8,28,2,2,22,28,2,2,10,29,4,2,18,29,4,2,13,30,6,2);
  // Body fill
  q(B,14,1,4,1,12,2,8,1,10,3,12,1,9,4,14,1,8,5,16,1,8,6,16,12,9,18,14,1,10,19,12,1,12,20,8,1,14,21,4,1);
  // Wait more compact body rows
  q(B,8,7,16,17,9,24,14,2,11,26,10,2,13,28,6,1);
  // Light patches (fluffy texture)
  q(L,10,6,6,1,9,7,8,1,9,8,8,1,10,9,6,1,10,10,5,1);
  q(H,11,7,4,1,10,8,5,1,11,9,4,1);
  // Tiny dot eyes
  q(D,12,13,3,3,17,13,3,3);q(EY,13,14,2,2,18,14,2,2);q(W,13,14,1,1,18,14,1,1);
  // Tiny nose + smile
  f(15,18,M);f(16,18,M);
  q(M,14,20,4,1,13,21,2,1,19,21,2,1);
  // Cheek fluff
  q(L,8,16,4,3,20,16,4,3);q(H,9,17,2,2,21,17,2,2);
},
  nyara(ctx){
  // にゃら (UC) - 小さな青い子ねこ (sitting)
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#093060',B='#48b8f0',L='#90d8ff',H='#d0f0ff',W='#fff',PK='#ffb0cc',GR='#48c060',EY='#0a1838';
  // Cat ears
  q(D,8,0,5,1,7,1,6,1,7,2,5,4);q(B,9,1,3,1,8,2,3,3);q(PK,9,2,2,2);
  q(D,19,0,5,1,19,1,6,1,20,2,5,4);q(B,20,1,3,1,21,2,3,3);q(PK,21,2,2,2);
  // Head
  q(D,9,4,14,1,7,5,18,1,6,6,2,1,24,6,2,1,5,7,22,1,4,8,1,10,27,8,1,10,5,18,1,6,19,18,1,7,20,16,1,9,21,14,1);
  q(B,10,5,12,1,8,6,16,1,7,7,18,1,6,8,20,1,5,8,22,8,6,16,20,1,7,17,18,1,8,18,16,1,10,19,12,1);
  q(L,7,8,8,1,6,9,10,1,6,10,9,1,7,11,7,1);q(H,8,9,5,1,7,10,5,1);
  // Cat eyes (slightly slanted)
  q(D,7,10,8,1,7,15,8,1,7,11,1,4,14,11,1,4);q(W,8,11,6,4);
  q(GR,9,12,5,3);q(EY,9,12,5,1,9,14,5,1,10,13,3,1);f(9,12,W);f(9,13,W);
  q(D,17,10,8,1,17,15,8,1,17,11,1,4,24,11,1,4);q(W,18,11,6,4);
  q(GR,19,12,5,3);q(EY,19,12,5,1,19,14,5,1,20,13,3,1);f(19,12,W);f(19,13,W);
  // Nose + ω mouth
  f(15,16,PK);f(16,16,PK);
  q(D,13,18,2,1,17,18,2,1,14,19,3,1,16,19,2,1,15,17,2,2);
  // Whiskers
  q(D,1,13,6,1,1,14,7,1,25,13,6,1,24,14,7,1);
  // Body (cat body, sitting)
  q(D,10,20,12,1,8,21,16,1,7,22,1,12,24,22,1,12,8,34,16,1,10,35,12,1);
  q(B,11,21,10,1,8,22,16,12,9,34,14,1);
  q(W,11,22,4,10,11,32,5,2); // white underbelly
  // Front paws
  q(D,10,34,5,1,17,34,5,1);q(B,11,35,4,2,18,35,4,2);
  // Tail (curled to right)
  q(D,26,22,4,1,29,23,3,4,27,27,3,1,25,28,3,1);q(B,27,23,2,1,29,24,2,3,28,27,2,1,26,28,2,1);
},
  usapi(ctx){
  // うさぴ (UC) - 小さな白うさぎ (sitting)
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#302050',B='#ece8ff',L='#fff',H='#f8f0ff',PK='#ffb0d0',EY='#1a0830',EI='#8060e0',CK='#ffc0d8';
  // Long floppy ears (drooping)
  q(D,10,0,4,1,9,1,6,1,9,2,6,1,8,3,7,1,8,4,7,9,9,13,6,1,10,14,4,1);
  q(B,11,1,2,1,10,2,4,1,10,3,5,1,9,4,5,8);q(PK,11,3,2,6,10,9,3,2);
  q(D,18,0,4,1,17,1,6,1,17,2,6,1,17,3,7,1,17,4,7,9,17,13,6,1,18,14,4,1);
  q(B,19,1,2,1,18,2,4,1,18,3,5,1,18,4,5,8);q(PK,19,3,2,6,19,9,3,2);
  // Head (round)
  q(D,10,12,12,1,8,13,16,1,6,14,2,1,24,14,2,1,5,15,22,1,4,16,1,10,27,16,1,10,5,26,1,6,25,22,1,8,26,16,1,10,27,12,1);
  q(B,11,13,10,1,9,14,14,1,7,15,18,1,6,16,20,1,5,16,22,8,6,24,20,1,7,25,18,1,9,26,14,1,11,27,10,1);
  q(L,8,16,8,1,7,17,10,1,7,18,9,1,8,19,7,1);q(H,9,17,5,1,8,18,5,1);
  // Eyes (big sparkle)
  q(D,8,18,8,1,8,24,8,1,8,19,1,5,15,19,1,5);q(B,9,19,6,5);
  q(EI,10,20,5,4);q(EY,11,21,3,3);q(L,10,20,2,1,10,21,1,1);
  q(D,16,18,8,1,16,24,8,1,16,19,1,5,23,19,1,5);q(B,17,19,6,5);
  q(EI,18,20,5,4);q(EY,19,21,3,3);q(L,18,20,2,1,18,21,1,1);
  // Nose
  q(PK,14,25,4,1,15,25,2,2);
  // Smile
  q(D,13,27,4,1,19,27,4,1,12,28,2,2,23,28,2,2);
  q(CK,6,21,4,2,22,21,4,2);
  // Body
  q(D,9,28,14,1,7,29,18,1,7,30,1,12,24,30,1,12,9,42,14,1,7,43,18,1);
  q(B,10,29,12,1,8,30,16,12,10,42,12,1,8,43,16,1);
  // Paws
  q(D,9,43,5,1,18,43,5,1);q(B,10,44,4,2,19,44,4,2);
  // Fluffy tail
  q(B,25,36,4,4,24,37,5,3);q(L,25,37,4,2,26,36,3,2);
},
  hanako(ctx){
  // はなこ (R) - 花の森の妖精 (small forest imp)
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#1a3a10',B='#50cc60',L='#88e898',H='#c0f8c8',PK='#ff9fcf',Y='#ffd54f',W='#fff',SK='#d8ffa0',EY='#0a1e08',M='#ff6090',WG='#c8ffda';
  // Flower petal crown
  q(PK,8,0,3,2,13,0,4,2,21,0,3,2,11,1,4,1,17,1,4,1);q(Y,10,1,4,1,16,1,4,1);
  q(PK,12,0,4,2,14,1,4,1);q(Y,14,1,4,1,14,2,2,1);
  // Leaf wings
  q(WG,0,10,5,8,27,10,5,8,0,12,2,4,28,12,2,4);
  q(D,0,9,6,1,6,10,1,1,26,10,1,1,26,9,6,1);
  // Head
  q(D,10,4,12,1,8,5,16,1,7,6,2,1,23,6,2,1,6,7,20,1,5,8,1,10,26,8,1,10,6,18,1,7,19,18,1,8,20,16,1,10,21,12,1);
  q(B,11,5,10,1,9,6,14,1,8,7,16,1,7,8,18,1,6,8,20,8,7,16,18,1,8,17,16,1,9,18,14,1,11,19,10,1);
  q(L,8,8,8,1,7,9,10,1,7,10,9,1,8,11,7,1);q(H,9,9,5,1,8,10,5,1);
  // Green bangs
  q(B,10,5,12,1,9,6,4,1,19,6,4,1);
  // Eyes (big, green-tinted)
  q(D,8,10,7,1,8,16,7,1,8,11,1,5,14,11,1,5);q(W,9,11,5,5);q('#2a9a20',10,12,4,4);q(EY,11,13,2,3);f(10,12,W);
  q(D,17,10,7,1,17,16,7,1,17,11,1,5,23,11,1,5);q(W,18,11,5,5);q('#2a9a20',19,12,4,4);q(EY,20,13,2,3);f(19,12,W);
  // Tiny nose
  f(15,17,PK);f(16,17,PK);
  // Smile
  q(M,13,19,6,1,12,20,2,1,20,20,2,1);
  // Body (small, with visible hands starting)
  q(D,9,21,14,1,7,22,18,1,7,23,1,9,24,23,1,9);
  q(B,10,22,12,1,8,23,16,6,7,26,18,1,6,27,20,1,5,28,22,1);
  q(L,10,23,7,2,10,25,6,1);
  // Small leaf hands
  q(D,5,22,3,4,24,22,3,4);q(SK,5,23,3,2,24,23,3,2);
  q(WG,4,24,3,2,25,24,3,2);
  // Leaf skirt
  q(D,5,29,22,1);q(B,6,30,4,1,10,30,4,1,14,30,4,1,18,30,4,1,22,30,4,1);
  q(L,7,30,2,1,11,30,2,1,15,30,2,1,19,30,2,1);
},
  denpi(ctx){
  // でんぴ (R) - 電気ハムスター (standing upright)
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#7a5000',B='#ffd060',L='#ffe898',H='#fffde7',W='#fff',WH='#fffef0',M='#ff8800',EY='#1e0f00',EI='#2040e0',Z='#40a8f8',R='#e84020';
  // Ears
  q(D,8,1,5,4,19,1,5,4);q(B,9,2,3,2,20,2,3,2);q(M,10,2,1,2,21,2,1,2);
  // Head (chubby)
  q(D,9,5,14,1,7,6,18,1,5,7,2,1,25,7,2,1,4,8,24,1,4,9,1,14,27,9,1,14,5,23,1,6,24,20,1,8,25,16,1,10,26,12,1);
  q(B,10,6,12,1,8,7,16,1,6,8,20,1,5,9,22,1,4,9,24,13,5,22,22,1,6,23,20,1,7,24,18,1,9,25,14,1,11,26,10,1);
  q(L,7,9,9,1,6,10,11,1,6,11,10,1,7,12,8,1);q(H,8,10,6,1,7,11,6,1);
  // Round cheek pouches (big)
  q(M,4,14,5,5,23,14,5,5);q(B,5,15,3,3,24,15,3,3);q(L,5,15,2,2,24,15,2,2);
  // Lightning marks
  q(R,4,12,2,1,3,13,2,2,5,14,2,1);q(R,26,12,2,1,27,13,2,2,25,14,2,1);
  // Eyes
  q(D,8,11,8,1,8,17,8,1,8,12,1,5,15,12,1,5);q(W,9,12,6,5);q(EI,10,13,5,4);q(EY,11,14,3,3);f(10,13,W);f(10,14,W);
  q(D,16,11,8,1,16,17,8,1,16,12,1,5,23,12,1,5);q(W,17,12,6,5);q(EI,18,13,5,4);q(EY,19,14,3,3);f(18,13,W);f(18,14,W);
  // Nose + mouth
  f(15,18,M);f(16,18,M);q(M,13,20,6,1,12,21,3,1,21,21,3,1);
  // Upright body (bipedal!)
  q(D,10,27,12,1,9,28,14,1,9,29,1,6,22,29,1,6,10,35,12,1);
  q(B,11,28,10,1,10,29,12,6,11,35,10,1);q(WH,11,29,4,5); // white belly
  // Arms (small but visible - bipedal!)
  q(D,7,27,3,4,22,27,3,4);q(B,8,28,2,3,23,28,2,3);q(M,8,31,2,1,23,31,2,1);
  // Legs
  q(D,11,35,4,1,17,35,4,1);q(B,12,36,4,3,18,36,4,3);q(M,12,39,4,1,18,39,4,1);
  // Electric tail (lightning bolt shape)
  q(D,24,30,2,1,25,31,2,1,23,32,2,1,24,33,2,1);
  q(Z,25,31,1,1,24,32,1,1,25,33,1,1);
  // Sparks
  q(Z,1,8,2,1,0,9,1,1,2,7,1,1,29,8,2,1,30,9,1,1,28,7,1,1);
  q('#ffd700',2,6,1,1,28,6,1,1);
},
  ryuu(ctx){
  // りゅう (SR) - 二足歩行の子ドラゴン
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#0d3015',B='#3ec858',L='#70e890',H='#b0f8c8',Y='#ffd54f',R='#ef5350',W='#fff',M='#f06292',EY='#061408',EI='#1a8030',SC='#5aba65';
  // Horns
  q(Y,12,0,3,1,11,1,4,1,10,2,5,1,17,0,3,1,17,1,4,1,17,2,5,1);q(D,12,0,1,1,21,0,1,1);
  // Wings spread behind
  q(R,0,7,6,1,0,8,8,1,0,9,9,1,0,10,8,1,1,11,7,1,2,12,5,2,4,14,3,2);
  q(R,26,7,6,1,24,8,8,1,23,9,9,1,24,10,8,1,25,11,7,1,25,12,5,2,25,14,3,2);
  q(B,1,8,5,1,1,9,6,1,2,10,6,1,3,11,5,1,4,12,3,1,5,13,2,2);
  q(B,26,8,5,1,25,9,6,1,24,10,6,1,24,11,5,1,24,12,3,1,25,13,2,2);
  // Head (big cute)
  q(D,10,3,12,1,8,4,16,1,6,5,2,1,24,5,2,1,5,6,22,1,4,7,1,14,27,7,1,14,5,21,1,6,22,20,1,8,23,16,1,10,24,12,1);
  q(B,11,4,10,1,9,5,14,1,7,6,18,1,6,7,20,1,5,7,22,12,6,19,20,1,7,20,18,1,9,21,14,1,11,22,10,1);
  q(L,7,6,8,1,6,7,10,1,6,8,8,1,7,9,6,1);q(H,8,7,5,1,7,8,5,1);
  // Scale texture
  q(SC,8,8,4,2,15,8,4,2,8,12,3,2,18,12,3,2);
  // Eyes
  q(D,7,9,7,1,7,15,7,1,7,10,1,5,13,10,1,5);q(W,8,10,5,5);q(EI,9,11,4,4);q(EY,10,12,2,3);f(9,11,W);f(9,12,'#c8ffd4');
  q(D,18,9,7,1,18,15,7,1,18,10,1,5,24,10,1,5);q(W,19,10,5,5);q(EI,20,11,4,4);q(EY,21,12,2,3);f(20,11,W);f(20,12,'#c8ffd4');
  q(M,14,17,2,1,16,17,2,1);q(M,13,19,6,1,12,20,2,1,20,20,2,1);
  // Upright body
  q(D,10,24,12,1,9,25,14,1,9,26,1,8,22,26,1,8,10,34,12,1);
  q(B,11,25,10,1,10,26,12,8,11,34,10,1);q(SC,11,26,5,3,17,27,4,3);
  // Arms (with claws!)
  q(D,6,24,4,5,22,24,4,5);q(B,7,25,2,4,23,25,2,4);
  q(Y,6,29,2,1,7,29,1,1,22,29,2,1,23,29,1,1);
  // Legs + feet
  q(D,11,34,4,1,17,34,4,1);q(B,12,35,4,4,18,35,4,4);
  q(Y,12,39,2,1,14,39,2,1,18,39,2,1,20,39,2,1);
  // Tail
  q(D,23,29,3,1,25,30,3,3,25,33,2,1,24,34,2,1);q(B,24,30,2,3,25,34,1,1);q(Y,26,32,1,1);
},
  koorin(ctx){
  // こおりん (SR) - 氷の精霊 (taking humanoid form through crystals)
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#013d60',B='#60d8f8',L='#a8f0ff',H='#e0fbff',W='#fff',IC='#38c0e0',CR='#c0f8ff',EY='#00243a',EI='#0088b0';
  // Crystal crown/hair spikes
  q(D,13,0,6,1,11,1,10,1,9,2,14,1,9,3,14,1);
  q(H,14,1,4,1,12,2,8,1,10,3,12,1);q(W,15,1,2,1,13,2,4,1,12,3,8,1);
  // Side ice spikes
  q(D,0,10,5,1,0,11,6,1,0,12,7,2,1,14,5,2,2,15,3,2,3,16,2,2);
  q(D,27,10,5,1,26,11,6,1,25,12,7,2,26,14,5,2,27,15,3,2,27,16,2,2);
  q(IC,1,11,3,1,1,12,5,2,2,14,4,2,3,15,2,2,27,11,3,1,26,12,5,2,27,14,4,2,28,15,2,2);
  // Body (taking humanoid shape through ice)
  q(D,10,4,12,1,8,5,16,1,7,6,18,1,6,7,20,1,5,8,1,18,26,8,1,18,6,20,1,7,21,18,1,8,22,16,1,10,23,12,1);
  q(B,11,5,10,1,9,6,14,1,8,7,16,1,7,8,18,1,6,8,20,13,7,21,18,1,8,22,16,1,9,23,14,1,11,24,10,1);
  // Inner glow
  q(L,10,6,12,1,9,7,14,1,8,8,16,4,9,12,14,1,10,13,12,1);
  q(H,11,8,10,1,10,9,12,2,11,11,10,1);
  // Eyes (glowing ice blue)
  q(D,8,11,8,1,8,17,8,1,8,12,1,5,15,12,1,5);q(W,9,12,6,5);q(EI,10,13,5,4);q(EY,11,14,3,3);
  f(9,12,CR);f(9,13,CR);f(10,12,W);
  q(D,16,11,8,1,16,17,8,1,16,12,1,5,23,12,1,5);q(W,17,12,6,5);q(EI,18,13,5,4);q(EY,19,14,3,3);
  f(17,12,CR);f(17,13,CR);f(18,12,W);
  f(15,18,IC);f(16,18,IC);q(D,13,20,2,1,17,20,2,1,14,21,4,1);
  // Body takes humanoid shape (torso, arms emerging)
  q(D,10,24,12,1,8,25,16,1,7,26,1,8,24,26,1,8,10,34,12,1);
  q(B,11,25,10,1,8,26,16,8,10,34,12,1);q(L,11,26,6,4,11,30,5,2);
  // Arms (crystal-forming)
  q(D,5,24,4,5,23,24,4,5);q(B,6,25,2,4,24,25,2,4);
  q(IC,5,29,4,2,23,29,4,2);q(CR,6,29,2,2,24,29,2,2);
  // Legs (crystal shards)
  q(D,11,34,4,1,17,34,4,1);q(B,12,35,3,5,19,35,3,5);
  q(IC,12,40,3,1,19,40,3,1);
  // Bottom crystal trail
  q(D,12,34,8,1,14,35,4,1,10,35,3,1,19,35,3,1);
  q(B,13,35,2,1,17,35,2,1);q(CR,14,35,4,1);
},
  luna(ctx){
  // るな (UR) - 小さな黄金の妖精 (clearly humanoid fairy)
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#7a5000',B='#ffd700',L='#ffe060',H='#fff9c4',W='#fff',SK='#ffe0b0',EY='#1a0840',EI='#9c27b0',WG='#a0f0ff',PK='#ff80cf',SP='#fffde7',GD='#ff9800';
  // Star crown
  q(B,13,0,6,1,12,1,8,1,11,2,10,1,12,3,8,1);
  q(L,14,0,4,1,13,1,6,1,12,2,8,1,13,3,6,1);q(W,15,1,2,1,14,2,4,1);
  q(B,7,2,3,1,6,3,4,1,7,4,3,1,22,2,3,1,22,3,4,1,22,4,3,1);
  // Large wings (fairy wings)
  q(WG,0,8,7,3,0,11,9,4,1,15,8,4,3,19,6,3,5,22,4,2);
  q(WG,25,8,7,3,24,11,9,4,23,15,8,4,23,19,6,3,23,22,4,2);
  q(W,1,9,5,2,1,11,7,3,2,14,6,3,4,17,4,2);
  q(W,26,9,5,2,24,11,7,3,24,14,6,3,24,17,4,2);
  // Head (humanoid, smaller than body)
  q(D,11,4,10,1,9,5,14,1,7,6,2,1,23,6,2,1,6,7,20,1,5,8,1,12,26,8,1,12,6,20,1,7,21,18,1,9,22,14,1,11,23,10,1);
  q(SK,12,5,8,1,10,6,12,1,8,7,16,1,7,8,18,1,6,8,20,9,7,17,18,1,8,18,16,1,10,19,14,1,12,20,8,1);
  // Golden hair
  q(B,11,5,10,1,10,6,5,1,17,6,5,1,9,7,4,1,19,7,4,1,8,8,4,1,20,8,4,1,7,9,4,1,6,10,3,1,6,12,3,5,23,9,4,1,23,10,3,1,23,12,3,5);
  q(L,12,5,8,1,11,6,3,1,18,6,3,1);
  // Eyes (violet, expressive)
  q(D,8,10,7,1,8,15,7,1,8,11,1,4,14,11,1,4);q(W,9,11,5,4);q(EI,10,12,4,3);q(EY,11,13,2,2);f(10,12,W);f(10,13,'#eebbff');
  q(D,17,10,7,1,17,15,7,1,17,11,1,4,23,11,1,4);q(W,18,11,5,4);q(EI,19,12,4,3);q(EY,20,13,2,2);f(19,12,W);f(19,13,'#eebbff');
  f(15,16,PK);f(16,16,PK);q(PK,13,18,6,1,12,19,2,1,20,19,2,1);
  // Dress (gold, with details)
  q(D,9,23,14,1,7,24,18,1,7,25,1,8,24,25,1,8);
  q(B,10,24,12,1,8,25,16,6,7,28,18,1,6,29,20,1,5,30,22,1);
  q(L,10,25,7,2,10,27,6,1);q(W,14,26,2,1,18,27,2,1,12,28,2,1);
  q(GD,10,23,12,1,9,24,2,1,21,24,2,1);
  // Arms
  q(SK,5,24,2,5,25,24,2,5);
  // Star wand
  q(D,26,22,2,8,26,30,2,1);q(B,27,23,1,6);
  q(B,24,24,6,1,25,23,4,1,25,25,4,1);q(L,25,24,4,1,26,23,2,1,26,25,2,1);q(W,26,24,2,1);
  q(SP,27,22,1,1,28,24,1,1,26,26,1,1);
},
  honoo(ctx){
  // ほのお (UR) - 炎の精霊 (humanoid fire spirit)
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#7a1000',R='#e52010',O='#ff5818',Y='#ffc020',L='#fff4b0',W='#fff',M='#ff1040',EY='#2a0400',EI='#ff4000';
  // Flame hair (rising upward wildly)
  q(Y,13,0,6,1,11,1,10,1,10,2,5,1,17,2,4,1);
  q(O,9,1,3,1,20,1,3,1,9,2,4,1,19,2,4,1,7,3,4,1,21,3,4,1);
  q(R,7,2,2,1,22,2,2,1,6,3,2,2,23,3,2,2,5,4,2,2,23,4,2,2);
  q(Y,14,2,4,1,13,3,6,1,12,4,8,1);q(L,15,2,2,1,14,3,4,1,13,4,6,1);
  // Side flames
  q(Y,3,8,3,3,26,8,3,3);q(O,2,9,4,4,26,9,4,4);q(R,1,10,3,3,28,10,3,3);
  q(Y,4,13,3,3,25,13,3,3);q(O,3,14,4,4,25,14,4,4);
  // Head (humanoid through flame)
  q(D,10,5,12,1,8,6,16,1,7,7,18,1,6,8,20,1,5,9,22,1,4,10,1,12,26,10,1,12,5,22,1,6,23,20,1,8,24,16,1,10,25,12,1);
  q(R,11,6,10,1,9,7,14,1,8,8,16,1,7,9,18,1,6,9,20,9,7,18,18,1,8,19,16,1,9,20,14,1,10,21,12,1,11,22,10,1);
  // Inner glow
  q(O,11,8,10,1,9,9,14,1,8,10,16,5,9,15,14,1,10,16,12,1,11,17,10,1);
  q(Y,12,10,8,1,10,11,12,2,11,13,10,1,12,14,8,1);
  q(L,13,11,6,1,11,12,10,1,12,13,8,1);
  // Eyes (glowing white-hot)
  q(D,8,12,8,1,8,17,8,1,8,13,1,4,15,13,1,4);q(L,9,13,6,4);q(EI,10,14,5,3);q(EY,11,15,3,2);
  f(9,13,W);f(10,13,W);f(9,14,W);
  q(D,16,12,8,1,16,17,8,1,16,13,1,4,23,13,1,4);q(L,17,13,6,4);q(EI,18,14,5,3);q(EY,19,15,3,2);
  f(17,13,W);f(18,13,W);f(17,14,W);
  q(M,13,19,6,1,12,20,3,1,21,20,3,1,12,21,2,1,22,21,2,1);
  // Body (clearly humanoid through flame)
  q(D,10,25,12,1,8,26,16,1,7,27,1,8,24,27,1,8,10,35,12,1);
  q(R,11,26,10,1,8,27,16,8,10,35,12,1);
  q(O,11,27,8,2,11,29,7,2,12,31,6,2);q(Y,13,29,6,1,13,30,5,1,14,31,4,1);
  // Arms (flame arms)
  q(D,5,25,4,6,23,25,4,6);q(R,6,26,2,5,24,26,2,5);q(O,6,28,2,2,24,28,2,2);
  // Legs (flame legs)
  q(D,11,35,4,1,17,35,4,1);q(R,12,36,3,5,18,36,3,5);q(O,12,38,3,2,18,38,3,2);
  q(Y,12,40,3,1,18,40,3,1);
},
  shizuka(ctx){
  // しずか (LR) - 銀髪の静かな少女
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#1a0830',H='#d8d0f0',HL='#ece8ff',LH='#f4f0ff',SK='#ffe8d8',EY='#18083a',EI='#7040e8',DR='#9020b0',DL='#e0c0f0',W='#fff',PK='#f8b0c8',AC='#cc30e8',GD='#e0d0ff';
  // Flowing long hair
  q(D,10,0,12,1,8,1,16,1,7,2,4,1,21,2,4,1,6,3,4,16,6,4,4,14,5,6,4,14,4,8,4,14,3,10,4,14,2,12,4,10,2,14,3,8,1,22,2,3,1);
  q(H,11,1,10,1,9,2,4,1,19,2,4,1,7,3,3,1,22,3,3,1);
  q(H,6,5,3,16,7,6,3,14,6,8,3,12,5,10,3,10,4,12,3,8,3,14,3,6,2,16,3,4);
  q(H,23,5,3,16,22,6,3,14,23,8,3,12,24,10,3,10,25,12,3,8,26,14,3,6,25,16,3,4);
  q(HL,7,7,2,12,7,9,2,10,6,11,2,8,5,13,2,6,5,15,2,4);
  q(HL,23,7,2,12,23,9,2,10,24,11,2,8,25,13,2,6,25,15,2,4);
  // Head
  q(D,10,3,12,1,8,4,16,1,7,5,2,1,23,5,2,1,6,6,20,1,5,7,1,12,26,7,1,12,6,20,1,7,21,18,1,8,22,16,1,10,23,12,1);
  q(SK,11,4,10,1,9,5,14,1,8,6,16,1,7,7,18,1,6,7,20,9,7,16,18,1,8,17,16,1,10,18,14,1,12,19,10,1);
  q(H,10,4,12,1,9,5,5,1,18,5,5,1,8,6,4,1,20,6,4,1);q(HL,12,4,8,1,11,5,3,1,18,5,3,1);
  // Half-closed eyes (serene)
  q(D,8,10,7,1,8,14,7,1,8,11,1,3,14,11,1,3,8,10,2,1,13,10,2,1,8,9,2,1,13,9,2,1);
  q(EI,9,11,5,3);q(EY,10,12,3,2);q(W,9,11,2,1,9,12,1,1);
  q(D,17,10,7,1,17,14,7,1,17,11,1,3,23,11,1,3,17,10,2,1,22,10,2,1,17,9,2,1,22,9,2,1);
  q(EI,18,11,5,3);q(EY,19,12,3,2);q(W,18,11,2,1,18,12,1,1);
  f(15,16,PK);f(16,16,PK);q(D,14,18,4,1,13,19,2,1,19,19,2,1);
  // Elegant dress
  q(D,9,22,14,1,7,23,18,1,7,24,1,8,24,24,1,8);
  q(DR,10,23,12,1,8,24,16,7,7,27,18,1,6,28,20,1,5,29,22,1,4,30,24,1);
  q(DL,10,24,6,2,10,26,5,2);q(AC,10,22,12,1,9,23,2,1,21,23,2,1);
  q(W,11,23,1,1,13,23,1,1,15,23,1,1,17,23,1,1,19,23,1,1,21,23,1,1);
  // LR sparkles
  q(AC,1,5,2,2,29,3,2,2,0,18,2,2,30,20,2,2,2,28,2,2,28,27,2,2);
  q(W,2,6,1,1,30,4,1,1,1,19,1,1,31,21,1,1,3,29,1,1,29,28,1,1);
  q(SK,6,25,2,4,24,25,2,4);
  q(H,6,21,3,8,5,24,4,6,4,27,3,4,23,21,3,8,23,24,4,6,25,27,3,4);
},
  genki(ctx){
  // げんき (LR) - 元気なオレンジツインテール少女
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#7a2000',H='#ff6000',HL='#ff8c00',HH='#ffb000',SK='#ffccbc',EY='#0a2060',EI='#1055c8',EL='#3090f0',W='#fff',M='#e01888',CK='#ffab91',JK='#d03020',JL='#e84030',SC='#ffd020',TR='#ff8000';
  // Dynamic twin-tails (flying outward)
  q(D,0,2,7,1,0,3,8,2,0,5,8,2,1,7,7,2,2,9,5,2,3,11,4,2);
  q(H,1,3,5,1,1,4,6,1,1,5,6,1,2,6,5,1,3,7,4,1,4,8,3,1,4,10,3,1,5,12,3,1);
  q(HL,2,4,3,1,2,5,3,1,3,6,3,1,4,7,3,1);
  q(D,25,2,7,1,24,3,8,2,24,5,8,2,24,7,7,2,25,9,5,2,25,11,4,2);
  q(H,26,3,5,1,25,4,6,1,25,5,6,1,25,6,5,1,25,7,4,1,24,10,3,1,23,12,3,1);
  q(HL,27,4,3,1,27,5,3,1,26,6,3,1,25,7,3,1);
  // Top hair
  q(D,10,0,12,1,8,1,16,1,7,2,18,1,6,3,20,1,6,4,20,1);
  q(H,11,1,10,1,9,2,4,1,19,2,4,1);q(HL,13,1,6,1,12,2,2,1,18,2,2,1);q(HH,14,1,4,1);
  // Head
  q(D,10,3,12,1,8,4,16,1,7,5,2,1,23,5,2,1,6,6,20,1,5,7,1,12,26,7,1,12,6,20,1,7,21,18,1,8,22,16,1,10,23,12,1);
  q(SK,11,4,10,1,9,5,14,1,8,6,16,1,7,7,18,1,6,7,20,9,7,16,18,1,8,17,16,1,10,18,14,1,12,19,10,1);
  q(H,10,4,12,1,9,5,4,1,19,5,4,1,8,6,4,1,20,6,4,1);
  // Big bright eyes
  q(D,7,9,8,1,7,15,8,1,7,10,1,5,14,10,1,5);
  q(W,8,10,6,5);q(EI,9,11,5,4);q(EL,9,11,5,1);q(EY,10,12,3,3);
  f(9,10,W);f(9,11,W);f(9,12,W);f(10,10,EL);
  q(D,17,9,8,1,17,15,8,1,17,10,1,5,24,10,1,5);
  q(W,18,10,6,5);q(EI,19,11,5,4);q(EL,19,11,5,1);q(EY,20,12,3,3);
  f(19,10,W);f(19,11,W);f(19,12,W);f(20,10,EL);
  // Big smile
  q(M,11,17,2,1,19,17,2,1);q(M,11,18,10,1,10,19,12,1,11,20,2,1,21,20,2,1);q(W,12,19,8,1);
  q(CK,6,14,3,2,23,14,3,2);
  // Outfit
  q(D,9,23,14,1,7,24,18,1,7,25,1,8,24,25,1,8);
  q(JK,10,24,12,1,8,25,16,5,7,27,18,1);q(JL,10,25,7,2,10,27,5,1);
  q(D,6,28,20,1);q(SC,7,29,18,3,6,30,20,1);q(TR,7,29,4,1,11,29,4,1,15,29,4,1,19,29,4,1);
  q(SK,5,25,2,4,25,25,2,4);q(JK,5,23,2,2,25,23,2,2);
  q(SK,10,32,4,4,18,32,4,4);q(D,10,31,4,1,18,31,4,1);
  // LR sparkles
  q('#ff4488',0,8,2,2,30,6,2,2,1,22,2,2,29,24,2,2,2,30,2,2);
  q(W,1,9,1,1,31,7,1,1,2,23,1,1,30,25,1,1);
},
  riku(ctx){
  // りく (LR) - ボーイッシュなティール髪少女
  const q=(c,...r)=>{ctx.fillStyle=c;for(let i=0;i<r.length;i+=4)ctx.fillRect(r[i],r[i+1],r[i+2],r[i+3])};
  const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};
  const D='#003040',H='#007888',HL='#20b8c8',HH='#70dce8',SK='#ffe0cc',EY='#002820',EI='#005848',EL='#20a090',W='#fff',JK='#1050b0',JL='#1a70d0',PT='#2e3844',PL='#3a5060',M='#e06060',SH='#101860';
  // Short teal hair with personality
  q(D,9,0,14,1,7,1,18,1,6,2,20,1,6,3,4,1,22,3,4,1);
  q(H,10,1,12,1,8,2,8,1,18,2,6,1,7,3,4,1,21,3,5,1);
  q(HL,12,1,8,1,10,2,5,1,18,2,3,1,8,3,3,1,22,3,3,1);
  q(HH,14,1,4,1,12,2,3,1);
  // Cowlick
  q(D,15,0,4,1,16,1,2,1);q(H,15,0,4,1,16,1,2,1);q(HL,16,0,2,1);
  // Head
  q(D,10,3,12,1,8,4,16,1,7,5,2,1,23,5,2,1,6,6,20,1,5,7,1,12,26,7,1,12,6,20,1,7,21,18,1,8,22,16,1,10,23,12,1);
  q(SK,11,4,10,1,9,5,14,1,8,6,16,1,7,7,18,1,6,7,20,9,7,16,18,1,8,17,16,1,10,18,14,1,12,19,10,1);
  q(H,10,4,12,1,9,5,4,1,19,5,4,1,8,6,3,1,21,6,3,1);
  // Cool determined eyes
  q(D,8,9,8,1,8,13,8,1,8,10,1,3,15,10,1,3,8,9,9,1,16,9,7,1);
  q(W,9,10,6,3);q(EI,10,10,5,3);q(EL,10,10,5,1);q(EY,11,11,3,2);
  f(10,10,W);f(11,10,W);f(12,10,EL);
  q(D,17,9,8,1,17,13,8,1,17,10,1,3,24,10,1,3,17,9,9,1);
  q(W,18,10,6,3);q(EI,19,10,5,3);q(EL,19,10,5,1);q(EY,20,11,3,2);
  f(19,10,W);f(20,10,W);f(21,10,EL);
  f(15,17,M);f(16,17,M);q(D,14,18,4,1);
  // Blue jacket
  q(D,9,23,14,1,7,24,18,1,7,25,1,8,24,25,1,8,7,31,4,1,21,31,4,1);
  q(JK,10,24,12,1,8,25,16,6,8,31,4,1,20,31,4,1);q(JL,10,25,5,2,10,27,5,2);
  q(W,15,24,2,6);q(D,15,24,2,1);
  // Shorts + sneakers
  q(D,10,31,12,1,9,32,14,1,9,33,1,7,22,33,1,7);
  q(PT,11,32,10,1,10,33,5,7,17,33,5,7);q(PL,12,33,3,4,19,33,3,4);
  q(D,10,36,5,1,17,36,5,1);q(H,10,37,5,2,17,37,5,2);q(HH,11,37,3,2,18,37,3,2);
  q(SK,5,25,2,5,25,25,2,5);q(JK,5,24,2,2,25,24,2,2);
  // LR sparkles (cyan theme)
  q(HL,0,7,2,2,30,5,2,2,1,20,2,2,29,22,2,2,2,29,2,2,28,30,2,2);
  q(W,1,8,1,1,31,6,1,1,2,21,1,1,30,23,1,1,3,30,1,1,29,31,1,1);
},
};

function MonsterSprite({type,size=64,anim='float',style={}}){
  const ref=useRef(null);
  useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,32,32);ctx.imageSmoothingEnabled=false;SP[type]?.(ctx)},[type]);
  return <canvas ref={ref} width={32} height={32} style={{width:size,height:size,imageRendering:'pixelated',animation:anim!=='none'?`${anim} 1.4s ease-in-out infinite`:'none',...style}}/>;
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
  slime:   {name:'ぷに',     rarity:'C',  color:'#3cd880',bg:'#d6fff0', desc:'みずみずしいゼリーのようなせいぶつ'},
  moko:    {name:'もふん',   rarity:'C',  color:'#ffafd7',bg:'#ffe8f4', desc:'ふわふわのコットンボールいきもの'},
  nyara:   {name:'にゃら',   rarity:'UC', color:'#60b8f0',bg:'#d6efff', desc:'小さな水色のこねこ'},
  usapi:   {name:'うさぴ',   rarity:'UC', color:'#d0b8ff',bg:'#f5e8ff', desc:'ながいみみのかわいいしょうウサギ'},
  hanako:  {name:'はなこ',   rarity:'R',  color:'#50cc60',bg:'#e8ffe8', desc:'花の森にすむようせいのしんぞく'},
  denpi:   {name:'でんぴ',   rarity:'R',  color:'#ffd060',bg:'#fffde7', desc:'いなずまのちからをもつでんきハムスター'},
  ryuu:    {name:'りゅう',   rarity:'SR', color:'#3ec858',bg:'#d4f0d4', desc:'二足歩行をおぼえたこドラゴン'},
  koorin:  {name:'こおりん', rarity:'SR', color:'#60d8f8',bg:'#e0f7ff', desc:'こおりのけっしょうからうまれたせいれい'},
  luna:    {name:'るな',     rarity:'UR', color:'#ffd700',bg:'#fff9d4', desc:'こがねいろのつばさをもつようせい'},
  honoo:   {name:'ほのお',   rarity:'UR', color:'#ff5818',bg:'#fff3e0', desc:'ほのおでできたにんげんがたのせいれい'},
  shizuka: {name:'しずか',   rarity:'LR', color:'#d0b8ff',bg:'#f3e5f5', desc:'ぎんのかみをもつしずかなしょうじょ'},
  genki:   {name:'げんき',   rarity:'LR', color:'#ff6000',bg:'#fff3e0', desc:'オレンジのツインテールのげんきっこ'},
  riku:    {name:'りく',     rarity:'LR', color:'#20b8c8',bg:'#e0f7ff', desc:'ティールのショートヘアのクールなこ'},
};
const RO=['C','UC','R','SR','UR','LR'];
const RC={C:'#9e9e9e',UC:'#4caf50',R:'#2196f3',SR:'#9c27b0',UR:'#ff9800',LR:'#e040fb'};
const RW={C:38,UC:26,R:17,SR:10,UR:6,LR:3};
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
  honoo:   {hp:100,atk:20, def:9,  spd:12, luk:8},
  shizuka: {hp:130,atk:18, def:16, spd:18, luk:28},
  genki:   {hp:120,atk:26, def:12, spd:24, luk:20},
  riku:    {hp:135,atk:22, def:20, spd:17, luk:22},
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
  orb:        {name:'うちゅうのオーブ',  slot:'wpn',icon:'🔮',rarity:'UR',cost:0,   stats:{atk:15,spd:8,luk:8}},
  catears:    {name:'ねこのみみ',       slot:'hat',icon:'🐱',rarity:'C', cost:180,  stats:{spd:4,luk:8}},
  witch_hat:  {name:'まじょのぼうし',   slot:'hat',icon:'🎩',rarity:'R', cost:0,    stats:{atk:6,luk:12}},
  angel_halo: {name:'エンジェルヘイロー',slot:'hat',icon:'😇',rarity:'SR',cost:0,   stats:{def:8,luk:18,spd:5}},
  fairy_wings:{name:'ようせいのはね',   slot:'acc',icon:'🦋',rarity:'UC',cost:420,  stats:{spd:10,luk:6}},
  dragonscale:{name:'りゅうのよろい',   slot:'acc',icon:'🛡️',rarity:'SR',cost:0,    stats:{def:18,atk:4}},
  starjewel:  {name:'ほしのたま',       slot:'acc',icon:'💫',rarity:'UR',cost:0,    stats:{atk:8,def:8,spd:8,luk:8}},
  ice_staff:  {name:'こおりのつえ',     slot:'wpn',icon:'🧊',rarity:'R', cost:0,    stats:{atk:10,spd:5}},
  fire_sword: {name:'えんじゃのけん',   slot:'wpn',icon:'🔥',rarity:'SR',cost:0,    stats:{atk:20,def:2}},
  holy_bow:   {name:'せいなるゆみ',     slot:'wpn',icon:'🏹',rarity:'UC',cost:500,  stats:{atk:8,spd:6,luk:5}},
  poison_dagger:{name:'どくのひとさし', slot:'wpn',icon:'☠️',rarity:'R', cost:0,    stats:{atk:12,luk:8}},
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
  potion:       {name:'ポーション',       icon:'🧪',basePrice:50},
  shell:        {name:'かいがら',         icon:'🐚',basePrice:18},
  ice:          {name:'こおりのかけら',   icon:'🧊',basePrice:28},
  ember:        {name:'ほのおのかけら',   icon:'🔥',basePrice:38},
  ancient_coin: {name:'こだいコイン',     icon:'🪙',basePrice:85},
  spider_silk:  {name:'くものいと',       icon:'🕸️',basePrice:30},
  venom:        {name:'どく',             icon:'☠️',basePrice:48},
  star_fragment:{name:'ほしのかけら',     icon:'💫',basePrice:65},
  darkstone:    {name:'やみのいし',       icon:'🌑',basePrice:75},
  elixir:       {name:'エリクサー',       icon:'✨',basePrice:220},
  moonflower:   {name:'つきのはな',       icon:'🌸',basePrice:42},
  thunder_core: {name:'いかずちのコア',   icon:'⚡',basePrice:58},
  dragon_scale: {name:'りゅうのうろこ',   icon:'🐉',basePrice:110},
  exp_book:     {name:'けいけんちの書',   icon:'📗',basePrice:0,  useEffect:'playerXP+200'},
  exp_tome:     {name:'けいけんちの大書', icon:'📕',basePrice:0,  useEffect:'playerXP+800'},
};
const ENEMIES={
  slimeE: {name:'スライム',hp:25,atk:4,def:1,xp:10,icon:'🫧',loot:['herb','mushroom'],col:'#a5d6a7'},
  bat:    {name:'コウモリ',hp:22,atk:5,def:1,xp:12,icon:'🦇',loot:['feather','bone'],col:'#ce93d8'},
  goblin: {name:'ゴブリン',hp:35,atk:6,def:2,xp:18,icon:'👺',loot:['bone','herb','stone'],col:'#a5d6a7'},
  wolf:   {name:'オオカミ',hp:50,atk:9,def:3,xp:28,icon:'🐺',loot:['fang','feather','bone'],col:'#cfd8dc'},
  fishE:  {name:'サカナB',  hp:40,atk:8,def:4,xp:22,icon:'🐡',loot:['scale','stone','feather'],col:'#80deea'},
  golem:  {name:'ゴーレム',hp:85,atk:13,def:9,xp:55,icon:'🪨',loot:['stone','iron','iron'],col:'#bcaaa4'},
  witch:  {name:'まじょ',  hp:65,atk:15,def:6,xp:50,icon:'🧙',loot:['crystal','mushroom','potion'],col:'#ce93d8'},
  dragon:       {name:'ドラゴン',       hp:130,atk:20,def:12,xp:90, icon:'🐉',loot:['crystal','iron','scale','fang'],        col:'#ffab91'},
  crab:         {name:'クラブ',         hp:30, atk:6, def:3, xp:14, icon:'🦀',loot:['shell','bone'],                            col:'#ef5350'},
  spider:       {name:'クモ',           hp:28, atk:7, def:2, xp:16, icon:'🕷️',loot:['spider_silk','fang'],                     col:'#424242'},
  yuki:         {name:'ユキオンナ',     hp:58, atk:11,def:6, xp:34, icon:'👻',loot:['ice','crystal'],                           col:'#b3e5fc'},
  phoenix_e:    {name:'フェニックス',   hp:72, atk:14,def:5, xp:46, icon:'🦅',loot:['ember','feather'],                        col:'#ff6d00'},
  vampire:      {name:'ヴァンパイア',   hp:92, atk:17,def:8, xp:64, icon:'🧛',loot:['darkstone','crystal','potion'],            col:'#6a1b9a'},
  angel_e:      {name:'アークエンジェル',hp:82,atk:13,def:14,xp:54, icon:'👼',loot:['star_fragment','moonflower'],              col:'#fff9c4'},
  ancient_golem:{name:'こだいゴーレム', hp:125,atk:17,def:16,xp:80, icon:'🗿',loot:['ancient_coin','iron'],                    col:'#8d6e63'},
  wyrm:         {name:'ワーム',         hp:105,atk:18,def:10,xp:74, icon:'🐍',loot:['venom','scale','fang'],                   col:'#558b2f'},
  thunder_bird: {name:'サンダーバード', hp:78, atk:15,def:7, xp:50, icon:'🦅',loot:['thunder_core','feather'],                  col:'#ffd54f'},
  demon_lord:   {name:'まおう',         hp:210,atk:26,def:19,xp:160,icon:'😈',loot:['darkstone','crystal','elixir'],            col:'#880e4f'},
  sea_serpent:  {name:'シーサーペント', hp:95, atk:16,def:11,xp:68, icon:'🐲',loot:['dragon_scale','scale','crystal'],          col:'#00897b'},
};

// ─── ENEMY SPRITES (16×16) ───────────────────────────────
const ES={
  slimeE(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#ef9a9a',D='#c62828',L='#ffcdd2',W='#fff',P='#3e0000',M='#ad1457';f(7,1,L);f(8,1,L);f(7,2,B);f(8,2,B);[[4,11],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[3,12],[4,11],[4,11],[5,10],[6,9]].forEach(([lo,hi],i)=>{for(let x=lo;x<=hi;x++)f(x,i+3,B)});for(let y=5;y<=7;y++){f(5,y,W);f(6,y,W);f(9,y,W);f(10,y,W)}f(6,6,P);f(9,6,P);f(7,9,M);f(8,9,M);f(5,4,D);f(10,4,D)},
  bat(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#4a148c',D='#7b1fa2',W='#fff',R='#e91e8c',LV='#ce93d8';for(let x=0;x<=4;x++){f(x,4,B);f(x,5,B)}for(let x=11;x<=15;x++){f(x,4,B);f(x,5,B)}f(1,3,D);f(14,3,D);f(2,2,D);f(13,2,D);f(0,3,B);f(15,3,B);for(let y=6;y<=11;y++)for(let x=4;x<=11;x++)f(x,y,B);for(let x=5;x<=10;x++){f(x,5,B);f(x,12,B)}f(5,7,W);f(6,7,W);f(9,7,W);f(10,7,W);f(6,8,W);f(9,8,W);f(7,9,R);f(8,9,R);f(6,10,LV);f(9,10,LV);f(7,12,B);f(8,12,B)},
  goblin(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#558b2f',D='#33691e',SK='#8d6e63',W='#fff',P='#1b5e20',RD='#ef5350',E='#ffd54f';for(let y=1;y<=3;y++)for(let x=5;x<=10;x++)f(x,y,SK);f(4,2,SK);f(11,2,SK);for(let y=4;y<=10;y++)for(let x=4;x<=11;x++)f(x,y,B);for(let y=5;y<=7;y++){f(5,y,W);f(6,y,W);f(9,y,W);f(10,y,W)}f(6,6,P);f(9,6,P);f(7,8,RD);f(8,8,RD);f(3,5,E);f(12,5,E);f(3,6,E);f(12,6,E);f(4,4,D);f(11,4,D);for(let y=11;y<=13;y++)for(let x=5;x<=10;x++)f(x,y,B);f(5,13,D);f(9,13,D)},
  wolf(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#546e7a',D='#263238',L='#90a4ae',W='#fff',P='#000',RD='#ef5350',T='#ffd54f';f(3,0,B);f(4,0,B);f(10,0,B);f(11,0,B);f(3,1,L);f(4,1,L);f(10,1,L);f(11,1,L);for(let y=2;y<=9;y++)for(let x=3;x<=12;x++)f(x,y,B);for(let x=5;x<=9;x++)f(x,2,L);for(let y=4;y<=6;y++){f(4,y,W);f(5,y,W);f(9,y,W);f(10,y,W)}f(5,5,P);f(9,5,P);f(6,7,RD);f(7,7,T);f(8,7,RD);for(let y=10;y<=13;y++)for(let x=4;x<=11;x++)f(x,y,B);f(13,8,B);f(14,9,B);f(4,13,D);f(5,13,D);f(9,13,D);f(10,13,D)},
  fishE(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#0288d1',D='#01579b',L='#80deea',W='#fff',O='#ff6f00',P='#0d47a1',Y='#ffd54f';f(13,3,O);f(14,2,O);f(14,4,O);f(15,3,O);for(let y=4;y<=11;y++)for(let x=2;x<=12;x++)f(x,y,B);for(let x=4;x<=10;x++){f(x,3,B);f(x,12,B)}for(let x=5;x<=9;x++)f(x,2,B);f(8,5,L);f(9,5,W);f(9,6,P);for(let x=3;x<=11;x++)f(x,7,L);for(let x=3;x<=11;x+=2)f(x,9,L);f(6,10,Y);f(7,10,Y);f(1,7,D);f(1,8,D);f(0,7,D)},
  golem(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#757575',D='#424242',L='#bdbdbd',W='#fff',RD='#ef5350',O='#ff9800';for(let y=2;y<=4;y++)for(let x=4;x<=11;x++)f(x,y,B);for(let x=3;x<=12;x++)f(x,3,B);for(let y=5;y<=12;y++)for(let x=2;x<=13;x++)f(x,y,B);for(let x=3;x<=12;x++)f(x,5,L);for(let y=6;y<=8;y++){f(4,y,W);f(5,y,W);f(10,y,W);f(11,y,W)}f(5,7,RD);f(10,7,RD);[4,5,6,8,9,10].forEach(x=>f(x,9,D));f(1,7,D);f(2,7,D);f(13,7,D);f(14,7,D);for(let x=4;x<=11;x++)f(x,13,B);f(4,14,D);f(5,14,D);f(9,14,D);f(10,14,D);[6,7,8,9].forEach(x=>{f(x,2,O);f(x,1,O)})},
  witch(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#4a148c',HT='#212121',SK='#f8bbd0',W='#fff',P='#7c4dff',RD='#e91e8c',Y='#ffd54f',S='#ce93d8';f(5,0,HT);f(6,0,HT);f(7,0,HT);f(8,0,HT);f(9,0,HT);f(4,1,HT);f(10,1,HT);for(let x=5;x<=9;x++){f(x,1,HT);f(x,2,HT)}f(3,2,HT);f(11,2,HT);for(let y=3;y<=9;y++)for(let x=4;x<=11;x++)f(x,y,SK);for(let x=5;x<=10;x++)f(x,3,HT);f(5,5,W);f(6,5,W);f(9,5,W);f(10,5,W);f(6,6,B);f(9,6,B);f(7,7,RD);f(8,7,RD);for(let y=10;y<=14;y++)for(let x=4;x<=11;x++)f(x,y,B);for(let x=3;x<=12;x++)f(x,11,B);f(12,9,P);f(13,8,P);f(14,7,Y);f(15,7,Y);f(3,9,S);f(2,8,S)},
  dragon(ctx){const f=(x,y,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,1,1)};const B='#bf360c',D='#7f0000',O='#ff6d00',Y='#ffd54f',W='#fff',P='#3e0000',M='#ff1744',L='#ffccbc';f(2,0,O);f(3,0,O);f(11,0,O);f(12,0,O);f(2,1,O);f(3,1,Y);f(4,1,B);f(10,1,B);f(11,1,Y);f(12,1,O);for(let x=1;x<=3;x++){f(x,2,O);f(x,3,D)}for(let x=12;x<=14;x++){f(x,2,O);f(x,3,D)}for(let y=2;y<=9;y++)for(let x=4;x<=11;x++)f(x,y,B);for(let y=3;y<=7;y++){f(3,y,B);f(12,y,B)}f(5,4,W);f(6,4,W);f(9,4,W);f(10,4,W);f(6,5,P);f(9,5,P);f(5,5,L);f(10,5,L);f(6,7,M);f(7,7,Y);f(8,7,M);for(let y=10;y<=13;y++)for(let x=3;x<=12;x++)f(x,y,B);f(0,4,D);f(1,4,O);f(14,4,D);f(15,4,O);f(1,7,O);f(14,7,O);f(3,13,D);f(4,13,D);f(11,13,D);f(12,13,D)},
};
function EnemySprite({type,size=64,anim='float',flip=false}){
  const ref=useRef(null);
  useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext('2d');ctx.clearRect(0,0,32,32);ctx.imageSmoothingEnabled=false;ES[type]?.(ctx)},[type]);
  return <canvas ref={ref} width={32} height={32} style={{
    width:size,height:size,imageRendering:'pixelated',
    animation:anim!=='none'?`${anim} 1.4s ease-in-out infinite`:'none',
    transform:flip?'scaleX(-1)':undefined,
  }}/>;
}

const QUESTS={
  meadow:{name:'牧草地探索',rank:'E',rankCol:'#9e9e9e',bg:'linear-gradient(135deg,#1b3a10 0%,#2d5a1b 100%)',reqLv:1,
    nodes:[{t:'enemy',e:'slimeE'},{t:'chest',items:['herb','herb']},{t:'enemy',e:'bat'},{t:'rest',hp:25},{t:'enemy',e:'goblin'},{t:'chest',items:['feather','mushroom']}]},
  forest:{name:'深い森',rank:'D',rankCol:'#4caf50',bg:'linear-gradient(135deg,#0d2b0a 0%,#1b3a12 100%)',reqLv:3,
    nodes:[{t:'enemy',e:'goblin'},{t:'enemy',e:'wolf'},{t:'chest',items:['fang','stone']},{t:'rest',hp:35},{t:'enemy',e:'wolf'},{t:'boss',e:'witch'}]},
  cave:{name:'洞窟採掘',rank:'C',rankCol:'#2196f3',bg:'linear-gradient(135deg,#0d0d24 0%,#1a1a3e 100%)',reqLv:6,
    nodes:[{t:'enemy',e:'golem'},{t:'chest',items:['iron','stone']},{t:'enemy',e:'wolf'},{t:'enemy',e:'golem'},{t:'rest',hp:40},{t:'boss',e:'dragon'}]},
  ocean:       {name:'海底神殿',       rank:'B', rankCol:'#ff9800',bg:'linear-gradient(135deg,#0a1030 0%,#0d1f60 100%)',reqLv:10,
    nodes:[{t:'enemy',e:'fishE'},{t:'enemy',e:'fishE'},{t:'chest',items:['scale','scale','crystal']},{t:'rest',hp:50},{t:'enemy',e:'fishE'},{t:'boss',e:'dragon'}]},
  beach:       {name:'砂浜の探索',       rank:'E', rankCol:'#9e9e9e',bg:'linear-gradient(135deg,#1a3a20 0%,#0d4060 100%)',reqLv:1,
    nodes:[{t:'enemy',e:'crab'},{t:'chest',items:['shell','feather']},{t:'enemy',e:'slimeE'},{t:'enemy',e:'crab'},{t:'rest',hp:20},{t:'chest',items:['shell','shell','bone']}]},
  swamp:       {name:'ぬまちの迷宮',     rank:'D', rankCol:'#4caf50',bg:'linear-gradient(135deg,#1a2a0a 0%,#0d2210 100%)',reqLv:4,
    nodes:[{t:'enemy',e:'spider'},{t:'enemy',e:'goblin'},{t:'chest',items:['spider_silk','mushroom']},{t:'rest',hp:30},{t:'enemy',e:'spider'},{t:'boss',e:'wolf'}]},
  snowfield:   {name:'雪原の彷徨',       rank:'D', rankCol:'#64b5f6',bg:'linear-gradient(135deg,#0a1a30 0%,#1a3050 100%)',reqLv:5,
    nodes:[{t:'enemy',e:'bat'},{t:'enemy',e:'yuki'},{t:'chest',items:['ice','crystal']},{t:'rest',hp:35},{t:'enemy',e:'wolf'},{t:'boss',e:'yuki'}]},
  volcano:     {name:'火山の奥地',       rank:'C', rankCol:'#ff5722',bg:'linear-gradient(135deg,#1a0000 0%,#3a0a00 100%)',reqLv:8,
    nodes:[{t:'enemy',e:'phoenix_e'},{t:'enemy',e:'golem'},{t:'chest',items:['ember','iron']},{t:'rest',hp:45},{t:'enemy',e:'phoenix_e'},{t:'boss',e:'dragon'}]},
  skycastle:   {name:'天空城',           rank:'B', rankCol:'#ce93d8',bg:'linear-gradient(135deg,#0a0a2a 0%,#1a0a40 100%)',reqLv:13,
    nodes:[{t:'enemy',e:'angel_e'},{t:'enemy',e:'thunder_bird'},{t:'chest',items:['star_fragment','moonflower']},{t:'rest',hp:55},{t:'enemy',e:'angel_e'},{t:'boss',e:'angel_e'}]},
  deep_ocean:  {name:'深海神殿',         rank:'A', rankCol:'#ef5350',bg:'linear-gradient(135deg,#010a20 0%,#020d30 100%)',reqLv:17,
    nodes:[{t:'enemy',e:'sea_serpent'},{t:'enemy',e:'fishE'},{t:'chest',items:['dragon_scale','scale','crystal']},{t:'rest',hp:60},{t:'enemy',e:'sea_serpent'},{t:'boss',e:'sea_serpent'}]},
  demon_tower: {name:'まおうのとう',     rank:'A', rankCol:'#880e4f',bg:'linear-gradient(135deg,#1a0010 0%,#2a0020 100%)',reqLv:20,
    nodes:[{t:'enemy',e:'vampire'},{t:'enemy',e:'witch'},{t:'chest',items:['darkstone','crystal']},{t:'rest',hp:65},{t:'enemy',e:'vampire'},{t:'boss',e:'demon_lord'}]},
  ancient_ruins:{name:'こだいいせき',    rank:'A', rankCol:'#8d6e63',bg:'linear-gradient(135deg,#1a1000 0%,#2a1800 100%)',reqLv:22,
    nodes:[{t:'enemy',e:'ancient_golem'},{t:'chest',items:['ancient_coin','iron','stone']},{t:'enemy',e:'wyrm'},{t:'enemy',e:'ancient_golem'},{t:'rest',hp:70},{t:'boss',e:'ancient_golem'}]},
  dragon_nest:  {name:'りゅうのす',         rank:'S', rankCol:'#ffd700',bg:'linear-gradient(135deg,#1a0000 0%,#300000 100%)',reqLv:30,
    nodes:[{t:'enemy',e:'dragon'},{t:'enemy',e:'phoenix_e'},{t:'chest',items:['dragon_scale','crystal','elixir']},{t:'rest',hp:80},{t:'enemy',e:'dragon'},{t:'boss',e:'demon_lord'}]},
  training_E:   {name:'しゅぎょうの道（初）', rank:'T', rankCol:'#66bb6a',bg:'linear-gradient(135deg,#0a1a08 0%,#1a3010 100%)',reqLv:1,
    nodes:[{t:'enemy',e:'slimeE'},{t:'rest',hp:30},{t:'enemy',e:'bat'},{t:'chest',items:['exp_book','exp_book']},{t:'enemy',e:'goblin'},{t:'chest',items:['exp_book','exp_book','exp_book']}]},
  training_C:   {name:'しゅぎょうの道（中）', rank:'T', rankCol:'#2196f3',bg:'linear-gradient(135deg,#080820 0%,#101840 100%)',reqLv:8,
    nodes:[{t:'enemy',e:'golem'},{t:'rest',hp:40},{t:'enemy',e:'wolf'},{t:'chest',items:['exp_tome','exp_book','exp_book']},{t:'enemy',e:'witch'},{t:'chest',items:['exp_tome','exp_tome']}]},
  training_S:   {name:'しゅぎょうの道（極）', rank:'T', rankCol:'#ff9800',bg:'linear-gradient(135deg,#1a0800 0%,#302000 100%)',reqLv:18,
    nodes:[{t:'enemy',e:'vampire'},{t:'enemy',e:'ancient_golem'},{t:'rest',hp:60},{t:'chest',items:['exp_tome','exp_tome','exp_tome']},{t:'enemy',e:'demon_lord'},{t:'chest',items:['exp_tome','exp_tome','ancient_coin']}]},
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
const SAVE_KEY='mlg_save_v1'; // ← 絶対に変えない
const DEFAULT_STATE={coins:400,monsters:[{...mkMon('slime',1),name:'スライちゃん'}],party:1,
  playerLv:1,playerXp:0,
  materials:{herb:3,bone:2,feather:1},equipInventory:['ribbon','clover','wand'],
  shop:{listings:[],pendingGold:0},facilities:{},screen:'home',toast:null};
const PLV_TABLE=[0,100,250,450,700,1000,1400,1900,2500,3200,4000,5000,6200,7600,9200,11000,13200,15700,18500,21600,25000,29000,33500,38500,44000,50000,57000,65000,74000,84000];
function addPlayerXP(s,xp){
  let lv=s.playerLv,px=s.playerXp+xp;
  const msgs=[];
  while(lv<PLV_TABLE.length&&px>=(PLV_TABLE[lv]||99999)){px-=PLV_TABLE[lv]||99999;lv++;msgs.push(`🎉 プレイヤーLv.${lv}！`);}
  return{...s,playerLv:lv,playerXp:px,toast:msgs.length?msgs[msgs.length-1]:s.toast};
}

// セーブデータを安全にマイグレーション（コードが変わっても重要データを維持）
function migrateSave(p){
  // モンスターデータを正規化（知らないtypeや壊れたデータを除去・補完）
  const mons=(p.monsters||[]).map(m=>{
    if(!MONS[m.type])return null; // 存在しないtypeは除去
    return{
      id:m.id||Date.now()+Math.random()*9999,
      type:m.type,
      name:m.name||MONS[m.type].name,
      level:m.level||1,
      xp:m.xp||0,
      lb:m.lb||0,
      rarity:m.rarity&&RO.includes(m.rarity)?m.rarity:MONS[m.type].rarity,
      equip:{
        hat:m.equip?.hat&&EQUIP[m.equip.hat]?m.equip.hat:null,
        acc:m.equip?.acc&&EQUIP[m.equip.acc]?m.equip.acc:null,
        wpn:m.equip?.wpn&&EQUIP[m.equip.wpn]?m.equip.wpn:null,
      },
    };
  }).filter(Boolean);

  // 素材は既知のキーのみ保持（新素材はデフォルト0で補完）
  const allMaterials={...Object.fromEntries(Object.keys(ITEMS).map(k=>[k,0])),...p.materials||{}};
  const materials=Object.fromEntries(Object.entries(allMaterials).filter(([k])=>ITEMS[k]));

  // 装備インベントリは既知のもののみ保持
  const equipInventory=(p.equipInventory||[]).filter(k=>EQUIP[k]);

  // ショップ出品は既知素材のみ保持
  const listings=(p.shop?.listings||[]).filter(l=>ITEMS[l.itemKey]&&l.qty>0&&l.price>0);

  return{
    ...DEFAULT_STATE,
    coins:typeof p.coins==='number'?p.coins:DEFAULT_STATE.coins,
    monsters:mons.length>0?mons:DEFAULT_STATE.monsters,
    party:p.party||1,
    materials,
    equipInventory:equipInventory.length>0?equipInventory:DEFAULT_STATE.equipInventory,
    shop:{listings,pendingGold:p.shop?.pendingGold||0},
    facilities:p.facilities||{},
    playerLv:p.playerLv||1,
    playerXp:p.playerXp||0,
    screen:'home',toast:null,
  };
}

const INIT=()=>{
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(raw){
      const p=JSON.parse(raw);
      return migrateSave(p);
    }
  }catch(e){console.warn('セーブデータ読み込み失敗、初期化します',e);}
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
      const pxp=Math.ceil(a.xp*0.6+(a.loot.length*8));
      const base={...s,materials:mat,monsters:mons,toast:`クエスト完了！ ${a.loot.map(k=>ITEMS[k]?.icon).join('')}`};
      return addPlayerXP(base,pxp);
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
    case 'USE_ITEM':{
      const {itemKey,count}=a;
      const cur=s.materials[itemKey]||0;
      if(cur<=0)return s;
      const n=Math.min(count||1,cur);
      const mat={...s.materials,[itemKey]:cur-n};
      const ITEM_EFF={
        exp_book:   (st,qty)=>addPlayerXP({...st,materials:{...st.materials,exp_book:st.materials.exp_book-qty}},200*qty),
        exp_tome:   (st,qty)=>addPlayerXP({...st,materials:{...st.materials,exp_tome:st.materials.exp_tome-qty}},800*qty),
        elixir:     (st,qty)=>({...st,materials:{...st.materials,elixir:st.materials.elixir-qty},monsters:st.monsters.map(m=>m.id===st.party?addXP(m,500*qty):m),toast:`✨ エリクサー使用！ EXP+${500*qty}`}),
        moonflower: (st,qty)=>addPlayerXP({...st,materials:{...st.materials,moonflower:st.materials.moonflower-qty}},150*qty),
        ancient_coin:(st,qty)=>addPlayerXP({...st,materials:{...st.materials,ancient_coin:st.materials.ancient_coin-qty}},300*qty),
      };
      if(ITEM_EFF[itemKey]) return ITEM_EFF[itemKey](s,n);
      return s;
    }
    case 'BG_SHOP_TICK':{
      const ls=s.shop.listings;if(!ls.length)return s;
      if(Math.random()>0.72)return s;
      const li=Math.floor(Math.random()*ls.length);
      const l=[...ls];
      // NPCが1〜3個まとめ買い（在庫に応じて）
      const maxBuy=Math.min(l[li].qty, 1+Math.floor(Math.random()*3));
      const buyQty=Math.max(1,maxBuy);
      const earned=l[li].price*buyQty;
      const mat={...s.materials,[l[li].itemKey]:Math.max(0,(s.materials[l[li].itemKey]||0)-buyQty)};
      if(l[li].qty<=buyQty)l.splice(li,1);else l[li]={...l[li],qty:l[li].qty-buyQty};
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
function Pill({label,color}){const isLR=label==='LR';return <span style={{fontSize:9,fontWeight:900,background:isLR?'linear-gradient(90deg,#e040fb,#ff9800,#ffd700)':color,borderRadius:20,padding:'2px 7px',letterSpacing:isLR?'0.5px':undefined}}>{isLR?'✨LR':label}</span>}
function Btn({onClick,children,color='#bf88ff',text='#fff',disabled=false,style={}}){return <button onClick={onClick} disabled={disabled} style={{...FF,border:'none',borderRadius:14,padding:'12px 0',fontWeight:900,fontSize:13,cursor:disabled?'default':'pointer',background:disabled?'rgba(255,255,255,0.08)':color,color:disabled?'rgba(255,255,255,0.3)':text,width:'100%',opacity:disabled?0.5:1,...style}}>{children}</button>}
function Toast({msg,onDone}){useEffect(()=>{const t=setTimeout(onDone,2100);return()=>clearTimeout(t)},[]);return <div style={{position:'fixed',top:18,left:'50%',transform:'translateX(-50%)',background:'rgba(20,0,50,0.96)',border:'1px solid #bf88ff',borderRadius:24,padding:'10px 22px',fontSize:12,fontWeight:700,animation:'pop 0.3s ease-out',zIndex:1000,whiteSpace:'nowrap',maxWidth:'92vw',textAlign:'center'}}>{msg}</div>}

// ─── EQUIPMENT PIXEL OVERLAYS ───────────────────────────
const EQ_OV={
  // HATS (rows 0-2, centered)
  ribbon:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(5,0,'#ff9fcf');f(6,0,'#ff6b9d');f(7,0,'#ff1744');f(8,0,'#ff1744');f(9,0,'#ff6b9d');f(10,0,'#ff9fcf');f(6,1,'#ff6b9d');f(7,1,'#ff9fcf');f(8,1,'#ff9fcf');f(9,1,'#ff6b9d');f(7,0,'#fffde7')},
  flowerhat:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(5,0,'#ff9fcf');f(7,0,'#ffd700');f(9,0,'#ff9fcf');f(11,0,'#a8e4a0');f(6,1,'#a8e4a0');f(7,1,'#ff9fcf');f(8,1,'#a8e4a0');f(9,1,'#ffd700');f(10,1,'#ff9fcf');f(7,0,'#fffde7')},
  crown:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(4,0,'#ffd700');f(6,0,'#ff9800');f(8,0,'#ff9800');f(10,0,'#ffd700');for(let x=4;x<=10;x++)f(x,1,'#ffd700');f(5,1,'#ff9800');f(8,1,'#ff9800');f(6,0,'#fffde7');f(10,0,'#fffde7')},
  starcrown:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(4,0,'#ffd700');f(6,0,'#ce93d8');f(8,0,'#40c4ff');f(10,0,'#ffd700');for(let x=3;x<=11;x++)f(x,1,'#ffd700');f(5,1,'#ce93d8');f(8,1,'#ff9fcf');f(7,0,'#fffde7')},
  catears:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(4,0,'#ffafd7');f(5,0,'#ff75b5');f(4,1,'#ffc2cc');f(10,0,'#ffafd7');f(11,0,'#ff75b5');f(11,1,'#ffc2cc')},
  witch_hat:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(8,0,'#1a0050');f(7,1,'#2a0070');f(8,1,'#1a0050');f(9,1,'#2a0070');f(6,2,'#1a0050');f(7,2,'#2a0070');f(8,2,'#1a0050');f(9,2,'#2a0070');f(10,2,'#1a0050');for(let x=4;x<=11;x++)f(x,3,'#4a0080');f(9,2,'#7c4dff');f(8,1,'#ffd700')},
  angel_halo:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};for(let x=4;x<=11;x++)f(x,0,'#ffd700');f(5,1,'#fff9c4');f(6,1,'#fff');f(7,1,'#fff');f(8,1,'#fff');f(9,1,'#fff9c4');f(3,0,'#ffd700');f(12,0,'#ffd700')},
  // ACCESSORIES (rows 6-9, right side cols 11-14)
  clover:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(12,6,'#4caf50');f(11,7,'#4caf50');f(12,7,'#2e7d32');f(13,7,'#4caf50');f(12,8,'#4caf50')},
  heartgem:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(11,6,'#e91e8c');f(12,6,'#ff80ab');f(11,7,'#ff80ab');f(12,7,'#e91e8c');f(11,8,'#e91e8c');f(12,8,'#c2185b')},
  moonstone:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(12,5,'#cfd8dc');f(11,6,'#eceff1');f(12,6,'#fff');f(12,7,'#eceff1');f(11,8,'#cfd8dc')},
  rainbow:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(11,5,'#ef5350');f(12,5,'#ff9800');f(13,5,'#ffd700');f(11,6,'#4caf50');f(12,6,'#2196f3');f(13,6,'#9c27b0');f(12,7,'#fff')},
  fairy_wings:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(0,5,'#80deea');f(1,5,'#e0f7fa');f(0,6,'#b2ebf2');f(1,6,'#80deea');f(0,7,'#80deea');f(1,7,'#4dd0e1');f(14,5,'#80deea');f(15,5,'#e0f7fa');f(14,6,'#b2ebf2');f(15,6,'#80deea');f(14,7,'#80deea');f(15,7,'#4dd0e1')},
  dragonscale:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(11,7,'#bf360c');f(12,7,'#ff5722');f(11,8,'#ff5722');f(12,8,'#bf360c');f(11,9,'#bf360c');f(12,9,'#ff5722');f(13,8,'#ffd700')},
  starjewel:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(12,5,'#ffd700');f(11,6,'#fff9c4');f(12,6,'#fff');f(13,6,'#fff9c4');f(12,7,'#ffd700');f(11,7,'#40c4ff');f(13,7,'#ff9fcf')},
  // WEAPONS (rows 7-13, left side cols 0-3)
  wand:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(1,6,'#ffd700');f(0,7,'#ffd700');f(2,7,'#ffd700');f(1,7,'#fffde7');f(1,8,'#ffd700');f(2,9,'#ce93d8');f(2,10,'#ce93d8');f(2,11,'#ce93d8');f(2,12,'#9c27b0');f(3,13,'#7c4dff')},
  lightning:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(2,6,'#ffd700');f(1,7,'#ffd700');f(2,7,'#ffd700');f(2,8,'#ffd700');f(1,9,'#ffd700');f(2,10,'#b0bec5');f(2,11,'#b0bec5');f(2,12,'#b0bec5');f(2,13,'#78909c')},
  sword:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(1,6,'#40c4ff');f(2,7,'#4caf50');f(1,8,'#ffd700');f(2,9,'#ff9800');f(1,10,'#e91e8c');f(2,11,'#9e9e9e');f(1,12,'#795548');f(3,11,'#795548');f(2,12,'#9e9e9e')},
  orb:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(0,6,'#7c4dff');f(1,6,'#bf88ff');f(2,6,'#7c4dff');f(0,7,'#bf88ff');f(1,7,'#fff');f(2,7,'#bf88ff');f(0,8,'#7c4dff');f(1,8,'#bf88ff');f(2,8,'#7c4dff');f(1,9,'#7c4dff');f(1,10,'#607d8b');f(1,11,'#607d8b');f(1,12,'#607d8b')},
  ice_staff:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(1,6,'#e1f5fe');f(0,7,'#80deea');f(2,7,'#80deea');f(1,7,'#fff');f(1,8,'#80deea');f(2,9,'#b3e5fc');f(2,10,'#b3e5fc');f(2,11,'#b3e5fc');f(2,12,'#0288d1')},
  fire_sword:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(2,5,'#ffd54f');f(2,6,'#ff6d00');f(1,6,'#ffd54f');f(2,7,'#ff6d00');f(2,8,'#ef5350');f(2,9,'#ef5350');f(1,10,'#795548');f(3,10,'#795548');f(2,11,'#5d4037');f(2,12,'#5d4037')},
  holy_bow:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(1,6,'#ffd700');f(0,7,'#ffd700');f(0,8,'#ffd700');f(0,9,'#ffd700');f(1,10,'#ffd700');f(2,7,'#eceff1');f(2,8,'#eceff1');f(2,9,'#eceff1');f(1,8,'#e0e0e0')},
  poison_dagger:(c)=>{const f=(x,y,col)=>{c.fillStyle=col;c.fillRect(x,y,1,1)};f(2,6,'#4caf50');f(1,7,'#4caf50');f(2,7,'#69f0ae');f(1,8,'#4caf50');f(2,8,'#4caf50');f(2,9,'#795548');f(2,10,'#5d4037');f(1,10,'#9e9e9e');f(3,10,'#9e9e9e')},
};
function EquippedMonster({monster,size=80,anim='float'}){
  const ref=useRef(null);
  const eq=monster.equip||{};
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
    ctx.clearRect(0,0,32,32);
    SP[monster.type]?.(ctx);
    if(eq.hat&&EQ_OV[eq.hat])EQ_OV[eq.hat](ctx);
    if(eq.acc&&EQ_OV[eq.acc])EQ_OV[eq.acc](ctx);
    if(eq.wpn&&EQ_OV[eq.wpn])EQ_OV[eq.wpn](ctx);
  },[monster.type,eq.hat,eq.acc,eq.wpn]);
  return <canvas ref={ref} width={32} height={32} style={{
    width:size,height:size,imageRendering:'pixelated',
    animation:anim!=='none'?`${anim} 1.4s ease-in-out infinite`:'none',
  }}/>;
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

// ─── BATTLE ARENA ────────────────────────────────────────
function BattleArena({monster,enemyKey,enemy,monHp,maxMonHp,enemyHp,maxEnemyHp,cphase,shakeM,shakeE,dmg,isBoss,questBg}){
  const monAnim = cphase==='enemy'?'slideRight':cphase==='done'&&enemyHp<=0?'victoryBounce':'none';
  const eneAnim = shakeE?'shake':cphase==='ready'||cphase==='done'?'float':'none';
  const monFilter = shakeM?'flashRed':'none';
  const eneHasSprite = !!ES[enemyKey];
  return <div style={{...CARD,marginBottom:8,padding:'14px 10px',position:'relative',overflow:'hidden',background:questBg||'rgba(255,255,255,0.07)'}}>
    {isBoss&&<div style={{position:'absolute',top:6,left:'50%',transform:'translateX(-50%)',fontSize:9,fontWeight:900,color:'#ff5722',background:'rgba(0,0,0,0.6)',borderRadius:8,padding:'2px 10px',letterSpacing:1,zIndex:2}}>👑 BOSS BATTLE</div>}
    {/* HP bars row */}
    <div style={{display:'flex',gap:8,marginBottom:10,alignItems:'center'}}>
      <div style={{flex:1}}>
        <div style={{fontSize:9,fontWeight:700,marginBottom:2,color:'#aaa'}}>{monster.name}</div>
        <div style={{height:7,background:'rgba(255,255,255,0.1)',borderRadius:4,overflow:'hidden'}}>
          <div style={{width:`${Math.max(0,(monHp/maxMonHp)*100)}%`,height:'100%',background:monHp/maxMonHp>0.5?'#66bb6a':monHp/maxMonHp>0.25?'#ffd700':'#ef5350',borderRadius:4,transition:'width 0.3s'}}/>
        </div>
        <div style={{fontSize:8,opacity:0.55,marginTop:1}}>{monHp}/{maxMonHp}</div>
      </div>
      <div style={{fontSize:12,fontWeight:900,opacity:0.5}}>VS</div>
      <div style={{flex:1}}>
        <div style={{fontSize:9,fontWeight:700,marginBottom:2,color:'#aaa',textAlign:'right'}}>{enemy.name}</div>
        <div style={{height:7,background:'rgba(255,255,255,0.1)',borderRadius:4,overflow:'hidden'}}>
          <div style={{width:`${Math.max(0,(enemyHp/maxEnemyHp)*100)}%`,height:'100%',background:enemy.col,borderRadius:4,transition:'width 0.3s',marginLeft:'auto'}}/>
        </div>
        <div style={{fontSize:8,opacity:0.55,marginTop:1,textAlign:'right'}}>{enemyHp}/{maxEnemyHp}</div>
      </div>
    </div>
    {/* Sprites stage */}
    <div style={{position:'relative',height:110,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 8px'}}>
      {/* Ground line */}
      <div style={{position:'absolute',bottom:8,left:0,right:0,height:2,background:'rgba(255,255,255,0.1)',borderRadius:1}}/>
      {/* Monster (left) */}
      <div style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
        <div style={{animation:monAnim!=='none'?`${monAnim} 0.4s ease-out`:'none',
          filter:shakeM?'brightness(3) saturate(0)':'none',transition:'filter 0.1s'}}>
          <EquippedMonster monster={monster} size={72} anim="none"/>
        </div>
        {dmg?.who==='m'&&<div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',fontSize:13,fontWeight:900,color:'#ef5350',whiteSpace:'nowrap',animation:'coinPop 0.6s ease-out forwards',zIndex:3}}>-{dmg.v}</div>}
      </div>
      {/* Center effects */}
      <div style={{position:'absolute',left:'50%',top:'40%',transform:'translate(-50%,-50%)',pointerEvents:'none',zIndex:5}}>
        {cphase==='enemy'&&<div style={{fontSize:28,animation:'slashAnim 0.5s ease-out forwards'}}>💥</div>}
        {cphase==='done'&&enemyHp<=0&&<div style={{fontSize:24,animation:'pop 0.4s ease-out forwards'}}>✨</div>}
        {dmg?.crit&&dmg?.who==='e'&&<div style={{fontSize:14,fontWeight:900,color:'#ffd700',whiteSpace:'nowrap',animation:'pop 0.3s ease-out'}}>CRIT!</div>}
      </div>
      {/* Enemy (right) */}
      <div style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
        {dmg?.who==='e'&&<div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',fontSize:13,fontWeight:900,color:dmg?.crit?'#ffd700':'#fff',whiteSpace:'nowrap',animation:'coinPop 0.6s ease-out forwards',zIndex:3}}>{dmg?.crit?'✨':''}-{dmg?.v}</div>}
        {eneHasSprite
          ? <div style={{filter:shakeE?'brightness(3) saturate(0)':'none',transition:'filter 0.1s'}}>
              <EnemySprite type={enemyKey} size={72} anim={eneAnim} flip={true}/>
            </div>
          : <div style={{fontSize:58,animation:'float 1.4s ease-in-out infinite',
              filter:`drop-shadow(0 0 12px ${enemy.col})`}}>{enemy.icon}</div>
        }
        {cphase==='done'&&enemyHp<=0&&<div style={{fontSize:10,color:'#ef5350',fontWeight:900,animation:'fadeIn 0.3s ease-out'}}>撃破！</div>}
      </div>
    </div>
    {/* Attack effect overlay */}
    {cphase==='enemy'&&<div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 30% 50%, ${enemy.col}22 0%, transparent 60%)`,pointerEvents:'none',animation:'pulse 0.3s ease-out'}}/>}
    {cphase==='done'&&enemyHp<=0&&<div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 70% 50%, rgba(255,215,0,0.1) 0%, transparent 60%)',pointerEvents:'none'}}/>}
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
        const locked=s.playerLv<q.reqLv;
        return <button key={key} onClick={()=>!locked&&startQuest(key)}
          style={{...CARD,...FF,display:'flex',gap:12,alignItems:'center',cursor:locked?'default':'pointer',
            opacity:locked?0.32:1,border:`1px solid ${locked?'rgba(255,255,255,0.06)':q.rankCol+'88'}`,
            background:locked?undefined:q.bg}}>
          <div style={{textAlign:'center',minWidth:38}}>
            <div style={{fontSize:10,fontWeight:900,background:q.rankCol,borderRadius:8,padding:'2px 7px',display:'inline-block'}}>{q.rank}</div>
            <div style={{fontSize:9,opacity:0.55,marginTop:2}}>PL{q.reqLv}+</div>
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

    {/* Battle Arena */}
    {enemy&&<BattleArena
      monster={pm} enemyKey={node.e} enemy={enemy}
      monHp={monHp} maxMonHp={stats?.maxHp||100}
      enemyHp={enemyHp} maxEnemyHp={ENEMIES[node.e]?.hp||1}
      cphase={cphase} shakeM={shakeM} shakeE={shakeE}
      dmg={dmg} isBoss={node.t==='boss'} questBg={q?.bg}
    />}
    {node?.t==='chest'&&<div style={{...CARD,textAlign:'center',padding:'20px 12px',marginBottom:8,background:'rgba(255,200,50,0.1)',border:'1px solid #ffd700'}}><div style={{fontSize:48}}>📦</div><div style={{fontWeight:900,fontSize:13,marginTop:6,color:'#ffd700'}}>宝箱を発見！</div></div>}
    {node?.t==='rest'&&<div style={{...CARD,textAlign:'center',padding:'20px 12px',marginBottom:8,background:'rgba(100,200,100,0.1)',border:'1px solid #66bb6a'}}><div style={{fontSize:48}}>⛺</div><div style={{fontWeight:900,fontSize:13,marginTop:6,color:'#66bb6a'}}>休憩中... HP回復！</div></div>}

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
      if(npcsRef.current.length<7&&listingsRef.current.length>0){
        const types=['villager','grandma','kid','knight','merchant'];
        // NPCが1〜3人同時に来ることも
        const batch=Math.random()<0.3?2:1;
        for(let bi=0;bi<batch;bi++){
          npcsRef.current.push({id:idRef.current++,x:-10-bi*20,type:types[Math.floor(Math.random()*types.length)],state:'walk_in',spd:18+Math.random()*22,buyTimer:0,hasBought:false,buyCount:1+Math.floor(Math.random()*3)});
        }
      }
    },1400);
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
  useEffect(()=>{const id=setInterval(()=>d({type:'BG_SHOP_TICK'}),1800);return()=>clearInterval(id)},[]);
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
        <div style={{background:'rgba(102,187,106,0.15)',border:'1px solid #66bb6a',borderRadius:12,padding:'8px 12px',fontSize:11,marginBottom:14,textAlign:'center'}}>✅ {s.monsters.length}体 / 💰{s.coins}G / PL{s.playerLv} / {Object.values(s.materials).reduce((a,b)=>a+b,0)}素材</div>
        <button onClick={hardReset} style={{...FF,width:'100%',padding:'10px 0',borderRadius:12,border:'1px solid #ef5350',background:'rgba(239,83,80,0.1)',color:'#ef5350',cursor:'pointer',fontWeight:700,fontSize:12}}>🗑 データを初期化する</button>
        <button onClick={()=>setShowSave(false)} style={{...FF,width:'100%',padding:'10px 0',borderRadius:12,border:'none',background:'rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontWeight:700,fontSize:12,marginTop:8}}>閉じる</button>
      </div>
    </div>}
    <div style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px 8px',background:'linear-gradient(180deg,rgba(20,5,45,0.88) 0%,transparent 100%)'}}>
      <button onClick={()=>setShowSave(true)} style={{background:'none',border:'none',cursor:'pointer',fontSize:14,opacity:0.7,...FF}}>💾</button>
      <div style={{fontWeight:900,fontSize:13,background:'linear-gradient(90deg,#ff9fcf,#bf88ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>✨ モンスターライフ</div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:3}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            {s.shop.pendingGold>0&&<div style={{fontSize:9,color:'#ffd700',fontWeight:900,opacity:0.8}}>+{s.shop.pendingGold}G</div>}
            <div style={{background:'rgba(255,215,0,0.15)',border:'1px solid #ffd700',borderRadius:20,padding:'3px 8px',fontSize:12,fontWeight:900,color:'#ffd700'}}>💰{s.coins}</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <span style={{fontSize:9,fontWeight:900,color:'#bf88ff',whiteSpace:'nowrap'}}>PL{s.playerLv}</span>
            <div style={{width:60,height:4,background:'rgba(255,255,255,0.1)',borderRadius:3,overflow:'hidden'}}>
              <div style={{width:`${Math.min(100,((s.playerXp||0)/(PLV_TABLE[s.playerLv-1]||100))*100)}%`,height:'100%',background:'#bf88ff',borderRadius:3,transition:'width 0.4s'}}/>
            </div>
          </div>
        </div>
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
