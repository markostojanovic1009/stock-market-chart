const knex = require('../config/database');

const Stock = {

    create(stockSymbol) {
        return new Promise((resolve, reject) => {
           return knex('stocks')
               .returning(['id', 'symbol'])
               .insert({symbol: stockSymbol.toUpperCase()})
               .then((array) => {
                    resolve(array);
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