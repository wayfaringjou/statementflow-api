const personalStatement = require('./personalStatement.json');

function makeStatementsArray() {
  return [
    {
      id: 1,
      clientId: 1,
      values: personalStatement,
    },
  ];
}

module.exports = {
  makeStatementsArray,
};
