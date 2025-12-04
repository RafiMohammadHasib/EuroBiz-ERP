
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Commission, FinishedGood, Distributor } from '@/lib/data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CreateCommissionRuleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (rule: Omit<Commission, 'id'>) => void;
  products: FinishedGood[];
  distributors: Distributor[];
}

export function CreateCommissionRuleDialog({ isOpen, onOpenChange, onCreate, products, distributors }: CreateCommissionRuleDialogProps) {
  const { toast } = useToast();
  const [ruleName, setRuleName] = useState('');
  const [appliesTo, setAppliesTo] = useState<string[]>([]);
  const [type, setType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [rate, setRate] = useState('');

  const allApplicableItems = [
    { type: 'Group', name: 'All Products' },
    ...products.map(p => ({ type: 'Product', name: p.productName })),
    ...distributors.map(d => ({ type: 'Distributor', name: d.name })),
    ...[...new Set(distributors.map(d => d.tier))].map(t => ({ type: 'Tier', name: t })),
  ];
  
  const handleSelectApplicable = (item: string) => {
    if (!appliesTo.includes(item)) {
      setAppliesTo([...appliesTo, item]);
    }
  };

  const handleRemoveApplicable = (itemToRemove: string) => {
    setAppliesTo(appliesTo.filter(item => item !== itemToRemove));
  };


  const resetForm = () => {
    setRuleName('');
    setAppliesTo([]);
    setType('Percentage');
    setRate('');
  };

  const handleSubmit = () => {
    const numericRate = parseFloat(rate);
    if (!ruleName || appliesTo.length === 0 || isNaN(numericRate)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please fill out all fields and select at least one application criteria.',
      });
      return;
    }

    onCreate({
      ruleName,
      appliesTo,
      type,
      rate: numericRate,
    });
    
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Commission Rule</DialogTitle>
          <DialogDescription>
            Define a new rule to calculate sales commissions automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ruleName" className="text-right">
              Rule Name
            </Label>
            <Input
              id="ruleName"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Q4 Electronics Bonus"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="appliesTo" className="text-right pt-2">
              Applies To
            </Label>
            <div className="col-span-3 space-y-2">
              <Select onValueChange={handleSelectApplicable}>
                <SelectTrigger>
                  <SelectValue placeholder="Select products, distributors, or tiers" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-48">
                    {allApplicableItems.map(item => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name} ({item.type})
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <div className="space-x-1 space-y-1">
                {appliesTo.map(item => (
                  <Badge key={item} variant="secondary" className="text-sm">
                    {item}
                    <button onClick={() => handleRemoveApplicable(item)} className="ml-2 rounded-full hover:bg-white/20">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage (%)</SelectItem>
                <SelectItem value="Fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rate" className="text-right">
              Rate / Amount
            </Label>
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="col-span-3"
              placeholder={type === 'Percentage' ? 'e.g., 5.5 for 5.5%' : 'e.g., 500'}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
