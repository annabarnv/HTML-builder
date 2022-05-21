const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const { stdin, stdout, } = process;

const filePath = path.join(__dirname, 'message.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Hello! Please leave your message on the lines below:\n');

stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    exit();
  }
  output.write(data);
});

process.on('exit', () => stdout.write('Thanks for your help! See you again!'));
process.on('SIGINT', exit);

