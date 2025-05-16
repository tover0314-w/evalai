// 评估数据类型
export type EvaluationDataType = {
  id: string;
  prompt: string;
  input: string;
  output: string;
  expected_output: string;
  llm_score: number;
  human_score: number;
  code_score: number;
  benchmark_score: number;
  comments: string;
};

// 评估指标类型
export type MetricType = {
  weight: number;
  enabled: boolean;
  name: string;
};

export type HumanMetricsType = {
  accuracy: MetricType;
  completeness: MetricType;
  efficiency: MetricType;
  custom: MetricType;
};

export const EvaluationBuilderTypes = [
  { id: 'human', name: '构建人工评估' },
  { id: 'llm', name: '构建LLM评估' },
  { id: 'code', name: '构建代码评估' },
] as const;

export type EvaluationBuilderType = typeof EvaluationBuilderTypes[number]['id']; 