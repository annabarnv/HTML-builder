const path = require('path');
const { readdir, stat } = require('fs/promises');
const { stdout } = process;
const fldPath = path.join(__dirname, 'secret-folder');

async function getInfo(dirPath) {
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    for (const dirent of files) {
      if (dirent.isFile()) {
        const stats = await stat(path.join(dirPath, dirent.name));
        stdout.write(`\n${path.parse(dirent.name).name} - ${path.extname(dirent.name).slice(1)} - ${stats.size}bytes`);
      }
    }
  } catch (error) {
    stdout.write(`Error: ${error.message}\n`);
  }
}
getInfo(fldPath);