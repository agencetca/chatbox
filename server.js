
var fs = require('fs');
var path = require('path');
var httpServer = require('http').createServer(
        function(request, response) {
            if(request.url != ''){//request.url is the file being requested by the client
                var filePath = '.' + request.url;
                if (filePath == './'){filePath = './index.html';} // Serve index.html if ./ was requested
                var filename = path.basename(filePath);
                var extname = path.extname(filePath);
                var contentType = 'text/html';
                fs.readFile(filePath, function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
        }
        ).listen(8000);

var clients = [];

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server:httpServer});
wss.on('connection', function(ws) {
    clients.push(ws);
    ws.on('message', function(message) {
        if(!message) return;
        _message = JSON.parse(message);
        if(_message.type === 'preview') {
            for(var i=0;i<clients.length;i++) {
                if(clients[i] !== ws) clients[i].send(message, function() {
                });
            }
        } else if(_message.type === 'entry'){
            for(var i=0;i<clients.length;i++) {
                clients[i].send(message, function() {
                });
            }
        }
    });
});
