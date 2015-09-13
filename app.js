var port = process.env.PORT || 3000;
var http = require('http');
var fs = require('fs');
var path = require('path');
var html = fs.readFileSync('./public/index.html');
var mime = require('mime');

var cache = {};

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

function send404(res) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.write('Error 404: resource not found.');
    res.end();
}

function sendFile(res, filePath, fileContents){
    res.writeHead(200, { 'content-type': mime.lookup(path.basename(filePath)) });
    res.end(fileContents);
}

function serveStatic(res, cache, absPath){
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    }
    else {
        fs.exists(absPath, function (exists) {
            if (exists) {
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(response);
                    }
                    else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            }
            else {
                send404(res);
            }
        });
    }
}


var server = http.createServer(function (req, res) {
    var filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html';
    }
    else {
        filePath = 'public/' + req.url;
    }
    var absPath = './' + filePath;
    serveStatic(res, cache, absPath);
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
