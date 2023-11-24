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
    });
});
