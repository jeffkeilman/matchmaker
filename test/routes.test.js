// const expect = require('chai').expect;

// describe('Router tests', () => {
//     describe('Socket tests', () => {
//         let io, ioServer, ioClient, client;

//         const ioClientOptions = { 
//             transports: ['websocket'],
//             forceNew: true,
//             reconnection: false
//         }

//         const testMsg = 'Match found';

//         beforeEach((done) => {
//             delete require.cache[require.resolve('../server')];
//             server = require('../index');
//             ioServer = require('socket.io')(server);
//             io = require('socket.io-client');

//             ioClient = io.connect('http://localhost:8000/', ioOptions);
            
//             done();
//         });

//         afterEach(function(done){
//             client.disconnect();

//             server.close(done);
//         });


//         it('should receive a connection message when \'found match\' event is emitted.', done => {
            
//             client.on('found match', msg => {
//                 expect(msg).to.equal(testMsg);
//                 done();
//             });
//         });
//     });
// });