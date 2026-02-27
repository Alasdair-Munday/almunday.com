
import fs from 'node:fs';
import path from 'node:path';

export const base64 = (filePath) => {
    const fullPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`[base64] File not found: ${fullPath}`);
        return '';
    }

    const fileExtension = path.extname(fullPath).substring(1);
    const data = fs.readFileSync(fullPath);
    const base64Data = data.toString('base64');

    return `data:image/${fileExtension};base64,${base64Data}`;
};
