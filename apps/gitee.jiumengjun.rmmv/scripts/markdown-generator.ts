import jsdoc2md from "jsdoc-to-markdown";
import * as fs from "fs/promises";
import * as path from "path";
import { ensureDirectoryExists, FileInfo, logProgress } from "./utils.js";

type JsdocOptions = {
	"example-lang"?: string;
	"param-list-format"?: string;
	"property-list-format"?: string;
	"member-index-format"?: string;
	"module-index-format"?: string;
	"global-index-format"?: string;
	"heading-depth"?: number;
	"no-gfm"?: boolean;
	separators?: boolean;
	files?: string[];
};

export class MarkdownGenerator {
	private readonly options: JsdocOptions;

	constructor(options: Partial<JsdocOptions> = {}) {
		this.options = {
			"example-lang": "js",
			"param-list-format": "table",
			"property-list-format": "table",
			"member-index-format": "grouped",
			"module-index-format": "table",
			"global-index-format": "table",
			"heading-depth": 1,
			"no-gfm": false,
			separators: true,
			...options,
		};
	}

	async generateMarkdown(filePath: string): Promise<string> {
		try {
			const markdown = await jsdoc2md.render({
				...this.options,
				files: [filePath],
			});

			if (!markdown.trim()) {
				return this.createEmptyDocumentation(filePath);
			}

			return markdown;
		} catch (error) {
			console.warn(`Warning: Failed to generate JSDoc for ${filePath}:`, error);
			return this.createErrorDocumentation(filePath, error);
		}
	}

	async saveMarkdown(fileInfo: FileInfo, content: string): Promise<void> {
		const outputDir = path.dirname(fileInfo.outputPath);
		await ensureDirectoryExists(outputDir);
		await fs.writeFile(fileInfo.outputPath, content, "utf-8");
	}

	private createEmptyDocumentation(filePath: string): string {
		const fileName = path.basename(filePath);
		return `# ${fileName}

> This file currently has no JSDoc documentation.

**Source:** \`${fileName}\`

## Description

This file appears to contain JavaScript code but no JSDoc comments were found to generate documentation.

To add documentation, please add JSDoc comments to the functions, classes, and methods in this file.

## Example JSDoc Format

\`\`\`javascript
/**
 * Description of the function
 * @param {type} paramName - Description of the parameter
 * @returns {type} Description of the return value
 */
function exampleFunction(paramName) {
  // function implementation
}
\`\`\`
`;
	}

	private createErrorDocumentation(filePath: string, error: any): string {
		const fileName = path.basename(filePath);
		return `# ${fileName}

> Documentation generation failed for this file.

**Source:** \`${fileName}\`

## Error

An error occurred while trying to generate documentation for this file:

\`\`\`
${error.message || "Unknown error"}
\`\`\`

## Suggestions

1. Check if the file contains valid JavaScript syntax
2. Verify that JSDoc comments are properly formatted
3. Ensure the file is not corrupted or empty

Please review the source file and try again.
`;
	}
}
