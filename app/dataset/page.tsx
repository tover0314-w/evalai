'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const datasetSchema = z.object({
  name: z.string().min(1, '请输入数据集名称'),
  description: z.string().min(1, '请输入数据集描述'),
  prompt: z.string().min(1, '请输入生成提示词'),
  count: z.number().min(1, '请输入生成数量').max(1000, '单次最多生成1000条'),
});

type DatasetFormData = z.infer<typeof datasetSchema>;

export default function DatasetPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatasetFormData>({
    resolver: zodResolver(datasetSchema),
  });

  const onSubmit = async (data: DatasetFormData) => {
    setIsGenerating(true);
    try {
      // TODO: 实现数据集生成逻辑
      console.log('生成数据集:', data);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI数据集生成</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">数据集名称</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">数据集描述</label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">生成提示词</label>
            <textarea
              {...register('prompt')}
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
              placeholder="输入提示词模板，使用 {variable} 表示变量..."
            />
            {errors.prompt && (
              <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">生成数量</label>
            <input
              type="number"
              {...register('count', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
              max="1000"
            />
            {errors.count && (
              <p className="mt-1 text-sm text-red-600">{errors.count.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? '生成中...' : '开始生成'}
          </button>
        </form>
      </div>
    </div>
  );
} 