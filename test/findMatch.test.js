const findMatch = require('../global/findMatch');
const lobby = require('../global/lobby');

const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

describe('Matching script tests', () => {

    it('matches two players with the same adjusted mmr', done => {
        const now = new Date().getTime();
        const matchMock = sinon.mock(findMatch.handleMatch);

        matchMock.

        lobby.push(
            {
                userData: {
                    mmr: 400,
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 1000000,
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 400,
                    games_played: 40
                },
                timestamp: now
            }
        );

        findMatch.findMatches(null);

        matchMock.restore();
        matchMock.should.have.been.calledWith(0, 3);

        done();
    });
});