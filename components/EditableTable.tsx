'use client';

import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface EditableTableProps {
  initialData: any[];
  onDataChange: (newData: any[]) => void;
}

interface EditableCellProps {
  getValue: () => any;
  row: { index: number };
  column: { id: string };
  table: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  row: { index },
  column: { id },
  table,
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  return (
    <div className="w-full h-full px-4">
      <input
        value={value as string}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        className="w-full h-full py-3 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-gray-900"
      />
    </div>
  );
};

const PAGE_SIZES = [10, 20, 50, 100];

export default function EditableTable({ initialData, onDataChange }: EditableTableProps) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const columnHelper = createColumnHelper<any>();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const columns = React.useMemo(() => {
    if (!initialData.length) return [];
    return Object.keys(initialData[0]).map(key => {
      // 计算列的最大内容长度
      const maxLength = Math.max(
        key.length,
        ...initialData.map(row => String(row[key] || '').length)
      );
      
      // 根据内容长度设置最小和最大宽度
      const minWidth = Math.min(Math.max(maxLength * 8, 100), 300);
      
      return columnHelper.accessor(key, {
        header: () => (
          <div className="font-semibold text-sm">
            {key}
          </div>
        ),
        cell: EditableCell,
        size: minWidth,
      });
    });
  }, [initialData, columnHelper]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        const newData = [...data];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [columnId]: value,
        };
        setData(newData);
        onDataChange(newData);
      },
    },
  });

  if (!initialData.length) {
    return <div className="text-center py-4 text-gray-500">暂无数据</div>;
  }

  const totalWidth = table.getAllColumns().reduce((acc, column) => acc + (column.getSize() ?? 200), 0);

  const VirtualRow = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = table.getRowModel().rows[index];
    if (!row) return null;

    return (
      <div 
        style={{ 
          ...style,
          display: 'flex',
          width: `${totalWidth}px`,
        }} 
        className="hover:bg-gray-50 transition-colors duration-150"
      >
        {row.getVisibleCells().map(cell => (
          <div
            key={cell.id}
            style={{
              width: `${cell.column.getSize()}px`,
            }}
            className="flex items-center border-b border-r last:border-r-0"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="搜索..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {PAGE_SIZES.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                显示 {pageSize} 行
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm hover:bg-gray-50"
          >
            上一页
          </button>
          <span className="text-sm">
            第 {table.getState().pagination.pageIndex + 1} 页，
            共 {table.getPageCount()} 页
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div>
          <div style={{ width: `${totalWidth}px` }}>
            <div className="flex bg-gray-50 border-b">
              {table.getHeaderGroups().map(headerGroup => (
                <React.Fragment key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <div
                      key={header.id}
                      style={{
                        width: `${header.getSize()}px`,
                      }}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none border-r last:border-r-0 hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        <span className="text-gray-400">
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="bg-white" style={{ height: '450px' }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    itemCount={table.getRowModel().rows.length}
                    itemSize={48}
                    width={width}
                  >
                    {VirtualRow}
                  </List>
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        共 {table.getPrePaginationRowModel().rows.length} 条记录
      </div>
    </div>
  );
} 