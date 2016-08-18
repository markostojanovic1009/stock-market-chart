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


exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('stocks', (stocks) => {
            stocks.increments();
            stocks.string('symbol').notNullable().unique();
            stocks.text('description');
            stocks.date('created_at').defaultTo(formatDate(new Date()));
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('stocks')
    ]);
};
