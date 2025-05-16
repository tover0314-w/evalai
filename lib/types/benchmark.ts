export type BenchmarkLevel = {
  score: number;
  description: string;
};

export type BenchmarkCriteria = {
  weight: number;
  description: string;
  levels: BenchmarkLevel[];
  enabled?: boolean;
};

export type BenchmarkDimension = {
  name: string;
  description: string;
  weight: number;
};

export type AIProductInfo = {
  name: string;
  description: string;
  features: string[];
  targetUsers: string[];
  useCase: string;
  technicalDetails?: string;
};

export type Benchmark = {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, BenchmarkCriteria>;
  createdAt: string;
  updatedAt: string;
  source?: 'template' | 'custom' | 'ai-generated' | 'import';
};

export type BenchmarkTemplate = {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, BenchmarkCriteria>;
}; 