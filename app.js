'use strict'

const AWS = require('aws-sdk');
const env = process.env.NODE_ENV || 'development';
const fsPromises = require('fs').promises;
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
});

// database
const dbConfig = require('./db/config');
const { Client } = require('pg');

function getClient() {
  return new Client(dbConfig[env]);
}

const getAllRecords = function() {
  const client = getClient();
  let data;
  try {
    client.connect();
    return client
      .query('SELECT content, company, version, audio FROM eulas')
      .then(recs => {
        data = recs.rows
        client.end();
        return data;
      });
  } catch (err) {
    console.log('ERROR in getText', err);
  }
};

// returns random record
const getRecord = function() {
  const client = getClient();
  let data;
  try {
    client.connect();
    return client
      .query('SELECT content, company, version, audio FROM eulas OFFSET floor(random()*(select count(*) from eulas)) LIMIT 1')
      .then(rec => {
        data = rec.rows[0];
        client.end();
        return data;
      });
  } catch (err) {
    console.log('ERROR in getText', err);
  }
};

// returns a promise to create an mp3 from text
const synthesizeSpeech = function(text) {
  const params = {
    'Text': text,
    'OutputFormat': 'mp3',
    'VoiceId': 'Kimberly'
  };
  return Polly.synthesizeSpeech(params).promise();
};

const createMp3 = function(text, name) {
  return synthesizeSpeech(text)
    .then((data, err) => {
      if (err) {
        console.log('Error in speech synthesis of createMp3', err);
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          fsPromises.writeFile(`${name}.kimberly.mp3`, data.AudioStream);
        }
      } else {
        throw 'createMp3: data not a Buffer!!';
      }
    })
    .catch(err => {
      console.log('error in createMp3', err);
    });
};

// thanks to https://codereview.stackexchange.com/questions/88788/save-file-from-request-to-database
const insertAudio = function(file, company) {
  const client = getClient();
  try {
    return fsPromises.readFile(`${file}`)
      .then(d => {
        const data = '\\x' + d.toString('hex');
        client.connect();

        return client
          .query(`update eulas set audio = $1 where company = '${company}'`, [data])
          .then(d => {
            console.log(`done uploading ${file} to ${company}`);
            client.end();
          });
      });
  } catch (err) {
    console.log('ERROR in insertAudio', err);
  }
};

const downloadAudio = function(company) {
  const client = getClient();
  try {
    client.connect();
    return client
      .query(`SELECT content, company, version, audio FROM eulas WHERE company = '${company}'`)
      .then(recs => {
        const rec = recs.rows[0]
        const audio = rec.audio;

        return fsPromises.writeFile(`output/${company}.downloaded.mp3`, audio)
          .then(() => {
            client.end();
          });
      });
  } catch (err) {
    console.log('ERROR in getText', err);
  }
};

module.exports.getAllRecords = getAllRecords;
module.exports.getRecord = getRecord;
module.exports.createMp3 = createMp3;
module.exports.synthesizeSpeech = synthesizeSpeech;
module.exports.insertAudio = insertAudio;
module.exports.downloadAudio = downloadAudio;
