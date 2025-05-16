import { BenchmarkTemplate } from '../types/benchmark';

export const defaultBenchmarkTemplates: BenchmarkTemplate[] = [
  {
    id: 'text-generation',
    name: '文本生成评估基准',
    description: '用于评估AI文本生成任务的质量',
    criteria: {
      accuracy: {
        weight: 0.4,
        description: '输出结果与预期结果的匹配程度',
        levels: [
          { score: 1, description: '完全不匹配预期结果' },
          { score: 2, description: '部分匹配，但有重大偏差' },
          { score: 3, description: '基本匹配，有minor偏差' },
          { score: 4, description: '完全匹配预期结果' },
        ],
      },
      completeness: {
        weight: 0.3,
        description: '输出是否完整地解决了问题',
        levels: [
          { score: 1, description: '未解决核心问题' },
          { score: 2, description: '部分解决核心问题' },
          { score: 3, description: '完整解决核心问题，但缺少细节' },
          { score: 4, description: '完整解决问题，包含所有必要细节' },
        ],
      },
      efficiency: {
        weight: 0.3,
        description: '解决问题的效率和资源使用情况',
        levels: [
          { score: 1, description: '效率极低，资源使用过度' },
          { score: 2, description: '效率一般，资源使用较多' },
          { score: 3, description: '效率良好，资源使用合理' },
          { score: 4, description: '效率极高，资源使用优化' },
        ],
      },
    },
  },
  {
    id: 'code-generation',
    name: '代码生成评估基准',
    description: '用于评估AI代码生成任务的质量',
    criteria: {
      functionality: {
        weight: 0.35,
        description: '代码的功能正确性',
        levels: [
          { score: 1, description: '代码无法运行或功能完全错误' },
          { score: 2, description: '代码可运行但功能有重大问题' },
          { score: 3, description: '代码功能基本正确，有小问题' },
          { score: 4, description: '代码功能完全正确' },
        ],
      },
      readability: {
        weight: 0.25,
        description: '代码的可读性和维护性',
        levels: [
          { score: 1, description: '代码混乱，难以理解' },
          { score: 2, description: '代码结构欠佳，可读性较差' },
          { score: 3, description: '代码结构清晰，可读性好' },
          { score: 4, description: '代码优雅，易于理解和维护' },
        ],
      },
      efficiency: {
        weight: 0.25,
        description: '代码的执行效率',
        levels: [
          { score: 1, description: '性能极差，存在明显的效率问题' },
          { score: 2, description: '性能一般，有优化空间' },
          { score: 3, description: '性能良好，基本优化' },
          { score: 4, description: '性能优秀，高度优化' },
        ],
      },
      security: {
        weight: 0.15,
        description: '代码的安全性',
        levels: [
          { score: 1, description: '存在严重安全漏洞' },
          { score: 2, description: '存在潜在安全风险' },
          { score: 3, description: '基本安全，有小的改进空间' },
          { score: 4, description: '完全符合安全最佳实践' },
        ],
      },
    },
  },
]; 