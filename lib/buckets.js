'use strict'

const bu = require('./bucket_utils');

if (process.argv[2] === 'create') {
  bu.createBucket();
} else if (process.argv[2] === 'files') {
  bu.listBucketFiles().then(d => { console.log(d); });
} else if (process.argv[2] === 'upload') {
  bu.uploadFiles().then(d => {});
} else {
  bu.listBuckets().then(d => { console.log(d); });
}