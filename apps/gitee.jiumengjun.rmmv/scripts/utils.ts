import * as path from 'path';
import * as fs from 'fs/promises';

export interface FileInfo {
  sourcePath: string;
  relativePath: string;
  outputPath: string;
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function getAllJsFiles(sourceDir: string): Promise<string[]> {
  const files: string[] = [];
  
  async function scanDirectory(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  }
  
  await scanDirectory(sourceDir);
  return files;
}

export function createFileInfo(sourcePath: string, sourceDir: string, outputDir: string): FileInfo {
  const relativePath = path.relative(sourceDir, sourcePath);
  const outputPath = path.join(outputDir, relativePath.replace(/\.js$/, '.md'));
  
  return {
    sourcePath,
    relativePath,
    outputPath
  };
}

export function logProgress(current: number, total: number, fileName: string): void {
  const percentage = ((current / total) * 100).toFixed(1);
  console.log(`[${current}/${total}] (${percentage}%) Processing: ${fileName}`);
}