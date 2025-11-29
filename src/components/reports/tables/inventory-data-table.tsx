
'use client';

import { useMemo, useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { FinishedGood, RawMaterial } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Download, Search, ChevronDown, DollarSign, Package, List } from "lucide-react";
import { useSettings } from "@/context/settings-context";
import InventoryValueChart from "../inventory-value-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type SortKeyFg = keyof FinishedGood;
type SortKeyRm = keyof RawMaterial;

export function InventoryDataTable() {
    const firestore = useFirestore();
    const { currencySymbol } = useSettings();

    const fgCol = useMemoFirebase(() => collection(firestore, 'finishedGoods'), [firestore]);
    const rmCol = useMemoFirebase(() => collection(firestore, 'rawMaterials'), [firestore]);
    
    const { data: finishedGoods, isLoading: l1 } = useCollection<FinishedGood>(fgCol);
    const { data: rawMaterials, isLoading: l2 } = useCollection<RawMaterial>(rmCol);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfigFg, setSortConfigFg] = useState<{ key: SortKeyFg, direction: 'asc' | 'desc' } | null>(null);
    const [sortConfigRm, setSortConfigRm] = useState<{ key: SortKeyRm, direction: 'asc' | 'desc' } | null>(null);

    const isLoading = l1 || l2;

    const safeFg = useMemo(() => finishedGoods || [], [finishedGoods]);
    const safeRm = useMemo(() => rawMaterials || [], [rawMaterials]);
    
    const kpiData = useMemo(() => {
        const fgValue = safeFg.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
        const rmValue = safeRm.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
        return { totalValue: fgValue + rmValue, productLines: safeFg.length, materialTypes: safeRm.length };
    }, [safeFg, safeRm]);

    const sortedFg = useMemo(() => {
        let sortableItems = [...safeFg];
        if (sortConfigFg) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfigFg.key], bVal = b[sortConfigFg.key];
                if (aVal < bVal) return sortConfigFg.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfigFg.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems.filter(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [safeFg, sortConfigFg, searchTerm]);
    
    const sortedRm = useMemo(() => {
        let sortableItems = [...safeRm];
        if (sortConfigRm) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfigRm.key], bVal = b[sortConfigRm.key];
                if (aVal < bVal) return sortConfigRm.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfigRm.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [safeRm, sortConfigRm, searchTerm]);


    const handleExport = (type: 'fg' | 'rm') => {
        const data = type === 'fg' ? sortedFg : sortedRm;
        const headers = type === 'fg' ? ["ID", "Name", "Quantity", "Unit Cost", "Value"] : ["ID", "Name", "Category", "Quantity", "Unit", "Unit Cost", "Value"];
        const rows = data.map(item => type === 'fg' ? [item.id, (item as FinishedGood).productName, item.quantity, item.unitCost, item.quantity * item.unitCost] : [item.id, (item as RawMaterial).name, (item as RawMaterial).category, item.quantity, (item as RawMaterial).unit, item.unitCost, item.quantity * item.unitCost]);
        const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${type}_inventory_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <Skeleton className="h-[600px] w-full" />
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currencySymbol}{kpiData.totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Finished goods & raw materials</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Product Lines</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpiData.productLines}</div>
                        <p className="text-xs text-muted-foreground">Unique finished products</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Raw Material Types</CardTitle>
                        <List className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpiData.materialTypes}</div>
                        <p className="text-xs text-muted-foreground">Unique raw materials in stock</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader><CardTitle>Inventory Value by Product</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                    <InventoryValueChart />
                </CardContent>
            </Card>

            <Tabs defaultValue="finished-goods">
                <div className="flex items-center gap-4">
                     <TabsList>
                        <TabsTrigger value="finished-goods">Finished Goods</TabsTrigger>
                        <TabsTrigger value="raw-materials">Raw Materials</TabsTrigger>
                    </TabsList>
                     <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Filter by name..."
                            className="pl-8 w-full md:w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="finished-goods">
                    <Card>
                        <CardHeader>
                             <div className="flex items-center">
                                <CardTitle>Finished Goods Details</CardTitle>
                                <Button onClick={() => handleExport('fg')} variant="outline" className="ml-auto">
                                    <Download className="mr-2 h-4 w-4" /> Export
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead onClick={() => setSortConfigFg({ key: 'productName', direction: sortConfigFg?.direction === 'asc' ? 'desc' : 'asc' })}>Product Name</TableHead>
                                        <TableHead className="text-right" onClick={() => setSortConfigFg({ key: 'quantity', direction: sortConfigFg?.direction === 'asc' ? 'desc' : 'asc' })}>Quantity</TableHead>
                                        <TableHead className="text-right" onClick={() => setSortConfigFg({ key: 'unitCost', direction: sortConfigFg?.direction === 'asc' ? 'desc' : 'asc' })}>Unit Cost</TableHead>
                                        <TableHead className="text-right">Total Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedFg.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.productName}</TableCell>
                                            <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{currencySymbol}{item.unitCost.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{currencySymbol}{(item.quantity * item.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2})}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="raw-materials">
                     <Card>
                         <CardHeader>
                             <div className="flex items-center">
                                <CardTitle>Raw Materials Details</CardTitle>
                                <Button onClick={() => handleExport('rm')} variant="outline" className="ml-auto">
                                    <Download className="mr-2 h-4 w-4" /> Export
                                </Button>
                            </div>
                         </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead onClick={() => setSortConfigRm({ key: 'name', direction: sortConfigRm?.direction === 'asc' ? 'desc' : 'asc' })}>Material Name</TableHead>
                                        <TableHead onClick={() => setSortConfigRm({ key: 'category', direction: sortConfigRm?.direction === 'asc' ? 'desc' : 'asc' })}>Category</TableHead>
                                        <TableHead className="text-right" onClick={() => setSortConfigRm({ key: 'quantity', direction: sortConfigRm?.direction === 'asc' ? 'desc' : 'asc' })}>Quantity</TableHead>
                                        <TableHead className="text-right" onClick={() => setSortConfigRm({ key: 'unitCost', direction: sortConfigRm?.direction === 'asc' ? 'desc' : 'asc' })}>Unit Cost</TableHead>
                                        <TableHead className="text-right">Total Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {sortedRm.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell className="text-right">{item.quantity.toLocaleString()} {item.unit}</TableCell>
                                            <TableCell className="text-right">{currencySymbol}{item.unitCost.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{currencySymbol}{(item.quantity * item.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2})}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
