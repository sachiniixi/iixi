const $=s=>document.querySelector(s);
const title=$("#title"),copy=$("#copy"),kicker=$("#kicker"),counter=$("#counter"),experiment=$("#experiment");
const action=$("#action"),actionText=$("#actionText"),progress=$("#progress"),timer=$("#timer");
const edgeLeft=$("#edgeLeft"),edgeRight=$("#edgeRight"),toast=$("#toast"),scene=$("#scene");
const overlay=$("#overlay"),overlayTitle=$("#overlayTitle"),overlayText=$("#overlayText"),overlayButton=$("#overlayButton");
const glow=document.querySelector(".cursor-glow");

let step=0, clicks=0, start=Date.now(), idleTimer=null, idleShown=false;
let seen=Number(localStorage.getItem("iixiSeen")||0)+1;
localStorage.setItem("iixiSeen",seen);

const scenes=[
["AN INTERNET EXPERIMENT","What is<br><strong>IIXI?</strong>","A website that has no useful purpose.","FIND OUT","click the button. obviously."],
["EXPERIMENT 01","You<br><strong>clicked.</strong>","Good. You have officially done something unnecessary.","DO IT AGAIN","this could have been an email."],
["EXPERIMENT 02","Are you<br><strong>sure?</strong>","There are approximately 8 billion better things to do.","YES, OBVIOUSLY","confidence detected."],
["EXPERIMENT 03","We are<br><strong>thinking.</strong>","Please wait while we calculate absolutely nothing.","CALCULATE NOTHING","processing 0 useful thoughts."],
["EXPERIMENT 04","ERROR:<br><strong>404.</strong>","Your purpose could not be located.","SEARCH AGAIN","maybe try somewhere else."],
["EXPERIMENT 05","This is<br><strong>awkward.</strong>","You have spent real time on this.","I ACCEPT","time is a limited resource."],
["EXPERIMENT 06","One last<br><strong>thing.</strong>","We could end here. You probably won't.","KEEP GOING","you know exactly what you're doing."],
["EXPERIMENT 07","Wait.<br><strong>WHY?</strong>","Nobody told you to keep clicking.","I DON'T KNOW","honesty detected."],
["EXPERIMENT 08","Almost<br><strong>nothing.</strong>","This is somehow becoming a journey.","FINISH THIS","99% unnecessary."],
["THE END","You found<br><strong>nothing.</strong>","Congratulations. That was the entire point.","START OVER","there is no reward."]
];

function toast(t){toast.el=toast.el||toast;toast.el.textContent=t;toast.el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>toast.el.classList.remove("show"),1500)}
function render(){
 let s=scenes[step];
 kicker.textContent=s[0];title.innerHTML=s[1];copy.textContent=s[2];actionText.textContent=s[3];
 edgeRight.textContent=s[4];counter.textContent=String(step).padStart(2,"0");
 experiment.textContent=`EXPERIMENT ${String(step).padStart(2,"0")}`;
 progress.style.width=(step/9*100)+"%";
 document.body.classList.toggle("secret",step===9 && clicks>=12);
 if(step===9){edgeLeft.textContent="YOU ACTUALLY FINISHED";experiment.textContent="THE END"}
 else edgeLeft.textContent=seen>1?"WELCOME BACK.":"NO USEFUL INFORMATION";
 if(seen>1 && step===0) edgeRight.textContent="SECOND VISIT DETECTED →";
}
function advance(){
 clicks++;
 if(step===9){step=0;start=Date.now();render();toast("Resetting your valuable time.");return}
 step++;
 render();
 if(step===3)toast("Calculating…");
 if(step===4){scene.classList.add("glitch");setTimeout(()=>scene.classList.remove("glitch"),800);toast("PURPOSE NOT FOUND")}
 if(step===6)toast("You were warned.");
 if(step===8)toast("This is definitely the last one.");
 if(clicks===5){overlayTitle.textContent="A quick question.";overlayText.textContent="Would you like to continue wasting time?";overlayButton.textContent="YES";overlay.classList.add("show")}
 if(clicks===12){toast("Secret condition unlocked.");document.body.classList.add("secret")}
}
action.addEventListener("click",advance);
overlayButton.addEventListener("click",()=>{overlay.classList.remove("show");toast("Excellent decision.")});
$("#logo").addEventListener("dblclick",()=>{step=0;clicks=0;render();toast("IIXI has forgotten everything.")});

document.addEventListener("mousemove",e=>{
 glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";
 resetIdle();
});
document.addEventListener("keydown",e=>{
 if(e.key==="Enter"||e.key===" ") { if(!overlay.classList.contains("show")) advance(); }
 resetIdle();
});
function resetIdle(){
 clearTimeout(idleTimer);
 idleTimer=setTimeout(()=>{
   if(step>0 && !idleShown){idleShown=true;toast("Still there?");edgeRight.textContent="WE NOTICED YOU STOPPED.";setTimeout(()=>idleShown=false,5000)}
 },8000);
}
setInterval(()=>{
 let sec=Math.floor((Date.now()-start)/1000),m=String(Math.floor(sec/60)).padStart(2,"0"),s=String(sec%60).padStart(2,"0");
 timer.textContent=`TIME WASTED ${m}:${s}`;
},500);

render();
