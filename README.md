# EULAgy
Get a EULA read to you.

## Using
EULAgy is a utility that can be plugged into an application that will stream an mp3. There is some seed data available in this project, but you are encouraged to add more EULAs yourself.

## How EULAgy works
EULAgy uses AWS Polly to create mp3s from EULA text. EULAgy is designed to work on AWS Lambda.

## Convert text to mp3
Using the `EULAS.CONTENT` field, create mp3 files.
```bash
node lib/db_to_mp3.js
```
and mp3s for all content in the EULA table will be placed in the `output` directory.

## Upload files to S3
Will upload all files from `output` to S3 bucket named `eulagy`. DOES NOT check for duplicates, so move records from `output` to `uploaded` once they are uploaded.
```bash
node lib/buckets upload
```

## Develop
1. [Install npm](https://www.npmjs.com/get-npm)
1. `npm install`
1. `npm test` to validate setup!

## Deploy
### S3 bucket policy
1. Create a bucket in S3
1. Create a folder named `uploaded` in the bucket
1. Create an AWS role with AWSLambdaExecute, AmazonPollyFullAccess and AmazonS3FullAccess
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

### Lambda
1. Create a new Lambda function with the new role you created
1. Give the function a Timeout of 10 seconds
1. Run `npm run zpack` to create the artifact in the `build` directory
1. Upload the artifact to your Lambda


## Helper functions
### S3
#### Create bucket
Bucket name defaults to `eulagy`. Will not create a bucket that already exists.
```bash
node lib/buckets create [name]
```

#### List buckets
```bash
node lib/buckets
```
