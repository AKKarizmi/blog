import React, { useMemo, useState, Component } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  RotateCw } from
'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
export interface DataTableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
}
interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyIcon?: ComponentType<{
    className?: string;
  }>;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  pageSize?: number;
  showSearch?: boolean;
  toolbar?: ReactNode;
}
export function DataTable<
  T extends {
    id: string;
  }>(
{
  columns,
  data,
  loading,
  error,
  onRetry,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No data found',
  emptyIcon: EmptyIcon,
  emptyAction,
  pageSize = 10,
  showSearch = true,
  toolbar
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
    Object.values(row as Record<string, unknown>).some((val) =>
    String(val ?? '').
    toLowerCase().
    includes(q)
    )
    );
  }, [data, query]);
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String((a as Record<string, unknown>)[sortKey] ?? '');
      const bv = String((b as Record<string, unknown>)[sortKey] ?? '');
      const cmp = av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };
  return (
    <Card className="overflow-hidden">
      {(showSearch || toolbar) &&
      <div className="p-4 flex flex-col sm:flex-row justify-between gap-3 border-b border-gray-100">
          {showSearch &&
        <div className="w-full sm:max-w-md">
              <Input
            placeholder={searchPlaceholder}
            icon={<Search className="w-4 h-4" />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }} />
          
            </div>
        }
          {toolbar &&
        <div className="flex flex-wrap gap-2 items-center">{toolbar}</div>
        }
        </div>
      }

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) =>
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                
                  {col.sortable ?
                <button
                  onClick={() => handleSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-gray-700">
                  
                      {col.label}
                      {sortKey === col.key && (
                  sortDir === 'asc' ?
                  <ChevronUp className="w-3 h-3" /> :

                  <ChevronDown className="w-3 h-3" />)
                  }
                    </button> :

                col.label
                }
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ?
            [...Array(5)].map((_, i) =>
            <tr key={`skel-${i}`}>
                  {columns.map((col) =>
              <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
              )}
                </tr>
            ) :
            error ?
            <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                    <p className="text-sm text-gray-700">{error}</p>
                    {onRetry &&
                  <Button variant="outline" size="sm" onClick={onRetry}>
                        <RotateCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                  }
                  </div>
                </td>
              </tr> :
            paged.length === 0 ?
            <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    {EmptyIcon &&
                  <EmptyIcon className="w-12 h-12 text-gray-300" />
                  }
                    <p className="text-sm font-medium text-gray-700">
                      {emptyMessage}
                    </p>
                    {emptyAction &&
                  <Button size="sm" onClick={emptyAction.onClick}>
                        {emptyAction.label}
                      </Button>
                  }
                  </div>
                </td>
              </tr> :

            paged.map((row) =>
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) =>
              <td
                key={col.key}
                className={`px-6 py-4 ${col.className || ''}`}>
                
                      {col.render ?
                col.render(row) :
                String(
                  (row as Record<string, unknown>)[col.key] ?? ''
                )}
                    </td>
              )}
                </tr>
            )
            }
          </tbody>
        </table>
      </div>

      {!loading && !error && sorted.length > 0 &&
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {start + 1}–{Math.min(start + pageSize, sorted.length)} of{' '}
            {sorted.length}
          </div>
          <div className="flex gap-2">
            <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}>
            
              Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}>
            
              Next
            </Button>
          </div>
        </div>
      }
    </Card>);

}