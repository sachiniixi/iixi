document.addEventListener('DOMContentLoaded', () => {

const $ = s => document.querySelector(s);
const title=$('#title'), copy=$('#copy'), kicker=$('#kicker'), counter=$('#counter'), experiment=$('#experiment');
const action=$('#action'), actionText=$('#actionText'), actionIcon=$('#actionIcon'), progress=$('#progress'), timer=$('#timer');
const edgeLeft=$('#edgeLeft'), edgeRight=$('#edgeRight'), toastEl=$('#toast'), scene=$('#scene');
const overlay=$('#overlay'), overlayTitle=$('#overlayTitle'), overlayText=$('#overlayText'), overlayButton=$('#overlayButton');
const glow=document.querySelector('.cursor-glow');

const experiments = [
  {k:'AN INTERNET EXPERIMENT',t:'What is<br><strong>IIXI?</strong>',p:'A website with absolutely no useful purpose.',a:'FIND OUT',r:'Nobody knows. Maybe you can.',type:'normal'},
  {k:'EXPERIMENT 01',t:'Click the<br><strong>button.</strong>',p:'You already clicked it once. There is no reason to do it again.',a:'DO IT AGAIN',r:'this could have been an email.',type:'normal'},
  {k:'EXPERIMENT 02',t:'Make a<br><strong>decision.</strong>',p:'Left or right. Both choices are equally meaningless.',a:'CHOOSE',r:'decision quality: questionable.',type:'choice'},
  {k:'EXPERIMENT 03',t:'Please<br><strong>wait.</strong>',p:'We are carefully calculating nothing. This is important.',a:'WAIT',r:'calculating 0 useful thoughts.',type:'wait'},
  {k:'EXPERIMENT 04',t:'Your purpose<br>is <strong>loading.</strong>',p:'Estimated completion: never.',a:'REFRESH PURPOSE',r:'connection to purpose: refused.',type:'normal'},
  {k:'EXPERIMENT 05',t:'This is<br><strong>awkward.</strong>',p:'You have spent real time on this. We can both acknowledge that.',a:'I ACCEPT',r:'no useful information gained.',type:'normal'},
  {k:'EXPERIMENT 06',t:'Press it<br><strong>faster.</strong>',p:'Speed will not improve anything. That has never stopped anyone.',a:'FASTER',r:'productivity has left the chat.',type:'spam'},
  {k:'EXPERIMENT 07',t:'Do not<br><strong>move.</strong>',p:'Move your mouse and this experiment will judge you.',a:'I CAN DO THIS',r:'remaining perfectly still is optional.',type:'still'},
  {k:'EXPERIMENT 08',t:'One more<br><strong>thing.</strong>',p:'There is definitely a point to this. Probably.',a:'FIND THE POINT',r:'point not found.',type:'normal'},
  {k:'EXPERIMENT 09',t:'You are<br><strong>close.</strong>',p:'Close to absolutely nothing.',a:'CONTINUE',r:'you could leave. you will not.',type:'normal'},
  {k:'THE END',t:'Nothing<br><strong>happened.</strong>',p:'Congratulations. You successfully accomplished nothing.',a:'START OVER',r:'thanks for wasting your time with IIXI.',type:'end'}
];

let step=0, clicks=0, start=Date.now(), idleTimer=null, idleShown=false, stillMode=false, waitTimer=null;
let seen=1, total=0;
try {
  seen=Number(localStorage.getItem('iixiSeen')||0)+1;
  localStorage.setItem('iixiSeen',seen);
  total=Number(localStorage.getItem('iixiClicks')||0);
} catch(e) {}
$('#visit').textContent=`VISITOR ${String(seen).padStart(3,'0')}`;

function toast(msg){
  toastEl.textContent=msg; toastEl.classList.add('show'); clearTimeout(toastEl._t);
  toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1700);
}
function render(){
  const s=experiments[step];
  kicker.textContent=s.k; title.innerHTML=s.t; copy.textContent=s.p; actionText.textContent=s.a; edgeRight.textContent=s.r;
  counter.textContent=String(step).padStart(2,'0'); experiment.textContent=step===experiments.length-1?'THE END':`EXPERIMENT ${String(step).padStart(2,'0')}`;
  progress.style.width=(step/(experiments.length-1)*100)+'%';
  edgeLeft.textContent=seen>1?'WELCOME BACK.':'NO USEFUL INFORMATION';
  actionIcon.textContent=s.type==='choice'?'↔':s.type==='wait'?'…':s.type==='end'?'↻':'↗';
  document.body.classList.toggle('secret', total>=15);
  document.body.classList.toggle('ending', s.type==='end');
  if(s.type==='end') edgeLeft.textContent='EXPERIMENTS COMPLETED: '+(experiments.length-1);
}
function advance(){
  clicks++; total++; try { localStorage.setItem('iixiClicks',total); } catch(e) {}
  clearTimeout(waitTimer); stillMode=false; document.body.classList.remove('still');
  if(step===experiments.length-1){ step=0; start=Date.now(); render(); toast('Your valuable time has been reset.'); return; }
  step++; render();
  if(step===2){ toast('Choose wisely. Or don’t.'); }
  if(step===3){
    action.disabled=true; let n=3; actionText.textContent='WAIT 3';
    waitTimer=setInterval(()=>{n--; actionText.textContent=n>0?'WAIT '+n:'CONTINUE'; if(n<=0){clearInterval(waitTimer); action.disabled=false; toast('Nothing happened. Perfect.');}},1000);
  }
  if(step===4){ scene.classList.add('glitch'); setTimeout(()=>scene.classList.remove('glitch'),900); toast('PURPOSE NOT FOUND'); }
  if(step===6){ action.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:180}); }
  if(step===7){ stillMode=true; document.body.classList.add('still'); toast('Do not move your mouse.'); setTimeout(()=>{if(stillMode) toast('Impressive. You survived.');},5000); }
  if(step===8) toast('There is no point. Keep going.');
  if(step===9) toast('You are now officially too invested.');
  if(total===5){ overlayTitle.textContent='A quick question.'; overlayText.textContent='Would you like to continue wasting time?'; overlayButton.textContent='YES'; openOverlay(); }
  if(total===10) toast('Achievement unlocked: still here.');
  if(total===15){ document.body.classList.add('secret'); toast('SECRET MODE UNLOCKED'); }
}
function openOverlay(){overlay.classList.add('show');overlay.setAttribute('aria-hidden','false')}
function closeOverlay(){overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true')}
function randomExperiment(){
  let next=Math.floor(Math.random()*experiments.length); if(next===step) next=(next+1)%experiments.length;
  step=next; render(); toast(`Random experiment ${String(step).padStart(2,'0')}`);
}
async function share(){
  const data={title:'IIXI — No Purpose',text:'I found a completely pointless website. You should probably waste some time here.',url:location.href};
  try{ if(navigator.share){await navigator.share(data); toast('Shared. Your work here is done.');} else {await navigator.clipboard.writeText(location.href); toast('Link copied. Go waste someone else’s time.');} }
  catch(e){ if(e.name!=='AbortError') toast('Sharing failed. The internet survives.'); }
}

action.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); advance(); });
$('#randomBtn').addEventListener('click',randomExperiment);
$('#shareBtn').addEventListener('click',share);
overlayButton.addEventListener('click',()=>{closeOverlay();toast('Excellent decision.')});
overlay.addEventListener('click',e=>{if(e.target===overlay) closeOverlay()});
$('#logo').addEventListener('dblclick',()=>{step=0;clicks=0;start=Date.now();render();toast('IIXI has forgotten everything.')});

document.addEventListener('mousemove',e=>{
  glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px';
  if(stillMode){stillMode=false;document.body.classList.remove('still');toast('You moved. We knew you would.');}
  resetIdle();
});
document.addEventListener('touchstart',resetIdle,{passive:true});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeOverlay();
  if((e.key==='Enter'||e.key===' ')&&!overlay.classList.contains('show')){e.preventDefault();advance();}
  if(e.key.toLowerCase()==='r') randomExperiment();
  resetIdle();
});
function resetIdle(){clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(step>0&&!idleShown){idleShown=true;toast('Still there?');edgeRight.textContent='WE NOTICED YOU STOPPED.';setTimeout(()=>idleShown=false,5000)}},8000)}
setInterval(()=>{const sec=Math.floor((Date.now()-start)/1000),m=String(Math.floor(sec/60)).padStart(2,'0'),s=String(sec%60).padStart(2,'0');timer.textContent=`TIME WASTED ${m}:${s}`},500);
render();

});
