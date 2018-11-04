'use strict'

const app = require('../app');
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

const addMp3ToRecord = function(file, company) {
  app.insertAudio(`${__dirname}/${file}`, company)
    .then(() => {
      console.log(`uploaded ${file}`);
    });
};


// script handler
if (process.argv[2] === 'upload') {
  addMp3ToRecord(process.argv[3], process.argv[4]);
} else {
  listFiles();
}
