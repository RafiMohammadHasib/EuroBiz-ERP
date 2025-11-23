'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { invoices, salesData, commissions, type Invoice, type Commission } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function SqlViewerPage() {
  const [copiedTable, setCopiedTable] = useState<string | null>(null);

  const generateSql = (tableName: string, data: any[]): string => {
    if (!data.length) return `-- No data for ${tableName}`;

    let createTableStatement = `CREATE TABLE ${tableName} (\n`;
    const firstItem = data[0];
    const columns = Object.keys(firstItem);

    columns.forEach((column, index) => {
      const dataType = typeof firstItem[column];
      let sqlType: string;
      switch (dataType) {
        case 'number':
          sqlType = Number.isInteger(firstItem[column]) ? 'INTEGER' : 'DECIMAL(10, 2)';
          break;
        case 'string':
           if (column === 'id') {
             sqlType = 'VARCHAR(255) PRIMARY KEY';
           } else if (firstItem[column].length > 100) {
             sqlType = 'TEXT';
           } else {
             sqlType = 'VARCHAR(255)';
           }
          break;
        case 'boolean':
          sqlType = 'BOOLEAN';
          break;
        default:
          sqlType = 'TEXT';
      }
      if (column === 'date') sqlType = 'DATE';
      createTableStatement += `  ${column} ${sqlType}${index === columns.length - 1 ? '' : ','}\n`;
    });
    createTableStatement += ');\n\n';

    let insertStatements = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n`;
    data.forEach((item, itemIndex) => {
      const values = columns.map(column => {
        const value = item[column];
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`;
        }
        return value;
      });
      insertStatements += `  (${values.join(', ')})${itemIndex === data.length - 1 ? ';' : ','}\n`;
    });

    return createTableStatement + insertStatements;
  };

  const handleCopy = (tableName: string, data: any[]) => {
    const sql = generateSql(tableName, data);
    navigator.clipboard.writeText(sql);
    setCopiedTable(tableName);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  return (
    <Tabs defaultValue="invoices">
      <CardHeader className="px-0">
        <CardTitle>SQL Viewer</CardTitle>
        <CardDescription>
          Inspect the application's live data. This is a read-only view.
        </CardDescription>
      </CardHeader>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="invoices">invoices</TabsTrigger>
          <TabsTrigger value="commissions">commissions</TabsTrigger>
          <TabsTrigger value="sales_data">sales_data</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <Textarea
                readOnly
                value="SELECT * FROM invoices;"
                className="font-mono bg-muted flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                className="ml-4 h-auto"
                onClick={() => handleCopy('invoices', invoices)}
              >
                {copiedTable === 'invoices' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {copiedTable === 'invoices' ? 'Copied!' : 'Copy SQL'}
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>id</TableHead>
                  <TableHead>customer</TableHead>
                  <TableHead>customerEmail</TableHead>
                  <TableHead>date</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead className="text-right">amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.customerEmail}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === 'Paid'
                            ? 'secondary'
                            : invoice.status === 'Unpaid'
                            ? 'outline'
                            : 'destructive'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${invoice.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="commissions">
        <Card>
          <CardHeader>
             <div className="flex justify-between items-start">
                <Textarea
                    readOnly
                    value="SELECT * FROM commissions;"
                    className="font-mono bg-muted"
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 h-auto"
                    onClick={() => handleCopy('commissions', commissions)}
                >
                    {copiedTable === 'commissions' ? (
                    <Check className="h-4 w-4" />
                    ) : (
                    <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-2">
                    {copiedTable === 'commissions' ? 'Copied!' : 'Copy SQL'}
                    </span>
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>id</TableHead>
                  <TableHead>ruleName</TableHead>
                  <TableHead>appliesTo</TableHead>
                  <TableHead>type</TableHead>
                  <TableHead className="text-right">rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map(commission => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-mono">
                      {commission.id}
                    </TableCell>
                    <TableCell>{commission.ruleName}</TableCell>
                    <TableCell>{commission.appliesTo}</TableCell>
                    <TableCell>{commission.type}</TableCell>
                    <TableCell className="text-right">
                      {commission.rate}
                      {commission.type === 'Percentage' ? '%' : ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sales_data">
        <Card>
          <CardHeader>
             <div className="flex justify-between items-start">
                <Textarea
                    readOnly
                    value="SELECT * FROM sales_data;"
                    className="font-mono bg-muted"
                />
                 <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 h-auto"
                    onClick={() => handleCopy('sales_data', salesData)}
                >
                    {copiedTable === 'sales_data' ? (
                    <Check className="h-4 w-4" />
                    ) : (
                    <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-2">
                    {copiedTable === 'sales_data' ? 'Copied!' : 'Copy SQL'}
                    </span>
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>month</TableHead>
                  <TableHead className="text-right">revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.map(data => (
                  <TableRow key={data.month}>
                    <TableCell>{data.month}</TableCell>
                    <TableCell className="text-right">
                      ${data.revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
