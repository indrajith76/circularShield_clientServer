const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist') && !fullPath.includes('scratch')) {
        results = results.concat(getFiles(fullPath));
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = getFiles('./src');
const importsMap = new Set();

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    const importPath = m[1];
    if (importPath.startsWith('.')) {
      const resolved = path.normalize(path.resolve(path.dirname(f), importPath));
      importsMap.add(resolved);
      importsMap.add(resolved + '.jsx');
      importsMap.add(resolved + '.js');
      importsMap.add(path.join(resolved, 'index.jsx'));
      importsMap.add(path.join(resolved, 'index.js'));
    }
  }
});

console.log('=== UNIMPORTED SRC FILES (EXCLUDING main.jsx & index.css) ===');
allFiles.forEach(f => {
  const norm = path.normalize(path.resolve(f));
  const base = path.basename(f);
  if (base === 'main.jsx' || base === 'App.jsx') return;
  if (!importsMap.has(norm)) {
    console.log(`Unimported file: ${f}`);
  }
});
