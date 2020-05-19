const express = require('express');
const ApiRouter = require('./api/api-router.js')
const server = express();
server.use(express.json());

server.use('/api', ApiRouter);

server.get('/', (req, res) => {
    res.status(200).json({message: "Hi there!"})
})
module.exports = server;