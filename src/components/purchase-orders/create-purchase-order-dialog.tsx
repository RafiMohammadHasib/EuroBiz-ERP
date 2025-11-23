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
import { PurchaseOrder, Supplier } from '@/lib/data';

interface CreatePurchaseOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (order: Omit<PurchaseOrder, 'id'>) => void;
  suppliers: Supplier[];
}

export function CreatePurchaseOrderDialog({ isOpen, onOpenChange, onCreate, suppliers }: CreatePurchaseOrderDialogProps) {
  const { toast } = useToast();
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Completed' | 'Cancelled'>('Pending');

  const handleSubmit = () => {
    const numericAmount = parseFloat(amount);
    if (!supplier || !amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please fill out all fields with valid data.',
      });
      return;
    }

    onCreate({
      supplier,
      amount: numericAmount,
      status,
      date: new Date().toISOString().split('T')[0],
    });
    
    toast({
      title: 'Purchase Order Created (Simulated)',
      description: `New PO for ${supplier} has been added.`,
    });

    setSupplier('');
    setAmount('');
    setStatus('Pending');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Purchase Order</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new purchase order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                    {suppliers.map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (BDT)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 2500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={(value) => setStatus(value as 'Pending' | 'Completed' | 'Cancelled')}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Purchase Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
