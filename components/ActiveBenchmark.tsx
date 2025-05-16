import React from 'react';
import { useBenchmarkStore } from '@/lib/store/benchmarkStore';

export function ActiveBenchmark() {
  const { activeBenchmarkId, getBenchmark } = useBenchmarkStore();
  const activeBenchmark = activeBenchmarkId ? getBenchmark(activeBenchmarkId) : null;

  if (!activeBenchmark) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              未选择评估基准。请先在基准页面创建或选择一个评估基准。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="border-b pb-3 mb-3">
        <h3 className="text-lg font-medium text-gray-900">{activeBenchmark.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{activeBenchmark.description}</p>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">评估指标</h4>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(activeBenchmark.criteria).map(([key, criterion]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <span className="font-medium">{key}</span>
                <span className="text-gray-500 ml-2">({criterion.description})</span>
              </div>
              <div className="text-gray-600">
                权重：{(criterion.weight * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 