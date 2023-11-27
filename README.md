[![CircleCI](https://circleci.com/gh/eebbesen/eulagy.svg?style=svg)](https://circleci.com/gh/eebbesen/eulagy)

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

*NOTE: EULAgy is an MVP and work to make it more flexible are in progress.*
*In particular, code changes are required to remove hard-coded `eulagy` bucket name throughout the application!*

## Using
### AWS Lambda
See Deploy below. Place txt files in the root S3 bucket -- output will appear in the `uploaded` folder of the S3 bucket.

## Develop
1. [Install npm](https://www.npmjs.com/get-npm)
1. `npm install`
1. `npm test` to validate setup! 
1. `npm run liveTest` to run tests that actually hit S3
    * requires configured AWS CLI setup on box running tests -- (You'll need to have AWS credentials created, e.g., https://docs.aws.amazon.com/sdkref/latest/guide/file-format.html)
    * will incur AWS charges (up to several cents per full suite run in the cheapest AWS region)

### More on testing
* Comprehend usage in the suite comprises over 98% of the cost and is executed from comprehendUtils.test.ts and app.test.ts
* app.test.ts executes the entire processing chain
* See the `coverage` directory for code coverage numbers after the tests are run

I chose to create "live" tests that hit AWS services instead of mocking.
The application is small enough and the tests are inexpensive enough for it to be worth _not_ spending my time mocking and potentially retooling mocks if anything changes on the AWS side. The live tests give me greater confidence that a packaged release will work.

## Deploy
### S3 bucket
1. Create a bucket in S3
1. Create a folder named `uploaded` in the bucket (see below for helper scripting)
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
5. Replace bucket references in code with your bucket name (I'm working on making this configurable)

### Lambda
1. Create a new Lambda function with the role you created
1. Give the function a Timeout of 10 seconds
1. Run `tsc`, then `npm run zpack_x` to create the artifact (a zip file) in the `build` directory. On Windows and WSL you may need to execute the script steps manually.
1. Upload the artifact to your Lambda function in AWS


## Helper functions
### Create bucket named eulagy
Bucket name defaults to `eulagy`. Will not create a bucket that already exists.
```bash
node lib/buckets createb [name]
```

#### List buckets
```bash
node lib/buckets
```
