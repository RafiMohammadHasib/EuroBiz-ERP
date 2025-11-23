
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
import CommissionChart from "@/components/reports/commission-chart"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Comprehensive Reports</CardTitle>
                <CardDescription>
                A complete overview of your business performance across all key areas.
                </CardDescription>
            </CardHeader>
        </Card>
        <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
            <Card>
            <CardHeader>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>
                An overview of your company's sales performance over the last year.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-[400px]">
                <SalesChart />
                </div>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="purchasing">
            <Card>
            <CardHeader>
                <CardTitle>Purchase Order Analysis</CardTitle>
                <CardDescription>
                Track purchase order volume and spending over time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <PurchaseAnalysisChart />
                </div>
            </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="inventory">
            <Card>
            <CardHeader>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>
                Value of your finished goods inventory.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <InventoryValueChart />
                </div>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="financials">
            <Card>
            <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>
                Overview of accounts receivable vs. accounts payable.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 h-[400px]">
                    <h3 className="text-xl font-semibold">Financial reports coming soon</h3>
                    <p className="text-muted-foreground mt-2">Check back later for detailed financial analysis.</p>
                </div>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="commissions">
            <Card>
            <CardHeader>
                <CardTitle>Commission Report</CardTitle>
                <CardDescription>
                Distribution of commission types across your sales rules.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <CommissionChart />
                </div>
            </CardContent>
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  )
}
