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
const routeLinks = [];
const navigateLinks = [];
const definedRoutes = new Set();

const appRoutesContent = fs.readFileSync('./src/routes/AppRoutes.jsx', 'utf8');
const routeRegex = /path=["']([^"']+)["']/g;
let rm;
while ((rm = routeRegex.exec(appRoutesContent)) !== null) {
  definedRoutes.add(rm[1]);
}

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const navRegex = /navigate\((?:['"`](\/[^'"`$?#)]*)['"`]|\s*['"`](\/[^'"`$?#)]*)['"`])/g;
  let nm;
  while ((nm = navRegex.exec(content)) !== null) {
    navigateLinks.push({ file: f, path: nm[1] || nm[2] });
  }

  const toRegex = /to=["'](\/[^"'?#]*)["']/g;
  let tm;
  while ((tm = toRegex.exec(content)) !== null) {
    routeLinks.push({ file: f, path: tm[1] });
  }
});

console.log('=== DEFINED ROUTES ===');
const defArray = Array.from(definedRoutes);
console.log(defArray.sort());

const allRoutes = defArray.map(r => r.startsWith('/') ? r : '/' + r);
defArray.forEach(r => {
  if (!r.startsWith('/')) allRoutes.push('/admin/' + r);
});

console.log('\n=== UNRECOGNIZED NAVIGATES ===');
const unknownNavs = [];
navigateLinks.forEach(({ file, path }) => {
  if (!path) return;
  const directMatch = allRoutes.includes(path);
  const paramMatch = allRoutes.some(r => {
    if (r.includes(':')) {
      const prefix = r.split('/:')[0];
      return path.startsWith(prefix);
    }
    return false;
  });
  if (!directMatch && !paramMatch) {
    unknownNavs.push({ path, file });
  }
});
console.log(unknownNavs);

console.log('\n=== UNRECOGNIZED <Link to="..."> ===');
const unknownLinks = [];
routeLinks.forEach(({ file, path }) => {
  if (!path) return;
  const directMatch = allRoutes.includes(path);
  const paramMatch = allRoutes.some(r => {
    if (r.includes(':')) {
      const prefix = r.split('/:')[0];
      return path.startsWith(prefix);
    }
    return false;
  });
  if (!directMatch && !paramMatch) {
    unknownLinks.push({ path, file });
  }
});
console.log(unknownLinks);
