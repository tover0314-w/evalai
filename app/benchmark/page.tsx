'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultBenchmarkTemplates } from '@/lib/data/benchmarkTemplates';
import { useBenchmarkStore } from '@/lib/store/benchmarkStore';
import type { 
  BenchmarkCriteria, 
  BenchmarkLevel, 
  BenchmarkDimension,
  AIProductInfo 
} from '@/lib/types/benchmark';

export default function BenchmarkPage() {
  const router = useRouter();
  const { addBenchmark, setActiveBenchmark } = useBenchmarkStore();
  const [selectedTemplate, setSelectedTemplate] = useState(defaultBenchmarkTemplates[0]);
  const [benchmarkName, setBenchmarkName] = useState('');
  const [benchmarkDescription, setBenchmarkDescription] = useState('');
  const [criteria, setCriteria] = useState<Record<string, BenchmarkCriteria>>(
    defaultBenchmarkTemplates[0].criteria
  );
  
  // 新增状态
  const [creationMethod, setCreationMethod] = useState<'template' | 'custom' | 'ai-generated' | 'import'>('template');
  const [customDimensions, setCustomDimensions] = useState<BenchmarkDimension[]>([]);
  const [importError, setImportError] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [aiProductInfo, setAIProductInfo] = useState<AIProductInfo>({
    name: '',
    description: '',
    features: [],
    targetUsers: [],
    useCase: '',
    technicalDetails: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    const template = defaultBenchmarkTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCriteria(template.criteria);
    }
  };

  const handleCriteriaChange = (
    criteriaKey: string,
    field: keyof BenchmarkCriteria,
    value: any
  ) => {
    setCriteria((prev) => ({
      ...prev,
      [criteriaKey]: {
        ...prev[criteriaKey],
        [field]: value,
      },
    }));
  };

  const handleLevelChange = (
    criteriaKey: string,
    levelIndex: number,
    field: keyof BenchmarkLevel,
    value: any
  ) => {
    setCriteria((prev) => ({
      ...prev,
      [criteriaKey]: {
        ...prev[criteriaKey],
        levels: prev[criteriaKey].levels.map((level, idx) =>
          idx === levelIndex ? { ...level, [field]: value } : level
        ),
      },
    }));
  };

  const handleCustomDimensionAdd = () => {
    setCustomDimensions(prev => [...prev, {
      name: '',
      description: '',
      weight: 0
    }]);
  };

  const handleCustomDimensionChange = (index: number, field: keyof BenchmarkDimension, value: any) => {
    setCustomDimensions(prev => prev.map((dim, i) => 
      i === index ? { ...dim, [field]: value } : dim
    ));
  };

  const handleCustomDimensionRemove = (index: number) => {
    setCustomDimensions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAIProductInfoChange = (field: keyof AIProductInfo, value: any) => {
    setAIProductInfo(prev => ({
      ...prev,
      [field]: field === 'features' || field === 'targetUsers' 
        ? value.split('\n').filter(Boolean)
        : value
    }));
  };

  const generateDimensionsFromAI = async () => {
    setIsGenerating(true);
    try {
      // TODO: 调用大模型API生成评估维度
      const response = await fetch('/api/generate-dimensions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiProductInfo),
      });
      
      if (!response.ok) {
        throw new Error('生成评估维度失败');
      }
      
      const dimensions: BenchmarkDimension[] = await response.json();
      setCustomDimensions(dimensions);
    } catch (error) {
      console.error('生成评估维度时出错:', error);
      // TODO: 显示错误提示
    } finally {
      setIsGenerating(false);
    }
  };

  const convertDimensionsToCriteria = (dimensions: BenchmarkDimension[]) => {
    const newCriteria: Record<string, BenchmarkCriteria> = {};
    dimensions.forEach(dim => {
      newCriteria[dim.name] = {
        weight: dim.weight,
        description: dim.description,
        enabled: true,
        levels: [
          { score: 1, description: '不满足要求' },
          { score: 2, description: '基本满足要求' },
          { score: 3, description: '良好' },
          { score: 4, description: '优秀' }
        ]
      };
    });
    return newCriteria;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCriteria = criteria;
    if (creationMethod === 'custom' || creationMethod === 'ai-generated') {
      finalCriteria = convertDimensionsToCriteria(customDimensions);
    }
    
    const newBenchmark = {
      id: `benchmark-${Date.now()}`,
      name: benchmarkName || selectedTemplate.name,
      description: benchmarkDescription || selectedTemplate.description,
      criteria: finalCriteria,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: creationMethod
    };

    addBenchmark(newBenchmark);
    setActiveBenchmark(newBenchmark.id);
    router.push('/evaluate');
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // 验证导入的数据格式
      if (!importedData.name || !importedData.description || !importedData.criteria) {
        throw new Error('文件格式不正确，请确保包含必要的字段：name、description、criteria');
      }

      setBenchmarkName(importedData.name);
      setBenchmarkDescription(importedData.description);
      setCriteria(importedData.criteria);
      
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '导入文件时发生错误');
      console.error('导入文件错误:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">创建评估基准</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择创建方式
            </label>
            <div className="grid grid-cols-4 gap-4">
              <button
                type="button"
                className={`p-4 rounded-lg border-2 ${
                  creationMethod === 'template'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setCreationMethod('template')}
              >
                <h3 className="font-medium">使用模板</h3>
                <p className="text-sm text-gray-500">从预设模板中选择并自定义</p>
              </button>
              <button
                type="button"
                className={`p-4 rounded-lg border-2 ${
                  creationMethod === 'custom'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setCreationMethod('custom')}
              >
                <h3 className="font-medium">自定义维度</h3>
                <p className="text-sm text-gray-500">手动创建评估维度</p>
              </button>
              <button
                type="button"
                className={`p-4 rounded-lg border-2 ${
                  creationMethod === 'ai-generated'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setCreationMethod('ai-generated')}
              >
                <h3 className="font-medium">AI 生成</h3>
                <p className="text-sm text-gray-500">基于产品信息自动生成</p>
              </button>
              <button
                type="button"
                className={`p-4 rounded-lg border-2 ${
                  creationMethod === 'import'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setCreationMethod('import')}
              >
                <h3 className="font-medium">导入文件</h3>
                <p className="text-sm text-gray-500">从JSON文件导入评估基准</p>
              </button>
            </div>
          </div>

          {creationMethod === 'import' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isImporting ? '导入中...' : '选择JSON文件'}
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  支持导入JSON格式的评估基准文件
                </p>
              </div>
              {importError && (
                <div className="text-red-600 text-sm">
                  {importError}
                </div>
              )}
              {benchmarkName && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-medium">已成功导入：{benchmarkName}</h3>
                  <p className="text-green-600 text-sm mt-1">{benchmarkDescription}</p>
                </div>
              )}
            </div>
          )}

          {creationMethod === 'template' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择基准模板
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedTemplate.id}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                {defaultBenchmarkTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              基准名称
              </label>
              <input
                type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={creationMethod === 'template' ? selectedTemplate.name : "输入基准名称"}
              value={benchmarkName}
              onChange={(e) => setBenchmarkName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              基准描述
            </label>
            <textarea
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder={creationMethod === 'template' ? selectedTemplate.description : "输入基准描述"}
              value={benchmarkDescription}
              onChange={(e) => setBenchmarkDescription(e.target.value)}
            />
          </div>
        </div>

        {creationMethod === 'template' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">评估指标配置</h2>
            <div className="space-y-6">
              {Object.entries(criteria).map(([key, criterion]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium">{key}</h3>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">权重：</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={criterion.weight}
                        onChange={(e) =>
                          handleCriteriaChange(key, 'weight', parseFloat(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      描述
              </label>
              <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      value={criterion.description}
                      onChange={(e) =>
                        handleCriteriaChange(key, 'description', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      评分等级
                    </label>
                    {criterion.levels.map((level, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            max="4"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={level.score}
                            onChange={(e) =>
                              handleLevelChange(
                                key,
                                index,
                                'score',
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={level.description}
                            onChange={(e) =>
                              handleLevelChange(key, index, 'description', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(creationMethod === 'custom' || creationMethod === 'ai-generated') && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              {creationMethod === 'custom' ? '自定义评估维度' : 'AI 生成评估维度'}
            </h2>
            
            {creationMethod === 'ai-generated' && (
              <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品名称
              </label>
              <input
                type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={aiProductInfo.name}
                    onChange={(e) => handleAIProductInfoChange('name', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品描述
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={aiProductInfo.description}
                    onChange={(e) => handleAIProductInfoChange('description', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主要功能（每行一个）
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    value={aiProductInfo.features.join('\n')}
                    onChange={(e) => handleAIProductInfoChange('features', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标用户（每行一个）
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={aiProductInfo.targetUsers.join('\n')}
                    onChange={(e) => handleAIProductInfoChange('targetUsers', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用场景
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={aiProductInfo.useCase}
                    onChange={(e) => handleAIProductInfoChange('useCase', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                    技术细节（可选）
              </label>
              <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={aiProductInfo.technicalDetails || ''}
                    onChange={(e) => handleAIProductInfoChange('technicalDetails', e.target.value)}
              />
            </div>
            
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    onClick={generateDimensionsFromAI}
                    disabled={isGenerating}
                  >
                    {isGenerating ? '生成中...' : '生成评估维度'}
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {customDimensions.map((dimension, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 mr-4">
                      <input
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="维度名称"
                        value={dimension.name}
                        onChange={(e) => handleCustomDimensionChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">权重：</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={dimension.weight}
                        onChange={(e) => handleCustomDimensionChange(index, 'weight', parseFloat(e.target.value))}
                      />
              <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleCustomDimensionRemove(index)}
                      >
                        删除
              </button>
                    </div>
                  </div>

                  <div>
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      placeholder="维度描述"
                      value={dimension.description}
                      onChange={(e) => handleCustomDimensionChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={handleCustomDimensionAdd}
              >
                + 添加评估维度
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            创建并使用此评估基准
          </button>
        </div>
      </form>
    </div>
  );
} 