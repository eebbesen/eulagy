'use strict';
var fu = require('./file_utils');
// script handler
if (process.argv[2] === 'upload') {
    fu.addMp3ToRecord(process.argv[3], process.argv[4]);
}
else if (process.argv[2] === 'download') {
    fu.downloadMp3(process.argv[3]);
}
else {
    fu.listFiles();
}
