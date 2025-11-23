import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function RawMaterialsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Raw Materials</CardTitle>
                <CardDescription>
                Manage your inventory of raw materials.
                </CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Material
                </span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
            <h3 className="text-xl font-semibold">No raw materials found</h3>
            <p className="text-muted-foreground mt-2">Add your first raw material to get started.</p>
        </div>
      </CardContent>
    </Card>
  );
}
