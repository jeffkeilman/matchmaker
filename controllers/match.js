const auth = require('../mock/auth');
const constants = require('../global/constants');
const getUser = require('../mock/user');

const lobby = require('../global/lobby');

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

const getMatch = function (token, res) {
    // If the lobby is full, abort
    if (lobby.length === constants.MAX_LOBBY_CAPACITY) {
        res.status(503).send('Lobby full');
    }

    // Some fake auth
    const userId = _authUser(token);

    // user not found, unauthorized
    if (!userId) res.status(401).send('Unauthorized: User not found');

    // have an id, get the user data
    _getUserData(userId)
        .then(userData => {
            // we may have wrong user id in database, probably need to notify user somehow
            if (!userData) res.status(500).send('Player not found');

            lobby.push({ 
                id: userId, 
                timestamp: new Date().getTime(),
                userData: JSON.parse(userData) 
            });

            res.send(lobby);
        })
        .catch(err => console.log(err));
}

module.exports = getMatch;