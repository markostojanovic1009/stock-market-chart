
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('stock_values').del().then(() => {
      return knex('stocks').del();
    }).then(() => {
      return knex('stocks').insert([
          {symbol: "GOOG", created_at: '2016-08-01', description: 'Google, Inc. Owns google.com search engine, youtube and like half the internet...'},
          {symbol: 'AAPL', created_at: '2016-08-01', description: 'Apple, Inc. Makes iPhones, iPads and other "i" stuff'}], 'id');
    }).then((ids) => {
      return knex('stock_values').insert([
           {"stock_id":ids[1],"value":105.4786,"day":"2016-08-01"},
           {"stock_id":ids[1],"value":103.9171,"day":"2016-08-02"},
           {"stock_id":ids[1],"value":105.22,"day":"2016-08-03"},
           {"stock_id":ids[1],"value":105.87,"day":"2016-08-04"},
           {"stock_id":ids[1],"value":107.48,"day":"2016-08-05"},
           {"stock_id":ids[1],"value":108.37,"day":"2016-08-08"}, 
           {"stock_id":ids[1],"value":108.81,"day":"2016-08-09"},
           {"stock_id":ids[1],"value":108,"day":"2016-08-10"},
           {"stock_id":ids[1],"value":107.93,"day":"2016-08-11"},
           {"stock_id":ids[1],"value":108.18,"day":"2016-08-12"},
           {"stock_id":ids[1],"value":109.48,"day":"2016-08-15"},
           {"stock_id":ids[1],"value":109.38,"day":"2016-08-16"},
           {"stock_id":ids[0],"value":772.88,"day":"2016-08-01"},
           {"stock_id":ids[0],"value":771.07,"day":"2016-08-02"},
           {"stock_id":ids[0],"value":773.18,"day":"2016-08-03"},
           {"stock_id":ids[0],"value":771.61,"day":"2016-08-04"},
           {"stock_id":ids[0],"value":782.22,"day":"2016-08-05"},
           {"stock_id":ids[0],"value":781.76,"day":"2016-08-08"},
           {"stock_id":ids[0],"value":784.26,"day":"2016-08-09"},
           {"stock_id":ids[0],"value":784.68,"day":"2016-08-10"},
           {"stock_id":ids[0],"value":784.85,"day":"2016-08-11"},
           {"stock_id":ids[0],"value":783.22,"day":"2016-08-12"},
           {"stock_id":ids[0],"value":782.44,"day":"2016-08-15"},
           {"stock_id":ids[0],"value":777.14,"day":"2016-08-16"} ]);
    })
  );
};
