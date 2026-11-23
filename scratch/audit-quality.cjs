const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('dist')) {
        results = results.concat(getFiles(fullPath));
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles('./src');

console.log('=== CONSOLE CALLS IN SRC ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('console.log') || l.includes('console.warn') || l.includes('console.error')) {
      console.log(`${f}:${idx + 1}: ${l.trim()}`);
    }
  });
});

console.log('\n=== EMPTY ONCLICK HANDLERS ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (/onClick=\{?\s*\(\)\s*=>\s*\{\s*\}?/.test(l)) {
      console.log(`${f}:${idx + 1}: ${l.trim()}`);
    }
  });
});

console.log('\n=== HASH LINKS (href="#") ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (/href=["']#["']/.test(l)) {
      console.log(`${f}:${idx + 1}: ${l.trim()}`);
    }
  });
});

console.log('\n=== IMAGES AUDIT (alt tags & error fallbacks) ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const imgMatches = content.match(/<img[^>]*>/g) || [];
  imgMatches.forEach(img => {
    const hasAlt = /alt=/.test(img);
    const hasOnError = /onError=/.test(img);
    if (!hasAlt) {
      console.log(`Missing alt in ${f}: ${img.slice(0, 60)}...`);
    }
    if (!hasOnError && /src=\{?["']https?:\/\//.test(img)) {
      console.log(`External image without onError in ${f}: ${img.slice(0, 70)}...`);
    }
  });
});
