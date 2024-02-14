const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const mqtt = require('mqtt');

const server = http.createServer((req, res) => {
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });
});

server.listen(8080, () => {
    console.log('Server is listening on http://localhost:8080');

    const options = {
        host: '0c0f13a385f1475b8629b4ffb3c53807.s1.eu.hivemq.cloud',
        port: 8883,
        protocol: 'mqtts',
        username: 'hivemq.webclient.1707752534995',
        password: '1032TACZcBYdahg,b.><'
    };

    const client = mqtt.connect(options);

    client.on('connect', function () {
        console.log('Connected to MQTT broker');
        client.subscribe('owntracks/hivemq.webclient.1707593370048/mmh6lm');
    });

    client.on('error', function (error) {
        console.log(error);
    });

    wss.on('connection', (ws) => {
        client.on('message', (topic, message) => {
            ws.send(message.toString());
        });
    });
});
