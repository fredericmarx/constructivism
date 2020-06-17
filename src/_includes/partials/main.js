import { defaultRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");

canvas.src = renderSvg(defaultRectlist, defaultPreset);

function adjustIndex(preset, index) {
  const newPreset = Object.assign({}, preset, { index });
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

window.addEventListener("scroll", () => {
  const preset = adjustIndex(defaultPreset, getScrollRatio() * 20);
  canvas.src = renderSvg(defaultRectlist, preset);
});
