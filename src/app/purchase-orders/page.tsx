'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal, Package, ShoppingCart, List, CheckCircle } from "lucide-react"
import { purchaseOrders as initialPurchaseOrders, type PurchaseOrder, suppliers } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreatePurchaseOrderDialog } from "@/components/purchase-orders/create-purchase-order-dialog";

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const totalPOValue = purchaseOrders.reduce((sum, order) => sum + order.amount, 0);
  const pendingPOValue = purchaseOrders.filter(o => o.status === 'Pending').reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = purchaseOrders.length;
  const completedOrders = purchaseOrders.filter(o => o.status === 'Completed').length;

  const addPurchaseOrder = (newOrder: Omit<PurchaseOrder, 'id'>) => {
    const orderWithId: PurchaseOrder = {
        ...newOrder,
        id: `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
    };
    setPurchaseOrders(prev => [orderWithId, ...prev]);
  }

  const renderPurchaseOrderTable = (orders: PurchaseOrder[]) => (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders</CardTitle>
        <CardDescription>
          Manage your purchase orders and track their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Completed' ? 'secondary' : order.status === 'Pending' ? 'outline' : 'destructive'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">BDT {order.amount.toLocaleString()}</TableCell>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                      <DropdownMenuItem>Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <>
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PO Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">BDT {totalPOValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all purchase orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending PO Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">BDT {pendingPOValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For all pending orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Across all statuses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully fulfilled POs</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Purchase Order
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          {renderPurchaseOrderTable(purchaseOrders)}
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          {renderPurchaseOrderTable(purchaseOrders.filter(o => o.status === 'Pending'))}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {renderPurchaseOrderTable(purchaseOrders.filter(o => o.status === 'Completed'))}
        </TabsContent>
      </Tabs>
    </div>
    <CreatePurchaseOrderDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={addPurchaseOrder}
        suppliers={suppliers}
    />
    </>
  );
}
