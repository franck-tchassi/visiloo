// lib/invoices.ts
const API_BASE_URL = '/api/invoices';

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

// Récupérer toutes les factures de l'utilisateur
export async function getInvoicesByUser(): Promise<Invoice[]> {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des factures');
  }

  return response.json();
}

// Créer une nouvelle facture
export async function createEmptyInvoice(name: string): Promise<Invoice> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la facture');
  }

  return response.json();
}

// Récupérer une facture par son ID
export async function getInvoiceById(id: string): Promise<Invoice> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la facture');
  }

  return response.json();
}

// Mettre à jour une facture
export async function updateInvoice(invoice: Invoice): Promise<Invoice> {
  const response = await fetch(`${API_BASE_URL}/${invoice.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...invoice,
      lines: invoice.lines || [] // S'assurer que lines est toujours un tableau
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la facture');
  }

  return response.json();
}

// Supprimer une facture
export async function deleteInvoice(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la facture');
  }
}