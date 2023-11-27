const { readFileSync } = require('node:fs');
const { writeFileSync } = require('node:fs');
const { readdirSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { randomBytes } = require('node:crypto');
const { Buffer } = require('node:buffer');
const targetDirectory = __dirname + process.argv[2].toString(); // requires a directory

readdirSync(targetDirectory).forEach(name => {
    let hashBefore = createHash('sha256');
    let hashAfter = createHash('sha256');
    let file = readFileSync(`${__dirname + process.argv[2].toString()}/${name}`);
    let newFile = appendBytesToBuffer(file);
    writeFileSync(`${__dirname + process.argv[2].toString()}/${name}`, newFile);
    hashBefore.update(file);
    hashAfter.update(newFile);
    console.log(`\n${name}`);
    console.log(`Before: ${hashBefore.digest('hex')}`);
    console.log(`After: ${hashAfter.digest('hex')}`);
});

function appendBytesToBuffer(data) {
    let rand = randomBytes(2);
    let n = Buffer.concat([data, rand]);
    return n;
}
