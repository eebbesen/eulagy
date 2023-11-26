'use strict';
// mostly from https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
var _a = require("@aws-sdk/client-s3"), S3Client = _a.S3Client, CreateBucketCommand = _a.CreateBucketCommand, DeleteObjectCommand = _a.DeleteObjectCommand, GetObjectCommand = _a.GetObjectCommand, ListBucketsCommand = _a.ListBucketsCommand, ListObjectsCommand = _a.ListObjectsCommand, PutObjectCommand = _a.PutObjectCommand;
var client = new S3Client({});
var fsPromises = require('fs').promises;
// Call S3 to list current buckets
var listBuckets = function () {
    return client.send(new ListBucketsCommand({}));
};
var createBucket = function (name) {
    var bucketName = name || 'eulagy';
    listBuckets()
        .then(function (bs) {
        bs['Buckets'].forEach(function (b) {
            if (b['Name'] === bucketName) {
                console.log("".concat(bucketName, " already exists!"));
                return true;
            }
        });
        console.log("Will create ".concat(bucketName));
    })
        .then(function () {
        var createBucketCommand = new CreateBucketCommand({ Bucket: bucketName });
        client.send(createBucketCommand);
    });
};
// lists files in S3 bucket
var listBucketFiles = function (name) {
    var bucketName = name || 'eulagy';
    var listObjectsCommand = new ListObjectsCommand({ Bucket: bucketName });
    return client.send(listObjectsCommand);
};
function downloadFile(name) {
    var getObjectCommand = new GetObjectCommand({ Bucket: 'eulagy', Key: name });
    return client.send(getObjectCommand);
}
function deleteFile(name) {
    var deleteObjectCommand = new DeleteObjectCommand({ Bucket: 'eulagy', Key: name });
    return client.send(deleteObjectCommand);
}
;
// uploads one file to S3 bucket
var uploadFile = function (name, data) {
    var putObjectCommand = new PutObjectCommand({ Bucket: 'eulagy', Key: name, Body: data, ContentLength: data.readableLength });
    return client.send(putObjectCommand);
};
// uploads all files in a dir to S3 bucket
var uploadFiles = function () {
    return fsPromises.readdir('output')
        .then(function (files, err) {
        files.forEach(function (f) {
            fsPromises.readFile("output/".concat(f))
                .then(function (buffer, err) {
                uploadFile(f, buffer)
                    .then(function () { console.log("Uploaded ".concat(f)); });
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
