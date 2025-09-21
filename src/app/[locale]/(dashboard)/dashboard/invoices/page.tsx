// app/invoices/page.tsx
"use client";

import { useInvoices, useCreateInvoice } from "@/hooks/useInvoices";
import { useState } from "react";
import InvoiceComponent from "./components/InvoiceComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function InvoicesPage() {
  const { data: invoices = [], isLoading, error } = useInvoices();
  const createInvoiceMutation = useCreateInvoice();
  const [invoiceName, setInvoiceName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateInvoice = () => {
    if (invoiceName.length > 0 && invoiceName.length <= 60) {
      createInvoiceMutation.mutate(invoiceName, {
        onSuccess: () => {
          setInvoiceName("");
          setIsDialogOpen(false);
        }
      });
    }
  };

  const isNameValid = invoiceName.length <= 60;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-destructive">Erreur lors du chargement des factures</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-6">
      <h1 className="text-2xl font-bold">Mes factures</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="font-bold text-muted-foreground mb-2">
                  Créer une facture
                </div>
                <div className="bg-primary/10 text-primary rounded-full p-3">
                  <Plus className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle Facture</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Nom de la facture (max 60 caractères)"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
              />
              {!isNameValid && (
                <p className="text-sm text-destructive">
                  Le nom ne peut pas dépasser 60 caractères.
                </p>
              )}
              <Button
                onClick={handleCreateInvoice}
                disabled={!isNameValid || invoiceName.length === 0 || createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending ? "Création..." : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {invoices.map((invoice, index) => (
          <InvoiceComponent key={invoice.id} invoice={invoice} index={index} />
        ))}
      </div>
    </div>
  );
}