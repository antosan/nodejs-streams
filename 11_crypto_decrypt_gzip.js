/*
Assuming the passed file is the compressed version, the code below will create
a read stream from that, pipe it into the crypto createDecipher() stream
(using the same secret), pipe the output of that into the zlib createGunzip()
stream, and then write things out back to a file without the extension part.
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
    .pipe(crypto.createDecipher("aes192", "a_secret"))
    .pipe(zlib.createGunzip())
    .pipe(reportProgress)
    .pipe(fs.createWriteStream(file.slice(0, -3)))
    .on("finish", () => console.log("Done"));
