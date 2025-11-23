import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function FinishedGoodsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finished Goods</CardTitle>
        <CardDescription>
          Manage your inventory of finished products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12">
            <h3 className="text-xl font-semibold">No finished goods in inventory</h3>
            <p className="text-muted-foreground mt-2">Production orders will populate finished goods here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
