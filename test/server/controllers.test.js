const server = require('../../server');
const request = require('supertest-as-promised');
const knex = require('../../config/database');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('stock controller', () => {

    beforeEach((done) => {
        knex.migrate.latest()
            .then(() => {
                return knex.seed.run();
            }).then(() => {
            done();
        }).catch((error) => {
            console.log("Database setup error: ", error);
            done();
        });
    });

    afterEach((done) => {
        knex.migrate.rollback().then(() => {
            done();
        }).catch((error) => {
            console.log("Database cleanup error: ", error);
        });
    });

    describe('POST /api/stock', () => {

        it('should create a new stock', (done) => {
            request(server)
                .post('/api/stock')
                .send({symbol: 'GOOG'})
                .expect(200)
                .then((res) => {
                    expect(res.body).to.deep.equal({
                        id: 1,
                        symbol: 'GOOG'
                    });
                    done();
                }).catch((error) => {
                    done(error);
                });
        });

        it('should return an error when no symbol is passed', (done) => {

            request(server)
                .post('/api/stock')
                .send({symbol: ''})
                .expect(400)
                .then((res) => {
                    expect(res.body).to.deep.equal([{
                        msg: "Symbol cannot be empty."
                    }]);
                    done();
                }).catch((error) => {
                    done(error);
                });

        });

    });

});