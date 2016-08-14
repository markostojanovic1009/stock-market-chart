const knex = require('../config/database');

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
    }

};

export default StockValue;