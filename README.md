# AI产品评估平台

一个专业的AI产品评估与数据集生成平台，帮助开发者更好地评估和改进AI产品。

## 主要功能

### 1. AI产品评估
- 支持多种评估方式：
  - 人工评估：自定义评分标准和评估说明
  - LLM自动评估：使用GPT-4、Claude等模型进行自动评估
  - 代码评估：通过自定义代码进行评估

### 2. 数据集生成
- AI辅助生成测试数据集
- 支持自定义生成模板
- 批量生成能力

### 3. 评估记录
- 查看历史评估记录
- 追踪性能变化趋势
- 导出评估报告

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Headless UI

## 开始使用

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 项目结构

```
ai-eval-platform/
├── app/                # Next.js 应用目录
│   ├── evaluate/      # 评估功能页面
│   ├── dataset/       # 数据集生成页面
│   └── dashboard/     # 评估记录页面
├── components/        # 可复用组件
├── public/           # 静态资源
└── styles/          # 样式文件
```

## 使用说明

### 评估AI产品

1. 进入评估中心
2. 上传评估数据（JSON格式）
3. 选择评估方式
4. 配置评估参数
5. 开始评估

### 生成数据集

1. 进入数据集生成页面
2. 填写数据集信息
3. 设置生成模板
4. 指定生成数量
5. 开始生成

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目。

## 许可证

MIT 