const personalStatement = require('./personalStatement.json');

function makeTemplatesArray() {
  return [
    {
      id: 1,
      name: 'Personal Finance Statement',
      template: personalStatement,
    },
  ];
}

module.exports = {
  makeTemplatesArray,
};
