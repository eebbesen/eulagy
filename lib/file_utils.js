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
  app.insertAudio(`${__dirname}/../uploaded/${file}`, company)
    .then(() => {
      console.log(`uploaded ${file}`);
    });
};

const downloadMp3 = function(company) {
  app.downloadAudio(company)
    .then(() => {
      console.log(`downloaded for ${company}`);
    });
};


// script handler
if (process.argv[2] === 'upload') {
  addMp3ToRecord(process.argv[3], process.argv[4]);
} else if (process.argv[2] === 'download') {
  downloadMp3(process.argv[3]);
} else {
  listFiles();
}
