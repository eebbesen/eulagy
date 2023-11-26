import * as App from '../src/app';
import * as FsPromises from 'fs/promises';
import * as S3Helper from '../src/bucket_utils';

// live test, requires file humegatech-11.05.2018.txt in eulagy root in S3 so we upload it
describe('end-to-end test', () => {
  it.only('handler creates mp3', () => {
    const event: object = {
      Records: [{
        s3: {
          object: {
            key: 'humegatech-11.05.2018.txt.slug'
          }
        }
      }]
    };

    return FsPromises.readFile('test/files/humegatech-11.05.2018.txt.slug')
      .then((buffer: Buffer) => {
        return S3Helper.uploadFile('humegatech-11.05.2018.txt.slug', buffer);
      })
      .then(() => {
        return App.handler(event);
      })
      .then((ret: any) => {
        console.log(`RETURN: ${ret}`);
        expect(ret?.$metadata?.httpStatusCode).toEqual(200);
      });
    }, 70000);
});