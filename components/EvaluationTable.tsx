'use client';

import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// 定义评估数据的类型
export type EvaluationData = {
  id: string;
  prompt: string;
  input: string;
  output: string;
  expected_output: string;
  llm_score: number;
  human_score: number;
  code_score: number;
  benchmark_score: number;
  comments: string;
};

// 定义评估基准
export const evaluationBenchmark = {
  accuracy: {
    weight: 0.4,
    description: '输出结果与预期结果的匹配程度',
    levels: [
      { score: 1, description: '完全不匹配' },
      { score: 2, description: '部分匹配，但有重大偏差' },
      { score: 3, description: '基本匹配，有minor偏差' },
      { score: 4, description: '完全匹配预期结果' },
    ],
  },
  completeness: {
    weight: 0.3,
    description: '输出是否完整地解决了问题',
    levels: [
      { score: 1, description: '未解决核心问题' },
      { score: 2, description: '部分解决核心问题' },
      { score: 3, description: '完整解决核心问题，但缺少细节' },
      { score: 4, description: '完整解决问题，包含所有必要细节' },
    ],
  },
  efficiency: {
    weight: 0.3,
    description: '解决问题的效率和资源使用情况',
    levels: [
      { score: 1, description: '效率极低，资源使用过度' },
      { score: 2, description: '效率一般，资源使用较多' },
      { score: 3, description: '效率良好，资源使用合理' },
      { score: 4, description: '效率极高，资源使用优化' },
    ],
  },
};

const columnHelper = createColumnHelper<EvaluationData>();

const columns = [
  columnHelper.accessor('prompt', {
    header: 'Prompt',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('input', {
    header: '输入',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('output', {
    header: '实际输出',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('expected_output', {
    header: '预期输出',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('llm_score', {
    header: 'LLM评分',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('human_score', {
    header: '人工评分',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('code_score', {
    header: '代码评分',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('benchmark_score', {
    header: '基准评分',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('comments', {
    header: '评估意见',
    cell: info => info.getValue(),
  }),
];

export function EvaluationTable({ data }: { data: EvaluationData[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">评估基准说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(evaluationBenchmark).map(([key, criteria]) => (
            <div key={key} className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 capitalize">{key}</h4>
              <p className="text-sm text-gray-600 mb-2">
                权重: {criteria.weight * 100}%
              </p>
              <p className="text-sm text-gray-600 mb-2">{criteria.description}</p>
              <div className="space-y-1">
                {criteria.levels.map(level => (
                  <div key={level.score} className="text-sm">
                    <span className="font-medium">{level.score}分：</span>
                    {level.description}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 