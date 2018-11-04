'use strict'

// mostly from https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html

const AWS = require('aws-sdk');
const fsPromises = require('fs').promises;
// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list current buckets
const listBuckets = function() {
  return s3.listBuckets((err, data) => {
     if (err) {
        console.log("Error", err);
     } else {
        return data;
     }
  }).promise();
};

const createBucket = function(name) {
  const bucketName = name || 'eulagy';

  listBuckets()
    .then(bs => {
      bs['Buckets'].forEach( b => {
        if(b['Name'] === bucketName) {
          console.log(`${bucketName} already exists!`);
          return true;
        }
        console.log(`Will create ${bucketName}`);
      });
    })
    .then(() => {
      s3.createBucket({ Bucket: bucketName }, (err, data) => {
        if (err) {
          console.log(`Error in createBucket:\n ${err}`);
        } else {
          console.log(`Success!: ${data.Location}`, data)
        }
      });
    });
}

// create buckets, up
const uploadFiles = function () {

};

if (process.argv[2] === 'create') {
  createBucket();
} else {
  listBuckets().then(d => { console.log(d); });
}