const constants = require('./constants');
const lobby = require('./lobby');

let playerOneMod = 0;
let playerTwoMod = 0;

const _applyModifier = function (playerOneGames, playerTwoGames) {
    // apply a modifier based on difference in games played
    const diff = playerOneGames - playerTwoGames;
    if (diff === 0) return 0;

    // positive diff means player one has played more games, vice versa
    diff > 0 ? playerTwoMod = _calculateModifier(Math.abs(diff)) : playerOneMod = _calculateModifier(Math.abs(diff));
}

const _calculateModifier = function (diff) {
    return (diff / constants.GAMES_PLAYED_GAP) * constants.SKILL_MODIFIER;
}

const findMatches = function () {
    // so long as the lobby has two or more players, check for matches
    if (!(lobby.length >= 2)) return;

    for (let x = 0; x < lobby.length; x++) {
        for (let y = 0; y < lobby.length; y++) {
            if (y === x) continue;

            const playerOne = lobby[x];
            const playerTwo = lobby[y];

            _applyModifier(playerOne.userData.games_played, playerTwo.userData.games_played);

            // check if player is within acceptable MMR range
            if (Math.abs((playerOne.userData.mmr - playerOneMod) - (playerTwo.userData.mmr - playerTwoMod)) <= constants.MAX_SKILL_GAP) {
                console.log('Match found:', playerOne.id, playerTwo.id);

                // remove both players from lobby
                lobby.splice(x, 1);
                lobby.splice(y - 1, 1);
            }

            playerOneMod = 0;
            playerTwoMod = 0;
        }
    }
}

module.exports = findMatches;