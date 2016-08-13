exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('stocks', (stocks) => {
            stocks.increments();
            stocks.string('symbol').notNullable().unique();
            stocks.date('created_at').defaultTo(knex.fn.now());
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('stocks')
    ]);
};
