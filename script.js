const stage = document.getElementById("stage");
const title = document.getElementById("title");
const message = document.getElementById("message");
const status = document.getElementById("status");
const action = document.getElementById("action");
const actionText = document.getElementById("actionText");
const count = document.getElementById("count");
const meter = document.querySelector(".meter");
const meterFill = document.getElementById("meterFill");
const tiny = document.getElementById("tiny");
const glow = document.getElementById("cursorGlow");
const logo = document.getElementById("logo");

let n = 0;
let idleTimer;

const scenes = [
  ["AN INTERNET EXPERIMENT", "What is IIXI?", "Nobody knows. Maybe you can find out.", "FIND OUT"],
  ["GOOD QUESTION.", "Maybe.", "That is all I have for you.", "CONTINUE"],
  ["WAIT.", "IIXI is nothing.", "You clicked for this.", "TRY AGAIN"],
  ["THIS IS UNNECESSARY.", "Why are you clicking this?", "There are literally millions of other websites.", "I KNOW"],
  ["IIXI NOTICE", "You are still here.", "This is becoming a little embarrassing.", "KEEP GOING"],
  ["WARNING", "Please stop.", "The button has feelings now.", "SORRY"],
  ["OKAY.", "One more.", "This is definitely the last useful thing you'll do today.", "ONE MORE"],
  ["PROCESSING", "Calculating your purpose...", "Please wait. This is important.", "WAIT"],
  ["RESULT", "Purpose not found.", "We searched everywhere.", "CONTINUE"],
  ["ALMOST THERE", "You have achieved nothing.", "But you have achieved it thoroughly.", "FINISH"],
  ["THE END", "Nothing.", "Thanks for wasting your time with IIXI.", "START OVER"]
];

const tinyLines = [
  "",
  "No useful information was gained.",
  "You could have opened a spreadsheet.",
  "IIXI is not responsible for lost time.",
  "Someone somewhere is doing something productive.",
  "The button is getting nervous.",
  "This website has no point.",
  "Estimating absolutely nothing...",
  "0% useful. 100% unnecessary.",
  "Achievement unlocked: nothing.",
  "You made it. There is no prize."
];

function render(i, animate = true) {
  const s = scenes[i];
  status.textContent = s[0];
  title.textContent = s[1];
  message.textContent = s[2];
  actionText.textContent = s[3];
  count.textContent = i;

  tiny.textContent = tinyLines[i];

  if (animate) {
    title.classList.remove("glitch", "shake");
    void title.offsetWidth;
    title.classList.add(i === 7 ? "glitch" : "shake");
  }

  const progress = Math.min(i / 10, 1) * 100;
  meter.classList.toggle("visible", i > 0);
  requestAnimationFrame(() => meterFill.style.width = progress + "%");

  if (i === 7) {
    meterFill.style.transitionDuration = "2.8s";
    meterFill.style.width = "100%";
    setTimeout(() => meterFill.style.width = "0%", 3100);
  }

  if (i === 10) {
    document.body.classList.add("final");
    action.innerHTML = '<span id="actionText">START OVER</span><span class="arrow">↻</span>';
  } else {
    document.body.classList.remove("final");
  }
}

function reset() {
  n = 0;
  action.style.left = "";
  action.style.top = "";
  action.style.position = "relative";
  stage.style.transform = "";
  stage.style.filter = "";
  render(0, false);
}

action.addEventListener("click", () => {
  if (n === 10) {
    reset();
    return;
  }

  n++;

  // At stage 4 the button begins avoiding the cursor.
  if (n === 4) {
    action.addEventListener("mouseenter", dodgeOnce, { once: true });
  }

  // At stage 5 it dodges twice.
  if (n === 5) {
    action.addEventListener("mouseenter", dodgeTwice, { once: true });
  }

  // Small physical reactions.
  if (n === 3) stage.style.transform = "scale(.985)";
  if (n === 6) stage.style.transform = "rotate(-.25deg)";
  if (n === 8) {
    stage.style.transform = "scale(1.02)";
    setTimeout(() => stage.style.transform = "scale(1)", 900);
  }

  render(n);
});

function dodgeOnce() {
  if (n !== 4) return;
  const x = (Math.random() * 80 - 40);
  const y = (Math.random() * 50 - 25);
  action.style.transform = `translate(${x}px, ${y}px)`;
  setTimeout(() => action.style.transform = "", 450);
}

function dodgeTwice() {
  if (n !== 5) return;
  const x = (Math.random() * 130 - 65);
  const y = (Math.random() * 90 - 45);
  action.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random()*8-4}deg)`;
  setTimeout(() => action.style.transform = "", 650);
}

logo.addEventListener("click", () => {
  if (n === 0) {
    title.textContent = "You clicked the logo.";
    message.textContent = "That wasn't supposed to do anything.";
    setTimeout(() => render(0, false), 1600);
  } else {
    reset();
  }
});

document.addEventListener("mousemove", (e) => {
  glow.style.opacity = "1";
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";

  const x = (e.clientX / innerWidth - .5);
  const y = (e.clientY / innerHeight - .5);

  if (n >= 5 && n < 10) {
    stage.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
  }
});

document.addEventListener("mouseleave", () => glow.style.opacity = "0");

function idleMessage() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (n === 0) {
      tiny.textContent = "Are you waiting for something?";
      setTimeout(() => {
        if (n === 0) tiny.textContent = "There is nothing else to do here.";
      }, 4000);
    } else if (n > 0 && n < 10) {
      tiny.textContent = "Still here?";
    }
  }, 10000);
}

["mousemove", "click", "touchstart", "keydown"].forEach(e => document.addEventListener(e, idleMessage));
idleMessage();

render(0, false);
