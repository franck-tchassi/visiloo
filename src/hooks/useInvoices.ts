// hooks/useInvoices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvoicesByUser, createEmptyInvoice, updateInvoice, deleteInvoice, getInvoiceById } from "@/lib/invoices";
import { Invoice } from "../../type";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoicesByUser,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEmptyInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (invoice: Invoice) => updateInvoice(invoice),
    onSuccess: (updatedInvoice) => {
      // Invalider et rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", updatedInvoice.id] });
      
      // Mettre à jour le cache directement pour une UI réactive
      queryClient.setQueryData(
        ["invoice", updatedInvoice.id],
        updatedInvoice
      );
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
}