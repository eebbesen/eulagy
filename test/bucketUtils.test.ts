import * as S3Helper from '../src/bucketUtils';
import * as FsPromises from 'fs/promises';
import { log4TSProvider } from "../src/config/LogConfig";

const log = log4TSProvider.getLogger("BucketUtilsTest");

describe('uploadFile, listBucketFiles, downloadFile, and deleteFile', () => {
  it('uploads and deletes', () => {
    const fileName = `humegatech-${Date.now()}.txt.slug`;

    return FsPromises.readFile('test/files/humegatech-11.05.2018.txt.slug')
      .then((buffer: Buffer) => {
        return S3Helper.uploadFile(fileName, buffer);
      })
      .then((ret: any) => {
        log.debug('After upload', JSON.stringify(ret));
        expect(ret?.$metadata?.httpStatusCode).toEqual(200);
        return S3Helper.listBucketFiles('eulagy');
      })
      .then((ret: any) => {
        log.debug('After upload list files', JSON.stringify(ret));
        const files: string[] = ret?.Contents.map((f: any) => { return f.Key });
        expect(files).toContain(fileName);
        return S3Helper.downloadFile(fileName);
      })
      .then((ret: any) => {
        return ret.Body.transformToString();
      })
      .then((ret: any) => {
        log.debug('After download and transform', JSON.stringify(ret));
        expect(ret).toEqual("Hello this is some text from humegatech");
        return S3Helper.deleteFile(fileName);
      })
      .then((ret: any) => {
        log.debug('After delete', JSON.stringify(ret));
        expect(ret?.$metadata?.httpStatusCode).toEqual(204);
        return S3Helper.listBucketFiles('eulagy');
      })
      .then((ret: any) => {
        log.debug('After delete list files', JSON.stringify(ret));
        expect(ret?.$metadata?.httpStatusCode).toEqual(200);
        const files: string[] = ret?.Contents.map((f: any) => { f.Key });
        expect(files).not.toContain(fileName);
      });
  });
});
