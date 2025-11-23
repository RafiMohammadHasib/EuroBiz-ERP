
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { salaries } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export default function SalariesPage() {
  const totalMonthlySalary = salaries.reduce((acc, salary) => acc + salary.amount, 0);

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Total Monthly Salary</CardTitle>
                <CardDescription>
                An overview of the total salary expense for the current month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">${totalMonthlySalary.toLocaleString()}</p>
            </CardContent>
        </Card>
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Salary Management</CardTitle>
                    <CardDescription>
                    Manage employee salaries and view monthly totals.
                    </CardDescription>
                </div>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Employee
                    </span>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {salaries.map((salary) => (
                <TableRow key={salary.id}>
                    <TableCell className="font-medium">{salary.name}</TableCell>
                    <TableCell>{salary.position}</TableCell>
                    <TableCell className="text-right">
                    ${salary.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
  );
}
