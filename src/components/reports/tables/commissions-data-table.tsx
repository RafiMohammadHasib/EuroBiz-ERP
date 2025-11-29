
'use client';

import { useMemo, useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { SalesCommission, Distributor } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Percent, Users, BarChart } from "lucide-react";
import { useSettings } from "@/context/settings-context";
import CommissionReport from "../commission-chart";
import { Skeleton } from "@/components/ui/skeleton";

type SortKey = keyof DistributorCommissions;

interface DistributorCommissions {
    id: string;
    name: string;
    totalCommission: number;
}

export function CommissionsDataTable() {
    const firestore = useFirestore();
    const { currencySymbol } = useSettings();

    const commissionCol = useMemoFirebase(() => collection(firestore, 'sales_commissions'), [firestore]);
    const distributorCol = useMemoFirebase(() => collection(firestore, 'distributors'), [firestore]);

    const { data: salesCommissions, isLoading: l1 } = useCollection<SalesCommission>(commissionCol);
    const { data: distributors, isLoading: l2 } = useCollection<Distributor>(distributorCol);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'asc' | 'desc' } | null>(null);

    const isLoading = l1 || l2;

    const commissionData: DistributorCommissions[] = useMemo(() => {
        if (!distributors || !salesCommissions) return [];
        
        const commissionsByDistributor: { [key: string]: number } = {};

        salesCommissions.forEach(sc => {
            if (!commissionsByDistributor[sc.distributionChannelId]) {
                commissionsByDistributor[sc.distributionChannelId] = 0;
            }
            commissionsByDistributor[sc.distributionChannelId] += sc.commissionAmount;
        });

        return distributors.map(dist => ({
            id: dist.id,
            name: dist.name,
            totalCommission: commissionsByDistributor[dist.id] || 0,
        }));
    }, [distributors, salesCommissions]);

    const kpiData = useMemo(() => {
        const totalCommissionPaid = commissionData.reduce((acc, item) => acc + item.totalCommission, 0);
        const totalDistributors = commissionData.length;
        const avgCommission = totalDistributors > 0 ? totalCommissionPaid / totalDistributors : 0;
        return { totalCommissionPaid, totalDistributors, avgCommission };
    }, [commissionData]);

    const sortedData = useMemo(() => {
        let sortableItems = [...commissionData];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [commissionData, sortConfig, searchTerm]);

    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleExport = () => {
        const headers = ["Distributor ID", "Distributor Name", "Total Commission"];
        const csvRows = [
            headers.join(','),
            ...sortedData.map(item => [item.id, `"${item.name}"`, item.totalCommission].join(','))
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'commission_report.csv');
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
                        <CardTitle className="text-sm font-medium">Total Commission Paid</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currencySymbol}{kpiData.totalCommissionPaid.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Total commissions paid out</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Distributors with Commission</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpiData.totalDistributors}</div>
                        <p className="text-xs text-muted-foreground">Number of distributors earning commission</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Commission per Distributor</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currencySymbol}{kpiData.avgCommission.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Average commission amount</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader><CardTitle>Distributor Commission Chart</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                    <CommissionReport />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <div className="flex items-center">
                        <CardTitle>Commission Details by Distributor</CardTitle>
                        <div className="ml-auto flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Filter by distributor..."
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleExport} variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => requestSort('name')}>Distributor Name</TableHead>
                                <TableHead className="text-right" onClick={() => requestSort('totalCommission')}>Total Commission</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">{currencySymbol}{item.totalCommission.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

