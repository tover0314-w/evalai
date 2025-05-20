import React from 'react';
import type { Benchmark } from '@/lib/types/benchmark';
import type { EvaluationDataType } from '@/lib/types/evaluation';

interface EvaluationHistoryProps {
  history: {
    date: string;
    benchmark: Benchmark;
    data: EvaluationDataType[];
    scores: Record<string, number>;
  }[];
  onSelect: (benchmarkId: string) => void;
}

export function EvaluationHistory({ history, onSelect }: EvaluationHistoryProps) {
  return (
    <div className="space-y-4">
      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          暂无评估历史记录
        </div>
      ) : (
        history.map((record, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-500 cursor-pointer"
            onClick={() => onSelect(record.benchmark.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{record.benchmark.name}</h3>
                <p className="text-sm text-gray-600">{record.benchmark.description}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(record.date).toLocaleString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {Object.entries(record.scores).map(([key, score]) => (
                <div key={key} className="text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className="ml-2 font-medium text-gray-900">{score.toFixed(1)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(record.benchmark.id);
                }}
              >
                查看详情 →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 