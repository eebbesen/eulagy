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
};

const listFiles = function(name) {
  const bucketName = name || 'eulagy';
  return s3.listObjects({ Bucket: bucketName }, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      return data;
    }
  }).promise();
};

const uploadFile = function(name, data) {
  console.log('yyyyyyy', data);
  const params = { Bucket: 'eulagy', Key: name, Body: data };
  return s3.upload (params, function (err, data) {
    if (err) {
      console.log("Error", err, data);
    }
  }).promise();
}

// create buckets, up
const uploadFiles = function() {
  return fsPromises.readdir('output')
    .then((files, err) => {
      files.forEach(f => {
        fsPromises.readFile(`output/${f}`)
          .then((buffer, err) => {
            uploadFile(f, buffer)
              .then(() => { console.log(`Uploaded ${f}`); });
        });
      });
    });
};

if (process.argv[2] === 'create') {
  createBucket();
} else if (process.argv[2] === 'files') {
  listFiles().then(d => { console.log(d); });
} else if (process.argv[2] === 'upload') {
  uploadFiles().then(d => {});
} else {
  listBuckets().then(d => { console.log(d); });
}