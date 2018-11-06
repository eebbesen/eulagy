const app = require('../app');
const AWS = require('aws-sdk');
const fs = require('fs');
const fsPromises = require('fs').promises;

const filename = 'hello_test.kimberly.mp3';

function cleanup() {
  try {
    if (fs.statSync(filename)) {
      fs.unlinkSync(filename);
    }
  } catch (err) {
    // nothing
  }
}

beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

test.only('handler does it all', () => {
  const event = {
    Records: [{
      s3: {
        object: {
          key: 'humegatech-11.05.2018.txt'
        }
      }
    }]
  };

  // console.log('ddddddoooooonnnneee', app.handler(event))
  app.handler(event)
    .then(e => {
      console.log('ddddddoooooonnnneee');
    })
});

test('runs query', (done) => {
  jest.setTimeout(10000)
  const rec = app.getRecord();

  return rec
    .then(data => {
      expect(data.content).toContain('the');
      expect(data.company.length).toBeGreaterThan(4);
      expect(data.version).toContain('.');
      done();
    })
    .catch(err => {
      console.log('error: ' + err);
      done(err);
    })
});

test('creates mp3', () => {
  const ret = app.createMp3('This is some text', 'hello_test');

  return ret.then((data, err) => {
    return expect(fsPromises.stat(filename)).resolves.toBeDefined();
  });
});

test('gets all records', () => {
  const recs = app.getAllRecords();

  return recs.then(data => {
    expect(data.length).toBe(3);
    expect(data[0].content).toMatch(/the/);
  });
});

test('inserts audio', () => {
  app.insertAudio(`${__dirname}/files/facebook.04.19.2018.0.kimberly.mp3`, 'facebook')
    .then(() => {});
});
