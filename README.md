# 'Statementflow-api'

[Live App](https://statementflow.vercel.app/).

## Description

'Statementflow' is meant to be a tool to help accountants in the preparation of financial statements. The first version of this project offers basic functionality that can serve as a good foundation for further development.

'Statementflow-api' is the server-side of the application. It is set-up to store and serve template, clients and worksheet data.

## Further goals for this project

For this first version there is one template available: "Personal Financial Statement (Compilation)".

In future versions I expect to let users create their own templates using the client app. For now, templates have to be created as a JSON document and added using this API.

## Summary

The server-side application offers CRUD functions for templates, worksheets, statements and clients.

## Built with

This project was made with Express, Knex and Postgresql.

## Client side repo:

[Statementflow-api](https://github.com/wayfaringjou/statementflow)

## API documentation

### Authentication

Unauthenticated clients can't make requests. To use this API an authentication key is needed.

### Resources in the REST API

#### Clients

Basic client's data used to relate statements and worksheets with specific individuals.

#### Statements

Representation of a client's financial statement for a specific date. Every statement object stores the template used and the financial data for that statement.

#### Worksheets

Reference of worksheets that have been created with information about when they were last modified, what template was used, for which client and what data is related with that worksheet.

#### Templates

Representation of worksheet templates that can be used to gather client's data. Each template is stored in JSON format.

### Endpoints available

All endpoints require `Authorization: Bearer {api-token}` included in the request's header.

#### /api/templates

##### Actions

- `GET /api/templates`

  - Response:
    List of all templates. Each template has an id, name and template data stored in JSON format.

- `GET /api/templates/{template-id}`

  - Response:
    Single template for the given id.

- `POST /api/templates/`
  Create a new template object.

  - Parameters

    | name     |  type  |  in  | description                                                                        |
    | :------- | :----: | :--: | :--------------------------------------------------------------------------------- |
    | name     | string | body | (Required) Name for the template                                                   |
    | template |  json  | body | (Required) Structured data representing template's sections, items and components. |

#### /api/clients

##### Actions

- `GET /api/clients`

  - Response:
    List of all clients. Each client has an id and name.

- `GET /api/clients/{client-id}`

  - Response:
    Single client for the given id.

- `POST /api/clients/`
  Create a new client object.

  - Parameters

    | name |  type  |  in  | description                    |
    | :--- | :----: | :--: | :----------------------------- |
    | name | string | body | (Required) Name for the client |

#### /api/statements

##### Actions

- `GET /api/statements`

  - Response:
    List of all statements. Each statement has an id, the client's id for that statement, the date for that statement and the client's financial data stored in JSON format.

- `GET /api/statements/{statement-id}`

  - Response:
    Single statement for the given id.

- `POST /api/statements/`
  Create a new statement object.

  - Parameters

    | name          |  type  |  in  | description                                                                                           |
    | :------------ | :----: | :--: | :---------------------------------------------------------------------------------------------------- |
    | clientId      | number | body | (Required) Client id for the new statement                                                            |
    | statementDate | string | body | (Required) Date for the new statement in YYYY-MM-DD format.                                           |
    | values        |  json  | body | (Required) Structured data representing statement's sections, items and components with client's data |

- `PATCH /api/statements/{statement-id}`
  Update a statement object.

  - Parameters

    | name          |  type  |  in  | description                                                                                           |
    | :------------ | :----: | :--: | :---------------------------------------------------------------------------------------------------- |
    | statementDate | string | body | (Required) Date for the statement in YYYY-MM-DD format.                                               |
    | values        |  json  | body | (Required) Structured data representing statement's sections, items and components with client's data |

#### /api/worksheets

##### Actions

- `GET /api/worksheets`

  - Response:
    List of all worksheets. Each worksheet has an id, modified date, also references to client's id, template's id, and statement's data id.

- `GET /api/worksheets/{worksheet-id}`

  - Response:
    Single worksheet representation for the given id.

- `POST /api/worksheets/`
  Create a new worksheet object.

  - Parameters

    | name            |  type  |  in  | description                                                          |
    | :-------------- | :----: | :--: | :------------------------------------------------------------------- |
    | clientId        | number | body | (Required) Id of client this worksheet is for.                       |
    | templateId      | number | body | (Required) Id of template used for the worksheet.                    |
    | statementDataId | number | body | (Required) Id of statement object used to store this worksheet data. |
