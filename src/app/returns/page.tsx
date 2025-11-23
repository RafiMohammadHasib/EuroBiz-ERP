import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function ReturnsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Sales Returns</CardTitle>
                <CardDescription>
                Process and track sales returns efficiently.
                </CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Process Return
                </span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
            <h3 className="text-xl font-semibold">No returns processed yet</h3>
            <p className="text-muted-foreground mt-2">Start by processing a new sales return.</p>
        </div>
      </CardContent>
    </Card>
  );
}
