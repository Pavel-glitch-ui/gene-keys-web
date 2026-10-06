const fs = require('fs');
const path = require('path');

const testsPath = path.join(__dirname, '..', 'src', 'shared', 'mock-data', 'tests.ts');
let content = fs.readFileSync(testsPath, 'utf8');

// Add import of ikigaiTest
content = "import { ikigaiTest } from './ikigaiTest';\n" + content;

// Find bigfive block
const bigfiveIdx = content.indexOf('"id": "bigfive"');
if (bigfiveIdx !== -1) {
  const startBlock = content.lastIndexOf('  {', bigfiveIdx);
  const endBlock = content.lastIndexOf('  }');
  
  if (startBlock !== -1 && endBlock !== -1) {
    const before = content.slice(0, startBlock);
    const after = content.slice(endBlock + 3);
    content = before + '  ikigaiTest\n' + after;
    fs.writeFileSync(testsPath, content, 'utf8');
    console.log('Successfully replaced bigfive with ikigaiTest in tests.ts');
  } else {
    console.error('Could not find start or end block of bigfive');
  }
} else {
  console.error('bigfive not found in tests.ts');
}
