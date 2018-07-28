const auth = function (token) {
    const users = {
        lol: 1,
        test: 2,
        something: 3
    }

    return users[token];
}

module.exports = auth;