const canvasHeight = 240;
const canvasWidth = 170;

export const defaultPreset = {
  canvasPadding: 0,
  colorAmount: 0.25,
  index: 0,
  maxCount: 2,
  maxHeight: 99.00000000000001,
  maxWidth: 153,
  minColorCount: 1,
  minHeight: 6.512500000000001,
  minWidth: 50.6125,
  rotate0Amount: 0,
  rotate45Amount: 12.000000000000002,
  rotate90Amount: 7.999999999999998,
  rotate315Amount: 0,
};

export const defaultRectlist = getRandomRectlist(50);

function getRect(props) {
  const defaultRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    coloredness: 0,
    rotate: 0,
    hidden: false,
  };

  return Object.assign(defaultRect, props);
}

function getRandomRect() {
  const width = Math.random();
  const height = Math.random();
  const rotate = Math.random();
  const x = Math.random();
  const y = Math.random();
  const coloredness = Math.random();

  const output = getRect({ width, height, x, y, rotate, coloredness });
  return output;
}

function applyPresetToRectlist(rectlist, preset) {
  const {
    index,
    maxCount,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    rotate0Amount,
    rotate45Amount,
    rotate90Amount,
    rotate315Amount,
    colorAmount,
    minColorCount,
    canvasPadding,
  } = preset;
  const rectlistSource = [...rectlist, ...rectlist];
  const rectlistResult = [];

  const rotateValues = [
    { value: 0, weight: rotate0Amount },
    { value: 45, weight: rotate45Amount },
    { value: 90, weight: rotate90Amount },
    { value: 315, weight: rotate315Amount },
  ];

  rectlistSource.forEach((rect, i) => {
    const hidden = i < index || i > index + maxCount - 1;

    const width = applyBounds(rect.width, minWidth, maxWidth);
    const height = applyBounds(Math.pow(rect.height, 3), minHeight, maxHeight);

    const diagonal = getDiagonal(width, height);
    const rotate = getCorrespondingWeightedValue(rect.rotate, rotateValues);

    const x = applyBounds(
      rect.x,
      0 + canvasPadding + Math.max(diagonal, width, height) / 2 - width / 2,
      canvasWidth -
        canvasPadding -
        Math.max(diagonal, width, height) / 2 -
        width / 2
    );
    const y = applyBounds(
      rect.y,
      0 + canvasPadding + Math.max(diagonal, width, height) / 2 - height / 2,
      canvasHeight -
        canvasPadding -
        Math.max(diagonal, width, height) / 2 -
        height / 2
    );

    const coloredness = rect.coloredness;
    const colored =
      i - index <= minColorCount - 1 || coloredness >= 1 - colorAmount;
    const fill = colored ? "red" : "black";

    const rectResult = getRect({
      coloredness,
      fill,
      height,
      hidden,
      rotate,
      width,
      x,
      y,
    });
    rectlistResult.push(rectResult);
  });

  return rectlistResult;
}

export function getRandomRectlist(amount) {
  const randomRectlist = [];
  for (let i = 0; i < amount; i++) {
    randomRectlist[i] = getRandomRect();
  }

  return randomRectlist;
}

function applyBounds(input, min, max) {
  return Math.floor(input * (max - min)) + min;
}

function getCorrespondingWeightedValue(input, weightedValues) {
  const weightSum = weightedValues
    .map((value) => value.weight)
    .reduce((a, b) => a + b);

  const values = [...weightedValues];
  let threshold = 0;
  values.forEach((value) => {
    value.threshold = threshold;
    threshold += (1 / weightSum) * value.weight;
  });
  values.reverse();

  const result = values.find((value) => input >= value.threshold).value;
  return result;
}

function getDiagonal(width, height) {
  return Math.ceil((Math.sqrt(2) / 2) * width + (Math.sqrt(2) / 2) * height);
}

export function renderSvg(rectlist, preset) {
  const svgTemplate = (innerHTML) => `
    <svg
      width="${canvasWidth}"
      height="${canvasHeight}"
      viewbox="0 0 ${canvasWidth} ${canvasHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >${innerHTML}</svg>
	`;

  function renderRect(props) {
    const { x, y, width, height, fill, rotate, hidden } = props;

    return hidden
      ? ""
      : `
    <rect
      x="${x}"
      y="${y}"
      width="${width}"
      height="${height}"
      fill="${fill}"
      transform="rotate(${rotate} ${x + width / 2} ${y + height / 2})"
		></rect>`;
  }

  const svgContent = svgTemplate(
    applyPresetToRectlist(rectlist, preset)
      .map((rect) => renderRect(rect))
      .join("")
  );

  return svgContent;
}
