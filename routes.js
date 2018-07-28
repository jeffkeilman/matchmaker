const getMatch = require('./controllers/match');

module.exports = function(app, io) {
    app.get('/match', (req, res) => {
        const token = 'lol';
        // if (!token) res.status(401).send('Access denied: no token provided');

        getMatch(token, res, io);
    });
}