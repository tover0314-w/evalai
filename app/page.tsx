import React from 'react';
import Link from 'next/link';

// 简单的SVG图标组件
const Icons = {
  CheckSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  BarChart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-16">
        {/* 标题部分 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI 产品评估平台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            科学、系统、高效地评估您的 AI 产品表现
          </p>
        </div>

        {/* 功能卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 评估基准卡片 */}
          <Link href="/benchmark" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                  <Icons.CheckSquare />
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  基准管理
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">创建评估基准</h3>
              <p className="text-gray-600">
                定制专业的评估维度和标准，确保评估的科学性和可靠性
              </p>
            </div>
          </Link>

          {/* 评估中心卡片 */}
          <Link href="/evaluate" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300">
                  <Icons.BarChart />
                </div>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  评估中心
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">开始评估</h3>
              <p className="text-gray-600">
                使用多维度评估方法，全面分析AI产品的性能表现
              </p>
            </div>
          </Link>

                    {/* 分析报告卡片 */}          <Link href="/report" className="group">            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">              <div className="flex items-center justify-between mb-6">                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">                  <Icons.TrendingUp />                </div>                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">                  数据分析                </span>              </div>              <h3 className="text-xl font-semibold text-gray-900 mb-2">分析报告</h3>              <p className="text-gray-600">                可视化展示评估结果，深入分析产品优势与改进空间              </p>            </div>          </Link>
        </div>

        {/* 特性展示区域 */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">为什么选择我们的平台？</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">科学的评估方法</h3>
                    <p className="text-gray-600">基于专业指标体系，确保评估结果的可靠性</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">灵活的定制能力</h3>
                    <p className="text-gray-600">支持自定义评估维度和权重，适应不同场景需求</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">智能化分析</h3>
                    <p className="text-gray-600">运用AI技术，提供深入的数据分析和改进建议</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">开始使用</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-medium">1</span>
                  <span>创建或选择评估基准</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-medium">2</span>
                  <span>上传评估数据</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-medium">3</span>
                  <span>获取评估报告</span>
                </div>
              </div>
              <div className="pt-4">
                <Link 
                  href="/benchmark"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                >
                  立即开始
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 