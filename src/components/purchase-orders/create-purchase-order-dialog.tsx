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
import { PurchaseOrder, Supplier, RawMaterial, PurchaseOrderItem } from '@/lib/data';
import { PlusCircle, Trash2 } from 'lucide-react';

interface CreatePurchaseOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (order: Omit<PurchaseOrder, 'id'>) => void;
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
}

export function CreatePurchaseOrderDialog({ isOpen, onOpenChange, onCreate, suppliers, rawMaterials }: CreatePurchaseOrderDialogProps) {
  const { toast } = useToast();
  const [supplier, setSupplier] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Completed' | 'Cancelled'>('Pending');
  const [items, setItems] = useState<Omit<PurchaseOrderItem, 'id'>[]>([]);

  const handleAddItem = () => {
    setItems([...items, { rawMaterialId: '', quantity: 1, unitCost: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof Omit<PurchaseOrderItem, 'id'>, value: string | number) => {
    const newItems = [...items];
    const material = rawMaterials.find(rm => rm.id === value);
    
    if (field === 'rawMaterialId' && material) {
        newItems[index] = { ...newItems[index], rawMaterialId: material.id, unitCost: material.unitCost };
    } else {
        const item = newItems[index] as any;
        item[field] = value;
    }
    setItems(newItems);
  };
  
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.quantity * item.unitCost, 0);
  };

  const resetForm = () => {
    setSupplier('');
    setStatus('Pending');
    setItems([]);
  }

  const handleSubmit = () => {
    const totalAmount = calculateTotalAmount();
    if (!supplier || items.length === 0 || items.some(i => !i.rawMaterialId || i.quantity <= 0 || i.unitCost < 0)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please select a supplier and add at least one valid item.',
      });
      return;
    }

    const newOrderItems: PurchaseOrderItem[] = items.map((item, index) => ({
        id: `po-item-${Date.now()}-${index}`,
        ...item
    }));

    onCreate({
      supplier,
      amount: totalAmount,
      status,
      date: new Date().toISOString().split('T')[0],
      items: newOrderItems,
    });
    
    toast({
      title: 'Purchase Order Created',
      description: `New PO for ${supplier} has been added.`,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Purchase Order</DialogTitle>
          <DialogDescription>
            Select a supplier and add the raw materials you want to purchase.
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

          <div className="space-y-4">
            <Label>Items</Label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Select
                    value={item.rawMaterialId}
                    onValueChange={(value) => handleItemChange(index, 'rawMaterialId', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Material" />
                    </SelectTrigger>
                    <SelectContent>
                        {rawMaterials.map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="Unit Cost"
                  value={item.unitCost}
                  onChange={(e) => handleItemChange(index, 'unitCost', parseFloat(e.target.value) || 0)}
                  className="w-28"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
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
          <div className="text-right font-semibold text-lg">
            Total Amount: BDT {calculateTotalAmount().toLocaleString()}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Purchase Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}