'use strict'

const { ComprehendClient, DetectSentimentCommand, DetectKeyPhrasesCommand } = require("@aws-sdk/client-comprehend");
const { PollyClient, SynthesizeSpeechCommand } = require("@aws-sdk/client-polly");

const comprehendClient = new ComprehendClient({
  apiVersion: '2017-11-27',
  region: 'us-east-1'
});
const pollyClient = new PollyClient({
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
      text = eulaText;
      const chunks = eulaText.match(/[\s\S]{1,2999}/g)
      return synthesizeSpeech(chunks[0]);
    })
    .then(mp3 => {
      return s3Helper
        .uploadFile(`uploaded/${fileName.replace('txt', 'mp3')}`, mp3.AudioStream);
    })
    .then(cd => {
      createDetails = cd;
      try {
        s3Helper
          .deleteFile(fileName);
      } catch (err) {
        console.log(`EULAGY:: Issue deleting ${fileName}`);
      }
    })
    .then(() => {
      const chunks = text.match(/[\s\S]{1,4900}/g);
      const input = {
        Text: chunks,
        LanguageCode: "en"
      };
      return detectKeyPhrases(chunks[0]);
    })
    .then(kp => {
      const vals = sortEntriesByValues(kp.KeyPhrases);
      const csv = mapToCsv(vals);
      return s3Helper
        .uploadFile(`uploaded/${fileName.replace('txt', 'csv')}`, csv);
    })
    .then(() => {
      return createDetails
    });
};

// returns a promise to create an mp3 from text
const synthesizeSpeech = function(text) {
  const params = {
    OutputFormat: 'mp3',
    Text: text,
    VoiceId: 'Kimberly'
  };
  const command = new SynthesizeSpeechCommand(params);
  return pollyClient.send(command);
};

const detectSentiment = function(text) {
  const params = {
    LanguageCode: 'en',
    Text: text
  };
  const command = new DetectSentimentCommand(params);
  return comprehendClient.send(command);
};

const detectKeyPhrases = function(text) {
  const params = {
    LanguageCode: 'en',
    Text: text
  };
  const command = new DetectKeyPhrasesCommand(params);
  return comprehendClient.send(command);
};

// count and sort map by count of key (lower case)
const sortEntriesByValues = function(arr) {
  const occ = arr.reduce((occ, val) => occ.set(val.Text.toLowerCase(), 1 + (occ.get(val.Text.toLowerCase()) || 0)), new Map());
  return new Map([...occ.entries()].sort((a, b) => b[1] - a[1]));
};

const mapToCsv = function(map) {
  let text = '';
  map.forEach((v,k,m) => {
    text += `${k},${v}\n`;
  });
  return text;
};

module.exports.handler = handler;
module.exports.detectKeyPhrases = detectKeyPhrases;
module.exports.detectSentiment = detectSentiment;
module.exports.mapToCsv = mapToCsv;
module.exports.sortEntriesByValues = sortEntriesByValues;
module.exports.synthesizeSpeech = synthesizeSpeech;
