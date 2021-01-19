module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/statementflow',
  TEST_DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/statementflow',
  API_TOKEN: process.env.API_TOKEN || 'de8210db-a220-475e-9970-d6fe86a85523',
};
