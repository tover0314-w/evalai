import React, { useState } from 'react';
import type { Benchmark } from '@/lib/types/benchmark';
import type { EvaluationDataType } from '@/lib/types/evaluation';
import * as XLSX from 'xlsx';

interface ReportExportProps {
  benchmark: Benchmark;
  dateRange: string;
  currentData: EvaluationDataType[] | null;
  history: {
    date: string;
    benchmark: Benchmark;
    data: EvaluationDataType[];
    scores: Record<string, number>;
  }[];
}

export function ReportExport({ benchmark, dateRange, currentData, history }: ReportExportProps) {
  const [exportFormat, setExportFormat] = useState('excel');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeTrends, setIncludeTrends] = useState(true);

  const handleExport = () => {
    // 生成导出数据
    const exportData = {
      benchmarkInfo: {
        name: benchmark.name,
        description: benchmark.description,
        createdAt: benchmark.createdAt,
        updatedAt: benchmark.updatedAt,
      },
      criteria: benchmark.criteria,
      dateRange,
      // 这里可以添加更多数据...
    };

    if (exportFormat === 'excel') {
      // 创建工作簿
      const wb = XLSX.utils.book_new();
      
      // 基准信息
      const infoWS = XLSX.utils.json_to_sheet([exportData.benchmarkInfo]);
      XLSX.utils.book_append_sheet(wb, infoWS, '基准信息');
      
      // 评估维度
      const criteriaData = Object.entries(exportData.criteria).map(([key, criterion]: [string, any]) => ({
        dimension: key,
        description: criterion.description,
        weight: criterion.weight,
      }));
      const criteriaWS = XLSX.utils.json_to_sheet(criteriaData);
      XLSX.utils.book_append_sheet(wb, criteriaWS, '评估维度');
      
      // 导出文件
      XLSX.writeFile(wb, `${benchmark.name}-评估报告-${new Date().toISOString().split('T')[0]}.xlsx`);
    } else if (exportFormat === 'pdf') {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">导出报告</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            导出格式
          </label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeDetails"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeDetails" className="ml-2 block text-sm text-gray-900">
              包含详细评估数据
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeTrends"
              checked={includeTrends}
              onChange={(e) => setIncludeTrends(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeTrends" className="ml-2 block text-sm text-gray-900">
              包含趋势分析
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleExport}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            生成报告
          </button>
        </div>
      </div>
    </div>
  );
} 