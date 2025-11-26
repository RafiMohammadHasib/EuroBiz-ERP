
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
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Employee, SalaryPayment } from '@/lib/data';
import { useSettings } from '@/context/settings-context';
import { Separator } from '../ui/separator';

interface MakeSalaryPaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payment: Omit<SalaryPayment, 'id'> | SalaryPayment) => void;
  employees: Employee[];
  payment?: SalaryPayment | null;
}

export function MakeSalaryPaymentDialog({ isOpen, onOpenChange, onConfirm, employees, payment }: MakeSalaryPaymentDialogProps) {
  const { toast } = useToast();
  const { currencySymbol } = useSettings();
  
  const [employeeId, setEmployeeId] = useState('');
  const [salaryMonth, setSalaryMonth] = useState('');
  const [bonus, setBonus] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<SalaryPayment['paymentMethod']>('Bank Transfer');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedEmployee = useMemo(() => employees.find(e => e.id === employeeId), [employeeId, employees]);

  useEffect(() => {
    if (payment) {
        setEmployeeId(payment.employeeId);
        setSalaryMonth(payment.salaryMonth);
        setBonus(String(payment.bonus));
        setDeductions(String(payment.deductions));
        setPaymentMethod(payment.paymentMethod);
        setPaymentDate(payment.paymentDate);
    } else {
        const today = new Date();
        const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        setSalaryMonth(currentMonth);
    }
  }, [payment]);

  const { baseSalary, netPay } = useMemo(() => {
    const base = selectedEmployee?.salary || 0;
    const bonusAmount = parseFloat(bonus) || 0;
    const deductionAmount = parseFloat(deductions) || 0;
    const net = base + bonusAmount - deductionAmount;
    return { baseSalary: base, netPay: net };
  }, [selectedEmployee, bonus, deductions]);

  const handleSubmit = () => {
    if (!employeeId || !salaryMonth) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please select an employee and specify the salary month.',
      });
      return;
    }
    
    const paymentData = {
        employeeId,
        employeeName: selectedEmployee!.name,
        position: selectedEmployee!.position,
        paymentDate,
        salaryMonth,
        amount: baseSalary,
        bonus: parseFloat(bonus) || 0,
        deductions: parseFloat(deductions) || 0,
        netPay,
        paymentMethod,
    };

    if(payment) {
      onConfirm({ ...payment, ...paymentData });
    } else {
      onConfirm(paymentData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{payment ? 'Edit' : 'Make'} Salary Payment</DialogTitle>
          <DialogDescription>
            {payment ? 'Update the details for this salary payment.' : 'Select an employee and record their salary payment for a specific month.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId} disabled={!!payment}>
                    <SelectTrigger id="employee">
                        <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.filter(e => e.status === 'Active').map(e => (
                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="salary-month">Salary For Month</Label>
                <Input
                    id="salary-month"
                    type="month"
                    value={salaryMonth}
                    onChange={(e) => setSalaryMonth(e.target.value)}
                />
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-md space-y-2">
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Salary</span>
                <span className="font-medium">{currencySymbol}{baseSalary.toLocaleString()}</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="bonus">Bonus</Label>
                    <Input id="bonus" type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input id="deductions" type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} placeholder="0" />
                </div>
             </div>
             <Separator className="my-2" />
             <div className="flex justify-between items-center font-bold text-lg">
                <span>Net Pay</span>
                <span>{currencySymbol}{netPay.toLocaleString()}</span>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input
                    id="payment-date"
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                    <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Confirm Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
