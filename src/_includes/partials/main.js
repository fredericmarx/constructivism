import { defaultRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");
const main = document.querySelector("main");
const maxIndex = 50;

console.log(defaultPreset);

let start;

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
  const topDistance = (rect2.top - rect1.bottom);
  const bottomDistance = (rect1.top - rect2.bottom);
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

function tick(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }

  const distance = getElementDistance(canvas, main);
  const mainHeight = main.clientHeight;
  const ratio = Math.sqrt(mainHeight + distance) || 0;

  const elapsed = timestamp - start;
  const maxCount = clamp(ratio,3,12);
  const rotate45Amount = 4 + Math.ceil(2 * Math.sin(elapsed / 1500));
  const rotate90Amount = 6 + Math.ceil(4 * Math.cos(elapsed / 1500));
  const rotate315Amount = 2 + Math.ceil(2 * Math.sin(elapsed / 1500));
  const index = getScrollRatio() * maxIndex;

  const preset = defaultPreset;
  const newPreset = Object.assign({}, preset, {
    index,
    maxCount,
    rotate45Amount,
    rotate90Amount,
    rotate315Amount
  });

  canvas.src = renderSvg(defaultRectlist, newPreset);

  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
