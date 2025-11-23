'use client';

import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ProductionOrder, FinishedGood } from '@/lib/data';

interface CreateProductionOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (order: Omit<ProductionOrder, 'id'>) => void;
  products: FinishedGood[];
}

export function CreateProductionOrderDialog({ isOpen, onOpenChange, onCreate, products }: CreateProductionOrderDialogProps) {
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [status, setStatus] = useState<'In Progress' | 'Completed' | 'Pending'>('Pending');

  const handleSubmit = () => {
    const numericQuantity = parseInt(quantity, 10);
    const numericCost = parseFloat(totalCost);

    if (!productName || !quantity || !totalCost || isNaN(numericQuantity) || numericQuantity <= 0 || isNaN(numericCost) || numericCost <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please fill out all fields with valid data.',
      });
      return;
    }

    onCreate({
      productName,
      quantity: numericQuantity,
      totalCost: numericCost,
      status,
      startDate: new Date().toISOString().split('T')[0],
    });
    
    toast({
      title: 'Production Order Created (Simulated)',
      description: `New order for ${quantity} units of ${productName} has been created.`,
    });

    setProductName('');
    setQuantity('');
    setTotalCost('');
    setStatus('Pending');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Production Order</DialogTitle>
          <DialogDescription>
            Fill in the details for the new production run.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-name" className="text-right">
              Product
            </Label>
            <Select value={productName} onValueChange={setProductName}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                    {products.map(p => (
                        <SelectItem key={p.id} value={p.productName}>{p.productName}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total-cost" className="text-right">
              Total Cost
            </Label>
            <Input
              id="total-cost"
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 6000"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
             <Select value={status} onValueChange={(value) => setStatus(value as 'In Progress' | 'Completed' | 'Pending')}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
