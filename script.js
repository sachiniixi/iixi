const $=s=>document.querySelector(s);
const title=$("#title"), copy=$("#copy"), eyebrow=$("#eyebrow"), number=$("#number");
const go=$("#go"), goText=$("#goText"), progress=$("#progress"), hint=$("#hint");
const side=$("#sideNote"), toast=$("#toast"), spotlight=document.querySelector(".spotlight");
let step=0;

const scenes=[
 {e:"AN INTERNET EXPERIMENT",t:"What is<br><em>IIXI?</em>",c:"A website with absolutely no reason to exist.",b:"ENTER THE VOID",h:"click the button. obviously."},
 {e:"EXPERIMENT 01",t:"You<br><em>clicked.</em>",c:"Excellent. Nothing useful happened.",b:"DO IT AGAIN",h:"this is your first mistake."},
 {e:"EXPERIMENT 02",t:"Are you<br><em>sure?</em>",c:"There are probably better things you could be doing.",b:"YES, OBVIOUSLY",h:"confidence detected."},
 {e:"EXPERIMENT 03",t:"We are<br><em>thinking.</em>",c:"Please wait while we calculate absolutely nothing.",b:"CALCULATE NOTHING",h:"0 useful thoughts."},
 {e:"EXPERIMENT 04",t:"RESULT:<br><em>404.</em>",c:"Your purpose could not be located.",b:"SEARCH AGAIN",h:"maybe try the internet."},
 {e:"EXPERIMENT 05",t:"This is<br><em>awkward.</em>",c:"You have spent real time on this.",b:"I ACCEPT",h:"time wasted: probably."},
 {e:"EXPERIMENT 06",t:"One last<br><em>thing.</em>",c:"We could end here. But you won't.",b:"KEEP GOING",h:"you know what happens next."},
 {e:"EXPERIMENT 07",t:"Wait.<br><em>Why?</em>",c:"Nobody told you to keep clicking.",b:"I DON'T KNOW",h:"honesty is refreshing."},
 {e:"EXPERIMENT 08",t:"Almost<br><em>nothing.</em>",c:"This is somehow becoming a journey.",b:"FINISH THIS",h:"98% unnecessary."},
 {e:"THE END",t:"You found<br><em>nothing.</em>",c:"Congratulations. That was the entire point.",b:"START OVER",h:"there is no reward."}
];

function showToast(text){
 toast.textContent=text;toast.classList.add("show");
 setTimeout(()=>toast.classList.remove("show"),1400);
}
function render(){
 const s=scenes[step];
 eyebrow.textContent=s.e;title.innerHTML=s.t;copy.textContent=s.c;goText.textContent=s.b;
 hint.textContent=s.h;number.textContent=String(step).padStart(2,"0");
 side.innerHTML=`EXPERIMENT ${String(step).padStart(2,"0")}<br><span>${step===9?"YOU MADE IT.":step===0?"YOU HAVE BEEN WARNED.":"NO USEFUL INFORMATION GAINED."}</span>`;
 progress.style.width=(step/(scenes.length-1)*100)+"%";
 document.body.classList.toggle("final",step===9);
 document.body.classList.toggle("chaos",step>=3&&step<9);
 go.style.transform="";
}
go.addEventListener("click",()=>{
 if(step===9){step=0;render();return}
 step++;
 render();
 if(step===3) showToast("Calculating…");
 if(step===4) showToast("ERROR: purpose not found");
 if(step===6) showToast("You were warned.");
 if(step===8) showToast("This is the last one. Probably.");
});
go.addEventListener("mouseenter",()=>{
 if(step===5){
   const x=(Math.random()*160)-80,y=(Math.random()*80)-40;
   go.style.transform=`translate(${x}px,${y}px)`;
 }
});
$("#brand").addEventListener("click",()=>{
 step=0;render();showToast("IIXI has been reset.");
});
document.addEventListener("mousemove",e=>{
 spotlight.style.left=e.clientX+"px";spotlight.style.top=e.clientY+"px";
 if(step>=7){
   const x=(e.clientX/innerWidth-.5)*14,y=(e.clientY/innerHeight-.5)*10;
   document.querySelector(".hero").style.transform=`translate(calc(-50% + ${x}px),calc(-48% + ${y}px))`;
 }
});
render();
