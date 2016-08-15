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

    describe('GET /api/stock', () => {

        it('should return all stocks', () => {
            knex('stocks').insert([{symbol: 'GOOG'}, {symbol: 'AAPL'}]).then(() => {
                request(server).get('/api/stock').expect(200).then((res) => {
                    expect(res.body).to.have.lengthOf(2);
                });
            });
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

    describe('POST /api/stock/:stockId', () => {

        it('should add the value of a stock', () => {
            const value = 200.05;
            const day = '2016-08-15';

            knex('stocks').insert({symbol: 'GOOG'}, 'id').then((stockId) => {
                return request(server).post(`/api/stock/${parseInt(stockId)}`).send({ value, day }).expect(204);
            }).then(() => {
                expect( knex.select('value', 'stock_id').from('stock_values').where('stock_id', 1) )
                    .to.eventually.deep.equal( [{
                    value: value.toString(),
                    stock_id: 1
                }] );
            });

        });

        it('should return an error when wrong stock_id is sent', () => {

            request(server).post('/api/stock/4').send({value: 200}).expect(400).then((res) => {
                expect(res.body).to.deep.equal({
                    msg: "Stock id is invalid."
                });
            });

        });

        it('should return an erro when value is not a float', () => {

            request(server).post('/api/stock/1').send({value: 'STRING'}).expect(400).then((res) => {
               expect(res.body).to.deep.equal([{
                   msg: "Invalid value."
               }]);
            });
        })

    });

    describe('GET /api/stock/:stockId', () => {

        it('should get the value of a stock on a day passed in a query', () => {

            const day = '2016-08-10';
            const value = 2142.85;

            return expect( knex('stocks').insert({symbol: 'GOOG'}).then(() => {
                return knex('stock_values').insert({stock_id: 1, value, day});
            }).then(() => {
                return request(server).get(`/api/stock/1?day=${day}`).expect(200)
            }).then((res) => {
                return res.body;
            }) ).to.eventually.deep.equal([{
                value: value.toString(),
                stock_id: 1
            }]);

        });

        it('should get the values and dates when no day query is passed', () => {

            const day1 = '2016-04-15';
            const value1 = 2034.32;
            const day2 = '2016-07-23';
            const value2 = 3482.32;

            return expect( knex('stocks').insert( {symbol: 'GOOG' }).then(() => {
               return knex('stock_values').insert([
                   {stock_id: 1, value: value1, day: day1},
                   {stock_id: 1, value:value2, day: day2}
                   ]);
            }).then(() => {
                return request(server).get('/api/stock/1').expect(200);
            }).then((res) => {
                return res.body;
            }) ).to.eventually.deep.equal([
                {
                    value: value2.toString(),
                    day: day2
                }, {
                    value: value1.toString(),
                    day: day1
                }
            ]);

        })

    });

    describe('DELETE /api/stock/:stockId', () => {

        it('should delete a stock', () => {

            knex('stocks').insert({symbol: 'GOOG'}, 'id').then((stockId) => {
                request(server).del(`/api/stock/${parseInt(stockId)}`).expect(204);
            });

        });

        it('should return 204 on wrong stockId param', () => {
            return request(server).del('/api/stock/4').expect(204);
        });

    });


});