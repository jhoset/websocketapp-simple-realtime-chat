import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3000 }, () => {
    console.log(`Server running on port: 3000`)
});

wss.on('connection', function connection(wsConnection) {
    console.log('>>> Client Connected');
    wsConnection.on('error', console.error);

    wsConnection.on('message', function message(data, isBinary) {
        const payload = {
            type: 'custom-message',
            payload: data.toString().toUpperCase()
        }
        // wsConnection.send(JSON.stringify(payload))
        //* to EVERYONE include current client connection
        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(JSON.stringify(payload), { binary: false })
        //     }
        // })

        //* to EVERYONE expect current client connection
        wss.clients.forEach(function each(client) {
            if ( client != wsConnection && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(payload), { binary: false })
            }
        })

    })
    wsConnection.on('close', function message() {
        console.log("--- Connection finished")
    })

    // setInterval(() => {
    //     wsConnection.send('Hi dude, from server :) after 3s')
    // }, 5000)


})
