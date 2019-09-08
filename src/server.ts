import express from "express";
import path from "path";

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('HELLO WORLD!');
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});