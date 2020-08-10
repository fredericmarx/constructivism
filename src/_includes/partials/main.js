import { defaultRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");
const main = document.querySelector("main");
const maxIndex = 50;

let start;

class Construction {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.controls = document.querySelector(".js-controls");
    this.controlsToggle = document.querySelector(".js-controls-toggle");
    this.sliders = document.querySelectorAll(".range-slider__input");
    this.defaultPreset = defaultPreset;
    this.parameterValues = {
      length: 0.75,
      breadth: 0.25,
      density: 0.4,
      brightness: 0.25,
      orientation: 0.1,
      variation: 0,
    };

    this.update();
    this.initSliders();

    this.toggleControls();

    this.controlsToggle.addEventListener("click", () => {
      this.toggleControls();
    });
  }

  toggleControls() {
    if (this.controlsHidden) {
      this.controls.removeAttribute("hidden");
    } else {
      this.controls.setAttribute("hidden", "");
    }
    this.updateControlsToggle();
  }

  updateControlsToggle() {
    if (this.controlsHidden) {
      this.controlsToggle.textContent = "More controls";
    } else {
      this.controlsToggle.textContent = "Less controls";
    }
  }

  get controlsHidden() {
    return this.controls.hidden;
  }

  get orientation() {
    return this.getParameter("orientation");
  }

  set variation(value) {
    this.setParameter("variation", value);
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

    function getKeyframeValue(frame, keyframes) {
      const index = frame * (keyframes.length - 1);

      const lower = keyframes[Math.floor(index)];
      const upper = keyframes[Math.ceil(index)];
      const diff = upper - lower;
      const value = lower + diff * (index - Math.floor(index));
      return value;
    }

    const keyframes = {
      0: [1, 0, 0, 0, 1],
      45: [0, 1, 0, 0, 0],
      315: [0, 0, 0, 1, 0],
      90: [0, 0, 1, 0, 0],
    };

    const baseRotateAmount = 20;
    const rotate0Amount =
      baseRotateAmount * getKeyframeValue(this.orientation, keyframes[0]);
    const rotate45Amount =
      baseRotateAmount * getKeyframeValue(this.orientation, keyframes[45]);
    const rotate90Amount =
      baseRotateAmount * getKeyframeValue(this.orientation, keyframes[90]);
    const rotate315Amount =
      baseRotateAmount * getKeyframeValue(this.orientation, keyframes[315]);

    const index = maxIndex * this.getParameter("variation");

    getKeyframeValue(this.getParameter("orientation"), keyframes);

    const colorAmount = Math.pow(this.getParameter("brightness"), 3);
    const minColorCount = this.getParameter("brightness") * 2 + 1;

    const preset = {
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      maxCount,
      index,
      colorAmount,
      minColorCount,
      rotate0Amount,
      rotate45Amount,
      rotate90Amount,
      rotate315Amount,
    };
    return preset;
  }

  initSliders() {
    this.sliders.forEach((slider) => {
      const name = slider.name;
      const value = this.parameterValues[name];

      slider.value = value;

      slider.addEventListener("input", () => {
        this.update();
      });
    });
  }

  update() {
    const newPreset = Object.assign({}, this.defaultPreset, this.preset);

    canvas.src = renderSvg(defaultRectlist, newPreset);
  }

  getParameter(name) {
    return parseFloat(document.querySelector(`[name="${name}"]`).value);
  }

  setParameter(name, value) {
    document.querySelector(`[name="${name}"]`).value = value;
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
