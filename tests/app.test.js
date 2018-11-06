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

// live test, requires file humegatech-11.05.2018.txt in eulagy root in S3
test('handler does it all', () => {
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
      console.log('ddddddoooooonnnneee', e);
    })
});
