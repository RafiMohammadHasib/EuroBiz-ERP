
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Undo2, Box, Package, FileText } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/settings-context';
import type { SalesReturn, Invoice, FinishedGood } from '@/lib/data';
import { CreateSalesReturnDialog } from '@/components/returns/create-sales-return-dialog';

export default function SalesReturnPage() {
  const firestore = useFirestore();
  const { currencySymbol } = useSettings();
  const { toast } = useToast();

  const salesReturnsCollection = useMemoFirebase(() => collection(firestore, 'sales_returns'), [firestore]);
  const invoicesCollection = useMemoFirebase(() => collection(firestore, 'invoices'), [firestore]);
  const productsCollection = useMemoFirebase(() => collection(firestore, 'finishedGoods'), [firestore]);
  
  const { data: salesReturns, isLoading: returnsLoading } = useCollection<SalesReturn>(salesReturnsCollection);
  const { data: invoices, isLoading: invoicesLoading } = useCollection<Invoice>(invoicesCollection);
  const { data: products, isLoading: productsLoading } = useCollection<FinishedGood>(productsCollection);

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const safeReturns = salesReturns || [];
  const isLoading = returnsLoading || invoicesLoading || productsLoading;
  
  const kpiData = useMemo(() => {
    const totalReturnedValue = safeReturns.reduce((acc, r) => acc + r.totalReturnValue, 0);
    const totalReturns = safeReturns.length;
    const totalItemsReturned = safeReturns.reduce((acc, r) => acc + r.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);

    return { totalReturnedValue, totalReturns, totalItemsReturned };
  }, [safeReturns]);

  const handleCreateReturn = async (newReturn: Omit<SalesReturn, 'id'>) => {
    if (!firestore) return;

    const batch = writeBatch(firestore);

    // 1. Create the new sales return document
    const returnRef = doc(collection(firestore, 'sales_returns'));
    batch.set(returnRef, newReturn);
    
    // 2. Update the original invoice
    const invoiceRef = doc(firestore, 'invoices', newReturn.invoiceId);
    const invoice = invoices?.find(i => i.id === newReturn.invoiceId);
    if (invoice) {
        const newDueAmount = Math.max(0, invoice.dueAmount - newReturn.totalReturnValue);
        const newPaidAmount = Math.max(0, invoice.paidAmount - newReturn.totalReturnValue);
        
        let newStatus: Invoice['status'] = invoice.status;
        if(newDueAmount <= 0.01) {
            newStatus = 'Paid';
        } else if (newPaidAmount > 0) {
            newStatus = 'Partially Paid';
        } else {
            newStatus = 'Unpaid';
        }

        batch.update(invoiceRef, { 
            dueAmount: newDueAmount,
            // Only adjust paid amount if the return value eats into what was paid
            paidAmount: invoice.paidAmount > newDueAmount ? newPaidAmount : invoice.paidAmount,
            status: newStatus
        });
    }

    // 3. Add the returned items back to stock
    for (const item of newReturn.items) {
        const product = products?.find(p => p.id === item.productId);
        if (product) {
            const productRef = doc(firestore, 'finishedGoods', product.id);
            batch.update(productRef, { quantity: product.quantity + item.quantity });
        }
    }

    try {
      await batch.commit();
      toast({
        title: 'Sales Return Processed',
        description: 'Invoice and stock levels have been updated.',
      });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Error processing sales return: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not process the sales return.' });
    }
  };

  return (
    <>
      <div className="space-y-6">
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returned Value</CardTitle>
              <Undo2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{kpiData.totalReturnedValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all sales returns</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalReturns}</div>
              <p className="text-xs text-muted-foreground">Total return transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items Returned</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalItemsReturned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Sum of all returned quantities</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Returns</CardTitle>
                <CardDescription>Manage and process customer returns.</CardDescription>
              </div>
              <Button size="sm" className="h-8 gap-1" onClick={() => setCreateDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Return</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Return Value</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell>
                  </TableRow>
                ) : safeReturns.length > 0 ? (
                  safeReturns.map((sreturn) => (
                    <TableRow key={sreturn.id}>
                      <TableCell className="font-medium">{new Date(sreturn.returnDate).toLocaleDateString()}</TableCell>
                      <TableCell>{sreturn.invoiceId}</TableCell>
                      <TableCell>{sreturn.reason}</TableCell>
                      <TableCell className="text-right">{currencySymbol}{sreturn.totalReturnValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                          <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No sales returns recorded.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <CreateSalesReturnDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateReturn}
        invoices={invoices || []}
        products={products || []}
      />
    </>
  );
}
