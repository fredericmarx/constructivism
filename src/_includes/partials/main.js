import { defaultRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");

canvas.src = renderSvg(defaultRectlist, defaultPreset);

function adjustIndex(index, preset) {
  const newPreset = Object.assign({}, preset, { index });
  return newPreset;
}

function adjustCount(maxCount, preset) {
  const newPreset = Object.assign({}, preset, { maxCount });
  return newPreset;
}

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
  if (start === undefined) { start = timestamp };
  const elapsed = timestamp - start;
  const sin = Math.sin(elapsed / 2000);
  const vCount = 5 * sin;
  const preset = adjustCount(defaultPreset.maxCount + vCount, defaultPreset);
  canvas.src = renderSvg(defaultRectlist, preset);

  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
