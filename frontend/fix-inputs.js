const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src/app/admin');
let modifiedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/(<(?:input|select|textarea)[^>]*className=)(['"])(.*?)(['"])/g, (match, p1, p2, p3, p4) => {
    let classes = p3.split(' ');
    if (!classes.includes('text-black')) classes.push('text-black');
    if (!classes.includes('placeholder-black')) classes.push('placeholder-black');
    return p1 + p2 + classes.join(' ') + p4;
  });
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    modifiedCount++;
    console.log('Modified: ' + file);
  }
});
console.log('Total files modified: ' + modifiedCount);
