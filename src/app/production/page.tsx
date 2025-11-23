import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function ProductionPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Production</CardTitle>
                <CardDescription>
                Manage production orders and calculate unit costs.
                </CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Production
                </span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
            <h3 className="text-xl font-semibold">No production orders</h3>
            <p className="text-muted-foreground mt-2">Create a new production order to begin.</p>
        </div>
      </CardContent>
    </Card>
  );
}
