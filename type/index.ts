// types/index.ts
export interface Invoice {
  id: string;
  name: string;
  userId: string;
  issuerName: string;
  issuerAddress: string;
  clientName: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  vatActive: boolean;
  vatRate: number;
  status: number;
  lines: InvoiceLine[];
}

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  invoiceId: string;
}

export interface Totals {
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
}