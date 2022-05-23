const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

async function bundleStyles() {

const srcPath = path.join(__dirname, 'project-dist');
const dstPath = path.join(__dirname, 'styles');
const writableStream = fs.createWriteStream(path.join(srcPath, 'bundle.css'));

const files = await readdir(dstPath, {withFileTypes: true});
for (let file of files) {
  if (file.isFile() && file.name.includes('css')) {
    const input = path.join(dstPath, file.name);
    const readableStream = fs.createReadStream(input, {encoding: 'utf-8'});
    readableStream.on('data', (data) => {
      writableStream.write(data);
    });
   }
  } 
}

bundleStyles();