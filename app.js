'use strict'

const AWS = require('aws-sdk');
const Comprehend = new AWS.Comprehend({
  apiVersion: '2017-11-27',
  region: 'us-east-1'
});
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
});
const s3Helper = require('./lib/bucket_utils');


const handler = function(event) {
  const rec = event.Records[0];
  const fileName = rec.s3.object.key;

  let text;
  let createDetails;

  return s3Helper.downloadFile(fileName)
    .then(data => {
      return data.Body.toString();
    })
    .then((eulaText) => {
      const chunks = eulaText.match(/[\s\S]{1,2999}/g)
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
        console.log(`EULAGY:: Issue deleting ${fileName}`);
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

const detectSentiment = function(text) {
  const params = {
    LanguageCode: 'en',
    Text: text
  };
  return Comprehend.detectSentiment(params).promise();
};

const detectKeyPhrases = function(text) {
  const params = {
    LanguageCode: 'en',
    Text: text
  };
  return Comprehend.detectKeyPhrases(params).promise();
};

module.exports.handler = handler;
module.exports.detectKeyPhrases = detectKeyPhrases;
module.exports.detectSentiment = detectSentiment;
module.exports.synthesizeSpeech = synthesizeSpeech;
