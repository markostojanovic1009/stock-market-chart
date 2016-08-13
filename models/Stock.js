const knex = require('../config/database');

const Stock = {
    create(stockSymbol) {
        return new Promise((resolve, reject) => {
           return knex('stocks')
               .insert({symbol: stockSymbol.toUpperCase()})
               .then(() => {
                    resolve();
               }).catch((error) => {
                    if(error.code == '23505') { // Postgres code for unique violation
                        reject({msg: `Company with symbol ${stockSymbol.toUpperCase()} was already added.`});
                    } else {
                        reject({msg: "An error occurred. Please try later"});
                    }
               });
        });
    }
};

export default Stock;