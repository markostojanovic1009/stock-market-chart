const server = require('../../server');
const request = require('supertest');

const knex = require('../../config/database');
const chai = require('chai');
const expect = chai.expect;

import Stock from '../../models/Stock';

chai.use(require('chai-as-promised'));

describe('Stock Model', () => {

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

    describe('all', () => {

        it('should return an empty array when no stocks are present', () => {
           return expect( Stock.all() ).to.eventually.deep.equal([]);
        });

        it('should return an array of stocks', () => {
           return expect( knex('stocks').insert([{symbol: 'AAPL'}, {symbol: 'GOOG'}]).then(() => {
               return Stock.all();
           })).to.eventually.have.lengthOf(2);
        });
    });

    describe('create', () => {

        it('should create a new stock', () => {
           expect( Stock.create('AAPL').then(() => {
              return knex.select('symbol').from('stocks');
           })).to.eventually.deep.equal([{
               symbol: "AAPL"
           }]);
        });

        it('should reject if we try to insert symbol twice', () => {
            return expect(Stock.create('GOOG').then(() => {
                return Stock.create('GOOG');
            })).to.be.rejected.and.eventually.deep.equal({msg: "Company with symbol GOOG was already added."});

        })

    });

    describe('remove', () => {

        it('should delete a new stock', () => {

            return expect( knex('stocks').insert({symbol: "GOOG"}, 'id').then((stockId) => {
                return Stock.remove(parseInt(stockId));
            }).then(() => {
                return knex.select('*').from('stocks');
            })).to.eventually.deep.equal([]);

        });


    });

    afterEach((done) => {
        knex.migrate.rollback().then(() => {
            done();
        }).catch((error) => {
            console.log("Database cleanup error: ", error);
        });
    });
});