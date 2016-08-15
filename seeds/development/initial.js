
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('stock_values').del().then(() => {
      return knex('stocks').del();
    }).then(() => {
      return knex('stocks').insert([
          {symbol: "GOOG", description: 'Google, Inc. Owner of google.com search engine, youtube...'},
          {symbol: 'AAPL', description: 'Apple, Inc. Makes iPhones, iPads and other "i" stuff'}], 'id');
    }).then((ids) => {
      return knex('stock_values').insert([
          {stock_id: parseInt(ids[0]), value: Math.random() * 100},
          {stock_id: parseInt(ids[0]), value: Math.random() * 100, day: '2016-08-14'},
          {stock_id: parseInt(ids[1]), value: Math.random() * 250}]);
    })
  );
};
