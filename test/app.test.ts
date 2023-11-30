import * as App from '../src/app'
import * as FsPromises from 'fs/promises'
import * as S3Helper from '../src/bucketUtils'
import * as Utils from '../src/utils'
import { type S3Event } from 'aws-lambda'
import { log4TSProvider } from '../src/config/LogConfig'
import { type StartSpeechSynthesisTaskCommandOutput } from '@aws-sdk/client-polly'
import { DeleteObjectCommandOutput } from '@aws-sdk/client-s3'

const log = log4TSProvider.getLogger('AppTest')

// live test, requires file humegatech-11.05.2018.txt in eulagy root in S3 so we upload it
describe('handler', () => {
  it('handler creates mp3 (end-to-end test)', async () => {
    const fileName: string = `humegatech-appTest-${Date.now()}.txt.slug`
    const event: S3Event = createEvent(fileName)

    // using existing text with unique filename
    await FsPromises.readFile('test/files/humegatech-11.05.2018.txt.slug')
      .then(async (buffer: Buffer) => {
        return await S3Helper.uploadFile(fileName, buffer.toString())
      })
      .then(async () => {
        return await App.handler(event)
      })
      .then(async (ret: StartSpeechSynthesisTaskCommandOutput) => {
        log.debug('end-to-end result', JSON.stringify(ret))
        expect(ret.$metadata?.httpStatusCode).toEqual(200)
        return await S3Helper.deleteFile(fileName)
      })
      .then((ret: DeleteObjectCommandOutput) => {
        expect(ret.$metadata.httpStatusCode).toEqual(204)
      })
  })

  it('throws error when no text in file', async () => {
    const fileName: string = `humegatech-appTest-empty-${Date.now()}.txt.slug`
    const event: S3Event = createEvent(fileName)

    await FsPromises.readFile('test/files/empty.txt')
      .then(async (buffer: Buffer) => {
        return await S3Helper.uploadFile(fileName, buffer.toLocaleString())
      })
      .then(async () => {
        return await expect(App.handler(event)).rejects.toThrow(`No content for file ${fileName}`)
      })
      .then(async () => {
        return await S3Helper.deleteFile(fileName)
      })
      .then((ret: DeleteObjectCommandOutput) => {
        expect(ret.$metadata.httpStatusCode).toEqual(204)
      })
  }, 10000)
})

function createEvent (fileName: string): S3Event {
  return {
    Records: [{
      eventVersion: '2.1',
      eventSource: 'aws:s3',
      awsRegion: 'us-east-1',
      eventTime: '1970-01-01T00:00:00.000Z',
      eventName: 'ObjectCreated:Put',
      userIdentity: {
        principalId: 'AB123'
      },
      requestParameters: {
        sourceIPAddress: '11.111.11.11'
      },
      responseElements: {
        'x-amz-request-id': 'AB123',
        'x-amz-id-2': 'a/A'
      },
      s3: {
        s3SchemaVersion: '1.0',
        configurationId: 'abc',
        bucket: {
          name: Utils.bucketProperty(),
          ownerIdentity: {
            principalId: 'xyz'
          },
          arn: 'arn:aws:s3:::slug'
        },
        object: {
          key: fileName,
          size: 36369,
          eTag: 'xxx',
          sequencer: '0000'
        }
      }
    }]
  }
}
