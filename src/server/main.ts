import * as path from 'path';
import * as express from 'express';
import {createServer, Server} from 'http';

const app = express();
const port = 8080;

const staticsPath = path.join(process.cwd(), 'dist', 'statics');
console.log(`Serving from: ${staticsPath}`);

app.use('/statics', express.static(staticsPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(staticsPath, 'index.html'));
});

const server = createServer(app);

server.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
