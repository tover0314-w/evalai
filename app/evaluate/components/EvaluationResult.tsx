import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import type { Benchmark } from '@/lib/types/benchmark';
import { exportToExcel } from '@/lib/services/fileService';

interface EvaluationResultProps {
  benchmark: Benchmark;
  scores: Record<string, number>;
}

export default function EvaluationResult({ benchmark, scores }: EvaluationResultProps) {
  // 转换数据为图表格式
  const chartData = Object.entries(benchmark.criteria).map(([key, criterion]) => ({
    dimension: key,
    score: scores[key] || 0,
    maxScore: 4, // 假设最高分为4
    weight: criterion.weight
  }));

  // 计算总分
  const totalScore = Object.entries(scores).reduce((sum, [key, score]) => {
    const weight = benchmark.criteria[key]?.weight || 0;
    return sum + score * weight;
  }, 0);

  const handleExport = () => {
    const exportData = Object.entries(scores).map(([dimension, score]) => ({
      维度: dimension,
      得分: score,
      权重: benchmark.criteria[dimension]?.weight || 0,
      加权得分: score * (benchmark.criteria[dimension]?.weight || 0)
    }));

    // 添加总分行
    exportData.push({
      维度: '总分',
      得分: totalScore,
      权重: 1,
      加权得分: totalScore
    });

    exportToExcel(exportData, `AI评估报告_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">评估结果</h2>
        
        {/* 总分展示 */}
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {totalScore.toFixed(2)}
          </div>
          <div className="text-gray-500">总分（满分4.00）</div>
        </div>

        {/* 雷达图 */}
        <div className="h-[400px]">
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height="100%">
            {/* @ts-ignore */}
            <RadarChart data={chartData}>
              {/* @ts-ignore */}
              <PolarGrid />
              {/* @ts-ignore */}
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#666', fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <PolarRadiusAxis
                angle={30}
                domain={[0, 4]}
              />
              {/* @ts-ignore */}
              <Radar
                name="得分"
                dataKey="score"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              {/* @ts-ignore */}
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 详细得分列表 */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">详细评分</h3>
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.dimension} className="flex items-center">
                <div className="w-1/3 text-gray-600">{item.dimension}</div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${(item.score / item.maxScore) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-gray-900">
                  {item.score.toFixed(1)}
                </div>
                <div className="w-16 text-right text-gray-500">
                  {`${(item.weight * 100).toFixed(0)}%`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 导出按钮 */}
      <div className="flex justify-end">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleExport}
        >
          导出报告
        </button>
      </div>
    </div>
  );
} 