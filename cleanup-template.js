var fs = require('fs');
const Path = require('path');

// https://stackoverflow.com/a/32197381
const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var paths = [
    'cleanup-template.js', 
    'init-template.js', 
    'package-template.json', 
    'reset-template.js',
    'test-page/index-template.html', 
    'src/index-template.js',
    'instructions.md',
    'src-templates/'
];

paths.forEach(function(path) {
    try {
        fs.unlinkSync(path);
    } catch {
        deleteFolderRecursive(path);
    }
})
