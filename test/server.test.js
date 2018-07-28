const request = require('supertest');

describe('Loading service', () => {
    let server;

    beforeEach(() => {
        delete require.cache[require.resolve('../server')];
        server = require('../server');
    });
    
    afterEach(done => {
        server.close(done);
    });

    after(() => {
        process.exit(0);
    });

    it('responds to /match with auth header', (done) => {
        request(server)
            .get('/match')
            .set('authorization', 'lol')
            .expect(201, done);
    });

    it('401s to /match without auth header', (done) => {
        request(server)
            .get('/match')
            .expect(401, done);
    });

    it('401s to /match with incorrect auth header', (done) => {
        request(server)
            .get('/match')
            .set('authorization', 'foobar')
            .expect(401, done);
    });
});