# Markdown 生成器使用指南

基于 jsdoc2md 的 Markdown 文档生成器，支持预设和自定义模板。

## 架构设计

### 核心组件

- **MarkdownGenerator**: 主要的文档生成器类，负责 JSDoc 到 Markdown 的转换
- **TemplateManager**: 专门负责模板管理，支持预设和自定义模板
- **Templates**: 预设的 Handlebars 模板文件，用于覆盖默认的 dmd 模板

### 设计原则

1. **关注点分离**: 生成逻辑与模板管理分离
2. **简单易用**: 提供简洁的 API 和工厂方法
3. **灵活配置**: 支持预设模板和完全自定义模板

## 基础使用

### 1. 默认使用（使用 dmd 默认模板）

```typescript
import { MarkdownGenerator } from "./markdown-generator.js";

const generator = new MarkdownGenerator();
const markdown = await generator.generateMarkdown("./src/example.js");
```

### 2. 使用 Clean 模板（无锚点链接）

```typescript
import { MarkdownGenerator } from "./markdown-generator.js";

// 方法1: 使用工厂方法（推荐）
const generator = MarkdownGenerator.createWithCleanTemplates();

// 方法2: 构造时配置
const generator2 = new MarkdownGenerator({}, {
  enabled: true,
  preset: "clean"
});

// 方法3: 动态启用
const generator3 = new MarkdownGenerator();
generator3.enablePresetTemplates("clean");

const markdown = await generator.generateMarkdown("./src/example.js");
```

### 3. 使用自定义模板

```typescript
import { TemplateManager, MarkdownGenerator } from "./markdown-generator.js";

// 方法1: 通过 MarkdownGenerator 直接设置
const generator = new MarkdownGenerator();
generator.enableCustomTemplates([
  "./custom/partials/my-signature.hbs",
  "./custom/partials/my-link.hbs"
]);

// 方法2: 使用 TemplateManager
const templateManager = TemplateManager.createCustom([
  "./custom/template1.hbs",
  "./custom/template2.hbs"
]);

const generator2 = new MarkdownGenerator({}, templateManager.getConfig());
```

## 预设模板

### Clean 模板特性

- **无锚点链接**: 返回类型显示为 `<code>TypeName</code>` 而非 `[<code>TypeName</code>](#TypeName)`
- **简洁输出**: 移除所有内部链接引用，适用于 VitePress 等静态文档工具
- **保持结构**: 保持原有的文档结构和格式

### 效果对比

**默认模板输出:**
```markdown
## allocate() ⇒ [<code>CacheEntry</code>](#CacheEntry)
```

**Clean 模板输出:**
```markdown
## allocate() ⇒ <code>CacheEntry</code>
```

## 高级用法

### 1. 模板验证

```typescript
const generator = MarkdownGenerator.createWithCleanTemplates();

// 验证模板文件是否存在
const validation = await generator.validateTemplates();
if (!validation.valid) {
  console.error("模板验证失败:", validation.missingFiles);
}
```

### 2. 模板管理器单独使用

```typescript
import { TemplateManager } from "./template-manager.js";

// 创建模板管理器
const manager = TemplateManager.createClean();

// 获取 jsdoc2md 配置
const jsdocOptions = manager.buildJsdocOptions();

// 直接用于 jsdoc2md
const jsdoc2md = require("jsdoc-to-markdown");
const output = await jsdoc2md.render({
  files: "src/**/*.js",
  ...jsdocOptions
});
```

### 3. 配置信息查看

```typescript
const generator = MarkdownGenerator.createWithCleanTemplates();

// 检查状态
console.log("是否启用模板:", generator.isUsingTemplates());

// 获取配置信息
const config = generator.getTemplateConfig();
console.log("当前配置:", config);

// 获取模板文件列表
const templateManager = generator.getTemplateManager();
const files = templateManager.getTemplateFiles();
console.log("使用的模板文件:", files);
```

## 工厂方法

### MarkdownGenerator 工厂方法

```typescript
// 创建使用 clean 模板的生成器
const cleanGenerator = MarkdownGenerator.createWithCleanTemplates(
  { "heading-depth": 3 }, // jsdoc 选项
  "./custom-templates"    // 模板目录
);

// 创建使用默认模板的生成器
const defaultGenerator = MarkdownGenerator.createWithDefaultTemplates({
  "param-list-format": "list"
});
```

### TemplateManager 工厂方法

```typescript
// 创建 clean 模板管理器
const cleanManager = TemplateManager.createClean("./templates");

// 创建自定义模板管理器
const customManager = TemplateManager.createCustom([
  "./partials/custom-signature.hbs",
  "./partials/custom-link.hbs"
], "./base-templates");
```

## 模板文件结构

