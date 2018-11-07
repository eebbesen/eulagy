'use strict'

const app = require('../app');
const fsPromises = require('fs').promises;

const listFiles = function(dir) {
  const rootDir = dir || 'output'
  fsPromises.readdir(rootDir)
    .then((files, err) => {
      files.forEach(f => {
        console.log(`${__dirname}/${f}`);
      });
    });
};

module.exports.listFiles = listFiles;
