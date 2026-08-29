const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/claims/page.tsx', 'utf-8');
content = content.replace(/\?13,50,000/, '?13,50,000');
content = content.replace(/A\?\?sA13,50,000/, '?13,50,000');
fs.writeFileSync('src/app/(app)/claims/page.tsx', content);
