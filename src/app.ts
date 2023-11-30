import * as BucketUtils from './bucketUtils'
import * as Utils from './utils'
import * as PollyUtils from './pollyUtils'
import * as ComprehendUtils from './comprehendUtils'
import { type StartSpeechSynthesisTaskCommandOutput } from '@aws-sdk/client-polly'
import { type DeleteObjectCommandOutput, type GetObjectCommandOutput, type PutObjectCommandOutput } from '@aws-sdk/client-s3'
import { type DetectKeyPhrasesCommandOutput } from '@aws-sdk/client-comprehend'
import { type S3Event } from 'aws-lambda'
import { log4TSProvider } from './config/LogConfig'

const log = log4TSProvider.getLogger('App')

export async function handler (event: S3Event): Promise<StartSpeechSynthesisTaskCommandOutput> {
  log.info('incoming event', JSON.stringify(event))

  Utils.bucketProperty() // check early since program need this

  const rec: S3Event['Records'] = event.Records
  const fileName: string = rec[0].s3.object.key
  log.info('processing file', fileName)

  let text: string | undefined
  let createDetailsMp3: StartSpeechSynthesisTaskCommandOutput
  let createDetailsCsv: PutObjectCommandOutput

  return await BucketUtils.downloadFile(fileName)
    .then(async (data: GetObjectCommandOutput) => {
      return await data?.Body?.transformToString()
    })
    .then(async (eulaText: string | undefined) => {
      log.debug('EULA text is', eulaText)
      if (eulaText?.length === 0) {
        throw new Error(`No content for file ${fileName}`)
      }
      text = eulaText
      const chunks: RegExpMatchArray = Utils.chunkText(eulaText, 2999)
      return await PollyUtils.startSynthesizeSpeech(chunks)
    })
    .then((mp3Generation: StartSpeechSynthesisTaskCommandOutput) => {
      createDetailsMp3 = mp3Generation
      log.debug('mp3 file location', JSON.stringify(mp3Generation))
    })
    .then(async () => {
      const chunks: RegExpMatchArray = Utils.chunkText(text, 4900)
      // raise error if chunks has no value
      return await ComprehendUtils.detectKeyPhrases(chunks)
    })
    .then(async (kp: DetectKeyPhrasesCommandOutput) => {
      const vals = Utils.sortEntriesByValues(kp.KeyPhrases)
      const csv = Utils.mapToCsv(vals)
      return await BucketUtils
        .uploadFile(`uploaded/${fileName.replace('txt', 'csv')}`, csv)
    })
    .then(async (uploadCsv: PutObjectCommandOutput) => {
      createDetailsCsv = uploadCsv
      log.debug('uploaded CSV file', JSON.stringify(uploadCsv))
      return await BucketUtils.deleteFile(fileName)
    })
    .then((cdMp3: DeleteObjectCommandOutput) => {
      console.log('mp3 file details', JSON.stringify(createDetailsMp3))
      console.log('CSV file details', JSON.stringify(createDetailsCsv))
      return createDetailsMp3
    })
};
