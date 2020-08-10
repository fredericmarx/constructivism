import { defaultRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");
const main = document.querySelector("main");
const maxIndex = 50;

console.log(defaultPreset);

let start;

class Construction {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.sliders = document.querySelectorAll(".range-slider__input");
    this.defaultPreset = defaultPreset;
    this.parameterValues = {
      length: 0.5,
      breadth: 0.5,
      density: 0.5,
      orientation: 0.5,
      variation: 0,
    };

    this.update();
    this.initSliders();
  }

  get preset() {
    const minWidth =
      this.defaultPreset.minWidth +
      this.defaultPreset.minWidth * this.getParameter("length");
    const maxWidth =
      this.defaultPreset.maxWidth / 8 +
      (this.defaultPreset.maxWidth / 8) * 7 * this.getParameter("length");

    const minHeight =
      this.defaultPreset.minHeight +
      this.defaultPreset.minHeight * this.getParameter("breadth");
    const maxHeight =
      this.defaultPreset.maxHeight / 8 +
      (this.defaultPreset.maxHeight / 8) * 7 * this.getParameter("breadth");

    const maxCount =
      this.defaultPreset.maxCount / 3 +
      (this.defaultPreset.maxCount / 3) * 2 * this.getParameter("density");

    const index = maxIndex * this.getParameter("variation");

    const colorAmount = this.getParameter("brightness");

    const preset = {
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      maxCount,
      index,
      colorAmount,
    };
    return preset;
  }

  initSliders() {
    this.sliders.forEach((slider) =>
      slider.addEventListener("input", () => {
        this.parameterValues[slider.name] = parseFloat(slider.value);
        this.update();
      })
    );
  }

  update() {
    this.updateSliders();
    const newPreset = Object.assign({}, this.defaultPreset, this.preset);
    console.log(newPreset);

    canvas.src = renderSvg(defaultRectlist, newPreset);
  }

  updateSliders() {
    this.sliders.forEach((slider) => this.updateSlider(slider));
  }

  getParameter(name) {
    return this.parameterValues[name];
  }

  updateSlider(slider) {
    const name = slider.name;
    const value = this.parameterValues[name];

    slider.value = value;
  }
}

const construction = new Construction();

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
  const newPreset = Object.assign({}, preset, construction.preset, {
    //index,
    //maxCount,
    //rotate45Amount,
    //rotate90Amount,
    //rotate315Amount,
    //colorAmount,
  });

  canvas.src = renderSvg(defaultRectlist, newPreset);

  window.requestAnimationFrame(tick);
}

//window.requestAnimationFrame(tick);
