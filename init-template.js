
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// --------------------------------------------------------------//
// --- Update package using package-template.json and user input---//
// --------------------------------------------------------------//
var pkg = require('./package-template.json');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

// Question 1 of 5 - name
const question1 = () => {
    return new Promise((resolve, reject) =>{
        readline.question(`Package Name - all-lower-case-with-no-spaces-please: `, (name) => {
            pkg.name = name
            resolve()
        })
    })
}

// Question 2 of 5 - description
const question2 = () => {
    return new Promise((resolve, reject) => {
        readline.question(`Package Description - 1 sentence description: `, (description) => {
            pkg.description = description
            resolve()
        })
    })
}

// Question 3 of 5 - keywords
const question3 = () => {
    return new Promise((resolve, reject) => {
        readline.question(`Package Keywords - use commas between keywords: `, (keywords) => {
            pkg.keywords = keywords.split(",")
            resolve()
        })
    })
}

// Question 4 of 5 - src
var srcOptions = require('./src-templates/getSrcOptions');
let src = null;
const question4 = () => {
    return new Promise((resolve, reject) => {
        console.log("Default graphic options:")
        srcOptions.opts.forEach(function(src,i){
            console.log(src.description)
        })
        readline.question(`Default Graphic  - type the number for a graphic from above or press enter for default: `, (srcNumber) => {
            srcNumber = srcNumber ? srcNumber : 0;
            src = srcOptions.opts.filter(function(f,i){return i==srcNumber})[0]
            var copydir = require('copy-dir');
            copydir('src-templates/'+src.folder, 'src', {
                utimes: true,  // keep add time and modify time
                mode: true,    // keep file mode
                cover: true    // cover file when exists, default is true
            }, function (err) {
                if (err) throw err;
            });
            resolve()
        })
    })
}

// Question 5 of 5 - org
const question5 = () => {
    return new Promise((resolve, reject) => {
        readline.question(`GitHub User or Org - Usually 'RhoInc'. Leave it blank (press enter) if this isn't on GitHub: `, (org) => {
            pkg.org = org
            updateProject(pkg)
            resolve()
        })
    })
}

function updateProject(pkg){
    // --- Create package.json ---//
    //main
    function camelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '')
            .replace(/-/g, '');
    }

    pkg.function= camelCase(pkg.name)
    pkg.main = './'+pkg.function+".js"
    pkg.scripts['format-bundle']= 'prettier --print-width=100 --tab-width=4 --single-quote --write ./' + pkg.function + '.js'

    //github urls
    if (pkg.org) {
        pkg.homepage = "https://github.com/" + pkg.org + "/" + pkg.name
        pkg.repository.url = pkg.homepage + ".git"
        pkg.bugs.url = pkg.homepage + "/issues"
    }

    // overwrite package.json
    const fs = require('fs');
    fs.writeFile('package.json', JSON.stringify(pkg, null, 4), (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('package.json created.');
    });

    // ---------------------------------------------------//
    // --- Create a readme.md                          ---//
    // ---------------------------------------------------//

    var readme = '#' + pkg.name + '\n' + pkg.description;
    fs.writeFile('README.md', readme, (err) => {
        if (err) throw err;
        console.log('README.md created.');
    });

    // ---------------------------------------------------//
    // --- update ./src/index                          ---//
    // ---------------------------------------------------//
    fs.readFile('./src/index-template.js', "utf8", function (err, data) {
        if (err) throw err;
        var new_index = data.replaceAll("myPackageFunctionGoesHere", pkg.function)
        fs.writeFile('./src/index.js', new_index, (err) => {
            if (err) throw err;
            console.log('./src/index.js created.');
        });
    });

    // ---------------------------------------------------//
    // --- update ./test-page/index.html               ---//
    // ---------------------------------------------------//
    fs.readFile('./test-page/index-template.html', "utf8", function (err, data) {
        if (err) throw err;
        var new_example = data
            .replaceAll("myPackageNameGoesHere", pkg.name)
            .replaceAll("myPackageFunctionGoesHere", pkg.function)
            .replaceAll("myPackageURLGoesHere", pkg.homepage)
            .replaceAll("myDataPathGoesHere", src.datapath)

        fs.writeFile('./test-page/index.html', new_example, (err) => {
            if (err) throw err;
            console.log('./test-page/index.html created.');
        });
    });

}

const main = async () => {
    await question1()
    await question2()
    await question3()
    await question4()
    await question5()
    readline.close()
}

main()