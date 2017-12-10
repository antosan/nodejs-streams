/*
A simple Node web server designed to exclusively serve the big.file

When the server gets a request, it’ll serve the big file using the
asynchronous method, fs.readFile BLOCKING THE EVENT LOOP.
*/

const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
    fs.readFile("big.file", (err, data) => {
        if (err) {
            throw err;
        }

        res.end(data);
    });
});

server.listen(8082);

// Connect to server - run this in terminal
// curl localhost:8082

/*
Running this basically put the whole big.file content in memory before we
wrote it out to the response object. This is very inefficient.
*/
