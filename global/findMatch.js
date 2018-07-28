const constants = require('./constants');
const lobby = require('./lobby');

let playerOneMod = 0;
let playerTwoMod = 0;
let socketIO = null;

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

const _calculateDifferenceModified = function (playerOneMMR, playerTwoMMR) {
    return Math.abs((playerOneMMR - playerOneMod) - (playerTwoMMR - playerTwoMod));
}

const _handleMatch = function (x, y) {
    const playerOne = lobby[x];
    const playerTwo = lobby[y];

    socketIO.to(playerOne.socketId).emit('match found', 'You\'ve been matched with: ' + playerTwo.playerId);
    socketIO.to(playerTwo.socketId).emit('match found', 'You\'ve been matched with: ' + playerOne.playerId);

    socketIO.sockets.connected[playerOne.socketId].disconnect();
    socketIO.sockets.connected[playerTwo.socketId].disconnect();
}

const findMatches = function (io) {
    // so long as the lobby has two or more players, check for matches
    if (!(lobby.length >= 2)) return;

    socketIO = io;

    let mustMatch = false;
    let leastGap = Infinity;
    let match = null;

    for (let x = 0; x < lobby.length; x++) {
        const playerOne = lobby[x];

        // if a player has been waiting for MAX_WAIT_TIME or longer, they must be matched this round
        if (new Date().getTime() - lobby[x].timestamp >= constants.MAX_WAIT_TIME) mustMatch = true;

        for (let y = 0; y < lobby.length; y++) {
            if (y === x) continue;

            const playerTwo = lobby[y];

            _applyModifier(playerOne.userData.games_played, playerTwo.userData.games_played);

            if (!mustMatch) {
                // check if player is within acceptable MMR range
                if (_calculateDifferenceModified(playerOne.userData.mmr, playerTwo.userData.mmr) <= constants.MAX_SKILL_GAP) {
                    _handleMatch(x, y);
                }
            } else {
                // just find the closest match
                const skillDifference = _calculateDifferenceModified(playerOne.userData.mmr, playerTwo.userData.mmr);

                if (skillDifference < leastGap) {
                    leastGap = skillDifference;
                    match = y;
                }
            }

            playerOneMod = 0;
            playerTwoMod = 0;
        }
        if (mustMatch) {
            _handleMatch(x, match);
            mustMatch = false;
            leastGap = Infinity;
            match = null;
        }
    }
}

module.exports = findMatches;