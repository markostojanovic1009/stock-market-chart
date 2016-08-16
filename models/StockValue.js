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


const genericMessage = {
    msg: "An error occurred. Please try later"
};


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
    },

    getStockValues(stock_id) {
        return new Promise((resolve, reject) => {
            knex.select('value', 'day').from('stock_values')
                .where({stock_id}).orderBy('day', 'desc').then((stockValues) => {
                    const mapped = stockValues.map((item) => {
                        return {
                            value: item.value,
                            day: formatDate(item.day)
                        }
                    });
                resolve(mapped);
            }).catch((error) => {
                reject(error);
            });
        })
    },

    getAll() {
        return new Promise((resolve, reject) => {
           knex.select('stock_id', 'value', 'day').from('stock_values').orderByRaw('day DESC, stock_id').then((result) => {
               let sortedData = [];
               result.forEach((item) => {
                   for(let i = 0; i < sortedData.length; i++) {
                       if(sortedData[i].day === formatDate(item.day)) {
                           sortedData[i].stocks.push({id: item.stock_id, value: parseFloat(item.value)});
                           return;
                       }
                   }
                   sortedData.push({
                       day: formatDate(item.day),
                       stocks: [{id: item.stock_id, value: parseFloat(item.value)}]
                   });
               });

              resolve(sortedData);
           }).catch((error) => {
               console.log(error);
               reject(genericMessage);
           });
        });
    }

};

export default StockValue;