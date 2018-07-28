const auth = require('../mock/auth');
const getUser = require('../mock/user');

let userInfo = null;
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
        .then(userData => {
            userInfo = JSON.parse(userData);
        })
        .catch(err => console.log(err))
}

const getMatch = function (token, res) {
    let userId = null;

    // Some fake auth
    userId = _authUser(token);

    // user not found, unauthorized
    if (!userId) res.status(401).send('Unauthorized: User not found');

    // have an id, get the user data
    _getUserData(userId)
        .then(() => {
            // we may have wrong user id in database, probably need to notify user somehow
            if (!userInfo) res.status(400).send('Downstream user not found');

            lobby.push({ id: userId, userInfo });

            res.send(lobby);
        });
}

module.exports = getMatch;