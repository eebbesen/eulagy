# EULAgy
Use AWS to read EULAs

## Develop
1. [Install npm](https://www.npmjs.com/get-npm)
1. `npm install`
1. Create PostgreSQL instance [on Amazon RDS](https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/) or [locally](https://www.postgresql.org/download/)
1. `cp db/example.config.js db/config.js` and modify the `development` and `test` entries to connect to your PostgreSQL instance(s)
1. Use scripts in migrations to create database objects and populate tables with data
1. `npm test` to validate setup!

## Deploy
1. Create PostgreSQL instance [on Amazon RDS](https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/)
