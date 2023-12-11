const { readFileSync } = require('node:fs');
const { writeFileSync } = require('node:fs');
const { readdirSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { randomBytes } = require('node:crypto');
const { Buffer } = require('node:buffer');

try {
    if (process.argv[2] == "f") {                                           // user selected single file
        if (process.argv[4] == "-a") {                                      // user selected absolute path
            const targetFile = `${process.argv[3].toString()}`;
            executeSingleFile(targetFile);
        } else {                                                            // user selected relative path
            const targetFile = `${__dirname}/${process.argv[3].toString()}`;
            executeSingleFile(targetFile);
        }
    } else if (process.argv[2] == "d") {                                    //user selected a directory
        if (process.argv[4] == "-r") {                                      // user selected recursion
            const targetDirectory = `${__dirname}/${process.argv[3].toString()}`;
            executeRecursive(targetDirectory);
        } else if ((process.argv[4] == "-ra" || process.argv[4] == "-ar")) { // user selected recursion and absolute path
            const targetDirectory = `${process.argv[3].toString()}`;
            executeRecursive(targetDirectory);
        } else if ((process.argv[4] == "-a")) {                             // user selected absolute path
            const targetDirectory = `${process.argv[3].toString()}`;
            executeNonRecursive(targetDirectory);
        } else {                                                            // exclude nested directories
            const targetDirectory = `${__dirname}/${process.argv[3].toString()}`;
            executeNonRecursive(targetDirectory);
        }
    }
} catch (err) {
    displayUsageInstructions(err);
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

function displayUsageInstructions(err) {
    console.log(err['message']);
    console.log("see https://github.com/Jacob1233/changeHash for usage instructions");
}