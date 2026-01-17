
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            if (/\.(js|jsx)$/.test(file)) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

function getImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = [];
    // Regex for static imports
    const regex = /import\s+(?:[\w\s{},*]*\s+from\s+)?['"](.*?)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    // Regex for dynamic imports or requires could be added but skipping for MVP
    return imports;
}

function resolveImport(sourceFile, importPath) {
    if (importPath.startsWith('.')) {
        return path.resolve(path.dirname(sourceFile), importPath);
    }
    // Alias or node_modules - skipping for this simple check
    return null;
}

function runAudit() {
    console.log("scanning for orphans...");
    const allFiles = getAllFiles(SRC_DIR);
    const importedFiles = new Set();

    // Add known entry points
    const entryPoints = [
        path.join(SRC_DIR, 'main.jsx'),
    ];
    entryPoints.forEach(f => importedFiles.add(f));

    allFiles.forEach(file => {
        const imports = getImports(file);
        imports.forEach(imp => {
            const resolved = resolveImport(file, imp);
            if (resolved) {
                // Try extensions
                const extensions = ['', '.js', '.jsx'];
                for (const ext of extensions) {
                    const fullPath = resolved + ext;
                    if (allFiles.includes(fullPath)) {
                        importedFiles.add(fullPath);
                        break;
                    }
                    // Check index.js
                    const indexPath = path.join(resolved, 'index.js');
                    if (allFiles.includes(indexPath)) {
                        importedFiles.add(indexPath);
                        break;
                    }
                }
            }
        });
    });

    const orphans = allFiles.filter(f => !importedFiles.has(f));

    if (orphans.length > 0) {
        console.log("\nPossible Orphans Found:");
        orphans.forEach(f => console.log(path.relative(SRC_DIR, f)));
    } else {
        console.log("\nNo orphans found. All files are reachable from main.jsx (or are circular references).");
    }
}

runAudit();
