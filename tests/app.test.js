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

test('runs query', async () => {
  const text = await app.getText();
  expect(text).toContain('the');
});

test('creates mp3', () => {
  const ret = app.createMp3('This is some text', 'hello_test');

  return ret.then((data, err) => {
    return expect(fsPromises.stat(filename)).resolves.toBeDefined();
  });
});
