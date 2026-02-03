const fs = require('fs');
const parser = require('@babel/parser');
const path = 'c:/Users/admin/Desktop/financial health/frontend/src/components/Dashboard.jsx';
const content = fs.readFileSync(path, 'utf-8');
try {
    parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx']
    });
    console.log('JSX is syntactically valid');
} catch (e) {
    console.error('JSX Error: ' + e.message);
}
