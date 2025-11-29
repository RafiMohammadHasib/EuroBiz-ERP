
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SalesChart from "@/components/dashboard/sales-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PurchaseAnalysisChart from "@/components/reports/purchase-analysis-chart"
import InventoryValueChart from "@/components/reports/inventory-value-chart"
import CommissionReport from "@/components/reports/commission-chart"
import FinancialsChart from "@/components/reports/financials-chart"
import IncomeExpenseChart from "@/components/reports/income-expense-chart"
import ProductPerformanceChart from "@/components/reports/product-performance-chart"
import SupplierSpendChart from "@/components/reports/supplier-spend-chart"
import { SalesDataTable } from "@/components/reports/tables/sales-data-table";
import { PurchasingDataTable } from "@/components/reports/tables/purchasing-data-table";
import { InventoryDataTable } from "@/components/reports/tables/inventory-data-table";
import { FinancialsDataTable } from "@/components/reports/tables/financials-data-table";
import { CommissionsDataTable } from "@/components/reports/tables/commissions-data-table";

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
            <TabsList className="grid w-full grid-cols-1 h-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="commissions">Commissions</TabsTrigger>
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
        </Tabs>
    </div>
  )
}
