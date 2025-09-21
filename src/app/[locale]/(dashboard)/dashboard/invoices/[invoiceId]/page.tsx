// app/invoice/[invoiceId]/page.tsx
"use client";

import { useInvoice, useUpdateInvoice, useDeleteInvoice } from "@/hooks/useInvoices";
import { useState, useEffect } from "react";


import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import InvoiceInfo from "../components/InvoiceInfo";
import InvoiceLines from "../components/InvoiceLines";
import VATControl from "../components/VATControl";
import { Invoice, Totals } from "../../../../../../../type";
import InvoicePDF from "../components/InvoicePDF";


export default function InvoiceDetailPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [initialInvoice, setInitialInvoice] = useState<Invoice | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const router = useRouter();
  
  const { invoiceId } = React.use(params);
  const { data: fetchedInvoice, isLoading } = useInvoice(invoiceId);
  const updateInvoiceMutation = useUpdateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();

  useEffect(() => {
    if (fetchedInvoice) {
      setInvoice(fetchedInvoice);
      setInitialInvoice(fetchedInvoice);
    }
  }, [fetchedInvoice]);

  useEffect(() => {
    if (!invoice) return;
    
    const ht = invoice.lines.reduce((acc:any, { quantity, unitPrice }:any) =>
      acc + quantity * unitPrice, 0
    );
    const vat = invoice.vatActive ? ht * (invoice.vatRate / 100) : 0;
    setTotals({ totalHT: ht, totalVAT: vat, totalTTC: ht + vat });
  }, [invoice]);

  const handleStatusChange = (value: string) => {
    if (invoice) {
      const updatedInvoice = { ...invoice, status: parseInt(value) };
      setInvoice(updatedInvoice);
    }
  };

  const handleSave = () => {
  if (invoice) {
    // S'assurer que les lignes sont bien incluses
    updateInvoiceMutation.mutate({
      ...invoice,
      lines: invoice.lines || [] // Garantir que lines existe
    });
  }
  };

  const handleDelete = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      deleteInvoiceMutation.mutate(invoiceId, {
        onSuccess: () => {
          router.push("/dashboard/invoices");
        }
      });
    }
  };

  const isSaveDisabled = !invoice || JSON.stringify(invoice) === JSON.stringify(initialInvoice);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice || !totals) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="font-bold">Facture Non Trouvée</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="text-lg font-semibold">FACT-{invoice.id}</div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Select value={invoice.status.toString()} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Brouillon</SelectItem>
              <SelectItem value="2">En attente</SelectItem>
              <SelectItem value="3">Payée</SelectItem>
              <SelectItem value="4">Annulée</SelectItem>
              <SelectItem value="5">Impayée</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleSave}
            disabled={isSaveDisabled || updateInvoiceMutation.isPending}
          >
            {updateInvoiceMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                Sauvegarder
                <Save className="w-4 ml-2" />
              </>
            )}
          </Button>

          <Button variant="destructive" onClick={handleDelete} disabled={deleteInvoiceMutation.isPending}>
            {deleteInvoiceMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Trash className="w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col space-y-6 lg:w-1/3">
          <div className="bg-card rounded-lg p-5 shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">Résumé des Totaux</div>
              <VATControl invoice={invoice} setInvoice={setInvoice} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Hors Taxes</span>
                <span>{totals.totalHT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({invoice.vatActive ? invoice.vatRate : 0}%)</span>
                <span>{totals.totalVAT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total TTC</span>
                <span>{totals.totalTTC.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <InvoiceInfo invoice={invoice} setInvoice={setInvoice} />
        </div>

        <div className="flex flex-col space-y-6 lg:w-2/3">
          <InvoiceLines invoice={invoice} setInvoice={setInvoice} />
          <InvoicePDF invoice={invoice} totals={totals} />  
        </div>
      </div>
    </div>
  );
}