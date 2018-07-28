const getUser = function (id) {
    const userData = {
        1: '{ "mmr": 3200, "games_played": 42 }', 
        2: '{ "mmr": 2000, "games_played": 60 }',
        3: '{ "mmr": 3100, "games_played": 732 }'
    }

    return userData[id];
}

module.exports = getUser;