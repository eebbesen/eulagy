'use strict';
var app = require('../app');
var fsPromises = require('fs').promises;
var listFiles = function (dir) {
    var rootDir = dir || 'output';
    fsPromises.readdir(rootDir)
        .then(function (files, err) {
        files.forEach(function (f) {
            console.log("".concat(__dirname, "/").concat(f));
        });
    });
};
module.exports.listFiles = listFiles;
