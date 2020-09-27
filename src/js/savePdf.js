import { jsPDF } from "jspdf";
import "svg2pdf.js";

export default function savePdf(svgString, width, height) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height],
  });
  const temp = document.createElement("div");
  temp.innerHTML = svgString;
  const svg = temp.children[0];

  return doc
    .svg(svg, {
      width,
      height,
    })
    .then(() => {
      const date = Date.now();
      doc.save("ode_to_construction_" + date + ".pdf");
    });
}
