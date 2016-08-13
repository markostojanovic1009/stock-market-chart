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

    afterEach((done) => {
        knex.migrate.rollback().then(() => {
            done();
        }).catch((error) => {
            console.log("Database cleanup error: ", error);
        });
    });
});