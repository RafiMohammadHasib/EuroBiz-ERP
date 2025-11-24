import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    title: "New invoice #INV-005 created",
    description: "A new invoice for Queen Consolidated has been added.",
    type: "info",
  },
  {
    title: "Invoice #INV-004 is overdue",
    description: "Invoice for Cyberdyne Systems is past its due date.",
    type: "warning",
  },
  {
    title: "Production order completed",
    description: "Order #PROD-001 for Premium Wall Paint is complete.",
    type: "info",
  },
    {
    title: "Raw material stock low",
    description: "Titanium Dioxide (RM-001) is below the reorder threshold.",
    type: "warning",
  },
    {
    title: "New distributor signed",
    description: "Rajshahi Paint Hub has been added to your distributor network.",
    type: "info",
  },
    {
    title: "PO-003 has been delivered",
    description: "Purchase order from Advanced Polymers has been marked as completed.",
    type: "info",
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            View all your recent notifications here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm">Mark all as read</Button>
          </div>
          <div className="divide-y divide-border rounded-md border">
            {notifications.map((notification, index) => (
              <div key={index} className="p-4">
                <p className={`font-medium ${notification.type === 'warning' ? 'text-destructive' : ''}`}>{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
