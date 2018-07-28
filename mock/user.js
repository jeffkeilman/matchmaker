const getUser = function (id) {
    const userData = {
        1: '{ "mmr": 1000, "games_played": 40 }', 
        2: '{ "mmr": 1100, "games_played": 40 }',
        3: '{ "mmr": 3100, "games_played": 40 }'
    }

    return userData[id];
}

module.exports = getUser;