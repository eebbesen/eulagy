'use strict'

const AWS = require('aws-sdk');
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
});
const s3Helper = require('./lib/bucket_utils');


const handler = function(event) {
  const rec = event.Records[0];
  const fileName = rec.s3.object.key;
  let createDetails;

  return s3Helper.downloadFile(fileName)
    .then(data => {
      return data.Body.toString();
    })
    .then((text) => {
      const chunks = text.match(/[\s\S]{1,3000}/g)
      return synthesizeSpeech(chunks[0]);
    })
    .then(mp3 => {
      return s3Helper
        .uploadFile(`uploaded/${fileName.replace('txt', 'mp3')}`, mp3.AudioStream);
    })
    .then((cd) => {
      createDetails = cd;
      try {
        s3Helper
          .deleteFile(fileName);
      } catch (err) {
        console.log(`Issue deleting ${fileName}`);
      }
    })
    .then(() => {
      return createDetails
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

module.exports.synthesizeSpeech = synthesizeSpeech;
module.exports.handler = handler;
