import { defaultRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");

function getScrollRatio() {
  const h = document.documentElement;
  const b = document.body;
  const st = "scrollTop";
  const sh = "scrollHeight";

  const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
  return percent;
}

console.log(defaultPreset);

let start;

function tick(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }

  const elapsed = timestamp - start;
  const maxCount = 3 + Math.ceil(10 * Math.pow(1 - getScrollRatio(), 2));
  const index = 15 + Math.ceil(10 * Math.cos(elapsed / 5000));

  const preset = defaultPreset;
  const newPreset = Object.assign({}, preset, {
    index,
    maxCount,
  });

  canvas.src = renderSvg(defaultRectlist, newPreset);

  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
