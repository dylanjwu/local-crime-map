const express = require('express');
const { db } = require('./pipeline/db/connect');
const { getCalls } = require('./pipeline/db/getCalls');
const cors = require('cors');

require('nodemon');

const port = 3001;

app = express();

const ws = require('express-ws')(app);

app.use(cors());

app.use(express.json());

app.ws('/echo', (ws, req) => {
    ws.on('message', (msg) => {
        console.log(req.socket.remoteAddress)
        ws.send(msg);
    });
});


const addDb = () => {
    let dbObj = null;
    return (req, res, next) => {
        if (!dbObj) {
            dbObj = db();
        }
        req.db = dbObj;
        next();
    };
};

app.use(addDb());



app.get('/', (req, res) => {
    res.send('hello');
})

app.post('/', (req, res) => {
    const { body } = req;
    console.log(body);
    res.sendStatus(200);
})

app.get('/calls', async(req, res) => {
    const calls = await getCalls(req.db);
    res.json(calls);
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})