```
templates/
└── partials/
    └── shared/
        ├── signature/
        │   └── sig-link.hbs          # 函数签名模板
        └── value/
            ├── link.hbs              # 链接模板
            └── linked-type-list.hbs  # 类型列表模板
```

## 自定义模板开发

### 1. 理解覆盖机制

dmd 通过文件名注册 Handlebars partial，同名的外部模板会覆盖内置模板。

### 2. 模板文件命名

模板文件名（去除 `.hbs` 后缀）必须与要覆盖的内置模板名一致：

- `sig-link.hbs` → 覆盖函数签名模板
- `link.hbs` → 覆盖链接生成模板
- `linked-type-list.hbs` → 覆盖类型列表模板

### 3. 创建自定义模板

```handlebars
{{! custom-link.hbs - 自定义链接模板 }}
{{#if html}}
  <span class="custom-type">{{name}}</span>
{{else}}
  **{{name}}**
{{/if}}
```

使用自定义模板：

```typescript
const generator = new MarkdownGenerator();
generator.enableCustomTemplates([
  "./templates/custom-link.hbs"
], "./templates");
```

## 错误处理

```typescript
const generator = MarkdownGenerator.createWithCleanTemplates();

try {
  // 验证模板
  const validation = await generator.validateTemplates();
  if (!validation.valid) {
    throw new Error(`模板文件缺失: ${validation.missingFiles.join(", ")}`);
  }
  
  // 生成文档
  const markdown = await generator.generateMarkdown("./src/example.js");
  
} catch (error) {
  console.error("生成失败:", error.message);
  
  // 回退到默认模板
  generator.disableTemplates();
  const fallbackMarkdown = await generator.generateMarkdown("./src/example.js");
}
```

## 最佳实践

### 1. 推荐的使用方式

```typescript
// 1. 优先使用工厂方法
const generator = MarkdownGenerator.createWithCleanTemplates();

// 2. 验证模板后再使用
const validation = await generator.validateTemplates();
if (validation.valid) {
  const markdown = await generator.generateMarkdown(filePath);
}

// 3. 批量处理时复用生成器实例
const files = ["file1.js", "file2.js", "file3.js"];
const results = await Promise.all(
  files.map(file => generator.generateMarkdown(file))
);
```

### 2. 性能优化

```typescript
// 避免重复创建实例
const generator = MarkdownGenerator.createWithCleanTemplates();

// 一次性验证所有模板
await generator.validateTemplates();

// 批量处理
const markdownPromises = inputFiles.map(async (filePath) => {
  return await generator.generateMarkdown(filePath);
});

const results = await Promise.all(markdownPromises);
```

### 3. 配置管理

```typescript
// 将配置提取为常量
const TEMPLATE_CONFIG = {
  enabled: true,
  preset: "clean" as const,
  templatesBaseDir: path.join(__dirname, "templates")
};

const JSDOC_OPTIONS = {
  "heading-depth": 2,
  "param-list-format": "table"
};

const generator = new MarkdownGenerator(JSDOC_OPTIONS, TEMPLATE_CONFIG);
```

## API 参考

### MarkdownGenerator

#### 构造函数
```typescript
constructor(options?: Partial<JsdocOptions>, templateConfig?: Partial<TemplateManagerConfig>)
```

#### 主要方法
- `generateMarkdown(filePath: string): Promise<string>` - 生成 Markdown
- `enablePresetTemplates(preset: PresetTemplate, templatesDir?: string): void` - 启用预设模板
- `enableCustomTemplates(partialPaths: string[], templatesDir?: string): void` - 启用自定义模板
- `disableTemplates(): void` - 禁用所有模板
- `validateTemplates(): Promise<{valid: boolean, missingFiles: string[]}>` - 验证模板

#### 静态方法
- `createWithCleanTemplates(options?, templatesDir?)` - 创建 clean 模板生成器
- `createWithDefaultTemplates(options?)` - 创建默认模板生成器

### TemplateManager

#### 构造函数
```typescript
constructor(config?: Partial<TemplateManagerConfig>)
```

#### 主要方法
- `enablePreset(preset: PresetTemplate, templatesDir?: string): void` - 启用预设
- `enableCustom(partials: string[], templatesDir?: string): void` - 启用自定义
- `buildJsdocOptions(): JsdocTemplateOptions` - 构建 jsdoc2md 选项
- `validateTemplates(): Promise<{valid: boolean, missingFiles: string[]}>` - 验证模板

#### 静态方法
- `createClean(templatesDir?)` - 创建 clean 模板管理器
- `createCustom(partials, templatesDir?)` - 创建自定义模板管理器

这个架构提供了简单易用的 API，同时保持了高度的灵活性和可扩展性。