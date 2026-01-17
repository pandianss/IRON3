
import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDirectory(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            scanFile(fullPath);
        }
    });
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Pattern: state.update(...)
    const updateRegex = /\.state\.update\(.*?\)/g;
    // Pattern: govern(...)
    const governRegex = /\.govern\(.*?\)/g;

    const updates = content.match(updateRegex) || [];
    const governs = content.match(governRegex) || [];

    if (updates.length > 0) {
        // If there are updates but no governs, it's a potential breach
        if (governs.length === 0) {
            console.log(`[BREACH] ${filePath}: ${updates.length} un-gated state updates found.`);
        } else if (updates.length > governs.length) {
            // Heuristic: more updates than governs might mean some are leaking
            console.log(`[LEAK] ${filePath}: Found ${updates.length} updates vs ${governs.length} governs.`);
        }
    }
}

console.log("Starting Sovereign Sovereignty Scan...");
scanDirectory(SRC_DIR);
console.log("Scan Complete.");
