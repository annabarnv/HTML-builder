const { stdout } = process;
const path = require('path');
const { readdir, writeFile, stat } = require('fs/promises');
const fs = require('fs');

const srcPath = path.join(__dirname, 'styles');
const dstPath = path.join(__dirname, 'project-dist');

async function bundleStyles(source, target) {
  try {
    const files = await readdir(source, { withFileTypes: true });
    const data = [];
    for (const file of files) {
      const fileExt = path.extname(path.join(source, file.name));
      if (file.isFile() && fileExt === '.css') {
        const size = await stat(path.join(source, file.name));
        const input = fs.createReadStream(path.join(source, file.name), { highWaterMark: size.size }, 'utf-8');
        for await (const chunk of input) {
          data.push(chunk);
        }
      }
    }
    await writeFile(path.join(target, 'bundle.css'), data.join('\n'), 'utf8');
  } catch (err) {
    stdout.write(`\nError: ${err.message}\n`);
  }
}

bundleStyles(srcPath, dstPath);