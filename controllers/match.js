const auth = require('../mock/auth');
const constants = require('../global/constants');
const getUser = require('../mock/user');

const lobby = require('../global/lobby');

let userData = null;
let userId = null;

const _authUser = function (token) {
    // check store of users for match
    return auth(token);
}

const _getUserData = function (userId) {
    // hit mock server to get user data
    return Promise.all([])
        .then(() => {
            return getUser(userId);
        })
        .catch(err => console.log(err))
}

const addToLobby = function (socketId) {
    lobby.push({ 
        playerId: userId,
        timestamp: new Date().getTime(),
        userData: JSON.parse(userData),
        socketId
    });
    userId = null;
    userData = null;
}

const getMatch = function (token, res) {
    // If the lobby is full, abort
    if (lobby.length === constants.MAX_LOBBY_CAPACITY) {
        res.status(503).send('Lobby full');
    }

    // Some fake auth
    userId = _authUser(token);

    if (userId) {
        _getUserData(userId)
            .then(data => {
                userData = data;
                res.status(201).sendFile(__dirname + '/static/lobby.html');
            })
            .catch(err => {
                console.log(err)
                userId = null;
                userData = null;
            });
    } else {
        // user not found, unauthorized
        res.status(401).send('Unauthorized: User not found');
    }
}

module.exports = {
    getMatch,
    addToLobby
};