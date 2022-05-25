const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const FILENAME = 'style.css';
const styles = [];

async function buildPage(template, components, assets, dst) {
  const templatePath = path.join(__dirname, template);
  const componentsPath = path.join(__dirname, components);
  const dstPath = path.join(__dirname, dst);
  const assetsPath = path.join(__dirname, assets);

  buildTemplate(templatePath, componentsPath, dstPath);

  buildStyles('styles', dst);

  copyDir(assetsPath, path.join(dstPath, assets));
}

async function buildTemplate(templatePath, componentsPath, dstPath) {
  const html = await fsPromises.readFile(templatePath);
  const componentFiles = await fsPromises.readdir(componentsPath);
  let content = html.toString();
  
  for(let componentFile of componentFiles) {
    const stats = await fsPromises.stat(path.join(componentsPath, componentFile));
    if (stats.isFile() && path.extname(componentFile) === '.html') {
      let componentName = path.basename(componentFile, path.extname(componentFile));
      let componentContent = await fsPromises.readFile(path.join(componentsPath, componentFile));

      content = content.replace(new RegExp(`{{${componentName}}}`), componentContent.toString());
    }
  }

  await fsPromises.mkdir(dstPath, { recursive: true });
  await fsPromises.writeFile(path.join(dstPath, 'index.html'), content);
}

async function buildStyles(src, dst) {
  const srcPath = path.join(__dirname, src);
  const dstFilePath = path.join(__dirname, dst, FILENAME);

  let files = await fsPromises.readdir(srcPath);
  for (let file of files) {
    const stats = await fsPromises.stat(path.join(srcPath, file));

    if (stats.isFile() && path.extname(file) === '.css') {
      let stylesBuffer = await fsPromises.readFile(path.join(srcPath, file));
      styles.push(stylesBuffer);
    }
  }

  let start = true;
  for (let style of styles) {
    if (start) {
      await fsPromises.writeFile(dstFilePath, style);
      start = false;
    } else {
      await fsPromises.writeFile(dstFilePath, style, { flag: 'a' });
    }
  }
}

async function copyDir(srcPath, dstPath) {

  await fsPromises.mkdir(dstPath, { recursive: true });

  let files = await fsPromises.readdir(dstPath);

  for (let file of files) {
    let stats = await fsPromises.stat(path.join(dstPath, file));

    if (!stats.isDirectory()) {
      await fsPromises.rm(path.join(dstPath, file));
    }
  }

  files = await fsPromises.readdir(srcPath);

  for (let file of files) {
    let stats = await fsPromises.stat(path.join(srcPath, file));
    
    if (!stats.isDirectory()) {
      await fsPromises.copyFile(path.join(srcPath, file), path.join(dstPath, file));
    } else {
      await copyDir(path.join(srcPath, file), path.join(dstPath, file));
    }
  }
}

buildPage('template.html', 'components', 'assets', 'project-dist');