import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportLessonPDF(lesson?: any) {

  const element = document.getElementById("lesson-pdf");
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  heightLeft -= pageHeight;

  while (heightLeft > 0) {

    position = heightLeft - imgHeight;

    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;
  }

  const name =
    lesson
      ? `mentorai-${lesson.type}-${lesson.subject}-${lesson.topic}.pdf`
      : "mentorai-document.pdf";

  pdf.save(name.replace(/\s+/g, "-").toLowerCase());
}