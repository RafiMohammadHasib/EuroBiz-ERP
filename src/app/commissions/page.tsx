'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal, Percent, BarChart } from "lucide-react"
import { commissions as initialCommissions, type Commission } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateCommissionRuleDialog } from "@/components/commissions/create-commission-rule-dialog";

export default function CommissionsPage() {
    const [commissions, setCommissions] = useState<Commission[]>(initialCommissions);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

    const totalCommissionValue = commissions.reduce((acc, commission) => {
        if (commission.type === 'Percentage') {
            return acc + (10000 * (commission.rate / 100)); 
        }
        return acc + commission.rate;
    }, 0);

    const averageCommissionRate = commissions.filter(c => c.type === 'Percentage').reduce((acc, c, _, arr) => arr.length > 0 ? acc + c.rate / arr.length : 0, 0);

    const addCommissionRule = (newRule: Omit<Commission, 'id'>) => {
        const ruleWithId: Commission = {
            ...newRule,
            id: `COM-${String(commissions.length + 1).padStart(2, '0')}`,
        };
        setCommissions(prev => [ruleWithId, ...prev]);
    }

  return (
    <>
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Commission Paid (Est.)</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">BDT {totalCommissionValue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Based on current rules</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Commission Rate</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageCommissionRate.toFixed(2)}%</div>
                    <p className="text-xs text-muted-foreground">For percentage-based rules</p>
                </CardContent>
            </Card>
        </div>
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Commission Rules</CardTitle>
                    <CardDescription>
                    Manage product and distribution-based sales commissions.
                    </CardDescription>
                </div>
                <Button size="sm" className="h-8 gap-1" onClick={() => setCreateDialogOpen(true)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Rule
                    </span>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {commissions.map((commission) => (
                <TableRow key={commission.id}>
                    <TableCell className="font-medium">{commission.ruleName}</TableCell>
                    <TableCell>{commission.appliesTo}</TableCell>
                    <TableCell>{commission.type}</TableCell>
                    <TableCell className="text-right">
                    {commission.type === 'Percentage' ? `${commission.rate}%` : `BDT ${commission.rate.toLocaleString()}`}
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
    <CreateCommissionRuleDialog 
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={addCommissionRule}
    />
    </>
  );
}
