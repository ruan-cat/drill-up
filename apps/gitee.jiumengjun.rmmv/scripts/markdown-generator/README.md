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
const generator2 = new MarkdownGenerator(
	{},
	{
		enabled: true,
		preset: "clean",
	},
);

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
generator.enableCustomTemplates(["./custom/partials/my-signature.hbs", "./custom/partials/my-link.hbs"]);

// 方法2: 使用 TemplateManager
const templateManager = TemplateManager.createCustom(["./custom/template1.hbs", "./custom/template2.hbs"]);

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
	...jsdocOptions,
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
	"./custom-templates", // 模板目录
);

// 创建使用默认模板的生成器
const defaultGenerator = MarkdownGenerator.createWithDefaultTemplates({
	"param-list-format": "list",
});
```

### TemplateManager 工厂方法

```typescript
// 创建 clean 模板管理器
const cleanManager = TemplateManager.createClean("./templates");

// 创建自定义模板管理器
const customManager = TemplateManager.createCustom(
	["./partials/custom-signature.hbs", "./partials/custom-link.hbs"],
	"./base-templates",
);
```

## 模板文件结构

```plain
templates/
└── partials/
    └── shared/
        ├── signature/
        │   └── sig-link.hbs          # 函数签名模板
        └── value/
            ├── link.hbs              # 链接模板
            └── linked-type-list.hbs  # 类型列表模板
```

## 模板调用链关系

### 核心调用关系图

```plain
JSDoc Comments
      ↓
   jsdoc2md
      ↓
     dmd (Document Markdown)
      ↓
┌─────────────────┐
│ sig-link.hbs    │ ← 函数签名渲染入口
│ (函数签名模板)   │
└─────┬───────────┘
      ↓ 调用
┌─────────────────┐
│linked-type-list │ ← 处理返回类型列表
│  .hbs           │   (如 A | B | C)
└─────┬───────────┘
      ↓ 遍历每个类型
