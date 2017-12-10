/*
In outStream, we simply console.log the chunk as a string and call the callback
after that without an error to indicate success. This is a very simple and
probably not so useful echo stream. It will echo back anything it receives.

To consume this stream, we can simply use it with process.stdin, which is a
readable stream, so we can just pipe process.stdin into our outStream.
*/

const { Writable } = require("stream");

const outStream = new Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    },
});

process.stdin.pipe(outStream);
