
'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Commission, Distributor, FinishedGood } from '@/lib/data';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface EditCommissionRuleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (rule: Commission) => void;
  products: FinishedGood[];
  distributors: Distributor[];
  commission: Commission;
}

export function EditCommissionRuleDialog({ isOpen, onOpenChange, onUpdate, products, distributors, commission }: EditCommissionRuleDialogProps) {
  const [ruleName, setRuleName] = useState('');
  const [appliesTo, setAppliesTo] = useState<string[]>([]);
  const [type, setType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [rate, setRate] = useState('');

  useEffect(() => {
    if (commission) {
      setRuleName(commission.ruleName);
      setAppliesTo(commission.appliesTo);
      setType(commission.type);
      setRate(String(commission.rate));
    }
  }, [commission]);

  const appliesToOptions = useMemo(() => {
    const productOptions = (products || []).map(p => p.productName);
    const distributorOptions = (distributors || []).map(d => d.name);
    const tierOptions = [...new Set((distributors || []).map(d => d.tier))];
    
    return {
      products: productOptions,
      distributors: distributorOptions,
      tiers: tierOptions
    };
  }, [products, distributors]);


  const handleSubmit = () => {
    const numericRate = parseFloat(rate);
    if (!ruleName || appliesTo.length === 0 || !rate || isNaN(numericRate) || numericRate <= 0) {
      alert('Please fill out all fields with valid data.');
      return;
    }

    onUpdate({
      ...commission,
      ruleName,
      appliesTo,
      type,
      rate: numericRate,
    });
    
    onOpenChange(false);
  };
  
  const handleAppliesToChange = (item: string, checked: boolean) => {
    if (checked) {
        setAppliesTo(prev => [...prev, item]);
    } else {
        setAppliesTo(prev => prev.filter(i => i !== item));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Commission Rule</DialogTitle>
          <DialogDescription>
            Update the details for this commission rule.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rule-name" className="text-right">
              Rule Name
            </Label>
            <Input
              id="rule-name"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Q4 Bonus"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4 pt-2">
            <Label htmlFor="applies-to" className="text-right pt-2">
              Applies To
            </Label>
            <div className="col-span-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span>{appliesTo.length > 0 ? `${appliesTo.length} selected` : "Select items..."}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full max-w-[295px]">
                        <ScrollArea className="h-64">
                            <DropdownMenuLabel>Products</DropdownMenuLabel>
                            {appliesToOptions.products.map(p => (
                                <DropdownMenuCheckboxItem
                                    key={p}
                                    checked={appliesTo.includes(p)}
                                    onCheckedChange={(checked) => handleAppliesToChange(p, checked)}
                                >
                                    {p}
                                </DropdownMenuCheckboxItem>
                            ))}
                            <DropdownMenuSeparator />
                             <DropdownMenuLabel>Distributors</DropdownMenuLabel>
                            {appliesToOptions.distributors.map(d => (
                                <DropdownMenuCheckboxItem
                                    key={d}
                                    checked={appliesTo.includes(d)}
                                    onCheckedChange={(checked) => handleAppliesToChange(d, checked)}
                                >
                                    {d}
                                </DropdownMenuCheckboxItem>
                            ))}
                             <DropdownMenuSeparator />
                            <DropdownMenuLabel>Distributor Tiers</DropdownMenuLabel>
                             {appliesToOptions.tiers.map(t => (
                                <DropdownMenuCheckboxItem
                                    key={t}
                                    checked={appliesTo.includes(t)}
                                    onCheckedChange={(checked) => handleAppliesToChange(t, checked)}
                                >
                                    {t}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-wrap gap-1 mt-2">
                    {appliesTo.map(item => <Badge key={item} variant="secondary">{item}</Badge>)}
                </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
             <Select value={type} onValueChange={(value) => setType(value as 'Percentage' | 'Fixed')}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rate" className="text-right">
              Rate
            </Label>
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="col-span-3"
              placeholder={type === 'Percentage' ? "e.g., 5.5" : "e.g., 1000"}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
