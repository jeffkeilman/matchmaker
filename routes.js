const lobby = require('./global/lobby');
const matchController = require('./controllers/match');

module.exports = function(app, io) {
    io.on('connection', socket => {
        matchController.addToLobby(socket.id);
        socket.on('disconnect', () => {
            // if user leaves lobby OR is matched, remove them from the lobby array
            const idx = lobby.findIndex(player => player.socketId === socket.id);
            lobby.splice(idx, 1);
        });
    });

    app.get('/match', (req, res) => {
        const token = req.headers.authorization;
        if (!token) res.status(401).send('Access denied: no token provided');

        matchController.getMatch(token, res);
    });
}