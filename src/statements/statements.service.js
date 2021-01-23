const statementsService = {
  getAllStatements(knex) {
    return knex.select('*').from('statements');
  },
  getById(knex, id) {
    return knex.from('statements').select('*').where('id', id).first();
  },
  postStatement(knex, newStatement) {
    return knex
      .insert(newStatement)
      .into('statements')
      .returning('*')
      .then((rows) => rows[0]);
  },
  updateStatement(knex, id, newStatementFields) {
    return knex('statements')
      .where({ id })
      .update(newStatementFields);
  },
};

module.exports = statementsService;
