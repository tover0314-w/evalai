import React from 'react';
import type { Benchmark } from '@/lib/types/benchmark';
import type { EvaluationDataType } from '@/lib/types/evaluation';

interface MetricsOverviewProps {
  benchmark: Benchmark;
  currentData: EvaluationDataType[] | null;
}

export function MetricsOverview({ benchmark, currentData }: MetricsOverviewProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">评估指标概览</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(benchmark.criteria).map(([key, criterion]) => (
          <div
            key={key}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{key}</h3>
              <span className="text-sm text-gray-500">
                权重: {(criterion.weight * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{criterion.description}</p>
            <div className="space-y-2">
              {criterion.levels.map((level) => (
                <div
                  key={level.score}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">Level {level.score}</span>
                  <span className="text-gray-500">{level.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 