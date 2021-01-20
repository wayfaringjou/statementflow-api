const worksheetTemplatesService = {
  getAllTemplates(knex) {
    return knex.select('*').from('templates');
  },
  getById(knex, id) {
    return knex.from('templates').select('*').where('id', id).first();
  },
  postTemplate(knex, newTemplate) {
    return knex
      .insert(newTemplate)
      .into('templates')
      .returning('*')
      .then((rows) => rows[0]);
  },
};

module.exports = worksheetTemplatesService;
