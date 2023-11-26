'use strict'

const bu = require('./bucket_utils');
const f = process.argv[2];
const s = process.argv[3];
const t = process.argv[4];

if (f === 'createb') {
  bu.createBucket(s);
} else if (f === 'files') {
  bu.listBucketFiles().then(d => { console.log(d); });
} else if (f === 'uploadf') {
  bu.uploadFile(s, t).then(d => { console.log(d); });
} else if (f === 'deletef') {
  bu.deleteFile(s).then(d => { console.log(d); });
} else {
  bu.listBuckets().then(d => { console.log(d); });
}