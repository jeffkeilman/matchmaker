require('dotenv').config();

const express = require('express');
const app = express();

require('./routes')(app);

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Listening on:', port);
});