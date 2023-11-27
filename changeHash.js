const { readFileSync } = require('node:fs');
const { writeFileSync } = require('node:fs');
const { readdirSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { randomBytes } = require('node:crypto');
const { Buffer } = require('node:buffer');

if (process.argv[2] == "-r") {  // user selected to include subfolders
    if (process.argv[3]) {
        const targetDirectory = `${__dirname}/${process.argv[3].toString()}`;
        if (targetDirectory.slice(-1).localeCompare('/') < 1) {
            executeRecursive(targetDirectory);
        } else {
            console.log("Please make sure your path ends in /");
        }
    } else {
        console.log("Please make sure you include a path");
    }
} else if (process.argv[2] == "-f") {   // user selected single file mode
    if (process.argv[3]) {
        const targetFile = `${__dirname}/${process.argv[3].toString()}`;
        executeSingleFile(targetFile);
    } else {
        console.log("Please make sure you include a path");
    }
} else if (process.argv[2]) {   // user opted to exclude subfolders
    const targetDirectory = `${__dirname}/${process.argv[2].toString()}`;
    if (targetDirectory.slice(-1).localeCompare('/') < 1) {
        executeNonRecursive(targetDirectory);
    } else {
        console.log("Please make sure your path ends in /");
    }
} else {
    console.log("Improper argument");
}

function appendBytesToBuffer(data) { 
    // need a better way to add bits. maybe one or two at different intervals in the file 
    let rand = randomBytes(2);
    let n = Buffer.concat([data, rand]);
    return n;
}

function executeRecursive(targetDirectory) {
    try {
        readdirSync(targetDirectory).forEach(fileName => {
            try {
                let currentFile = readFileSync(targetDirectory + fileName);
                let newFile = appendBytesToBuffer(currentFile);
                let currentHash = createHash('sha256');
                let newHash = createHash('sha256');              
                writeFileSync(targetDirectory + fileName, newFile);
                currentHash.update(currentFile);
                newHash.update(newFile);
                console.log(`\n${fileName}`);
                console.log(`Old SHA256: ${currentHash.digest('hex')}`);
                console.log(`New SHA256: ${newHash.digest('hex')}`);
            } catch (err) {
                let td = `${targetDirectory}/${fileName}/`;
                executeRecursive(td);
            }        
        }); 
    } catch (err) {
        console.log("Please make sure your path is relative and correct");
    } 
}

function executeNonRecursive(targetDirectory) {
    try {
        readdirSync(targetDirectory).forEach(fileName => {
            try {
                let currentFile = readFileSync(targetDirectory + fileName);
                let newFile = appendBytesToBuffer(currentFile);
                let currentHash = createHash('sha256');
                let newHash = createHash('sha256');              
                writeFileSync(targetDirectory + fileName, newFile);
                currentHash.update(currentFile);
                newHash.update(newFile);
                console.log(`\n${fileName}`);
                console.log(`Old SHA256: ${currentHash.digest('hex')}`);
                console.log(`New SHA256: ${newHash.digest('hex')}`);
            } catch (err) {
                console.log(`\nIgnored ${fileName}/`);
            }        
        }); 
    } catch (err) {
        console.log("Please make sure your path is relative and correct");
    } 
}

function executeSingleFile(fileName) {
    let currentFile = readFileSync(fileName);
    let newFile = appendBytesToBuffer(currentFile);
    let currentHash = createHash('sha256');
    let newHash = createHash('sha256');              
    writeFileSync(fileName, newFile);
    currentHash.update(currentFile);
    newHash.update(newFile);
    console.log(`\n${process.argv[3].toString()}`);
    console.log(`Old SHA256: ${currentHash.digest('hex')}`);
    console.log(`New SHA256: ${newHash.digest('hex')}`);
}
