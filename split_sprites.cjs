const fs = require('fs');
const path = require('path');

// 读取原始文件
const sourceFile = 'D:\\code\\github-desktop-store\\gh.ruancat.drill-up.v3.62\\apps\\gitee.jiumengjun.rmmv\\rpg_sprites.js';
const targetDir = 'D:\\code\\github-desktop-store\\gh.ruancat.drill-up.v3.62\\apps\\gitee.jiumengjun.rmmv\\sourceCodeFile\\rpg_sprites';

try {
    const content = fs.readFileSync(sourceFile, 'utf8');
    const lines = content.split('\n');
    
    // 查找所有类的开始行
    const classStarts = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('function Sprite_') || line.startsWith('function Spriteset_')) {
            const match = line.match(/function (Sprite_\w+|Spriteset_\w+)/);
            if (match) {
                classStarts.push({
                    name: match[1],
                    startLine: i,
                    functionLine: i
                });
            }
        }
    }
    
    // 为每个类找到结束行
    for (let i = 0; i < classStarts.length; i++) {
        const current = classStarts[i];
        let endLine = lines.length - 1;
        
        // 查找下一个类的开始位置或//----------分隔符
        for (let j = current.startLine + 1; j < lines.length; j++) {
            if (lines[j].startsWith('//-----------------------------------------------------------------------------')) {
                // 检查这个分隔符后面是否跟着新的类
                for (let k = j + 1; k < j + 10 && k < lines.length; k++) {
                    if (lines[k].trim().startsWith('function Sprite_') || lines[k].trim().startsWith('function Spriteset_')) {
                        endLine = j - 1;
                        break;
                    }
                }
                if (endLine !== lines.length - 1) break;
            }
        }
        
        current.endLine = endLine;
    }
    
    // 处理每个类
    let remainingContent = lines.slice();
    
    classStarts.reverse().forEach(classInfo => {
        console.log(`Processing ${classInfo.name} (lines ${classInfo.startLine}-${classInfo.endLine})`);
        
        // 找到类的注释开始行
        let commentStartLine = classInfo.startLine;
        for (let i = classInfo.startLine - 1; i >= 0; i--) {
            if (lines[i].trim().startsWith('//-----------------------------------------------------------------------------')) {
                commentStartLine = i;
                break;
            }
        }
        
        // 提取类的内容
        const classLines = lines.slice(commentStartLine, classInfo.endLine + 1);
        
        // 创建文件内容
        const fileContent = [
            `//=============================================================================`,
            `// ${classInfo.name}.js`,
            `//=============================================================================`,
            '',
            ...classLines.filter(line => line.trim() !== '')
        ].join('\n');
        
        // 写入文件
        const filePath = path.join(targetDir, `${classInfo.name}.js`);
        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`Created: ${filePath}`);
        
        // 从原始内容中删除这个类
        remainingContent.splice(commentStartLine, classInfo.endLine - commentStartLine + 1);
    });
    
    // 更新原始文件
    const newContent = remainingContent.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
    fs.writeFileSync(sourceFile, newContent.trim(), 'utf8');
    
    console.log('All classes extracted successfully!');
    
} catch (error) {
    console.error('Error:', error.message);
}