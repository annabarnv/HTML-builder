const fs = require('fs');
const path = require('path');
const { stdout } = process;

const stream = fs.createReadStream(path.join(__dirname, './text.txt'), 'utf8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => stdout.write(`\n${data}`));
stream.on('error', error => stdout.write(`\nError ${error.message}`));