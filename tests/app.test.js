const app = require('../app');
const AWS = require('aws-sdk');
const fs = require('fs');
const fsPromises = fs.promises;

test('runs query', async () => {
  const text = await app.getText();
  expect(text).toContain('the');
});

test('creates mp3', () => {
  const filename = '/Users/eebbesen/p3/eulagy/hello_test.kimberly.mp3';
  if (fs.existsSync(filename)){
    fs.unlinkSync(filename);
  }

  const ret = app.createMp3('hello there', 'hello_test');

  return ret.then((data, err) => {
    fsPromises.stat(filename)
      .then(ret => {
        // just checking to make sure value is there
        expect(ret.mode).toEqual(33188);
        fsPromises.unlink(filename)
      })
  })
});
