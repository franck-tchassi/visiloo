// components/VATControl.tsx

import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Invoice } from "../../../../../../../type"


interface Props {
    invoice: Invoice
    setInvoice: (invoice: Invoice) => void
}

const VATControl: React.FC<Props> = ({ invoice, setInvoice }) => {
    const handleVatChange = (checked: boolean) => {
        setInvoice({
            ...invoice,
            vatActive: checked,
            vatRate: checked ? invoice.vatRate : 0
        })
    }

    const handleVatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInvoice({
            ...invoice,
            vatRate: parseFloat(e.target.value)
        })
    }

    return (
        <div className="flex items-center space-x-2">
            <Label htmlFor="vat-toggle">TVA</Label>
            <Switch
                id="vat-toggle"
                checked={invoice.vatActive}
                onCheckedChange={handleVatChange}
            />
            {invoice.vatActive && (
                <Input
                    type="number"
                    value={invoice.vatRate}
                    className="w-16"
                    onChange={handleVatRateChange}
                    min={0}
                />
            )}
        </div>
    )
}

export default VATControl