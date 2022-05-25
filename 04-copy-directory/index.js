const path = require('path');
const { copyFile, mkdir, readdir, rm } = require('fs/promises');

const srcPath = path.join(__dirname, 'files');
const dstPath = path.join(__dirname, 'files-copy');

async function copyDir(srcPath, dstPath) {
  try {
    const files = await readdir(srcPath, {withFileTypes: true});
    for (let file of files) {
      if (file.isDirectory()) {
        copyDir(path.join(srcPath, file.name), path.join(dstPath, file.name));
      } else {
        await copyFile(path.join(srcPath, file.name), path.join(dstPath, file.name));
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

(async function () {
  await rm(dstPath, { recursive: true, force: true });
  await mkdir(dstPath, {recursive: true});
  copyDir(srcPath, dstPath);
}) ();