┌─────────────────┐
│    link.hbs     │ ← 渲染单个类型
│  (链接模板)     │   (如 CacheEntry)
└─────────────────┘
```

### 详细调用流程

#### 1. 函数签名渲染流程

```handlebars
{{! sig-link.hbs - 函数签名模板 }}
{{#if name}}{{#sig~}}
{{{@codeOpen}~}}
{{@accessSymbol}}{{name}}{{@methodSign}}
{{{@codeClose}}}
{{~#if @returnSymbol}} {{@returnSymbol}}{{/if~}}
{{#if @returnTypes}} {{>linked-type-list types=@returnTypes delimiter=" \| " }}{{/if~}}
{{~/sig}}{{/if~}}
```

**调用步骤：**

1. `sig-link.hbs` 检测到有返回类型 `@returnTypes`
2. 调用 `{{>linked-type-list types=@returnTypes delimiter=" \| " }}`
3. 将类型数组和分隔符传递给 `linked-type-list.hbs`

#### 2. 类型列表处理流程

```handlebars
{{! linked-type-list.hbs - 类型列表模板 }}
{{#each types~}}
{{>link to=this html=../html ~}}
{{#unless @last}}{{{../delimiter}}}{{/unless~}}
{{/each}}
```

**调用步骤：**

1. 遍历 `types` 数组中的每个类型
2. 对每个类型调用 `{{>link to=this html=../html}}`
3. 在类型之间插入分隔符（通常是 `|`）

#### 3. 单个类型链接渲染流程

```handlebars
{{! link.hbs - 链接模板 }}
{{~#if html~}}
<code>{{#link to~}}{{#if ../../caption}}{{../../../caption}}{{else}}{{name}}{{/if}}{{/link~}}</code>
{{~else~}}
<code>{{#link to~}}{{#if ../../caption}}{{escape ../../../caption}}{{else}}{{escape name}}{{/if}}{{/link~}}</code>
{{/if~}}
```

**调用步骤：**

1. 检查输出格式（`html` 为 true 表示 HTML 输出）
2. 使用 `{{#link to}}` helper 获取类型上下文信息
3. 输出单行紧凑格式：`<code>类型名称</code>`

**关键设计要点：**

- 所有内容在同一行，避免换行符导致的多行输出
- 保持 `{{#link to}}` helper 结构以获取正确的类型名称
- 确保 `<code>` 标签紧贴内容，无额外空白字符

### 数据流转过程

#### 原始 JSDoc 数据

```javascript
/**
 * @returns {CacheEntry} 返回此缓存条目
 */
function allocate() { ... }
```

#### 经过 jsdoc2md 解析后的数据结构

```json
{
	"name": "allocate",
	"returns": [
		{
			"type": {
				"names": ["CacheEntry"]
			},
			"description": "返回此缓存条目"
		}
	]
}
```

#### 在模板中的数据传递

1. **sig-link.hbs** 接收数据：

   ```handlebars
   @returnTypes = ["CacheEntry"] @returnSymbol = "⇒"
   ```

2. **linked-type-list.hbs** 接收数据：

   ```handlebars
   types = ["CacheEntry"] delimiter = " \| " html = true
   ```

3. **link.hbs** 接收数据：
   ```handlebars
   to = "CacheEntry" html = true caption = undefined
   ```

#### 最终输出结果

**Clean 模板输出：**

```markdown
## allocate() ⇒ <code>CacheEntry</code>
```

**原始 dmd 模板输出：**

```markdown
## allocate() ⇒ [<code>CacheEntry</code>](#CacheEntry)
```

### 格式化要求

Clean 模板确保输出为单行紧凑格式：

- ✅ 正确：`<code>CacheEntry</code>`
- ❌ 错误：`<code>\nCacheEntry\n</code>` (包含换行符)

### 模板覆盖机制

#### dmd 模板注册顺序

1. **内置模板加载**（来自 dmd 包）

   ```javascript
   handlebars.registerPartial("sig-link", defaultSigLinkTemplate);
   handlebars.registerPartial("linked-type-list", defaultLinkedTypeListTemplate);
   handlebars.registerPartial("link", defaultLinkTemplate);
   ```

2. **外部模板覆盖**（通过 `partial` 选项）
   ```javascript
   // 我们的自定义模板覆盖同名的内置模板
   handlebars.registerPartial("sig-link", customSigLinkTemplate);
   handlebars.registerPartial("linked-type-list", customLinkedTypeListTemplate);
   handlebars.registerPartial("link", customLinkTemplate);
   ```

#### 覆盖后的调用流程保持不变

即使模板内容被覆盖，调用关系和数据流转方式完全相同：

- `sig-link.hbs` 仍然调用 `linked-type-list`
- `linked-type-list.hbs` 仍然调用 `link`
- 只是具体的渲染逻辑发生了改变

### 关键设计要点

#### 1. 保持调用接口不变

```handlebars
{{! 无论如何修改，这些调用接口必须保持一致 }}
{{>linked-type-list types=@returnTypes delimiter=" \| " }}
{{>link to=this html=../html}}
```

#### 2. 数据上下文传递

```handlebars
{{! linked-type-list.hbs 必须正确传递上下文 }}
{{#each types~}}
{{>link to=this html=../html ~}}  <!-- 传递 html 参数 -->
{{/each}}
```

#### 3. Helper 依赖关系

```handlebars
{{! link.hbs 依赖 dmd 提供的 link helper }}
{{#link to~}}
	{{name}}
	<!-- name 变量由 link helper 提供 -->
{{/link~}}
```

这个调用链关系确保了即使我们覆盖了模板内容，整个渲染流程仍然能够正常工作，只是输出格式从包含锚点链接变成了纯代码标签格式。

### 常见问题与解决方案

#### 问题 1：输出包含换行符

**问题现象：**

```markdown
## allocate() ⇒ <code>

CacheEntry
</code>
```

**原因：** 模板中 `<code>` 标签内包含换行符

**解决方案：** 确保模板为单行格式

```handlebars
<!-- 错误的多行格式 -->
<code>
	{{#link to~}}
		{{name}}
	{{/link~}}
</code>

<!-- 正确的单行格式 -->
<code>{{#link to~}}{{name}}{{/link~}}</code>
```

#### 问题 2：类型名称为空

**问题现象：**

```markdown
## allocate() ⇒ <code></code>
```

**原因：** 缺少 `{{#link to}}` helper 上下文，`name` 变量未定义

**解决方案：** 保持 helper 结构完整

```handlebars
<!-- 错误：缺少 link helper -->
<code>{{name}}</code>

<!-- 正确：保持 helper 结构 -->
<code>{{#link to~}}{{name}}{{/link~}}</code>
```

#### 问题 3：html 参数未传递

**问题现象：** 输出格式不一致或异常

**原因：** `linked-type-list.hbs` 未传递 `html` 参数给 `link.hbs`

**解决方案：** 确保参数正确传递

```handlebars
<!-- linked-type-list.hbs 中必须传递 html 参数 -->
{{#each types~}}
{{>link to=this html=../html ~}}
{{/each}}
```

#### 问题 4：表格格式错乱 (MD056)

**问题现象：**

```markdown
| Param                          | Type                | Description |
| ------------------------------ | ------------------- | ----------- |
| cache                          | <code>Object</code> |
| 缓存管理器 - The cache manager |
```

**原因：** 缺少 URL 检查逻辑导致在不同上下文中渲染不一致

**解决方案：** 恢复完整的 URL 检查逻辑

```handlebars
{{! 修复前：缺少 url 检查 }}
<code>{{#link to~}}{{name}}{{/link~}}</code>

{{! 修复后：保持完整的条件逻辑 }}
{{~#if html~}}
	<code>{{#link to~}}{{#if url~}}{{name}}{{~else~}}{{name}}{{/if~}}{{/link~}}</code>
{{~else~}}
	{{#link to~}}
		{{#if url~}}<code>{{name}}</code>{{~else~}}<code>{{name}}</code>{{~/if~}}
	{{/link~}}
{{/if~}}
```

**修复效果：**

```markdown
| Param | Type                | Description                    |
| ----- | ------------------- | ------------------------------ |
| cache | <code>Object</code> | 缓存管理器 - The cache manager |
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
generator.enableCustomTemplates(["./templates/custom-link.hbs"], "./templates");
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

### 1. 模板开发原则

#### 格式化原则

```handlebars
<!-- 1. 单行输出，避免不必要的换行符 -->
<code>{{#link to~}}{{name}}{{/link~}}</code>

<!-- 2. 保持 helper 结构完整 -->
{{#link to~}}
  {{name}}  <!-- 依赖 helper 提供的上下文 -->
{{/link~}}

<!-- 3. 正确传递参数 -->
{{>link to=this html=../html ~}}
```

#### 调试技巧

```handlebars
<!-- 1. 使用注释标记模板版本 -->
{{! 修改后的链接模板 v2.0 - 单行输出 }}

<!-- 2. 添加条件调试输出 -->
{{#if debug}}DEBUG: name={{name}}, html={{html}}{{/if}}

<!-- 3. 使用 Handlebars 内置 helper 检查数据 -->
{{#with this}}{{#each .}}{{@key}}: {{this}}, {{/each}}{{/with}}
```

### 2. 推荐的使用方式

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
const results = await Promise.all(files.map((file) => generator.generateMarkdown(file)));
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
	templatesBaseDir: path.join(__dirname, "templates"),
};

const JSDOC_OPTIONS = {
	"heading-depth": 2,
	"param-list-format": "table",
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

## 版本历史

### v2.0 - 2024/12 (当前版本)

**新特性：**

- ✅ 完整的模板管理系统，支持预设和自定义模板
- ✅ 单行紧凑输出格式：`<code>CacheEntry</code>`
- ✅ 完整的调用链关系文档和故障排除指南
- ✅ 工厂方法和最佳实践指导

**修复：**

- 🐛 修复换行符导致多行输出的问题
- 🐛 修复缺少 `{{#link to}}` helper 导致类型名称为空的问题
- 🐛 修复 `html` 参数未正确传递的问题
- 🐛 修复表格格式错乱问题 (MD056/table-column-count)
- 🐛 修复缺少 URL 检查逻辑导致的渲染不一致问题

**技术改进：**

- 🔧 ES 模块兼容性（`__dirname` 替代方案）
- 🔧 集中化路径管理和模板路径构建
- 🔧 完整的模板验证机制

### v1.0 - 初始版本

**基础功能：**

- 基于 jsdoc2md 的文档生成
- 简单的模板覆盖机制
- 基础的错误处理

## 故障排除

### 快速诊断清单

1. **检查模板文件**

   ```bash
   # 验证模板文件存在
   ls templates/partials/shared/value/link.hbs
   ls templates/partials/shared/value/linked-type-list.hbs
   ls templates/partials/shared/signature/sig-link.hbs
   ```

2. **验证输出格式**

   ```typescript
   const validation = await generator.validateTemplates();
   console.log("验证结果:", validation);
   ```

3. **检查生成结果**

   ```bash
   # 查看具体的输出文件
   cat docs/jsdoc/rpg_core/CacheEntry.md | grep "allocate"

   # 检查表格格式是否正确
   cat docs/jsdoc/rpg_core/CacheEntry.md | grep -A 10 "| Param | Type | Description |"

   # 验证Markdown语法
   markdownlint docs/jsdoc/rpg_core/CacheEntry.md
   ```

### 获取帮助

如遇到问题，请检查：

1. 模板文件路径是否正确
2. jsdoc2md 版本是否兼容
3. JSDoc 注释格式是否符合规范
4. 表格格式是否符合 Markdown 标准
5. URL 检查逻辑是否完整
6. 参考本文档的"常见问题与解决方案"章节

**常见错误类型：**

- **函数签名多行输出**: 检查 `link.hbs` 单行格式
- **类型名称为空**: 检查 `{{#link to}}` helper 结构
- **表格列数不匹配 (MD056)**: 检查 URL 检查逻辑
- **参数表格错乱**: 检查 HTML/非 HTML 模式的条件逻辑

---

**最后更新：** 2024 年 12 月  
**维护者：** Claude Code Assistant  
**文档版本：** 2.0
