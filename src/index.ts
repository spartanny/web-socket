import * as http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const PORT = 8080;
const clients = [];

// Create HTTP server as first TCP handshake is required to establish a connection
// even for a websocket 
const server = http.createServer(function (request: any, response: http.ServerResponse) {
    console.log(`received reqeuest for` + request.url);
    response.statusCode = 200;
    response.end("Thanks for contacting !")
});

// WebSocket server on top of http server
const wss = new WebSocketServer({
    server: server
});


wss.on('connection', (ws: WebSocket) => {
    ws.on('error', console.error);

    ws.on('message', (data, isBinary) => {
        wss.clients.forEach(client => {
            if(client != ws && client.readyState === WebSocket.OPEN) {
                client.send(data, {binary: isBinary});
            }
        })
    })

    ws.send("HELLO THIS IS BEGINNING OF YOUR ROOM !");
})

server.listen(PORT, () => {
    console.log(new Date() + ` Server is listening on ${PORT}`);
});
