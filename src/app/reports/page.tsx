
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesDataTable } from "@/components/reports/tables/sales-data-table";
import { PurchasingDataTable } from "@/components/reports/tables/purchasing-data-table";
import { InventoryDataTable } from "@/components/reports/tables/inventory-data-table";
import { FinancialsDataTable } from "@/components/reports/tables/financials-data-table";
import { CommissionsDataTable } from "@/components/reports/tables/commissions-data-table";
import { IncomeExpenseDataTable } from "@/components/reports/tables/income-expense-data-table";
import { ProfitLossDataTable } from "@/components/reports/tables/profit-loss-data-table";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Comprehensive Reports</CardTitle>
                <CardDescription>
                An interactive overview of your business performance across all key areas.
                </CardDescription>
            </CardHeader>
        </Card>
        <Tabs defaultValue="sales" className="grid grid-cols-1 gap-6">
            <TabsList className="grid w-full grid-cols-1 h-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="commissions">Commissions</TabsTrigger>
                <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
            </TabsList>
            <TabsContent value="sales">
                <div className="grid gap-6">
                   <SalesDataTable />
                </div>
            </TabsContent>
            <TabsContent value="purchasing">
                <div className="grid gap-6">
                    <PurchasingDataTable />
                </div>
            </TabsContent>
            <TabsContent value="inventory">
                <InventoryDataTable />
            </TabsContent>
            <TabsContent value="financials">
                 <FinancialsDataTable />
            </TabsContent>
            <TabsContent value="commissions">
               <CommissionsDataTable />
            </TabsContent>
            <TabsContent value="profit-loss">
               <ProfitLossDataTable />
            </TabsContent>
        </Tabs>
    </div>
  )
}
