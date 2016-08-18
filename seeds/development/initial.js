
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('stock_values').del().then(() => {
      return knex('stocks').del();
    }).then(() => {
        return knex('stocks').insert([
            {symbol: "GOOG", description: 'Alphabet Inc (GOOG)'},
            {symbol: 'AAPL', description: 'Apple Inc (AAPL)'}]);
    })
  );
};
