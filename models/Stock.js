import knex from '../config/database';

const Stock = {
    create(stockSymbol) {
        return new Promise((resolve, reject) => {
           return knex('stocks')
               .insert({symbol: stockSymbol.toUpperCase()})
               .then(() => {
                    resolve();
               }).catch((error) => {
                    reject(error);
               });
        });
    }
};

export default Stock;