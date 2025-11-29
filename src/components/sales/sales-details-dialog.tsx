
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSettings } from '@/context/settings-context';
import type { Invoice } from '@/lib/data';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface SalesDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice & { salespersonName?: string };
}

export function SalesDetailsDialog({ isOpen, onOpenChange, invoice }: SalesDetailsDialogProps) {
  const { currencySymbol } = useSettings();

  const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
        case 'Paid': return 'secondary';
        case 'Overdue': return 'destructive';
        case 'Partially Paid': return 'default';
        case 'Unpaid':
        default: return 'outline';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Details for Invoice #{invoice.id}</DialogTitle>
          <DialogDescription>
            A complete summary of the sale.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className='grid grid-cols-3 gap-4 rounded-lg border p-4'>
                <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-semibold">{invoice.customer}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Salesperson</p>
                    <p className="font-semibold">{invoice.salespersonName}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoice.items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{currencySymbol}{item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{currencySymbol}{item.total.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Separator />
             <div className="flex justify-end">
                <div className="w-full md:w-1/2 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{currencySymbol}{invoice.items.reduce((acc, item) => acc + item.total, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-semibold text-lg">{currencySymbol}{invoice.totalAmount.toLocaleString()}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between text-green-600">
                        <span className="text-muted-foreground">Paid Amount</span>
                        <span className="font-semibold">{currencySymbol}{invoice.paidAmount.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between text-destructive">
                        <span className="text-muted-foreground">Due Amount</span>
                        <span className="font-semibold">{currencySymbol}{invoice.dueAmount.toLocaleString()}</span>
                    </div>
                </div>
             </div>

        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
