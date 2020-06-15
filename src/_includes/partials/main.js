import { defaultRectlist, defaultPreset, renderSvg } from "/js/main.js";

const canvas = document.getElementById("canvas");
const canvasHeight = 170;
const canvasWidth = 240;

canvas.src = renderSvg(defaultRectlist, defaultPreset);
