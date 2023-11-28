import * as App from '../src/app';
import * as FsPromises from 'fs/promises';
import * as S3Helper from '../src/bucketUtils';
import { log4TSProvider } from '../src/config/LogConfig';

const log = log4TSProvider.getLogger('AppTest');

function createEvent(fileName: string): { Records: { s3: { object: { key: string; }; }; }[]; } {
  return {
    Records: [{
      s3: {
        object: {
          key: fileName
        }
      }
    }]
  };
};

// live test, requires file humegatech-11.05.2018.txt in eulagy root in S3 so we upload it
describe('handler', () => {
  it('handler creates mp3 (end-to-end test)', () => {
    const fileName: string = `humegatech-appTest-${Date.now()}.txt.slug`
    const event: { Records: { s3: { object: { key: string; }; }; }[]; } = createEvent(fileName);

    // using existing text with unique filename
    return FsPromises.readFile('test/files/humegatech-11.05.2018.txt.slug')
      .then((buffer: any) => {
        return S3Helper.uploadFile(fileName, buffer);
      })
      .then(() => {
        return App.handler(event);
      })
      .then((ret: any) => {
        log.debug('end-to-end result', JSON.stringify(ret));
        expect(ret?.$metadata?.httpStatusCode).toEqual(200);
      });
  });

  it('throws error when no text in file', () => {
    const fileName: string = `humegatech-appTest-empty-${Date.now()}.txt.slug`
    const event: { Records: { s3: { object: { key: string; }; }; }[]; } = createEvent(fileName);

    return FsPromises.readFile('test/files/empty.txt')
      .then((buffer: any) => {
        return S3Helper.uploadFile(fileName, buffer);
      })
      .then(() => {
        return expect(App.handler(event)).rejects.toThrow(`No content for file ${fileName}`);
      });
  });
});
