# EULAgy
Get a EULA read to you.

-----
## What EULAgy does
EULAgy takes a text file, converts it to an mp3 and generates a csv based on the Amazon Comprehend findings.

EULAgy is a utility that can be plugged into an application that will stream an mp3. Or an application that wants to analyze the key phrases in a text file.

And (shhhh, don't tell) EULAgy will work for _any_ text file, not just EULAs :).


* EULAgy uses Amazon Polly to create an mp3 from EULA text
* EULAgy uses Amazon Comprehend to create a csv from EULA text
* EULAgy is designed to work on AWS Lambda, but can also be run from the command line


## Using
### AWS Lambda
See Deploy below.

### Command Line
#### Convert text to mp3
Using the `EULAS.CONTENT` field, create mp3 files.
```bash
node lib/db_to_mp3.js
```
and mp3s for all content in the EULA table will be placed in the `output` directory.

#### Upload files to S3
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
1. Create an AWS role with AWSLambdaExecute, AmazonPollyFullAccess, AmazonS3FullAccess and ComprehendFullAccess
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
1. Create a new Lambda function with the role you created
1. Give the function a Timeout of 10 seconds
1. Run `npm run zpack` to create the artifact in the `build` directory
1. Upload the artifact to your Lambda


----
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
