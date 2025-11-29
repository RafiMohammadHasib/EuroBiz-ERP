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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Wallet, Receipt, TrendingUp } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/settings-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Expense } from '@/lib/data';
import { CreateExpenseDialog } from '@/components/expenses/create-expense-dialog';
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog';

export default function ExpensesPage() {
  const firestore = useFirestore();
  const { currencySymbol } = useSettings();
  const { toast } = useToast();

  const expensesQuery = useMemoFirebase(() => 
    query(collection(firestore, 'expenses'), orderBy('date', 'desc')), 
    [firestore]
  );
  const { data: expenses, isLoading } = useCollection<Expense>(expensesQuery);

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const safeExpenses = expenses || [];

  const kpiData = useMemo(() => {
    const totalExpenses = safeExpenses.reduce((acc, p) => acc + p.amount, 0);
    const totalTransactions = safeExpenses.length;
    const avgTransaction = totalTransactions > 0 ? totalExpenses / totalTransactions : 0;
    return { totalExpenses, totalTransactions, avgTransaction };
  }, [safeExpenses]);


  const handleCreateExpense = async (newExpense: Omit<Expense, 'id'>) => {
    if (!firestore) return;
    try {
      await addDoc(collection(firestore, 'expenses'), newExpense);
      toast({
        title: 'Expense Recorded',
        description: `Expense for ${newExpense.category} has been recorded.`,
      });
    } catch (error) {
      console.error("Error recording expense: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not record expense.' });
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    if (!firestore) return;
    try {
      const expenseRef = doc(firestore, 'expenses', updatedExpense.id);
      await updateDoc(expenseRef, { ...updatedExpense });
      toast({
        title: 'Expense Updated',
        description: `Expense record has been updated.`,
      });
      setExpenseToEdit(null);
    } catch (error) {
      console.error("Error updating expense: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update expense record.' });
    }
  };

  const handleDeleteExpense = async () => {
    if (!firestore || !expenseToDelete) return;
    try {
      const expenseRef = doc(firestore, 'expenses', expenseToDelete.id);
      await deleteDoc(expenseRef);
      toast({
        title: 'Expense Deleted',
        description: `Expense record has been deleted.`,
      });
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Error deleting expense: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete expense record.' });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{kpiData.totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all recorded expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">Total expense records</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Transaction Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currencySymbol}{kpiData.avgTransaction.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Average value per transaction</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Expense Management</CardTitle>
                <CardDescription>Record and manage all business operating expenses.</CardDescription>
              </div>
              <Button size="sm" className="h-8 gap-1" onClick={() => setCreateDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Record Expense</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
                ) : safeExpenses.length > 0 ? (
                  safeExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right">{currencySymbol}{expense.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setExpenseToEdit(expense)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setExpenseToDelete(expense)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No expenses recorded.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <CreateExpenseDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateExpense}
      />

      {expenseToEdit && (
        <EditExpenseDialog
          isOpen={!!expenseToEdit}
          onOpenChange={(open) => !open && setExpenseToEdit(null)}
          onUpdate={handleUpdateExpense}
          expense={expenseToEdit}
        />
      )}

      <AlertDialog open={!!expenseToDelete} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this expense record.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteExpense} className="bg-destructive hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </>
  );
}
