import React, { useMemo } from 'react';
import type { Benchmark } from '@/lib/types/benchmark';
import type { EvaluationDataType } from '@/lib/types/evaluation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell
} from 'recharts';

interface EvaluationTrendsProps {
  benchmark: Benchmark;
  history: {
    date: string;
    benchmark: Benchmark;
    data: EvaluationDataType[];
    scores: Record<string, number>;
  }[];
}

// 使用实际历史数据而不是生成模拟数据
const generateHistoricalData = (benchmark: Benchmark, history: EvaluationTrendsProps['history']) => {
  if (history.length === 0) {
    // 如果没有历史数据，返回空数组
    return [];
  }

  return history.map(record => {
    const data: any = {
      date: record.date,
      totalScore: 0,
    };

    // 使用实际的评分数据
    Object.entries(record.scores).forEach(([key, score]) => {
      data[key] = score;
      if (benchmark.criteria[key]) {
        data.totalScore += score * benchmark.criteria[key].weight;
      }
    });

    return data;
  });
};

export default function EvaluationTrends({ benchmark, history }: EvaluationTrendsProps) {
  const historicalData = useMemo(() => generateHistoricalData(benchmark, history), [benchmark, history]);
  const dimensions = Object.keys(benchmark.criteria);
  
  // 生成渐变色
  const colors = [
    '#2563eb', '#dc2626', '#059669', '#7c3aed', 
    '#ea580c', '#0891b2', '#be185d', '#65a30d'
  ];

  // 计算维度进步情况
  const dimensionProgress = useMemo(() => {
    if (!historicalData.length) {
      return dimensions.map(dimension => ({
        dimension,
        improvement: 0,
        startScore: 0,
        endScore: 0,
        weight: benchmark.criteria[dimension].weight
      }));
    }

    return dimensions.map(dimension => {
      const firstScore = historicalData[0][dimension] || 0;
      const lastScore = historicalData[historicalData.length - 1][dimension] || 0;
      const improvement = firstScore === 0 ? 0 : ((lastScore - firstScore) / firstScore * 100).toFixed(1);
      return {
        dimension,
        improvement: Number(improvement),
        startScore: firstScore,
        endScore: lastScore,
        weight: benchmark.criteria[dimension].weight
      };
    }).sort((a, b) => b.improvement - a.improvement);
  }, [historicalData, dimensions, benchmark]);

  return (
    <div className="space-y-8">
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
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">总分趋势</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="totalScoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 4]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="totalScore"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#totalScoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 各维度趋势图 */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">各维度得分趋势</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 4]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              {dimensions.map((dimension, index) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 进步排名 */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">维度进步排名</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dimensionProgress}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="dimension" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="improvement" fill="#2563eb">
                  {dimensionProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 详细进步数据 */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">维度进步详情</h3>
          <div className="space-y-4">
            {dimensionProgress.map((item, index) => (
              <div 
                key={item.dimension}
                className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.dimension}</span>
                    <span className="text-sm text-gray-500">
                      (权重: {(item.weight * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.startScore.toFixed(1)} → {item.endScore.toFixed(1)}
                  </div>
                </div>
                <div className={`text-lg font-semibold ${
                  item.improvement > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.improvement > 0 ? '+' : ''}{item.improvement}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 改进建议 */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">改进建议</h3>
        <div className="space-y-4">
          {dimensionProgress.map((item, index) => {
            let suggestion = '';
            if (item.improvement < 10) {
              suggestion = `${item.dimension}的提升空间较大，建议重点关注改进`;
            } else if (item.improvement < 30) {
              suggestion = `${item.dimension}有稳定提升，建议继续保持当前改进方向`;
            } else {
              suggestion = `${item.dimension}提升显著，可以将经验推广到其他维度`;
            }
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
                <p className="text-gray-600">{suggestion}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 