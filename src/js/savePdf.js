import { jsPDF } from "jspdf";
import "svg2pdf.js";

export default function savePdf(svgString) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm"
  });
  const temp = document.createElement("div");
  temp.innerHTML = svgString;
  const svg = temp.children[0];

  return doc.svg(svg, {
    width: 297,
    height: 210
  }).then(() => {
    const date = Date.now();
    doc.save("construction_" + date + ".pdf");
  })
}
