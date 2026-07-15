import jsPDF from "jspdf";

export function generarDiplomaPDF({
  nombreAlumno,
  tituloCurso,
}: {
  nombreAlumno: string;
  tituloCurso: string;
}) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Bordes decorativos
  doc.setDrawColor(204, 255, 0);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  doc.rect(14, 14, w - 28, h - 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text("TuMarketing", w / 2, 32, { align: "center" });

  doc.setFontSize(30);
  doc.text("CERTIFICADO DE FINALIZACIÓN", w / 2, 55, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("Se certifica que", w / 2, 78, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(34);
  doc.setTextColor(20, 20, 20);
  doc.text(nombreAlumno, w / 2, 98, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("completó exitosamente el curso", w / 2, 113, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text(tituloCurso, w / 2, 127, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  const fecha = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
  doc.text(fecha, w / 2, h - 22, { align: "center" });

  doc.save(`Certificado - ${tituloCurso}.pdf`);
}
