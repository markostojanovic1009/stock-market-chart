const server = require('../../server');
const request = require('supertest');

const knex = require('../../config/database');
const chai = require('chai');
const expect = chai.expect;

import Stock from '../../models/Stock';
import StockValue from '../../models/StockValue';

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

describe('StockValue model', () => {

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

    describe('setValue', () => {

        it('should set the value of a stock at a given date', () => {
            let insertedStockId = 1;
            const day = new Date().toDateString();
            const value = 100.05;
            return expect( knex('stocks').insert({symbol: 'GOOG'}, 'id').then((stockId) => {
                insertedStockId = stockId;
                return StockValue.setValue(parseInt(stockId), value, day);
            }).then(() => {
                return knex.select('stock_id', 'value').from('stock_values');
            })).to.eventually.deep.equal([{
                value: value.toString(),
                stock_id: insertedStockId
            }]);
        });

        it('should return an error when a wrong stock_id is passed', () => {
           return expect( StockValue.setValue(1000, 2000.00) ).to.be.rejected.and.eventually.deep.equal({
               msg: "Stock id is invalid."
           });
        });

        it('should properly truncate the value to only 2 decimal places', () => {
            return expect( knex('stocks').insert({symbol: 'GOOG'}, 'id').then((stockId) => {
                return StockValue.setValue(parseInt(stockId), 200.03043);
            }).then(() => {
                return knex.select('value').from('stock_values');
            }) ).to.eventually.deep.equal([{
                value: '200.03'
            }]);
        });

    });

    describe('getStockValueForDay', () => {

        it('should return the stock_id and day', () => {
            let stock_id = 1;
            const value = 200.05;
            return expect( knex('stocks').insert({symbol: "GOOG"}, 'id').then((insertedId) => {
                stock_id = parseInt(insertedId);
                return knex('stock_values').insert({stock_id, value});
            }).then(() => {
                return StockValue.getStockValueForDay(1, new Date().toDateString());
            }) ).to.eventually.deep.equal([{
                value: value.toString(),
                stock_id
            }]);

        });

        it('should return an empty array when wrong date is passed', () => {

            return expect( knex('stocks').insert({symbol: "GOOG"}, 'id').then((insertedId) => {
                return knex('stock_values').insert({stock_id: parseInt(insertedId), value: 2133.32});
            }).then(() => {
                return StockValue.getStockValueForDay(1, '2023-03-13');
            }) ).to.eventually.deep.equal([]);

        });

        it('should return an empty array when wrong stock_id is passed', () => {

            return expect( knex('stocks').insert({symbol: "GOOG"}, 'id').then((insertedId) => {
                return knex('stock_values').insert({stock_id: parseInt(insertedId), value: 2133.32});
            }).then(() => {
                return StockValue.getStockValueForDay(100, new Date().toDateString());
            }) ).to.eventually.deep.equal([]);

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