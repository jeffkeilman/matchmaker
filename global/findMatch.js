const constants = require('./constants');
const lobby = require('./lobby');


const _applyModifier = function () {

}

const findMatches = function () {
    // so long as the lobby has two or more players, check for matches
    if (!(lobby.length >= 2)) return;

    for (let x = 0; x < lobby.length; x++) {
        for (let y = 0; y < lobby.length; y++) {
            if (y === x) continue;

            const playerOne = lobby[x];
            const playerTwo = lobby[y];

            // check if player is within acceptable MMR range
            if (Math.abs(playerOne.userData.mmr - playerTwo.userData.mmr) <= constants.MAX_SKILL_GAP) {
                console.log('Match found:', playerOne.id, playerTwo.id);

                // remove both players from lobby
                lobby.splice(x, 1);
                lobby.splice(y - 1, 1);
            }
        }
    }
}

module.exports = findMatches;