const app = require('../app');
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
    .then((ret) => {
      expect(ret.$metadata.httpStatusCode).toEqual(200);
      console.log('COMPLETE')
    });

}, 700000);

test('detects sentiment of facebook', () => {
  return fsPromises.readFile('eulas/facebook/04.19.2018.txt')
    .then((buffer, err) => {
      const text = buffer.toString();
      const chunks = text.match(/[\s\S]{1,4999}/g)
      return app.detectSentiment(chunks[0]);
    })
    .then((sentiment) => {
      // console.log('FACEBOOK', sentiment);
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
      // console.log('TUMBLR', sentiment);
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

test('sorts key phrases by count descending', () => {
  const kp = [ { Score: 0.9989810585975647,
        Text: 'Our Statement',
        BeginOffset: 0,
        EndOffset: 13 },
      { Score: 0.9646416306495667,
        Text: 'Rights and Responsibilities',
        BeginOffset: 17,
        EndOffset: 44 },
      { Score: 0.9958744049072266,
        Text: 'our STATEMENT',
        BeginOffset: 60,
        EndOffset: 69 },
      { Score: 0.9955416321754456,
        Text: 'Service',
        BeginOffset: 73,
        EndOffset: 80 },
      { Score: 0.9994470477104187,
        Text: 'our previous Statement',
        BeginOffset: 95,
        EndOffset: 117 } ];

  const sorted = app.sortEntriesByValues(kp);

  expect(sorted.size).toBe(4);
  expect(sorted.get('our statement')).toBe(2);
  expect(sorted.get('rights and responsibilities')).toBe(1);
  expect(sorted.get('service')).toBe(1);
  expect(sorted.get('our previous statement')).toBe(1);
});

test('Map to csv', () => {
  const kp = [ { Score: 0.9989810585975647,
        Text: 'Our Statement',
        BeginOffset: 0,
        EndOffset: 13 },
      { Score: 0.9646416306495667,
        Text: 'Rights and Responsibilities',
        BeginOffset: 17,
        EndOffset: 44 },
      { Score: 0.9958744049072266,
        Text: 'our STATEMENT',
        BeginOffset: 60,
        EndOffset: 69 },
      { Score: 0.9955416321754456,
        Text: 'Service',
        BeginOffset: 73,
        EndOffset: 80 },
      { Score: 0.9994470477104187,
        Text: 'our previous Statement',
        BeginOffset: 95,
        EndOffset: 117 } ];

  const map = app.sortEntriesByValues(kp);

  const result = app.mapToCsv(map);

  expect(result.replace(/\n/g, '')).toEqual('our statement,2rights and responsibilities,1service,1our previous statement,1');
});

// find word(s) that appear very seldom to flag unusual clauses...
