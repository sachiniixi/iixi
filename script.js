const app = document.getElementById("app");
const hero = document.getElementById("hero");
const headline = document.getElementById("headline");
const sub = document.getElementById("sub");
const eyebrow = document.getElementById("eyebrow");
const brand = document.getElementById("brand");
const button = document.getElementById("findBtn");
const clickCount = document.getElementById("clickCount");

let clicks = 0;

const stages = [
  ["Maybe.", "Keep going.", "FIND OUT →"],
  ["IIXI is nothing.", "That was disappointing.", "TRY AGAIN →"],
  ["Okay. Maybe it's something.", "You clicked again.", "CONTINUE →"],
  ["Why are you still here?", "There are better websites.", "I KNOW →"],
  ["IIXI knows you're here.", "Don't worry. Probably.", "KEEP GOING →"],
  ["Stop clicking.", "Seriously.", "ONE MORE →"],
  ["You have been warned.", "This is getting unnecessary.", "DO IT →"],
  ["Fine.", "You win absolutely nothing.", "ONE LAST TIME →"],
  ["You found IIXI.", "Unfortunately, there is nothing to find.", "FINISH →"],
  ["Congratulations.", "You discovered the internet's least useful website.", "RESET →"]
];

function setStage(n) {
  const [title, text, label] = stages[Math.min(n, stages.length - 1)];
  headline.textContent = title;
  sub.textContent = text;
  button.innerHTML = `${label.split(" →")[0]} <span>→</span>`;

  headline.classList.remove("shake");
  void headline.offsetWidth;
  headline.classList.add("shake");
}

button.addEventListener("click", () => {
  clicks++;
  clickCount.textContent = clicks;

  if (clicks < stages.length) {
    setStage(clicks);
  }

  if (clicks === 3) {
    document.body.classList.add("weird");
    eyebrow.textContent = "IT KNOWS";
  }

  if (clicks === 5) {
    brand.style.transform = "rotate(180deg)";
  }

  if (clicks === 7) {
    app.classList.add("flash");
    setTimeout(() => app.classList.remove("flash"), 600);
  }

  if (clicks === 9) {
    eyebrow.textContent = "YOU FOUND IT";
  }

  if (clicks === 10) {
    document.body.classList.remove("weird");
    document.body.classList.add("final");
    headline.textContent = "Nothing.";
    sub.textContent = "Thanks for wasting your time with IIXI.";
    eyebrow.textContent = "THE END";
    button.innerHTML = `START OVER <span>↻</span>`;
    brand.style.transform = "none";
  } else if (clicks > 10) {
    clicks = 0;
    clickCount.textContent = "0";
    document.body.classList.remove("final", "weird");
    eyebrow.textContent = "AN INTERNET EXPERIMENT";
    headline.textContent = "What is IIXI?";
    sub.textContent = "Nobody knows. Maybe you can find out.";
    button.innerHTML = `FIND OUT <span>→</span>`;
  }
});

let idleTimer;
function idle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (clicks === 0) {
      sub.textContent = "Are you waiting for something?";
    }
  }, 12000);
}
["mousemove", "touchstart", "keydown"].forEach(e => document.addEventListener(e, idle));
idle();

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - .5) * 4;
  const y = (e.clientY / window.innerHeight - .5) * 4;
  brand.style.transform = `translate(${x}px, ${y}px)`;
});
