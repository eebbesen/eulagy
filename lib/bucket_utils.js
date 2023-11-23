'use strict'

// mostly from https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
const { S3Client, 
        CreateBucketCommand, 
        DeleteObjectCommand, 
        GetObjectCommand, 
        ListBucketsCommand, 
        ListObjectsCommand, 
        PutObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client({});
const fsPromises = require('fs').promises;

// Call S3 to list current buckets
const listBuckets = function() {
  return client.send(new ListBucketsCommand({}));
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
      const createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });

      client.send(createBucketCommand);
    });
};

// lists files in S3 bucket
const listBucketFiles = function(name) {
  const bucketName = name || 'eulagy';
  const listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
  return client.send(listObjectsCommand);
};

function downloadFile(name) {
  const getObjectCommand = new GetObjectCommand({ Bucket: 'eulagy', Key: name });
  return client.send(getObjectCommand);
}

function deleteFile(name) {
  const deleteObjectCommand = new DeleteObjectCommand({ Bucket: 'eulagy', Key: name });
  return client.send(deleteObjectCommand);
};

// uploads one file to S3 bucket
const uploadFile = function(name, data) {
  const putObjectCommand = new PutObjectCommand({ Bucket: 'eulagy', Key: name, Body: data, ContentLength: data.readableLength });
  return client.send(putObjectCommand);
}

// uploads all files in a dir to S3 bucket
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

module.exports.createBucket = createBucket;
module.exports.deleteFile = deleteFile;
module.exports.downloadFile = downloadFile;
module.exports.listBuckets = listBuckets;
module.exports.listBucketFiles = listBucketFiles;
module.exports.uploadFile = uploadFile;
module.exports.uploadFiles = uploadFiles;
