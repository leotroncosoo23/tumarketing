import jsPDF from "jspdf";

const SIMBOLO_MONEDA: Record<string, string> = { ARS: "$", USD: "U$D" };

export function generarFacturaPDF({
  concepto,
  monto,
  moneda,
  fechaEmision,
  nombreCliente,
}: {
  concepto: string;
  monto: number;
  moneda: string;
  fechaEmision: string;
  nombreCliente: string;
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const w = doc.internal.pageSize.getWidth();

  doc.setDrawColor(204, 255, 0);
  doc.setLineWidth(1);
  doc.rect(8, 8, w - 16, doc.internal.pageSize.getHeight() - 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text("TuMarketing", w / 2, 24, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(90, 90, 90);
  doc.text("Comprobante de pago", w / 2, 32, { align: "center" });

  doc.setDrawColor(220, 220, 220);
  doc.line(16, 40, w - 16, 40);

  let y = 52;
  const fila = (etiqueta: string, valor: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(etiqueta.toUpperCase(), 16, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text(valor, 16, y + 6);
    y += 18;
  };

  fila("Cliente", nombreCliente);
  fila("Concepto", concepto);
  fila("Monto", `${SIMBOLO_MONEDA[moneda] || moneda} ${monto.toLocaleString("es-AR")} ${moneda}`);
  fila("Fecha", new Date(fechaEmision).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }));

  doc.save(`Comprobante - ${concepto}.pdf`);
}
