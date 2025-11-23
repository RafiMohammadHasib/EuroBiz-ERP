import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { invoices } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function DuesPage() {
  const outstandingInvoices = invoices.filter(i => i.status !== 'Paid');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outstanding Dues</CardTitle>
        <CardDescription>
          Monitor and manage all outstanding payments from customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outstandingInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.customer}</TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === 'Overdue' ? 'destructive' : 'outline'}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${invoice.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
