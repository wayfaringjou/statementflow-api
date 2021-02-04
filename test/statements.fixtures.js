const personalStatement = require('./personalStatement.json');

function makeStatementsArray() {
  return [
    {
      id: 1,
      clientId: 1,
      values: personalStatement,
      statementDate: '2021-02-03T00:00:00.000Z',
    },
  ];
}

module.exports = {
  makeStatementsArray,
};
