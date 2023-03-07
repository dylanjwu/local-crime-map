const express = require('express');
const { db } = require('./pipeline/db/connect');
const { getCalls } = require('./pipeline/db/getCalls');

require('nodemon');

const port = 3000;

app = express();

app.use(express.json());


const addDb = (req, res, next) => {
    req.db = db();
    next();
};

app.use(addDb);


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