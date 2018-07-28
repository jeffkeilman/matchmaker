const getUser = function (id) {
    const userData = {
        1: '{ "mmr": 2800, "games_played": 40 }', 
        2: '{ "mmr": 2000, "games_played": 100 }',
        3: '{ "mmr": 3100, "games_played": 732 }'
    }

    return userData[id];
}

module.exports = getUser;