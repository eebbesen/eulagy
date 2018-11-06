'use strict'

const AWS = require('aws-sdk');
const env = process.env.NODE_ENV || 'development';
// const fsPromises = require('fs').promises;
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

function downloadFile(name) {
  const params = { Bucket: 'eulagy', Key: name };
  return s3.getObject(params, function (err, data) {
    if (err) {
      console.log("Error", err, data);
    }
  }).promise();
}

// uploads one file to S3 bucket
const uploadFile = function(name, data) {
  const params = { Bucket: 'eulagy', Key: name, Body: data };
  return s3.upload (params, function (err, data) {
    if (err) {
      console.log("Error", err, data);
    }
  }).promise();
}

const handler = function(event) {
  const rec = event.Records[0];
  const fileName = rec.s3.object.key;
  let text

  return downloadFile(fileName)
  .then(data => {
    text = data.Body.toString()
  })
  .then(() => {
    const rr = synthesizeSpeech(text)
    return rr
  })
  .then(mp3 => {
    // upload to S3
    return uploadFile(`uploaded/${fileName.replace('txt', 'mp3')}`, mp3.AudioStream);
  });
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

module.exports.createMp3 = createMp3;
module.exports.synthesizeSpeech = synthesizeSpeech;
module.exports.handler = handler;
