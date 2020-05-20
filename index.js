const express = require('express')

const server = require('./server.js')

server.listen(4000, _ => {
    console.log('listening on 4000')
})