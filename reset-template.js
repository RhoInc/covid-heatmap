var fs = require('fs');
var paths = [
    'README.md',
    'package.json',
    'package-lock.json',
    'test-page/index.html'
];

// fs.rmdirSync('src', { recursive: true }); //needs node 12.10+. delete /src by hand for now. 

paths.forEach(function(path){
    fs.unlinkSync(path);
})
