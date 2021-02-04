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