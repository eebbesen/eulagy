'use strict'

const fsPromises = require('fs').promises;

const listFiles = function(dir) {
  const rootDir = dir || 'uploaded'
  fsPromises.readdir(rootDir)
    .then((files, err) => {
      files.forEach(f => {
        console.log(`${__dirname}/${f}`);
      });
    });
};

listFiles();
