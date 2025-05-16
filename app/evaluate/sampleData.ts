import { EvaluationData } from '@/components/EvaluationTable';

export const sampleEvaluationData: EvaluationData[] = [
  {
    id: '1',
    prompt: '请帮我总结这篇文章的主要观点',
    input: '人工智能正在改变我们的生活方式。从智能手机助手到自动驾驶汽车，AI技术已经渗透到了日常生活的方方面面。然而，这种变革也带来了一些担忧，比如就业机会减少、隐私安全等问题。专家认为，关键是要在发展AI技术的同时，建立相应的伦理准则和监管框架。',
    output: '文章主要讨论了AI对生活的影响，包括：1. AI技术在日常生活中的应用 2. AI带来的潜在问题 3. 需要建立伦理准则和监管',
    expected_output: '文章主要观点：1. AI技术广泛应用于日常生活 2. AI发展带来就业和隐私等担忧 3. 建议建立伦理准则和监管框架来应对挑战',
    llm_score: 3.5,
    human_score: 3.8,
    code_score: 3.6,
    benchmark_score: 3.6,
    comments: '总结基本准确，但可以更好地保持原文的表达方式',
  },
  {
    id: '2',
    prompt: '编写一个简单的计算器函数',
    input: '需要一个能执行基本数学运算（加减乘除）的函数',
    output: `function calculator(a: number, b: number, op: string): number {
  switch(op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : NaN;
    default: throw new Error('Invalid operator');
  }
}`,
    expected_output: `function calculator(a: number, b: number, op: string): number {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
  throw new Error('Invalid operator');
}`,
    llm_score: 3.2,
    human_score: 3.0,
    code_score: 3.5,
    benchmark_score: 3.2,
    comments: '基本功能正确，但错误处理可以改进，代码结构可以优化',
  },
  {
    id: '3',
    prompt: '生成一个创建用户API的OpenAPI规范',
    input: '需要一个创建新用户的API端点，包含用户名、邮箱和密码字段',
    output: `openapi: 3.0.0
paths:
  /users:
    post:
      summary: Create user
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                username: { type: string }
                email: { type: string }
                password: { type: string }`,
    expected_output: `openapi: 3.0.0
paths:
  /users:
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [username, email, password]
              properties:
                username: { type: string, minLength: 3 }
                email: { type: string, format: email }
                password: { type: string, minLength: 8 }
      responses:
        201:
          description: User created successfully`,
    llm_score: 2.8,
    human_score: 2.5,
    code_score: 2.7,
    benchmark_score: 2.7,
    comments: '缺少必要的验证规则和响应定义，安全性考虑不足',
  }
]; 