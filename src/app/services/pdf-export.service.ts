import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  exportTableToPdf(titulo: string, encabezados: string[][], datos: any[][], nombreArchivo: string) {
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text(titulo, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Fecha de generación
    const fecha = new Date().toLocaleDateString();
    doc.text(`Generado el: ${fecha}`, 14, 30);

    // Creación de la tabla
    autoTable(doc, {
      startY: 35,
      head: encabezados,
      body: datos,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 9 }
    });

    // Descarga
    doc.save(`${nombreArchivo}_${new Date().getTime()}.pdf`);
  }
}
