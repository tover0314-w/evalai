import React from 'react';
import type { Benchmark } from '@/lib/types/benchmark';

interface ReportHeaderProps {
  benchmark: Benchmark;
  onBack: () => void;
}

export function ReportHeader({ benchmark, onBack }: ReportHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">评估报告</h1>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{benchmark.name}</h2>
          <p className="text-gray-600 mb-4">{benchmark.description}</p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>创建时间: {new Date(benchmark.createdAt).toLocaleDateString()}</span>
            <span>更新时间: {new Date(benchmark.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            打印报告
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            导出PDF
          </button>
        </div>
      </div>
    </div>
  );
} 