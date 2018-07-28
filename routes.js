const getMatch = require('./controllers/match');

module.exports = function(app) {
    app.get('/match', (req, res) => {
        const token = req.headers['authorization'];
        if (!token) res.status(401).send('Access denied: no token provided');

        getMatch(token, res);
    });
}