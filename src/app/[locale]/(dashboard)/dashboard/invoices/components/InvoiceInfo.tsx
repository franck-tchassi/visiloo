// components/InvoiceInfo.tsx

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Invoice } from "../../../../../../../type"


interface Props {
    invoice: Invoice 
    setInvoice: (invoice: Invoice) => void
}

const InvoiceInfo: React.FC<Props> = ({ invoice, setInvoice }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setInvoice({ ...invoice, [field]: e.target.value });
    };

    return (
        <div className="bg-card rounded-lg p-6 space-y-6">
            <div className="space-y-4">
                <div>
                    <Label className="text-sm font-medium mb-2 block">Émetteur</Label>
                    <Input
                        type="text"
                        value={invoice?.issuerName}
                        placeholder="Nom de l'entreprise émettrice"
                        required
                        onChange={(e) => handleInputChange(e, 'issuerName')}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2 block">Adresse de l'émetteur</Label>
                    <Textarea
                        value={invoice?.issuerAddress}
                        placeholder="Adresse de l'entreprise émettrice"
                        rows={4}
                        required
                        onChange={(e) => handleInputChange(e, 'issuerAddress')}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2 block">Client</Label>
                    <Input
                        type="text"
                        value={invoice?.clientName}
                        placeholder="Nom de l'entreprise cliente"
                        required
                        onChange={(e) => handleInputChange(e, 'clientName')}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2 block">Adresse du client</Label>
                    <Textarea
                        value={invoice?.clientAddress}
                        placeholder="Adresse de l'entreprise cliente"
                        rows={4}
                        required
                        onChange={(e) => handleInputChange(e, 'clientAddress')}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2 block">Date de la Facture</Label>
                    <Input
                        type="date"
                        value={invoice?.invoiceDate}
                        required
                        onChange={(e) => handleInputChange(e, 'invoiceDate')}
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium mb-2 block">Date d'échéance</Label>
                    <Input
                        type="date"
                        value={invoice?.dueDate}
                        required
                        onChange={(e) => handleInputChange(e, 'dueDate')}
                    />
                </div>
            </div>
        </div>
    )
}

export default InvoiceInfo