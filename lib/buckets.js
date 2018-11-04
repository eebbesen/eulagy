'use strict'

// from https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html

const AWS = require('aws-sdk');

const listBuckets = function() {
  // Create S3 service object
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});

  // Call S3 to list current buckets
  s3.listBuckets(function(err, data) {
     if (err) {
        console.log("Error", err);
     } else {
        console.log("Bucket List", data.Buckets);
     }
  });
}();
