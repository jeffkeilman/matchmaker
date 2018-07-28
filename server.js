require('dotenv').config();

const express = require('express');
const app = express();

require('./routes')(app);

const port = process.env.PORT;
const findMatch = require('./global/findMatch');
const constants = require('./global/constants');

app.listen(port, () => {
    console.log('Listening on:', port);
    // run matchmaking forever
    setInterval(findMatch, constants.FIND_MATCH_INTERVAL);
});