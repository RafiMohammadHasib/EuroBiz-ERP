import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import SalesChart from "@/components/dashboard/sales-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  return (
    <Tabs defaultValue="sales">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="sales">Sales Reports</TabsTrigger>
        <TabsTrigger value="commission">Commission Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="sales">
        <Card>
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>
              An overview of your company's sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="h-[400px]">
               <SalesChart />
             </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="commission">
        <Card>
          <CardHeader>
            <CardTitle>Commission Report</CardTitle>
            <CardDescription>
              Track commissions paid out to your sales team and distributors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
                <h3 className="text-xl font-semibold">Commission data not available</h3>
                <p className="text-muted-foreground mt-2">Check back later for commission reports.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
