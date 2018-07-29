const auth = function (token) {
    const users = {
        999: 1,
        888: 2,
        777: 3
    }

    return users[token];
}

module.exports = auth;