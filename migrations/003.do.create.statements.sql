CREATE TABLE statements (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  "clientId" INTEGER REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  "statementDate" DATE NOT NULL DEFAULT now(),
  values JSONB NOT NULL
);