
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { FinishedGood } from '@/lib/data';
import { useSettings } from '@/context/settings-context';

interface EditSellingPriceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: FinishedGood;
  onUpdate: (productId: string, newPrice: number) => void;
}

export function EditSellingPriceDialog({ isOpen, onOpenChange, product, onUpdate }: EditSellingPriceDialogProps) {
  const { toast } = useToast();
  const { currencySymbol } = useSettings();
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    if (product?.sellingPrice) {
      setNewPrice(String(product.sellingPrice));
    } else {
      setNewPrice('');
    }
  }, [product]);

  const handleSubmit = () => {
    const numericPrice = parseFloat(newPrice);
    if (isNaN(numericPrice) || numericPrice < 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Price',
        description: 'Please enter a valid, non-negative selling price.',
      });
      return;
    }

    onUpdate(product.id, numericPrice);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Selling Price for "{product.productName}"</DialogTitle>
          <DialogDescription>
            Set a new selling price for this product. The current unit cost is {currencySymbol}{product.unitCost.toFixed(2)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="selling-price" className="text-right">
              New Price
            </Label>
            <Input
              id="selling-price"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="col-span-3"
              placeholder={`e.g., 150.00`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
