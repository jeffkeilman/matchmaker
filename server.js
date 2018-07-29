require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./routes')(app, io);

const port = process.env.PORT;
const findMatch = require('./global/findMatch').findMatches;
const constants = require('./global/constants');

const server = http.listen(port, () => {
    console.log('Listening on:', port);
    // run matchmaking forever
    setInterval(() => findMatch(io), constants.FIND_MATCH_INTERVAL);
});

module.exports = server;