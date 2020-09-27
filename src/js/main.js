import { getRandomRectlist, defaultPreset, renderSvg } from "./lib/lib.mjs";

const main = document.querySelector("main");
const maxIndex = 50;

let start;

class Construction {
  constructor() {
    this.canvasElements = document.querySelectorAll(".js-canvas");
    this.console = document.querySelector(".js-console");
    this.canvas = document.querySelector(".js-canvas");
    this.controls = document.querySelector(".js-controls");
    this.controlsToggle = document.querySelector(".js-controls-toggle");
    this.a4Button = document.querySelector(".js-a4-button");
    this.a2Button = document.querySelector(".js-a2-button");
    this.generateButton = document.querySelector(".js-generate-button");
    this.sliders = document.querySelectorAll(".range-slider__input");
    this.hint = document.querySelector(".js-hint");
    this.defaultPreset = defaultPreset;
    this.parameterValues = {
      minWidth: 0.6,
      maxWidth: 1,
      minHeight: 0.2,
      maxHeight: 0.8,
      density: 0.1,
      brightness: 0.5,
      orientation: 0.35,
      variation: 0,
    };
    this.frozen = false;
    this.rectlist = getRandomRectlist(50);

    this.initSliders();
    this.update();

    this.controlsToggle.addEventListener("click", () => {
      this.toggleControls();
    });

    this.a4Button.addEventListener("click", () => {
      this.savePdf(210, 297, this.a4Button);
    });
    this.a2Button.addEventListener("click", () => {
      this.savePdf(420, 594, this.a2Button);
    });

    this.generateButton.addEventListener("click", () => {
      this.rectlist = getRandomRectlist(50);
      this.update();
      this.frozen = false;
    });
  }

  toggleControls() {
    if (this.controlsHidden) {
      this.controls.classList.remove("hidden");
      document.body.classList.add("controls-visible");
    } else {
      this.controls.classList.add("hidden");
      document.body.classList.remove("controls-visible");
    }
    this.updateControlsToggle();
  }

  updateControlsToggle() {
    if (this.controlsHidden) {
      this.controlsToggle.innerHTML = "Expand Editor";
    } else {
      this.controlsToggle.innerHTML = "Collapse Editor";
    }
  }

  get controlsHidden() {
    return this.controls.classList.contains("hidden");
  }

  get orientation() {
    return this.getParameter("orientation");
  }

  set variation(value) {
    this.setParameter("variation", value);
  }

  get preset() {
    const minWidth = Math.pow(this.getParameter("minWidth"), 2) * 147 + 3;
    const maxWidth =
      Math.pow(this.getParameter("maxWidth"), 2) *
        (1 - this.getParameter("density")) *
        147 +
      3;

    const minHeight = Math.pow(this.getParameter("minHeight"), 2) * 147 + 3;
    const maxHeight =
      Math.pow(this.getParameter("maxHeight"), 2) *
        (1 - this.getParameter("density")) *
        147 +
      3;

    const maxCount = Math.pow(this.getParameter("density"), 2) * 37 + 2;

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

    const colorAmount = Math.pow(this.getParameter("brightness"), 2);
    const minColorCount = 1;

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

      slider.addEventListener("click", () => {
        this.frozen = true;
      });

      slider.addEventListener("change", () => {
        this.frozen = true;
      });

      slider.addEventListener("input", () => {
        this.update();
      });
    });
  }

  update() {
    const urlPrefix = "data:image/svg+xml;utf8,";
    const newPreset = Object.assign({}, this.defaultPreset, this.preset);

    const text = Object.values(newPreset)
      .map((num) => Math.round(num * 100) / 100)
      .join(", ");
    this.console.textContent = text;

    this.canvasElements.forEach((canvas) => {
      canvas.src = urlPrefix + renderSvg(this.rectlist, newPreset);
    });
  }

  get svg() {
    const newPreset = Object.assign({}, this.defaultPreset, this.preset);
    return renderSvg(this.rectlist, newPreset);
  }

  savePdf(width, height, targetButton) {
    targetButton.setAttribute("disabled", true);
    targetButton.classList.add("loading");
    import("./savePdf").then((module) => {
      const savePdf = module.default;
      savePdf(this.svg, width, height).then(() => {
        targetButton.removeAttribute("disabled");
        targetButton.classList.remove("loading");
      });
    });
  }

  getParameter(name) {
    return parseFloat(document.querySelector(`[name="${name}"]`).value);
  }

  setParameter(name, value) {
    document.querySelector(`[name="${name}"]`).value = value;
    this.update();
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

  window.requestAnimationFrame(tick);
}

//window.requestAnimationFrame(tick);
