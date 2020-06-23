import { getRandomRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");
const main = document.querySelector("main");
const regenerateButton = document.getElementById("regenerate");
const unMuteButton = document.getElementById("unmute");

const maxIndex = 50;
const ctx = new AudioContext();
let rectlist = getRandomRectlist();

console.log(defaultPreset);

let start;

regenerateButton.addEventListener("click", () => {
  rectlist = getRandomRectlist();
  if (!isMuted()) {
    playNote(110.0, 8, 0.05);
  }
})

unMuteButton.addEventListener("click", () => {
  if (isMuted()) {
    unMuteButton.setAttribute("aria-pressed", "true");
    unMuteButton.textContent = "Stop sound";
  } else {
    unMuteButton.setAttribute("aria-pressed", "false");
    unMuteButton.textContent = "Play sound";
  }
})

function isMuted() {
  return unMuteButton.getAttribute("aria-pressed") !== "true";
}

function getScrollRatio() {
  const h = document.documentElement;
  const b = document.body;
  const st = "scrollTop";
  const sh = "scrollHeight";

  const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
  return percent;
}

function getElementDistance(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  const topDistance = rect2.top - rect1.bottom;
  const bottomDistance = rect1.top - rect2.bottom;
  return Math.max(topDistance, bottomDistance);
}

function clamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

function playNote(freq = 220, dur = 2, gain = 0.1) {
  const osc = ctx.createOscillator();
  const vca = ctx.createGain();
  const att = ctx.createGain();

  att.gain.setValueAtTime(gain, ctx.currentTime);

  osc.frequency.value = freq;
  osc.connect(vca);
  vca.connect(att);
  att.connect(ctx.destination);

  osc.start();
  vca.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
  osc.stop(ctx.currentTime + dur);
}

function tick(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }

  const distance = getElementDistance(canvas, main);
  const mainHeight = main.clientHeight;
  const ratio = Math.sqrt(mainHeight / 2 + distance) || 0;

  const elapsed = timestamp - start;
  const maxCount = clamp(ratio, 4, 12);
  const rotate45Amount = 4 + Math.ceil(2 * Math.sin(elapsed / 1500));
  const rotate90Amount = 6 + Math.ceil(4 * Math.cos(elapsed / 1500));
  const rotate315Amount = 2 + Math.ceil(2 * Math.sin(elapsed / 1500));
  const colorAmount = Math.pow(Math.sin(elapsed / 7000), 2) / 2;
  const index = getScrollRatio() * maxIndex;

  const preset = defaultPreset;
  const newPreset = Object.assign({}, preset, {
    index,
    maxCount,
    rotate45Amount,
    rotate90Amount,
    rotate315Amount,
    colorAmount,
  });

  const previousSvg = canvas.src;
  canvas.src = renderSvg(rectlist, newPreset);

  if (!isMuted() && previousSvg !== canvas.src) {
    const notes = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0];

    const note = notes[Math.floor(Math.random() * notes.length)];
    playNote(note);
  }

  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
