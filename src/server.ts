import express from 'express';
import http from 'http';
import io from 'socket.io';

const app = express();
const port = 8080;

const server = new http.Server(app);

app.use('/js', express.static(__dirname + 'public/js'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html')
});

io.listen(server);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});