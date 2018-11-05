# EULAgy
Use AWS Polly to create mp3s from EULA text.

## Convert text to mp3
Execute
```js
node lib/db_to_mp3.js
```
and mp3s for all content in the EULA table will be placed in the `output` directory.

## Develop
1. [Install npm](https://www.npmjs.com/get-npm)
1. `npm install`
1. Create PostgreSQL instance [on Amazon RDS](https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/) or [locally](https://www.postgresql.org/download/)
1. `cp db/example.config.js db/config.js` and modify the `development` and `test` entries to connect to your PostgreSQL instance(s)
1. Use scripts in migrations to create database objects and populate tables with data
1. `npm test` to validate setup!

## Deploy
1. Create PostgreSQL instance [on Amazon RDS](https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/)

## Other
### PostgreSQL setup notes
1. `createuser -s postgres`
1. `psql postgres`
1. Run script
```sql
create role eulagy_user with login password 'abcd!1234';
create database eulagy;
GRANT ALL PRIVILEGES ON DATABASE eulagy to eulagy_user;
create role eulagy_test with login password 'abcd!1234';
create database eulagy_test_user;
GRANT ALL PRIVILEGES ON DATABASE eulagy_test to eulagy_test_user;
```

### Helper functions
#### List buckets
```bash
node lib/buckets
```

#### Create bucket
Bucket name defaults to `eulagy`. Will not create a bucket that already exists.
```bash
node lib/buckets create [name]
```

#### Upload files
Will upload all files from `output` to S3 bucket named `eulagy`. DOES NOT check for duplicates, so move records from `output` to `uploaded` once they are uploaded.
```bash
node lib/buckets upload
```

## Experimental


### PostgreSQL for testing in Circle CI
Working on using RDS instance from Circle CI to run unit tests, but there is a connection timeout when connecting to the database ( maybe because of some AWS or Circle CI restrictions?). So this doesn't work yet.

#### Configure
Populate db/ci_config.yml with the non-secret info for your RDS instance, and set the following environment variables in Circle CI for your project:
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* CI_PG_HOST: database host
* CI_PG_PASS: database user password

