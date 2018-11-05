# EULAgy
Get a EULA read to you.

## Using
EULAgy is a utility that can be plugged into an application that will stream an mp3. There is some seed data available in this project, but you are encouraged to add more EULAs yourself.

### Selecting audio
* `app.getRecord()` will select a random record from the database
* `app.getAllRecords()` will retrieve all records from the database

In both cases you can access the mp3 bytes (using the `audio` property of the returned row(s)) and stream or save that to a file.

See `lib/file_utils.downloadMp3` for reference implementation that saves the data to an mp3 file locally.

## How EULAgy works
EULAgy uses AWS Polly to create mp3s from EULA text stored in PostgreSQL. The mp3s are then stored in the same PostgreSQL instance using the `bytea` datatype, allowing you to run the costly conversion one time and use the results infinitely.

## Convert text to mp3
Using the `EULAS.CONTENT` field, create mp3 files.
```bash
node lib/db_to_mp3.js
```
and mp3s for all content in the EULA table will be placed in the `output` directory.

## Add mp3 to database
File to be uploaded must exist in `output` directory.
```bash
node lib/file_utils upload <fileName> <companyName>

node lib/file_utils upload facebook.04.19.2018.0.kimberly.mp3 facebook
```
## Upload files to S3
Will upload all files from `output` to S3 bucket named `eulagy`. DOES NOT check for duplicates, so move records from `output` to `uploaded` once they are uploaded.
```bash
node lib/buckets upload
```

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
### Local PostgreSQL setup notes
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
4. Manually run db/migrations/ files in each database

### S3 bucket policy
1. Create an AWS role with AWSLambdaExecute
1. Add this policy to the bucket
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<user_id>:role/<role_name>
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::<bucket_name>/*"
        }
    ]
}
```

## Helper functions
### S3
You can also store artifacts in S3!
#### Create bucket
Bucket name defaults to `eulagy`. Will not create a bucket that already exists.
```bash
node lib/buckets create [name]
```

#### List buckets
```bash
node lib/buckets
```
