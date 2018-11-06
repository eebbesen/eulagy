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
      s3Helper.uploadFile('humegatech-11.05.2018.txt.slug', buffer);
    })
    .then(() => {
      return app.handler(event);
    })
    .then((file) => {
      expect(file.key).toEqual('uploaded/humegatech-11.05.2018.mp3.slug');
    });
});
