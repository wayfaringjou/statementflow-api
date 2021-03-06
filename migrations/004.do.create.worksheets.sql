CREATE TABLE worksheets (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  modified TIMESTAMPTZ NOT NULL DEFAULT now(),
  "clientId" INTEGER REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  "templateId" INTEGER REFERENCES templates(id) ON DELETE CASCADE NOT NULL,
  "statementDataId" INTEGER REFERENCES statements(id) ON DELETE CASCADE NOT NULL
);