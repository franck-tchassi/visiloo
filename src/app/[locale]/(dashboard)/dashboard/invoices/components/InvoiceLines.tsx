// components/InvoiceLines.tsx

import { InvoiceLine } from '@prisma/client'
import { Plus, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Invoice } from '../../../../../../../type'


interface Props {
    invoice: Invoice
    setInvoice: (invoice: Invoice) => void
}

const InvoiceLines: React.FC<Props> = ({ invoice, setInvoice }) => {

    const handleAddLine = () => {
        const newLine: InvoiceLine = {
            id: `${Date.now()}`,
            description: "",
            quantity: 1,
            unitPrice: 0,
            invoiceId: invoice.id
        }
        setInvoice({
            ...invoice,
            lines: [...invoice.lines, newLine]
        })
    }

    const handleQuantityChange = (index: number, value: string) => {
        const updatedLines = [...invoice.lines]
        updatedLines[index].quantity = value === "" ? 0 : parseInt(value)
        setInvoice({ ...invoice, lines: updatedLines })
    }

    const handleDescriptionChange = (index: number, value: string) => {
        const updatedLines = [...invoice.lines]
        updatedLines[index].description = value
        setInvoice({ ...invoice, lines: updatedLines })
    }

    const handleUnitPriceChange = (index: number, value: string) => {
        const updatedLines = [...invoice.lines]
        updatedLines[index].unitPrice = value === "" ? 0 : parseFloat(value)
        setInvoice({ ...invoice, lines: updatedLines })
    }

    const handleRemoveLine = (index: number) => {
        const updatedLines = invoice.lines.filter((_:any, i:any) => i !== index)
        setInvoice({ ...invoice, lines: updatedLines })
    }

    return (
        <div className="bg-card rounded-lg p-6 w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Produits / Services</h2>
                <Button
                    size="sm"
                    onClick={handleAddLine}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quantité</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Prix Unitaire (HT)</TableHead>
                            <TableHead>Montant (HT)</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoice.lines.map((line:any, index:any) => (
                            <TableRow key={line.id}>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={line.quantity}
                                        className="w-20"
                                        min={0}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={line.description}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={line.unitPrice}
                                        className="w-24"
                                        min={0}
                                        step={0.01}
                                        onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">
                                    {(line.quantity * line.unitPrice).toFixed(2)} €
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveLine(index)}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default InvoiceLines