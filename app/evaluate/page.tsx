'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Tab } from '@headlessui/react';
import * as XLSX from 'xlsx';
import EditableTable from '@/components/EditableTable';
import { EvaluationTable } from '@/components/EvaluationTable';
import { ActiveBenchmark } from '@/components/ActiveBenchmark';
import { sampleEvaluationData } from './sampleData';
import { useBenchmarkStore } from '@/lib/store/benchmarkStore';
import { 
  EvaluationDataType, 
  MetricType, 
  HumanMetricsType, 
  EvaluationBuilderTypes 
} from '@/lib/types/evaluation';
import EvaluationTrends from './components/EvaluationTrends';
import FileUpload from './components/FileUpload';
import EvaluationResult from './components/EvaluationResult';
import { parseFile, validateFileFormat } from '@/lib/services/fileService';
import type { Benchmark } from '@/lib/types/benchmark';

// 默认值定义
const defaultHumanMetrics: HumanMetricsType = {
  accuracy: { weight: 0.4, enabled: true, name: '准确性' },
  completeness: { weight: 0.3, enabled: true, name: '完整性' },
  efficiency: { weight: 0.3, enabled: true, name: '效率' },
  custom: { weight: 0, enabled: false, name: '' }
};

const defaultLLMPrompt = `请评估以下AI生成的输出质量。根据以下标准进行评分（1-4分）：
- 准确性（40%）：输出与预期输出的匹配程度
- 完整性（30%）：输出是否完整地解决了问题
- 效率（30%）：解决问题的效率和资源使用情况

输入：{{input}}
实际输出：{{output}}
预期输出：{{expected_output}}

请给出1-4分的评分和简短解释：`;

const defaultCodeEval = `function evaluateOutput(input, output, expectedOutput) {
  // 评估准确性 (40%)
  const accuracyScore = calculateAccuracy(output, expectedOutput);
  
  // 评估完整性 (30%)
  const completenessScore = calculateCompleteness(output, expectedOutput);
  
  // 评估效率 (30%)
  const efficiencyScore = calculateEfficiency(output);
  
  // 计算总分
  const totalScore = 
    accuracyScore * 0.4 + 
    completenessScore * 0.3 + 
    efficiencyScore * 0.3;
    
  return {
    score: totalScore,
    accuracy: accuracyScore,
    completeness: completenessScore,
    efficiency: efficiencyScore,
    comments: generateComments(accuracyScore, completenessScore, efficiencyScore)
  };
}`;

interface EvaluatePageState {
  tableData: Record<string, any>[];
  fileName: string;
  evaluationData: EvaluationDataType[];
  humanMetrics: HumanMetricsType;
  llmPrompt: string;
  codeEval: string;
}

// 示例评估标准
const exampleBenchmark: Benchmark = {
  id: 'default-benchmark',
  name: 'AI系统评估标准',
  description: '用于评估AI系统的综合性能和质量',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  criteria: {
    '性能效率': {
      description: '系统的响应速度和资源利用率',
      weight: 0.2,
      levels: [
        { score: 1, description: '响应缓慢，资源利用率低' },
        { score: 2, description: '响应一般，资源利用率中等' },
        { score: 3, description: '响应快速，资源利用率良好' },
        { score: 4, description: '响应极快，资源利用率优秀' }
      ]
    },
    '准确性': {
      description: '输出结果的准确度和可靠性',
      weight: 0.25,
      levels: [
        { score: 1, description: '结果经常出错，可靠性低' },
        { score: 2, description: '结果偶有错误，可靠性一般' },
        { score: 3, description: '结果较为准确，可靠性好' },
        { score: 4, description: '结果非常准确，可靠性高' }
      ]
    },
    '用户体验': {
      description: '系统的易用性和交互设计',
      weight: 0.15,
      levels: [
        { score: 1, description: '交互复杂，使用困难' },
        { score: 2, description: '交互一般，使用需要学习' },
        { score: 3, description: '交互友好，使用较为简单' },
        { score: 4, description: '交互优秀，使用非常简单' }
      ]
    },
    '可靠性': {
      description: '系统的稳定性和错误处理能力',
      weight: 0.2,
      levels: [
        { score: 1, description: '经常出现故障，错误处理能力差' },
        { score: 2, description: '偶有故障，错误处理能力一般' },
        { score: 3, description: '较为稳定，错误处理能力好' },
        { score: 4, description: '非常稳定，错误处理能力强' }
      ]
    },
    '创新性': {
      description: '系统的创新特性和技术先进性',
      weight: 0.2,
      levels: [
        { score: 1, description: '技术落后，缺乏创新' },
        { score: 2, description: '技术一般，创新性不足' },
        { score: 3, description: '技术先进，具有创新性' },
        { score: 4, description: '技术领先，创新性突出' }
      ]
    },
  },
};

