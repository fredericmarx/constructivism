const minifyXML = require("minify-xml").minify;

module.exports = async function main() {
  const {getRandomRectlist, defaultPreset, renderSvg} = await import('../js/lib/lib.mjs');

  const rectlist = getRandomRectlist(50);
  const svg = renderSvg(rectlist, defaultPreset);
  return minifyXML(svg);
}
