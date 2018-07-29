# Matching service
An Express API built on Node.js that matches players for 1v1 matches based on [MMR](https://dota2.gamepedia.com/Matchmaking_Rating). Players are matched by skill as well as experience.

Run with:
`npm dev run`

Test with:
`npm test`

## Assumptions
- A service must exist to pull player MMR and total games played
- API token auth already exists with a user lookup table

## Technologies
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Mocha](https://mochajs.org/)
- [Chai](http://www.chaijs.com/)
- [Sinon](http://sinonjs.org/)
- [supertest](https://github.com/visionmedia/supertest)
- [Socket.io](https://socket.io/)

## API Endpoints
| Verb | URI Pattern | Controller#Action |
| ------------- |:-------------:| :-------------:|
| GET | /match | match#getMatch |

## Summary
A GET request to /match (from a browser or socket testing tool) with proper authorization header (reference mock/auth.js for valid tokens) will trigger the match controller. This will hit a mock store containing a user ID that will be passed to a mock service to pull player MMR and total games played. If all of this is done successfully, the controller will return a simple script containing the code to connect a client to the service's Socket.io instance.

Given a successful connection, player data and a socket ID will be added, in a JS object, to the lobby (exported array in global/lobby.js). The lobby has can be limited by adjusting global/constants.MAX_LOBBY_CAPACITY. 

If two or more players are in the lobby, a script will run attempting to find matches for all players in the lobby every global/constants.FIND_MATCH_INTERVAL milliseconds. Matches are attempted in FIFO order. Each player is compared to each other based on their base MMR, which can be modified depending on the difference in games played between the two players. For every global/constants.GAMES_PLAYED_GAP more games that one player has played, it's opponent's MMR will lose global/constants.SKILL_MODIFIER.

Example: player_1 has played 50 games, player_2 has played 100 games. GAMES_PLAYED_GAP = 50. SKILL_MODIFIER = 100. player_1.mmr === player_1.mmr - 100.

If two players are within global/constants.MAX_SKILL_GAP from each other, they are considered a match. The two will be notified, removed from the lobby, and their sockets will be disconnected.

Caveat: If a player has been in the lobby for at least global/constants.MAX_WAIT_TIME (milliseconds), the player must be matched on their next attempt. They will be matched to the opponent with the closest MMR.

## Production Ready Diagram/Description
[Diagram](https://drive.google.com/open?id=1Y6iomaYw1Mw4nJJksZSUajQVXMcs1msh)

- The matchMaking service should communicate with clients through sockets. This would allow for realtime updates for matches.
- The matchMaking service will communicate with a playerAuth API (internal) with AJAX. This will be used to look up player IDs (used in external playerInfoAPI).
- The matchMaking service should communicate with playerInfoAPI (external) with AJAX. This service would be used to pull down information about a player.
- Depending on the format of said data, an additional "parsing" service might be necessary. playerInfoParser would communicate with matchMaking service via AJAX. I noticed that services like OpenDota often don't have a very clear MMR. Calculations might have to be made in this service.

The biggest bottleneck in this system is the external playerInfoAPI. We could not guarantee the availability of this service. We also couldn't guarantee the speed of its calls. This problem increases with latency should the external API be hosted in a single place and we have customers around the world.

In order to mitigate this, we could implement a player information cache with redis, and a call throttler in the event that the playerInfoAPI throttles connections. The redis cache could be refreshed periodically (5-10 hours for users that have recently played, within the past week) with minimal loss of user experience since stale data would rarely drastically affect matches.

The service would need to be deployed on a server with significant storage to hold the cache (approx slightly less than 1 tb), configured with PM2. 3-4 could be deployed in strategic locations around the world to decrease latency for our international players.

All in all, I think that the wait time for responses from the server will not be significant with this approach given that players are already used to waiting 15+ minutes in matchmaking lobbies and this should be significantly faster assuming plenty of players.