const findMatch = require('../global/findMatch');
const lobby = require('../global/lobby');

const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

const constants = require('../global/constants');

describe('Matching script tests', () => {

    beforeEach(() => {
        while (lobby.length > 0) {
            lobby.pop();
        }
    });

    it('matches two players with the same adjusted mmr', done => {
        const now = new Date().getTime();
        const matchStub = sinon.stub(findMatch, 'handleMatch');

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

        matchStub.restore();
        matchStub.should.have.been.calledWith(0, 2);

        done();
    });

    it('matches two players with adjusted mmr within defined range', done => {
        const now = new Date().getTime();
        const matchStub = sinon.stub(findMatch, 'handleMatch');

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
                    mmr: 400 + constants.MAX_SKILL_GAP,
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 100000000,
                    games_played: 40
                },
                timestamp: now
            }
        );

        findMatch.findMatches(null);

        matchStub.restore();
        matchStub.should.have.been.calledWith(0, 1);

        done();
    });

    it('does not match a single player in the lobby', done => {
        const now = new Date().getTime();
        const matchStub = sinon.stub(findMatch, 'handleMatch');

        lobby.push(
            {
                userData: {
                    mmr: 400,
                    games_played: 40
                },
                timestamp: now
            }
        );

        findMatch.findMatches(null);

        matchStub.restore();
        matchStub.should.have.not.been.called;

        done();
    });

    it('will match two players closest in skill if max time has been waited', done => {
        const now = new Date().getTime();
        const matchStub = sinon.stub(findMatch, 'handleMatch');

        lobby.push(
            {
                userData: {
                    mmr: 1,
                    games_played: 40
                },
                timestamp: now - (constants.MAX_WAIT_TIME + 1)
            },
            {
                userData: {
                    mmr: 600,
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 60000,
                    games_played: 40
                },
                timestamp: now
            }
        );

        findMatch.findMatches(null);

        matchStub.restore();
        matchStub.should.have.been.calledWith(0, 1);

        done();
    });

    it('will match two players closest in skill if max time has been waited', done => {
        const now = new Date().getTime();
        const matchStub = sinon.stub(findMatch, 'handleMatch');

        lobby.push(
            {
                userData: {
                    mmr: 1,
                    games_played: 40
                },
                timestamp: now - (constants.MAX_WAIT_TIME + 1)
            },
            {
                userData: {
                    mmr: 600,
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 60000,
                    games_played: 40
                },
                timestamp: now
            }
        );

        findMatch.findMatches(null);

        matchStub.restore();
        matchStub.should.have.been.calledWith(0, 1);

        done();
    });

    it('will match two players with modified mmr in the correct range', done => {
        const now = new Date().getTime();
        const matchStub = sinon.stub(findMatch, 'handleMatch');

        const holdGamesPlayedGap = constants.GAMES_PLAYED_GAP;
        const holdMaxSkillGap = constants.MAX_SKILL_GAP;
        const holdSkillModifier = constants.SKILL_MODIFIER;

        constants.GAMES_PLAYED_GAP = 10;
        constants.MAX_SKILL_GAP = 600;
        constants.SKILL_MODIFIER = 100;

        lobby.push(
            {
                userData: {
                    mmr: 1000,
                    games_played: 10
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 1000000000,
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 100,
                    games_played: 40
                },
                timestamp: now
            }
        );

        findMatch.findMatches(null);

        constants.GAMES_PLAYED_GAP = holdGamesPlayedGap;
        constants.MAX_SKILL_GAP = holdMaxSkillGap;
        constants.SKILL_MODIFIER = holdSkillModifier;

        matchStub.restore();
        matchStub.should.have.been.calledWith(0, 2);

        done();
    });

    it('will not match anyone who are not in correct range if time is not past max', done => {
        const now = new Date().getTime();
        const matchStub = sinon.stub(findMatch, 'handleMatch');

        lobby.push(
            {
                userData: {
                    mmr: 100 + (constants.MAX_SKILL_GAP * 2),
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 100 + (constants.MAX_SKILL_GAP * 4),
                    games_played: 40
                },
                timestamp: now
            },
            {
                userData: {
                    mmr: 100 + (constants.MAX_SKILL_GAP * 6),
                    games_played: 40
                },
                timestamp: now
            }
        );

        findMatch.findMatches(null);

        matchStub.restore();
        matchStub.should.have.not.been.called;

        done();
    });
});