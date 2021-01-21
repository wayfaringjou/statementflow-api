const worksheetsService = {
  getAllWorksheets(knex) {
    return knex.select('*').from('worksheets');
  },
  getById(knex, id) {
    return knex.from('worksheets').select('*').where('id', id).first();
  },
  postWorksheet(knex, newWorksheet) {
    return knex
      .insert(newWorksheet)
      .into('worksheets')
      .returning('*')
      .then((rows) => rows[0]);
  },
};

module.exports = worksheetsService;
