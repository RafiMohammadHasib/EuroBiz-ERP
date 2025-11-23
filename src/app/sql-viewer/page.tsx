'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  invoices,
  salesData,
  commissions,
} from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download } from 'lucide-react';
import { useState } from 'react';

export default function SqlExporterPage() {
  const [copied, setCopied] = useState(false);

  const generateSqlForTable = (tableName: string, data: any[]): string => {
    if (!data.length) return `-- No data for table: ${tableName}\n`;

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
      createTableStatement += `  "${column}" ${sqlType}${index === columns.length - 1 ? '' : ','}\n`;
    });
    createTableStatement += ');\n\n';

    let insertStatements = `INSERT INTO ${tableName} ("${columns.join('", "')}") VALUES\n`;
    data.forEach((item, itemIndex) => {
      const values = columns.map(column => {
        const value = item[column];
        if (value === null || value === undefined) {
            return 'NULL';
        }
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`;
        }
        return value;
      });
      insertStatements += `  (${values.join(', ')})${itemIndex === data.length - 1 ? ';' : ','}\n`;
    });

    return createTableStatement + insertStatements;
  };
  
  const allSql = [
      generateSqlForTable('invoices', invoices),
      generateSqlForTable('commissions', commissions),
      generateSqlForTable('sales_data', salesData)
  ].join('\n\n');


  const handleCopy = () => {
    navigator.clipboard.writeText(allSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([allSql], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">SQL Exporter</h1>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2">{copied ? 'Copied!' : 'Copy SQL'}</span>
                </Button>
                <Button onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                    <span className="ml-2">Download .sql file</span>
                </Button>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Generated SQL Schema</CardTitle>
                <CardDescription>
                This SQL schema is generated from your project's data entities. It will refresh automatically if you change your data structure and revisit this tab.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    readOnly
                    value={allSql}
                    className="font-mono bg-muted h-[60vh]"
                />
            </CardContent>
        </Card>
    </div>
  );
}
