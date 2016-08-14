const knex = require('../config/database');


/**
 * Database schema:
 * id SERIAL - Primary key,
 * value decimal(14, 2) - precision is 2 decimal digits for cents and 14 for dollars,
 * stock_id INTEGER FOREIGN KEY REFERENCES Stock.id,
 * day DATE - Day when the stock had the given value. Defaults to knex.fn.now()
 */

const StockValue = {

    setValue(stockId, value, day) {
        let stockValue = {
            stock_id: stockId,
            value,
        };
        if(day) {
            stockValue.day = day;
        }
        return new Promise((resolve, reject) => {
            knex('stock_values').insert(stockValue).then(() => {
                resolve();
            }).catch((error) => {
                // Postgres code for foreign key violation, in this case stock_id
                if(error.code === '23503') {
                    reject({msg: "Stock id is invalid."});
                } else {
                    console.log(error);
                    reject({msg: "An error occurred."});
                }
            });
        });
    },

    getStockValueForDay(stock_id, day) {
        return new Promise((resolve, reject) => {
           knex.select('stock_id', 'value').from('stock_values').where({stock_id, day}).then((stockValue) => {
               resolve(stockValue);
           }).catch((error) => {
               console.log(error);
               reject();
           });
        });
    }

};

export default StockValue;