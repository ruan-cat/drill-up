# Bug 002: 缺少结束标签错误

## 问题描述

在运行 `pnpm docs:build` 命令时，构建失败并报告以下错误：

```
[vite:vue] [plugin vite:vue] docs/jsdoc/rpg_managers/DataManager.md (441:110): Element is missing end tag.
```

## 问题定位

经过深入分析，问题出现在 `docs/jsdoc/rpg_managers/DataManager.md` 文件的第563-564行：

```markdown
从备注字符串中提取<key:value>或<key>格式的元数据。
Extracts metadata from note strings in <key:value> or <key> format.
```

## 根本原因

1. **VitePress + Vue 解析器的误解**：项目使用 VitePress 构建文档，VitePress 基于 Vue，会解析 Markdown 文件中的 HTML 标签
2. **未转义的尖括号**：文件中的 `<key:value>` 和 `<key>` 被 Vue 解析器误认为是 HTML 元素
3. **缺少闭合标签**：由于这些不是真正的 HTML 标签，所以没有对应的闭合标签，导致解析错误
4. **JSDoc 生成的内容**：这些内容是通过 JSDoc 自动生成的文档，其中包含了未转义的尖括号字符

## 问题影响

- 阻止文档构建完成
- 影响 CI/CD 流程
- 阻止文档网站的部署

## 解决方案

### 方案一：手动转义HTML字符（临时解决方案）

将第563-564行的内容修改为：

```markdown
从备注字符串中提取&lt;key:value&gt;或&lt;key&gt;格式的元数据。
Extracts metadata from note strings in &lt;key:value&gt; or &lt;key&gt; format.
```

### 方案二：修改JSDoc生成逻辑（推荐的永久解决方案）

修改 `scripts/markdown-generator/index.ts` 文件，在生成 Markdown 内容时自动转义 HTML 特殊字符。

### 方案三：配置VitePress忽略特定标签

在 `.vitepress/config.mts` 中配置 Vue 编译选项，让Vue忽略包含冒号的标签。

## 预防措施

1. **自动化检查**：添加构建前的 HTML 标签验证脚本
2. **JSDoc 配置优化**：配置 JSDoc 生成器自动转义 HTML 字符
3. **测试覆盖**：在 CI/CD 流程中包含文档构建测试
4. **代码审查**：在代码审查中注意检查 Markdown 文件中的 HTML 字符

## 修复记录

- **发现时间**：2025-08-28
- **影响范围**：文档构建流程
- **修复方式**：[待选择上述方案之一]
- **验证方法**：运行 `pnpm docs:build` 确认构建成功

## 相关文件

- `docs/jsdoc/rpg_managers/DataManager.md` - 问题文件
- `scripts/markdown-generator/index.ts` - JSDoc 生成器
- `.vitepress/config.mts` - VitePress 配置