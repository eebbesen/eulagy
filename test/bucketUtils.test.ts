import * as S3Helper from '../src/bucketUtils'
import * as FsPromises from 'fs/promises'

import {
  type ListBucketsCommandOutput
} from '@aws-sdk/client-s3'
import { log4TSProvider } from '../src/config/LogConfig'

const log = log4TSProvider.getLogger('BucketUtilsTest')

describe('listBuckets', () => {
  // assumes you have buckets for your AWS credentials
  it('lists buckets', async () => {
    await S3Helper.listBuckets()
      .then((buckets: ListBucketsCommandOutput) => {
        expect(buckets?.Buckets?.length).toBeGreaterThanOrEqual(1)
      })
  })
})

describe('uploadFile, listBucketFiles, downloadFile, and deleteFile', () => {
  it('uploads and deletes', async () => {
    const fileName = `humegatech-${Date.now()}.txt.slug`

    await FsPromises.readFile('test/files/humegatech-11.05.2018.txt.slug')
      .then(async (buffer: Buffer) => {
        return await S3Helper.uploadFile(fileName, buffer.toString())
      })
      .then(async (ret: any) => {
        log.debug('After upload', JSON.stringify(ret))
        expect(ret?.$metadata?.httpStatusCode).toEqual(200)
        return await S3Helper.listBucketFiles('eulagy')
      })
      .then(async (ret: any) => {
        log.debug('After upload list files', JSON.stringify(ret))
        const files: string[] = ret?.Contents.map((f: any) => { return f.Key })
        expect(files).toContain(fileName)
        return await S3Helper.downloadFile(fileName)
      })
      .then((ret: any) => {
        return ret.Body.transformToString()
      })
      .then(async (ret: any) => {
        log.debug('After download and transform', JSON.stringify(ret))
        expect(ret).toEqual('Hello this is some text from humegatech')
        return await S3Helper.deleteFile(fileName)
      })
      .then(async (ret: any) => {
        log.debug('After delete', JSON.stringify(ret))
        expect(ret?.$metadata?.httpStatusCode).toEqual(204)
        return await S3Helper.listBucketFiles('eulagy')
      })
      .then((ret: any) => {
        log.debug('After delete list files', JSON.stringify(ret))
        expect(ret?.$metadata?.httpStatusCode).toEqual(200)
        const files: string[] = ret?.Contents.map((f: any) => { return f.Key })
        expect(files).not.toContain(fileName)
      })
  })
})
