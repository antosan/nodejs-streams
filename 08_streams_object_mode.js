/*
By default, streams expect Buffer/String values. There is an `objectMode` flag
that we can set to have the stream accept any JavaScript object.

The following combination of transform streams makes for a feature to map a
string of comma-separated values into a JavaScript object. So “a,b,c,d”
becomes {a: b, c: d}.
*/

const { Transform } = require("stream");

const commaSplitter = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        this.push(
            chunk
                .toString()
                .trim()
                .split(","),
        );
        callback();
    },
});

const arrayToObject = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
        const obj = {};

        for (let i = 0; i < chunk.length; i += 2) {
            obj[chunk[i]] = chunk[i + 1];
        }

        this.push(obj);
        callback();
    },
});

const objectToString = new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
        this.push(JSON.stringify(chunk) + "\n");
        callback();
    },
});

process.stdin
    .pipe(commaSplitter)
    .pipe(arrayToObject)
    .pipe(objectToString)
    .pipe(process.stdout);
