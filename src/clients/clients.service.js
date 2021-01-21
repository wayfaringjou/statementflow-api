const clientsService = {
  getAllClients(knex) {
    return knex.select('*').from('clients');
  },
  getById(knex, id) {
    return knex.from('clients').select('*').where('id', id).first();
  },
  postClient(knex, newClient) {
    return knex
      .insert(newClient)
      .into('clients')
      .returning('*')
      .then((rows) => rows[0]);
  },
};

module.exports = clientsService;
