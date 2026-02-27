
import { base64 } from './src/_config/filters/base64.js';
import path from 'path';

const bgPath = 'src/assets/images/background/background-tile-colour.png';
console.log(`Testing path: ${bgPath}`);
console.log(`CWD: ${process.cwd()}`);

const result = base64(bgPath);
console.log(`Result length: ${result.length}`);
if (result.length < 100) console.log(`Result: ${result}`);
