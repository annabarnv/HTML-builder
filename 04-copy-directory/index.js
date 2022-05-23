const fsPromises = require('fs').promises;
const path = require('path');

async function copyDir(src, dst)  {
  const srcPath = path.join(__dirname, src);
  const dstPath = path.join(__dirname, dst);

  await fsPromises.mkdir(dstPath, { recursive: true });

  let files = await fsPromises.readdir(dstPath);
  
  for (let file of files) {
    await fsPromises.rm(path.join(dstPath, file));
  }

  files = await fsPromises.readdir(srcPath);
  
  for (let file of files) {
    await fsPromises.copyFile(path.join(srcPath, file), path.join(dstPath, file));
  }

}

copyDir('files', 'files-copy');


