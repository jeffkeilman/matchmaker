const auth = require('../mock/auth');

module.exports = function (token) {
    // check store of users for match
    return auth(token);
}