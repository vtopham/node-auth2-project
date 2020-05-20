
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
      tbl.increments('id');
      tbl.string('username')
        .unique()
        .notNullable();
      tbl.string('password')
        .notNullable();
      tbl.string('department')
        .defaultTo('5')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
