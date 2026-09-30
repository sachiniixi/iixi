document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const title=$('#title'), copy=$('#copy'), kicker=$('#kicker'), counter=$('#counter'), experiment=$('#experiment');
  const action=$('#action'), actionText=$('#actionText'), actionIcon=$('#actionIcon'), progress=$('#progress'), timer=$('#timer');
  const edgeLeft=$('#edgeLeft'), edgeRight=$('#edgeRight'), toastEl=$('#toast'), scene=$('#scene');
  const overlay=$('#overlay'), overlayTitle=$('#overlayTitle'), overlayText=$('#overlayText'), overlayButton=$('#overlayButton');
  const actionRow=$('#actionRow'), achievementEl=$('#achievement'), glow=document.querySelector('.cursor-glow');

  const experiments = [
    {k:'AN INTERNET EXPERIMENT',t:'What is<br><strong>IIXI?</strong>',p:'A website with absolutely no useful purpose.',a:'FIND OUT',r:'Nobody knows. Maybe you can.',type:'normal'},
    {k:'EXPERIMENT 01',t:'Click the<br><strong>button.</strong>',p:'You already clicked it once. There is no reason to do it again.',a:'DO IT AGAIN',r:'this could have been an email.',type:'normal'},
    {k:'EXPERIMENT 02',t:'Make a<br><strong>decision.</strong>',p:'Left or right. Both choices are equally meaningless.',a:'CHOOSE',r:'decision quality: questionable.',type:'choice'},
    {k:'EXPERIMENT 03',t:'Please<br><strong>wait.</strong>',p:'We are carefully calculating nothing. This is important.',a:'WAIT',r:'calculating 0 useful thoughts.',type:'wait'},
    {k:'EXPERIMENT 04',t:'Your purpose<br>is <strong>loading.</strong>',p:'Estimated completion: never.',a:'REFRESH PURPOSE',r:'connection to purpose: refused.',type:'loading'},
    {k:'EXPERIMENT 05',t:'This is<br><strong>awkward.</strong>',p:'You have spent real time on this. We can both acknowledge that.',a:'I ACCEPT',r:'no useful information gained.',type:'normal'},
    {k:'EXPERIMENT 06',t:'Press it<br><strong>faster.</strong>',p:'Speed will not improve anything. That has never stopped anyone.',a:'FASTER',r:'productivity has left the chat.',type:'spam'},
    {k:'EXPERIMENT 07',t:'Do not<br><strong>move.</strong>',p:'Move your mouse and this experiment will judge you.',a:'I CAN DO THIS',r:'remaining perfectly still is optional.',type:'still'},
    {k:'EXPERIMENT 08',t:'One more<br><strong>thing.</strong>',p:'There is definitely a point to this. Probably.',a:'FIND THE POINT',r:'point not found.',type:'normal'},
    {k:'EXPERIMENT 09',t:'You are<br><strong>close.</strong>',p:'Close to absolutely nothing.',a:'CONTINUE',r:'you could leave. you will not.',type:'normal'},
    {k:'EXPERIMENT 10',t:'Choose<br><strong>nothing.</strong>',p:'Pick the option that promises the least. We recommend both.',a:'I CHOOSE NOTHING',r:'choice successfully avoided.',type:'choice2'},
    {k:'EXPERIMENT 11',t:'Hold on<br><strong>forever.</strong>',p:'Hold the button. It gets more pointless the longer you do it.',a:'HOLD',r:'you are really committing to this.',type:'hold'},
    {k:'EXPERIMENT 12',t:'Trust the<br><strong>arrow.</strong>',p:'It points somewhere. That is all we can say.',a:'FOLLOW →',r:'the arrow was not certified.',type:'normal'},
    {k:'EXPERIMENT 13',t:'Are you<br><strong>sure?</strong>',p:'This is your last opportunity to reconsider your choices.',a:'YES, PROBABLY',r:'confidence level: suspicious.',type:'normal'},
    {k:'EXPERIMENT 14',t:'This took<br><strong>long enough.</strong>',p:'There is one final button. Of course there is.',a:'END THIS',r:'please enjoy the consequences.',type:'normal'},
    {k:'THE END',t:'Nothing<br><strong>happened.</strong>',p:'Congratulations. You successfully accomplished nothing.',a:'START OVER',r:'thanks for wasting your time with IIXI.',type:'end'}
  ];

  let step=0, start=Date.now(), idleTimer=null, idleShown=false, stillMode=false, waitTimer=null, holdTimer=null, holdStarted=0;
  let seen=1, total=0, completed=0, sessionClicks=0;
  try {
    seen=Number(localStorage.getItem('iixiSeen')||0)+1;
    localStorage.setItem('iixiSeen',seen);
    total=Number(localStorage.getItem('iixiClicks')||0);
    completed=Number(localStorage.getItem('iixiCompleted')||0);
  } catch(e) {}
  $('#visit').textContent=`LOCAL VISITOR ${String(seen).padStart(3,'0')}`;

  function toast(msg){
    toastEl.textContent=msg; toastEl.classList.add('show'); clearTimeout(toastEl._t);
    toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1900);
  }
  function achievement(msg){
    achievementEl.textContent=msg;
    achievementEl.classList.add('show');
    clearTimeout(achievementEl._t);
    achievementEl._t=setTimeout(()=>achievementEl.classList.remove('show'),3200);
  }
  function save(){
    try{
      localStorage.setItem('iixiClicks',total);
      localStorage.setItem('iixiCompleted',completed);
    }catch(e){}
  }
  function clearDynamic(){
    clearTimeout(waitTimer); clearInterval(waitTimer); clearTimeout(holdTimer); clearInterval(holdTimer);
    stillMode=false; document.body.classList.remove('still');
    action.disabled=false; action.classList.remove('holding');
    actionRow.querySelectorAll('.choice-button').forEach(b=>b.remove());
  }
  function render(){
    clearDynamic();
    const s=experiments[step];
    kicker.textContent=s.k; title.innerHTML=s.t; copy.textContent=s.p; actionText.textContent=s.a;
    edgeRight.textContent=s.r; counter.textContent=String(step).padStart(2,'0');
    experiment.textContent=step===experiments.length-1?'THE END':`EXPERIMENT ${String(step).padStart(2,'0')}`;
    progress.style.width=(step/(experiments.length-1)*100)+'%';
    edgeLeft.textContent=seen>1?'WELCOME BACK.':'NO USEFUL INFORMATION';
    actionIcon.textContent=s.type==='choice'||s.type==='choice2'?'↔':s.type==='wait'?'…':s.type==='end'?'↻':s.type==='hold'?'∞':'↗';
    document.body.classList.toggle('secret', total>=15);
    document.body.classList.toggle('ending', s.type==='end');
    if(s.type==='end') edgeLeft.textContent='EXPERIMENTS COMPLETED: '+completed;
    if(s.type==='choice') makeChoiceButtons(['LEFT','RIGHT']);
    if(s.type==='choice2') makeChoiceButtons(['OPTION A','OPTION B']);
    if(s.type==='hold') setupHold();
  }
  function makeChoiceButtons(labels){
    action.style.display='none';
    labels.forEach((label,i)=>{
      const b=document.createElement('button');
      b.className='action choice-button'; b.innerHTML=`<span>${label}</span><i>${i?'→':'←'}</i>`;
      b.addEventListener('click',()=>{ toast(i?'technically a choice.':'bold.'); finishStep(); });
      actionRow.appendChild(b);
    });
  }
  function setupHold(){
    action.addEventListener('pointerdown',startHold);
    action.addEventListener('pointerup',cancelHold);
    action.addEventListener('pointerleave',cancelHold);
    action.addEventListener('pointercancel',cancelHold);
  }
  function startHold(e){
    if(step!==11) return;
    e.preventDefault();
    if(holdStarted) return;
    holdStarted=Date.now(); action.classList.add('holding'); actionText.textContent='KEEP HOLDING';
    holdTimer=setTimeout(()=>{
      holdStarted=0; action.classList.remove('holding'); actionText.textContent='ENOUGH';
      toast('You held a button for no reason.'); finishStep();
    },1800);
  }
  function cancelHold(){
    if(step!==11 || !holdStarted) return;
    clearTimeout(holdTimer); holdStarted=0; action.classList.remove('holding'); actionText.textContent='HOLD'; toast('You let go. Predictable.');
  }
  function finishStep(){
    clearDynamic();
    completed++;
    save();
    step++;
    if(step>=experiments.length) step=experiments.length-1;
    render();
    afterStep();
  }
  function advance(){
    total++; sessionClicks++; save();
    if(step===experiments.length-1){
      step=0; completed=0; sessionClicks=0; start=Date.now(); save(); render(); toast('Your valuable time has been reset.'); return;
    }
    if(experiments[step].type==='wait' || experiments[step].type==='hold') return;
    if(experiments[step].type==='choice' || experiments[step].type==='choice2') return;
    finishStep();
  }
  function afterStep(){
    if(step===3){
      action.disabled=true; let n=3; actionText.textContent='WAIT 3';
      waitTimer=setInterval(()=>{n--; actionText.textContent=n>0?'WAIT '+n:'CONTINUE'; if(n<=0){clearInterval(waitTimer); action.disabled=false; toast('Nothing happened. Perfect.');}},1000);
    }
    if(step===4){ scene.classList.add('glitch'); setTimeout(()=>scene.classList.remove('glitch'),900); toast('PURPOSE NOT FOUND'); }
    if(step===6){ action.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:500}); }
    if(step===7){ stillMode=true; document.body.classList.add('still'); toast('Do not move your mouse.'); setTimeout(()=>{if(stillMode){toast('Impressive. You survived.'); finishStep();}},5000); }
    if(step===8) toast('There is no point. Keep going.');
    if(step===9) toast('You are now officially too invested.');
    if(step===10) toast('You avoided making a meaningful choice.');
    if(step===11) toast('Hold it. Seriously.');
    if(step===12) toast('The arrow appreciates your trust.');
    if(step===13) toast('You could still leave.');
    if(step===14) toast('This is your final mistake.');
    if(total===5){ overlayTitle.textContent='A quick question.'; overlayText.textContent='Would you like to continue wasting time?'; overlayButton.textContent='YES'; openOverlay(); }
    if(total===10) achievement('ACHIEVEMENT: STILL HERE');
    if(total===15){ document.body.classList.add('secret'); achievement('SECRET MODE UNLOCKED'); }
    if(completed===10) achievement('ACHIEVEMENT: COMMITTED TO NOTHING');
  }
  function openOverlay(){overlay.classList.add('show');overlay.setAttribute('aria-hidden','false')}
  function closeOverlay(){overlay.classList.remove('show');overlay.setAttribute('aria-hidden','true')}
  function randomExperiment(){
    clearDynamic(); let next=Math.floor(Math.random()*(experiments.length-1)); if(next===step) next=(next+1)%(experiments.length-1);
    step=next; render(); toast(`Random experiment ${String(step).padStart(2,'0')}`);
  }
  async function share(){
    const data={title:'IIXI — No Purpose',text:`I wasted ${sessionClicks} clicks and ${completed} experiments on IIXI. Your turn.`,url:location.href};
    try{
      if(navigator.share){await navigator.share(data); toast('Shared. Your work here is done.');}
      else if(navigator.clipboard){await navigator.clipboard.writeText(location.href); toast('Link copied. Go waste someone else’s time.');}
      else toast('Copy the URL manually. Very 2007.');
    }catch(e){if(e.name!=='AbortError') toast('Sharing failed. The internet survives.');}
  }

  action.addEventListener('click',(event)=>{event.preventDefault();event.stopPropagation();advance();});
  $('#randomBtn').addEventListener('click',randomExperiment);
  $('#shareBtn').addEventListener('click',share);
  overlayButton.addEventListener('click',()=>{closeOverlay();toast('Excellent decision.')});
  overlay.addEventListener('click',e=>{if(e.target===overlay) closeOverlay()});
  $('#logo').addEventListener('dblclick',()=>{step=0;sessionClicks=0;start=Date.now();render();toast('IIXI has forgotten everything.')});

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
