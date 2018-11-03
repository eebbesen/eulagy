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
const client = new Client(dbConfig[env]);

// returns random EULA text
const getText = async function() {
  let rows;
  try {
    await client.connect();
    rows = await client.query('SELECT content FROM eulas OFFSET floor(random()*(select count(*) from eulas)) LIMIT 1');
    await client.end();
  } catch (err) {
    console.log('ERROR in getText', err);
  }
  return rows.rows[0]['content'];
}

// returns a promise to create an mp3 from text
const synthesizeSpeech = function(text) {
  const params = {
    'Text': text,
    'OutputFormat': 'mp3',
    'VoiceId': 'Kimberly'
  };
  return Polly.synthesizeSpeech(params).promise();
}

const createMp3 = function(text, name) {
  return synthesizeSpeech(text)
    .then((data, err) => {
      if (err) {
        console.log('Error in speech synthesis of createMp3', err);
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          fsPromises.writeFile(`${name}.kimberly.mp3`, data.AudioStream)
        }
      } else {
        throw 'createMp3: data not a Buffer!!';
      }
    })
    .catch(err => {
      console.log('error in createMp3', err);
    });
}

module.exports.getText = getText;
module.exports.createMp3 = createMp3;
module.exports.synthesizeSpeech = synthesizeSpeech;
