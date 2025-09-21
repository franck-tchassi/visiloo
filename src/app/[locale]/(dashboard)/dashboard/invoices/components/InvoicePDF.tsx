// components/InvoicePDF.tsx

import { Button } from "@/components/ui/button";
import { Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Totals } from "../../../../../../../type";

interface Props {
  invoice: Invoice;
  totals: Totals;
}

const InvoicePDF: React.FC<Props> = ({ invoice, totals }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // En-tête du document
    doc.setFontSize(20);
    doc.text('FACTURE', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`N°: FACT-${invoice.id || ''}`, 15, 25);
    doc.text(`Date: ${invoice.invoiceDate || ''}`, 15, 32);
    doc.text(`Échéance: ${invoice.dueDate || ''}`, 15, 39);
    
    // Informations de l'émetteur
    doc.setFontSize(14);
    doc.text('ÉMETTEUR', 15, 55);
    doc.setFontSize(10);
    doc.text(invoice.issuerName || '', 15, 62);
    const splitIssuerAddress = doc.splitTextToSize(invoice.issuerAddress || '', 80);
    doc.text(splitIssuerAddress, 15, 69);
    
    // Informations du client
    doc.setFontSize(14);
    doc.text('CLIENT', 15, 90);
    doc.setFontSize(10);
    doc.text(invoice.clientName || '', 15, 97);
    const splitClientAddress = doc.splitTextToSize(invoice.clientAddress || '', 80);
    doc.text(splitClientAddress, 15, 104);
    
    // Tableau des lignes de facture
    const tableData = (invoice.lines || []).map(line => [
      (line.quantity || 0).toString(),
      line.description || '',
      `${(line.unitPrice || 0).toFixed(2)} €`,
      `${((line.quantity || 0) * (line.unitPrice || 0)).toFixed(2)} €`
    ]);
    
    autoTable(doc, {
      startY: 120,
      head: [['Quantité', 'Description', 'Prix Unitaire', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 }
      }
    });
    
    // Totaux
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.text('SOUS-TOTAL:', 140, finalY);
    doc.text(`${(totals?.totalHT || 0).toFixed(2)} €`, 180, finalY, { align: 'right' });
    
    if (invoice.vatActive) {
      doc.text(`TVA (${invoice.vatRate || 0}%):`, 140, finalY + 8);
      doc.text(`${(totals?.totalVAT || 0).toFixed(2)} €`, 180, finalY + 8, { align: 'right' });
    }
    
    doc.setFontSize(14);
    // CORRECTION : Utiliser null au lieu de undefined ou spécifier une police
    doc.setFont("helvetica", "bold"); // "helvetica" est la police par défaut
    doc.text('TOTAL TTC:', 140, finalY + 20);
    doc.text(`${(totals?.totalTTC || 0).toFixed(2)} €`, 180, finalY + 20, { align: 'right' });
    
    // Statut de la facture
    doc.setFontSize(10);
    // CORRECTION : Utiliser null au lieu de undefined
    doc.setFont("helvetica", "normal"); // "helvetica" est la police par défaut
    const statusText = getStatusText(invoice.status);
    doc.text(`Statut: ${statusText}`, 15, finalY + 30);
    
    // Sauvegarder le PDF
    doc.save(`facture-${invoice.id || 'sans-nom'}.pdf`);
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Brouillon';
      case 2: return 'En attente';
      case 3: return 'Payée';
      case 4: return 'Annulée';
      case 5: return 'Impayée';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Export PDF</h2>
        <FileText className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Générez un document PDF professionnel de votre facture pour l'imprimer ou l'envoyer à votre client.
        </p>
        
        <Button 
          onClick={generatePDF} 
          className="w-full"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Télécharger le PDF
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <p>• Format professionnel</p>
          <p>• Compatible avec toutes les imprimantes</p>
          <p>• Prêt à être envoyé au client</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;