const auth = require('../mock/auth');
const getUser = require('../mock/user');

const lobby = [];

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
    // Some fake auth
    const userId = _authUser(token);

    // user not found, unauthorized
    if (!userId) res.status(401).send('Unauthorized: User not found');

    // have an id, get the user data
    _getUserData(userId)
        .then((userData) => {
            // we may have wrong user id in database, probably need to notify user somehow
            if (!userData) res.status(400).send('Downstream user not found');

            lobby.push({ id: userId, userData: JSON.parse(userData) });

            res.send(lobby);
        });
}

module.exports = getMatch;