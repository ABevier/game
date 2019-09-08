import * as express from 'express';
import {createServer, Server} from 'http';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send("HELLO WORLD!!");
});

const server = createServer(app);

server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