export default function EvaluatePage() {
  const [state, setState] = useState<EvaluatePageState>({
    tableData: [],
    fileName: '',
    evaluationData: sampleEvaluationData,
    humanMetrics: defaultHumanMetrics,
    llmPrompt: defaultLLMPrompt,
    codeEval: defaultCodeEval
  });

  const { activeBenchmarkId, getBenchmark } = useBenchmarkStore();
  const activeBenchmark = activeBenchmarkId ? getBenchmark(activeBenchmarkId) : null;

  const [scores, setScores] = React.useState<Record<string, number>>({});
  const [hasData, setHasData] = React.useState(false);
  const [showEvalResult, setShowEvalResult] = React.useState(false);

  const updateState = useCallback((updates: Partial<EvaluatePageState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    updateState({ fileName: file.name });
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target?.result;
      if (typeof data === 'string') {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];
        
        try {
          const formattedData: EvaluationDataType[] = jsonData.map((item, index) => ({
            id: item.id || String(index + 1),
            prompt: item.prompt || '',
            input: item.input || '',
            output: item.output || '',
            expected_output: item.expected_output || '',
            llm_score: item.llm_score || 0,
            human_score: item.human_score || 0,
            code_score: item.code_score || 0,
            benchmark_score: item.benchmark_score || 0,
            comments: item.comments || '',
          }));
          updateState({ 
            tableData: jsonData,
            evaluationData: formattedData 
          });
        } catch (error) {
          console.error('数据格式转换错误:', error);
        }
      }
    };
    reader.readAsBinaryString(file);
  }, [updateState]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  const handleDataChange = useCallback((newData: Record<string, any>[]) => {
    const formattedData: EvaluationDataType[] = newData.map((item, index) => ({
      id: item.id || String(index + 1),
      prompt: item.prompt || '',
      input: item.input || '',
      output: item.output || '',
      expected_output: item.expected_output || '',
      llm_score: item.llm_score || 0,
      human_score: item.human_score || 0,
      code_score: item.code_score || 0,
      benchmark_score: item.benchmark_score || 0,
      comments: item.comments || '',
    }));
    
    updateState({
      tableData: newData,
      evaluationData: formattedData
    });
  }, [updateState]);

  const handleExport = useCallback(() => {
    if (!state.tableData.length || !state.fileName) {
      console.warn('没有可导出的数据或文件名未设置');
      return;
    }

    try {
      const ws = XLSX.utils.json_to_sheet(state.tableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${state.fileName.split('.')[0]}_edited.xlsx`);
    } catch (error) {
      console.error('导出Excel文件时发生错误:', error);
    }
  }, [state.tableData, state.fileName]);
  
  const handleHumanMetricChange = (metricKey: keyof HumanMetricsType, field: keyof MetricType, value: any) => {
    const prevMetrics = state.humanMetrics;
    updateState({
      humanMetrics: {
        ...prevMetrics,
        [metricKey]: {
          ...prevMetrics[metricKey],
          [field]: value
        }
      }
    });
  };
  
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        id: 'template_1',
        prompt: '示例提示词',
        input: '示例输入',
        output: '示例实际输出',
        expected_output: '示例预期输出',
        llm_score: 0,
        human_score: 0,
        code_score: 0,
        benchmark_score: 0,
        comments: '',
      }
    ];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'evaluation_template.xlsx');
  };

  // 更新评估配置
  useEffect(() => {
    if (activeBenchmark) {
      const newMetrics: HumanMetricsType = {
        accuracy: { weight: 0, enabled: false, name: '准确性' },
        completeness: { weight: 0, enabled: false, name: '完整性' },
        efficiency: { weight: 0, enabled: false, name: '效率' },
        custom: { weight: 0, enabled: false, name: '' }
      };
      
      Object.entries(activeBenchmark.criteria).forEach(([key, criterion]) => {
        if (key in newMetrics) {
          newMetrics[key as keyof HumanMetricsType] = {
            weight: criterion.weight,
            enabled: true,
            name: criterion.description
          };
        }
      });
      
      updateState({ humanMetrics: newMetrics });
      
      const criteriaPrompt = Object.entries(activeBenchmark.criteria)
        .map(([key, criterion]) => `- ${key}（${criterion.weight * 100}%）：${criterion.description}`)
        .join('\n');
        
      updateState({ 
        llmPrompt: 
`请评估以下AI生成的输出质量。根据以下标准进行评分（1-4分）：
${criteriaPrompt}

输入：{{input}}
实际输出：{{output}}
预期输出：{{expected_output}}

请给出1-4分的评分和简短解释：`
      });
      
      const codeEvalTemplate = generateCodeEvalTemplate(activeBenchmark.criteria);
      updateState({ codeEval: codeEvalTemplate });
    }
  }, [activeBenchmark, updateState]);

  const generateCodeEvalTemplate = (criteria: any) => {
    const criteriaCode = Object.entries(criteria)
      .map(([key, criterion]: [string, any]) => 
        `  // 评估${criterion.description} (${criterion.weight * 100}%)
  const ${key}Score = calculate${key.charAt(0).toUpperCase() + key.slice(1)}(output, expectedOutput);`
      )
      .join('\n\n');

    const weightCalculation = Object.entries(criteria)
      .map(([key, criterion]: [string, any]) => 
        `${key}Score * ${criterion.weight}`
      )
      .join(' + \n    ');

    return `function evaluateOutput(input, output, expectedOutput) {
${criteriaCode}
  
  // 计算总分
  const totalScore = 
    ${weightCalculation};
    
  return {
    score: totalScore,
    ${Object.keys(criteria).map(key => `${key}: ${key}Score`).join(',\n    ')},
    comments: generateComments(${Object.keys(criteria).map(key => `${key}Score`).join(', ')})
  };
}

// 辅助函数
${Object.keys(criteria).map(key => 
`function calculate${key.charAt(0).toUpperCase() + key.slice(1)}(output, expectedOutput) {
  // 实现${key}评估逻辑
  return 0; // 1-4分
}`
).join('\n\n')}

function generateComments(${Object.keys(criteria).map(key => `${key}Score`).join(', ')}) {
  // 生成评估意见
  return "";
}`;
  };

  const handleFileUpload = async (file: File) => {
    try {
      if (!validateFileFormat(file)) {
        throw new Error('不支持的文件格式');
      }

      const data = await parseFile(file);
      const firstSheet = Object.values(data)[0];
      
      if (!firstSheet || firstSheet.length === 0) {
        throw new Error('文件内容为空');
      }

      // 假设文件的第一行包含评分数据
      const scoreData = firstSheet[0];
      const newScores: Record<string, number> = {};

      // 尝试从文件中提取评分
      Object.keys(exampleBenchmark.criteria).forEach(criterion => {
        if (criterion in scoreData) {
          const score = Number(scoreData[criterion]);
          if (!isNaN(score) && score >= 0 && score <= 4) {
            newScores[criterion] = score;
          }
        }
      });

      if (Object.keys(newScores).length === 0) {
        throw new Error('未找到有效的评分数据');
      }

      setScores(newScores);
      setHasData(true);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AI 产品评估</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <ActiveBenchmark />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">示例评估数据</h2>
        <EvaluationTable data={state.evaluationData} />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">上传评估数据</h2>
        <p className="text-sm text-gray-600 mb-4">请上传符合评估数据格式的Excel文件，包含相同的表头结构</p>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            下载模板
          </button>
        </div>
        <FileUpload
          onFileUpload={handleFileUpload}
          accept={{
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv']
          }}
        />
        {state.fileName && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">当前文件：{state.fileName}</p>
          </div>
        )}
      </div>

      {state.tableData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">数据预览与编辑</h2>
            <div className="space-x-4">
              <button
                onClick={() => setShowEvalResult(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                查看评估结果
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
              >
                导出Excel
              </button>
            </div>
          </div>
          <EditableTable initialData={state.tableData} onDataChange={handleDataChange} />
        </div>
      )}

      {showEvalResult && (
        <div className="space-y-8">
          <EvaluationResult
            benchmark={activeBenchmark || exampleBenchmark}
            scores={scores}
          />
          <EvaluationTrends
            benchmark={activeBenchmark || exampleBenchmark}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">构建评估方式</h2>
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
            {EvaluationBuilderTypes.map((type) => (
              <Tab
                key={type.id}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {type.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">配置评估指标</h3>
                  <p className="text-sm text-gray-500 mb-4">设置每个指标的权重和是否启用</p>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(state.humanMetrics).map(([key, metric]) => {
                    if (key === 'custom' && !metric.enabled) return null;
                    
                    return (
                      <div key={key} className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox"
                            checked={metric.enabled}
                            onChange={(e) => handleHumanMetricChange(key as keyof HumanMetricsType, 'enabled', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        </div>
                        
                        {key === 'custom' && metric.enabled ? (
                          <input
                            type="text"
                            value={metric.name}
                            onChange={(e) => handleHumanMetricChange(key as keyof HumanMetricsType, 'name', e.target.value)}
                            placeholder="自定义指标名称"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex-1">
                            <span className="capitalize">{metric.name}</span>
                          </div>
                        )}
                        
                        <div className="w-24">
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={metric.weight}
                            onChange={(e) => handleHumanMetricChange(key as keyof HumanMetricsType, 'weight', parseFloat(e.target.value))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            disabled={!metric.enabled}
                          />
                        </div>
                        <div className="text-sm text-gray-500 w-16">权重</div>
                      </div>
                    );
                  })}
                  
                  {!state.humanMetrics.custom.enabled && (
                    <button
                      onClick={() => handleHumanMetricChange('custom' as keyof HumanMetricsType, 'enabled', true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + 添加自定义指标
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">评估说明</label>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    placeholder="请输入给评估人员的指导说明..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
                    生成评估表格
                  </button>
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">配置LLM评估</h3>
                  <p className="text-sm text-gray-500 mb-4">设置评估模型和提示词</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">选择评估模型</label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option>GPT-4</option>
                      <option>Claude</option>
                      <option>自定义模型</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">评估提示词</label>
                    <p className="text-xs text-gray-500">使用 {'{{input}}'}, {'{{output}}'}, {'{{expected_output}}'} 作为占位符</p>
                    <textarea
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
                      rows={12}
                      value={state.llmPrompt}
                      onChange={(e) => updateState({ llmPrompt: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
                    创建LLM评估任务
                  </button>
                </div>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-2">配置代码评估</h3>
                  <p className="text-sm text-gray-500 mb-4">编写自动评估代码</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">评估代码</label>
                  <p className="text-xs text-gray-500">代码将接收 input、output、expected_output 作为参数</p>
                  <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
                    rows={16}
                    value={state.codeEval}
                    onChange={(e) => updateState({ codeEval: e.target.value })}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
                    验证并保存评估代码
                  </button>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
} 