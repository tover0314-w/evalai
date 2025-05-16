import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { Benchmark } from '@/lib/types/benchmark';

interface EvaluationTrendsProps {
  benchmark: Benchmark;
}

// 模拟历史评估数据
const generateHistoricalData = (benchmark: Benchmark) => {
  const dates = [
    '2024-01-01',
    '2024-01-15',
    '2024-02-01',
    '2024-02-15',
    '2024-03-01',
    '2024-03-15',
  ];

  return dates.map(date => {
    const data: any = {
      date,
      totalScore: 0,
    };
    
    // 为每个维度生成随机的提升数据
    Object.keys(benchmark.criteria).forEach(key => {
      const baseScore = 2.0; // 基础分
      const improvement = Math.random() * 2; // 随机提升
      data[key] = baseScore + improvement;
      data.totalScore += (baseScore + improvement) * benchmark.criteria[key].weight;
    });

    return data;
  });
};

export default function EvaluationTrends({ benchmark }: EvaluationTrendsProps) {
  const historicalData = generateHistoricalData(benchmark);
  const dimensions = Object.keys(benchmark.criteria);
  
  // 生成随机的颜色
  const colors = [
    '#2563eb', '#dc2626', '#059669', '#7c3aed', 
    '#ea580c', '#0891b2', '#be185d', '#65a30d'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">评估趋势分析</h2>
        <div className="flex space-x-2">
          <select 
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue="3months"
          >
            <option value="1month">近1个月</option>
            <option value="3months">近3个月</option>
            <option value="6months">近6个月</option>
            <option value="1year">近1年</option>
          </select>
        </div>
      </div>

      {/* 总分趋势图 */}
      <div>
        <h3 className="text-lg font-medium mb-4">总分趋势</h3>
        <div className="h-[300px]">
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height="100%">
            {/* @ts-ignore */}
            <LineChart data={historicalData}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <YAxis 
                domain={[0, 4]}
                tick={{ fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <Tooltip />
              {/* @ts-ignore */}
              <Line
                type="monotone"
                dataKey="totalScore"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 各维度趋势图 */}
      <div>
        <h3 className="text-lg font-medium mb-4">各维度得分趋势</h3>
        <div className="h-[400px]">
          {/* @ts-ignore */}
          <ResponsiveContainer width="100%" height="100%">
            {/* @ts-ignore */}
            <LineChart data={historicalData}>
              {/* @ts-ignore */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* @ts-ignore */}
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <YAxis 
                domain={[0, 4]}
                tick={{ fontSize: 12 }}
              />
              {/* @ts-ignore */}
              <Tooltip />
              {/* @ts-ignore */}
              <Legend />
              {dimensions.map((dimension, index) => (
                /* @ts-ignore */
                <Line
                  key={dimension}
                  type="monotone"
                  dataKey={dimension}
                  name={dimension}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 维度进步分析 */}
      <div>
        <h3 className="text-lg font-medium mb-4">维度进步分析</h3>
        <div className="grid grid-cols-2 gap-4">
          {dimensions.map((dimension, index) => {
            const firstScore = historicalData[0][dimension];
            const lastScore = historicalData[historicalData.length - 1][dimension];
            const improvement = ((lastScore - firstScore) / firstScore * 100).toFixed(1);
            
            return (
              <div 
                key={dimension}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{dimension}</div>
                  <div className="text-sm text-gray-500">
                    {firstScore.toFixed(1)} → {lastScore.toFixed(1)}
                  </div>
                </div>
                <div className={`text-lg font-semibold ${
                  Number(improvement) > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Number(improvement) > 0 ? '+' : ''}{improvement}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 改进建议 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">改进建议</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>用户体验维度近期提升显著，建议保持当前的优化方向</li>
          <li>性能指标仍有提升空间，建议关注系统响应时间的优化</li>
          <li>可靠性指标波动较大，建议加强稳定性测试</li>
        </ul>
      </div>
    </div>
  );
} 