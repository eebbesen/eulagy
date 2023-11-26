'use strict';
var bu = require('./bucket_utils');
var f = process.argv[2];
var s = process.argv[3];
var t = process.argv[4];
if (f === 'createb') {
    bu.createBucket(s);
}
else if (f === 'files') {
    bu.listBucketFiles().then(function (d) { console.log(d); });
}
else if (f === 'uploadf') {
    bu.uploadFile(s, t).then(function (d) { console.log(d); });
}
else if (f === 'deletef') {
    bu.deleteFile(s).then(function (d) { console.log(d); });
}
else {
    bu.listBuckets().then(function (d) { console.log(d); });
}
