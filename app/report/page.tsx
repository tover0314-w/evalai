'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBenchmarkStore } from '@/lib/store/benchmarkStore';
import { useEvaluationStore } from '@/lib/store/evaluationStore';
import EvaluationTrends from '../evaluate/components/EvaluationTrends';
import { ReportHeader } from '@/app/report/components/ReportHeader';
import { MetricsOverview } from '@/app/report/components/MetricsOverview';
import { ReportExport } from '@/app/report/components/ReportExport';
import { EvaluationHistory } from '@/app/report/components/EvaluationHistory';

export default function ReportPage() {
  const router = useRouter();
  const { activeBenchmarkId, getBenchmark } = useBenchmarkStore();
  const { currentEvaluation, evaluationHistory, recentReports } = useEvaluationStore();
  const activeBenchmark = activeBenchmarkId ? getBenchmark(activeBenchmarkId) : null;
  const [dateRange, setDateRange] = useState('3months');

  // 如果没有活跃的评估基准，显示历史记录
  if (!activeBenchmark) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">评估报告历史</h1>
          <EvaluationHistory 
            history={evaluationHistory}
            onSelect={(benchmarkId: string) => {
              // 跳转到评估页面并选择对应的基准
              router.push('/evaluate');
            }}
          />
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                请先在评估页面选择一个评估基准，再查看最新评估报告。
                <button 
                  onClick={() => router.push('/evaluate')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  前往评估页面
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ReportHeader 
        benchmark={activeBenchmark}
        onBack={() => router.push('/evaluate')}
      />
      
      <div className="grid grid-cols-1 gap-8">
        {/* 指标概览 */}
        <div className="bg-white rounded-lg shadow p-6">
          <MetricsOverview 
            benchmark={activeBenchmark}
            currentData={currentEvaluation}
          />
        </div>

        {/* 趋势分析 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">评估趋势分析</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="1month">近1个月</option>
              <option value="3months">近3个月</option>
              <option value="6months">近6个月</option>
              <option value="1year">近1年</option>
            </select>
          </div>
          <EvaluationTrends 
            benchmark={activeBenchmark}
            history={evaluationHistory.filter(h => h.benchmark.id === activeBenchmark.id)}
          />
        </div>

        {/* 导出选项 */}
        <ReportExport 
          benchmark={activeBenchmark}
          dateRange={dateRange}
          currentData={currentEvaluation}
          history={evaluationHistory}
        />
      </div>
    </div>
  );
} 