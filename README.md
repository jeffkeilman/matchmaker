# Matching service
---
An Express API built on Node.js that matches players for 1v1 matches based on [MMR](https://dota2.gamepedia.com/Matchmaking_Rating). Players are matched by skill as well as experience.

---
## Assumptions
- A service must exist to pull player MMR and total games played
- API token auth already exists with a user lookup table

---
## Technologies
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Mocha](https://mochajs.org/)
- [Chai](http://www.chaijs.com/)
- [Sinon](http://sinonjs.org/)
- [supertest](https://github.com/visionmedia/supertest)
- [Socket.io](https://socket.io/)

---
## API Endpoints
| Verb | URI Pattern | Controller#Action |
| ------------- |:-------------:| :-------------:|
| GET | /match | match#getMatch |

---
## Summary

A GET request to /match (from a browser or socket testing tool) with proper authorization header (reference mock/auth.js for valid tokens) will trigger the match controller. This will hit a mock store containing a user ID that will be passed to a mock service to pull player MMR and total games played. If all of this is done successfully, the controller will return a simple script containing the code to connect a client to the service's Socket.io instance.

Given a successful connection, player data and a socket ID will be added, in a JS object, to the lobby (exported array in global/lobby.js). The lobby has can be limited by adjusting global/constants.MAX_LOBBY_CAPACITY. 

If two or more players are in the lobby, a script will run attempting to find matches for all players in the lobby every global/constants.FIND_MATCH_INTERVAL milliseconds. Matches are attempted in FIFO order. Each player is compared to each other based on their base MMR, which can be modified depending on the difference in games played between the two players. For every global/constants.GAMES_PLAYED_GAP more games that one player has played, it's opponent's MMR will lose global/constants.SKILL_MODIFIER.

Example: player_1 has played 50 games, player_2 has played 100 games. GAMES_PLAYED_GAP = 50. SKILL_MODIFIER = 100. player_1.mmr === player_1.mmr - 100.

If two players are within global/constants.MAX_SKILL_GAP from each other, they are considered a match. The two will be notified, removed from the lobby, and their sockets will be disconnected.

Caveat: If a player has been in the lobby for at least global/constants.MAX_WAIT_TIME (milliseconds), the player must be matched on their next attempt. They will be matched to the opponent with the closest MMR.