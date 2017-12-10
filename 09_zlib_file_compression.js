/*
Using the zlib.createGzip() stream combined with the fs readable/writable
streams to create a file-compression script.

The cool thing about using pipes is that we can actually combine them with
events if we need to. Say, for example, I want the user to see a progress
indicator while the script is working and a “Done” message when the script is
done. Since the pipe method returns the destination stream, we can chain the
registration of events handlers as well.
*/

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
    .on("data", () => process.stdout.write("."))
    // we can simply create a transform stream to report progress, and replace
    // the.on() call with another.pipe() call
    // .pipe(reportProgress)
    .pipe(fs.createWriteStream(file + ".gz"))
    .on("finish", () => console.log("Done"));
