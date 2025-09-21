// components/InvoiceComponent.tsx


import { CheckCircle, Clock, FileText, SquareArrowOutUpRight, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Invoice } from '@/lib/invoices';

type InvoiceComponentProps = {
    invoice: Invoice;
    index: number
}

const getStatusBadge = (status: number) => {
    switch (status) {
        case 1:
            return (
                <Badge variant="secondary" className="flex items-center gap-2">
                    <FileText className='w-4 h-4' />
                    Brouillon
                </Badge>
            )
        case 2:
            return (
                <Badge variant="outline" className="flex items-center gap-2 border-amber-500 text-amber-500">
                    <Clock className='w-4 h-4' />
                    En attente
                </Badge>
            )
        case 3:
            return (
                <Badge variant="outline" className="flex items-center gap-2 border-green-500 text-green-500">
                    <CheckCircle className='w-4 h-4' />
                    Payée
                </Badge>
            )
        case 4:
            return (
                <Badge variant="outline" className="flex items-center gap-2">
                    <XCircle className='w-4 h-4' />
                    Annulée
                </Badge>
            )
        case 5:
            return (
                <Badge variant="destructive" className="flex items-center gap-2">
                    <XCircle className='w-4 h-4' />
                    Impayée
                </Badge>
            )
        default:
            return (
                <Badge variant="outline" className="flex items-center gap-2">
                    <XCircle className='w-4 h-4' />
                    Indéfini
                </Badge>
            )
    }
}

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({ invoice, index }) => {

    const calculateTotal = () => {
        const totalHT = invoice?.lines?.reduce((acc: any, line: any) => {
            const quantity = line.quantity ?? 0;
            const unitPrice = line.unitPrice ?? 0;
            return acc + quantity * unitPrice
        }, 0) || 0;

        const totalVAT = totalHT * ((invoice.vatRate || 0) / 100);
        return totalHT + totalVAT;
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">FACT-{invoice.id}</CardTitle>
                {getStatusBadge(invoice.status)}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{calculateTotal().toFixed(2)} €</div>
                <CardDescription className="mt-2">{invoice.name}</CardDescription>
                <Button asChild className="w-full mt-4">
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                        Voir les détails
                        <SquareArrowOutUpRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}

export default InvoiceComponent;