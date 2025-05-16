import { create } from 'zustand';
import { persist, type StateStorage } from 'zustand/middleware';
import { Benchmark } from '../types/benchmark';

interface BenchmarkState {
  benchmarks: Benchmark[];
  activeBenchmarkId: string | null;
}

interface BenchmarkActions {
  addBenchmark: (benchmark: Benchmark) => void;
  updateBenchmark: (id: string, benchmark: Partial<Benchmark>) => void;
  deleteBenchmark: (id: string) => void;
  setActiveBenchmark: (id: string | null) => void;
  getBenchmark: (id: string) => Benchmark | undefined;
}

type BenchmarkStore = BenchmarkState & BenchmarkActions;

export const useBenchmarkStore = create<BenchmarkStore>()(
  persist(
    (set, get) => ({
      benchmarks: [],
      activeBenchmarkId: null,

      addBenchmark: (benchmark: Benchmark) =>
        set((state) => ({
          benchmarks: [...state.benchmarks, benchmark],
        })),

      updateBenchmark: (id: string, updatedBenchmark: Partial<Benchmark>) =>
        set((state) => ({
          benchmarks: state.benchmarks.map((benchmark) =>
            benchmark.id === id
              ? { ...benchmark, ...updatedBenchmark, updatedAt: new Date().toISOString() }
              : benchmark
          ),
        })),

      deleteBenchmark: (id: string) =>
        set((state) => ({
          benchmarks: state.benchmarks.filter((benchmark) => benchmark.id !== id),
          activeBenchmarkId: state.activeBenchmarkId === id ? null : state.activeBenchmarkId,
        })),

      setActiveBenchmark: (id: string | null) =>
        set({
          activeBenchmarkId: id,
        }),

      getBenchmark: (id: string) => {
        const state = get();
        return state.benchmarks.find((benchmark) => benchmark.id === id);
      },
    }),
    {
      name: 'benchmark-storage',
    }
  )
); 