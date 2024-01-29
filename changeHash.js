const { readFileSync } = require('node:fs');
const { writeFileSync } = require('node:fs');
const { readdirSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { randomBytes } = require('node:crypto');
const { Buffer } = require('node:buffer');

try {
    if (process.argv[2] == "n") {
        let absolutePath = false;
        let directory = false;
        let recursion = false;

        try {
            if (process.argv[4].indexOf("a") > -1) {
                absolutePath = true;
            }
            if (process.argv[4].indexOf("d") > -1) {
                directory = true;
            }
            if (process.argv[4].indexOf("r") > -1) {
                recursion = true;
            } 
        } catch (err) {
            // no flags given
        }

        if (absolutePath) {
            if (directory) {
                const targetDirectory = `${process.argv[3].toString()}`;
                if (recursion) {
                    executeRecursive(targetDirectory);
                } else {
                    executeNonRecursive(targetDirectory);
                }
            } else {
                const targetFile = `${process.argv[3].toString()}`;
                executeSingleFile(targetFile);
            }
        } else {
            if (directory) {
                const targetDirectory = `${__dirname}/${process.argv[3].toString()}`;
                if (recursion) {
                    executeRecursive(targetDirectory);
                } else {
                    executeNonRecursive(targetDirectory);
                }
            } else {
                const targetFile = `${__dirname}/${process.argv[3].toString()}`;
                executeSingleFile(targetFile);
            }
        }
    } else {
        console.log("No or incorrect option given");
        console.log("see https://github.com/Jacob1233/changeHash for usage instructions");
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
}

function executeNonRecursive(targetDirectory) {
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