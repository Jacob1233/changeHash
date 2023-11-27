const { readFileSync } = require('node:fs');
const { writeFileSync } = require('node:fs');
const { readdirSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { randomBytes } = require('node:crypto');
const { Buffer } = require('node:buffer');

if (process.argv[2]) {
    const targetDirectory = `${__dirname}/${process.argv[2].toString()}`;
    if (targetDirectory.slice(-1).localeCompare('/') < 1) {
        try {
            readdirSync(targetDirectory).forEach(fileName => {
                let hashBefore = createHash('sha256');
                let hashAfter = createHash('sha256');
                let file = readFileSync(targetDirectory + fileName);
                let newFile = appendBytesToBuffer(file);
                writeFileSync(targetDirectory + fileName, newFile);
                hashBefore.update(file);
                hashAfter.update(newFile);
                console.log(`\n${fileName}`);
                console.log(`Old SHA256: ${hashBefore.digest('hex')}`);
                console.log(`New SHA256: ${hashAfter.digest('hex')}`);
            });
        } catch (err) {
            console.log("Please make sure your path is relative and correct");
        }
    } else {
        console.log("Please make sure your path ends in /");
    }
} else {
    console.log("Please make sure you include a path");
}

function appendBytesToBuffer(data) {
    let rand = randomBytes(2);
    let n = Buffer.concat([data, rand]);
    return n;
}
