exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('stocks', (stocks) => {
            stocks.increments();
            stocks.string('symbol').notNullable().unique();
            stocks.timestamp('created_at').defaultTo(knex.fn.now());
        }).createTable('stock_values', (table) => {
            table.increments();
            table.integer('stock_id').references('stocks.id').onDelete('CASCADE');
            table.decimal('value', 14, 2);
            table.date('day');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('stock_values').dropTableIfExists('stocks')
    ]);
};
