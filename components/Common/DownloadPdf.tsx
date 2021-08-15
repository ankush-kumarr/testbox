import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default async function downloadPdf(docId: any) {
  const input = document.getElementById(docId) as HTMLElement;
  document.getElementById("pagination")?.remove();
  while (document.getElementById("action-header")) {
    document.getElementById("action-header")?.remove();
  }
  document.getElementById("pdf-header")?.classList.remove("hidden");
  while (document.getElementById("action-value")) {
    document.getElementById("action-value")?.remove();
  }
  input.setAttribute("class", "page");
  html2canvas(input, {
    scale: 3,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 190;
    const pageHeight = 290;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    const doc = new jsPDF("p", "mm");
    let position = 0;
    doc.addImage(imgData, "PNG", 10, 0, imgWidth, imgHeight + 25);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight + 25);
      heightLeft -= pageHeight;
    }
    doc.save(`${docId}.pdf`);
    input.classList.remove("page");
  });
}
