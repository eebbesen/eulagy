const app = require('../app');
const AWS = require('aws-sdk');
const fsPromises = require('fs').promises;
const s3Helper = require('../lib/bucket_utils');

// live test, requires file humegatech-11.05.2018.txt in eulagy root in S3 so we upload it
test('handler creates mp3', () => {
  const event = {
    Records: [{
      s3: {
        object: {
          key: 'humegatech-11.05.2018.txt.slug'
        }
      }
    }]
  };

  return fsPromises.readFile('tests/files/humegatech-11.05.2018.txt.slug')
    .then((buffer, err) => {
      return s3Helper.uploadFile('humegatech-11.05.2018.txt.slug', buffer);
    })
    .then(() => {
      return app.handler(event);
    })
    .then((file) => {
      expect(file.key).toEqual('uploaded/humegatech-11.05.2018.mp3.slug');
    });
});

test('detects sentiment of facebook', () => {
  return fsPromises.readFile('eulas/facebook/04.19.2018.txt')
    .then((buffer, err) => {
      const text = buffer.toString();
      const chunks = text.match(/[\s\S]{1,4999}/g)
      return app.detectSentiment(chunks[0]);
    })
    .then((sentiment) => {
      console.log('FACEBOOK', sentiment);
      expect(sentiment.Sentiment).toEqual('NEUTRAL');
    });
});

test('detects sentiment of tumblr', () => {
  return fsPromises.readFile('eulas/tumblr/05.15.2018.txt')
    .then((buffer, err) => {
      const text = buffer.toString();
      const chunks = text.match(/[\s\S]{1,4899}/g)
      return app.detectSentiment(chunks[0]);
    })
    .then((sentiment) => {
      console.log('TUMBLR', sentiment);
      expect(sentiment.Sentiment).toEqual('NEUTRAL');
    });
});

test('detects key phrases in facebook eula', () => {
  return fsPromises.readFile('eulas/facebook/04.19.2018.txt')
    .then((buffer, err) => {
      const text = buffer.toString();
      const chunks = text.match(/[\s\S]{1,4999}/g)
      return app.detectKeyPhrases(chunks[0]);
    })
    .then((keyPhrases) => {
      expect(keyPhrases.KeyPhrases.length).toBeGreaterThan(10);
    });
});
