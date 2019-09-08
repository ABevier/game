import express from 'express';
import {createServer, Server } from 'http';
import socketIo from 'socket.io';
import path from 'path';

const app = express();
const port = 8080;

const server = createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

const io = socketIo(server);
io.on("connection", socket => {
    console.log("A user connected");
    socket.on("message", message => {
        console.log(message);
        socket.emit("message", "PONG!");
    });
});

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});