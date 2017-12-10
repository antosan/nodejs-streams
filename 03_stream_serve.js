/*
The HTTP response object (`res`) is also a writable stream.
This means if we have a readable stream that represents the content of
big.file, we can just pipe those two on each other and achieve mostly the
same result without consuming ~50 MB of memory.

Node’s `fs` module can give us a readable stream for any file using the
`createReadStream` method. We can pipe that to the response object.
*/

const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
    const src = fs.createReadStream("big.file");

    src.pipe(res);
});

server.listen(8082);

// Connect to server - run this in terminal
// curl localhost:8082

/*
When a client asks for that big file, we stream it one chunk at a time, which
means we don’t buffer it in memory at all.
The memory usage grew by about 25 MB and that’s it.
*/
