import { create } from 'zustand';
import type { EvaluationDataType } from '../types/evaluation';
import type { Benchmark } from '../types/benchmark';

interface EvaluationStore {
  // 当前评估数据
  currentEvaluation: EvaluationDataType[] | null;
  // 评估历史记录
  evaluationHistory: {
    date: string;
    benchmark: Benchmark;
    data: EvaluationDataType[];
    scores: Record<string, number>;
  }[];
  // 最近查看的报告
  recentReports: {
    id: string;
    benchmarkId: string;
    date: string;
    scores: Record<string, number>;
  }[];
  // 操作方法
  setCurrentEvaluation: (data: EvaluationDataType[] | null) => void;
  addEvaluationHistory: (history: { benchmark: Benchmark; data: EvaluationDataType[]; scores: Record<string, number> }) => void;
  addRecentReport: (report: { benchmarkId: string; scores: Record<string, number> }) => void;
  clearCurrentEvaluation: () => void;
}

export const useEvaluationStore = create<EvaluationStore>((set) => ({
  currentEvaluation: null,
  evaluationHistory: [],
  recentReports: [],

  setCurrentEvaluation: (data) => set({ currentEvaluation: data }),
  
  addEvaluationHistory: (history) => set((state) => ({
    evaluationHistory: [
      {
        date: new Date().toISOString(),
        ...history,
      },
      ...state.evaluationHistory,
    ].slice(0, 10), // 只保留最近10条记录
  })),
  
  addRecentReport: (report) => set((state) => ({
    recentReports: [
      {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        ...report,
      },
      ...state.recentReports,
    ].slice(0, 5), // 只保留最近5条记录
  })),
  
  clearCurrentEvaluation: () => set({ currentEvaluation: null }),
})); 