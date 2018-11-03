const app = require('../app');
const AWS = require('aws-sdk');
const fs = require('fs');
const fsPromises = fs.promises;

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

test('runs query', () => {
  const rec = app.getRecord();

  return rec.then(data => {
    expect(data.content).toContain('the');
    expect(data.company.length).toBeGreaterThan(4);
    expect(data.version).toContain('.');
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
  console.log('aaaaaa', recs)

  return recs.then(data => {
    expect(data.length).toBe(3);
    expect(data[0].content).toMatch(/the/);
  });
});
