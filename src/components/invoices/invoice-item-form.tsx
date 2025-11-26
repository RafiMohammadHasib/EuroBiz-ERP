
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FinishedGood, InvoiceItem } from '@/lib/data';
import { Trash2 } from 'lucide-react';
import { useSettings } from '@/context/settings-context';

interface InvoiceItemFormProps {
  item: Omit<InvoiceItem, 'id' | 'total'>;
  products: FinishedGood[];
  onChange: (item: Omit<InvoiceItem, 'id' | 'total'>) => void;
  onRemove: () => void;
}

export function InvoiceItemForm({ item, products, onChange, onRemove }: InvoiceItemFormProps) {
  const { currencySymbol } = useSettings();

  const handleProductChange = (productName: string) => {
    const product = products.find(p => p.productName === productName);
    onChange({
      ...item,
      description: productName,
      unitPrice: product?.sellingPrice || 0,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...item, quantity: parseInt(e.target.value, 10) || 0 });
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...item, unitPrice: parseFloat(e.target.value) || 0 });
  };
  
  const total = item.quantity * item.unitPrice;

  return (
    <div className="grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-2 items-center">
      <Select value={item.description} onValueChange={handleProductChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a product" />
        </SelectTrigger>
        <SelectContent>
          {products.map(p => (
            <SelectItem key={p.id} value={p.productName}>{p.productName}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Quantity"
        value={item.quantity}
        onChange={handleQuantityChange}
        min="1"
      />
      <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currencySymbol}</span>
          <Input
            type="number"
            placeholder="Unit Price"
            value={item.unitPrice}
            onChange={handlePriceChange}
            className="pl-7"
          />
      </div>
      <div className="text-right font-medium pr-2">{currencySymbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
