const knex = require('../config/database');


function formatDate (date) {
    function fill(value) {
        if(value < 10) {
            return "0" + value.toString();
        } else {
            return value.toString();
        }
    }
    return date.getFullYear() + "-" + fill(date.getMonth() + 1) + '-' + fill(date.getDate());
}


/**
 * Database schema:
 * id SERIAL - Primary key,
 * symbol VARCHAR(255) NOT NULL UNIQUE - NASDAQ symbol for the stock. They are guaranteed to be unique,
 * created_at DATE - Defaults to knex.fn.now()
 */

const Stock = {

    all() {
        return new Promise((resolve, reject) => {
            return knex.select('id', 'symbol', 'created_at').from('stocks')
                .then((stocks) => {
                    resolve(stocks);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    create(stockSymbol) {
        return new Promise((resolve, reject) => {
           return knex('stocks')
               .returning(['id', 'symbol'])
               .insert({symbol: stockSymbol.toUpperCase()})
               .then((array) => {
                    resolve(array[0]);
               }).catch((error) => {
                    if(error.code == '23505') { // Postgres code for unique violation
                        reject({msg: `Company with symbol ${stockSymbol.toUpperCase()} was already added.`});
                    } else {
                        reject({msg: "An error occurred. Please try later"});
                    }
               });
        });
    },

    remove(stockId) {
        return new Promise((resolve, reject) => {
            return knex('stocks')
                .where('id', stockId)
                .del().then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
        });
    }
};

export default Stock;