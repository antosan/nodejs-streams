/*
The script below compresses and then encrypts the passed file and only those
who have the secret can use the outputted file. We can’t unzip this file with
the normal unzip utilities because it’s encrypted.
*/

const crypto = require("crypto");
const fs = require("fs");
const zlib = require("zlib");
const file = process.argv[2];

const { Transform } = require("stream");

const reportProgress = new Transform({
    transform(chunk, encoding, callback) {
        process.stdout.write(".");
        callback(null, chunk); // push the data inside the transform() method
    },
});

fs
    .createReadStream(file)
    .pipe(zlib.createGzip())
    .pipe(crypto.createCipher("aes192", "a_secret"))
    .pipe(reportProgress)
    .pipe(fs.createWriteStream(file + ".gz"))
    .on("finish", () => console.log("Done"));
