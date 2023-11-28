import * as BucketUtils from './bucketUtils'
import * as Utils from './utils'
import * as PollyUtils from './pollyUtils'
import * as ComprehendUtils from './comprehendUtils'
import { type StartSpeechSynthesisTaskOutput } from '@aws-sdk/client-polly'
import { log4TSProvider } from './config/LogConfig'

const log = log4TSProvider.getLogger('App')

export async function handler (event: any): Promise<any> {
  log.info('incoming event', JSON.stringify(event))
  const rec: any = event.Records[0]
  const fileName: string = rec.s3.object.key
  log.info('processing file', fileName)

  let text: string | undefined
  let createDetailsMp3: any
  let createDetailsCsv: any

  return await BucketUtils.downloadFile(fileName)
    .then((data: any) => {
      return data?.Body?.transformToString()
    })
    .then(async (eulaText: string | undefined) => {
      log.debug('EULA text is', eulaText)
      if (eulaText?.length === 0) {
        throw new Error(`No content for file ${fileName}`)
      }
      text = eulaText
      // raise Exception unless eulaText has value
      // const chunks: RegExpMatchArray | null | undefined = eulaText?.match(/[\s\S]{1,2999}/g)
      const chunks: any = eulaText?.match(/[\s\S]{1,2999}/g)
      return await PollyUtils.startSynthesizeSpeech(chunks)
    })
    .then((mp3Generation: StartSpeechSynthesisTaskOutput | null) => {
      createDetailsMp3 = mp3Generation
      log.debug('mp3 file location', JSON.stringify(mp3Generation))
    })
    .then(async (ret: any) => {
      const chunks: RegExpMatchArray | null | undefined = text?.match(/[\s\S]{1,4900}/g)
      // raise error if chunks has no value
      return await ComprehendUtils.detectKeyPhrases(chunks)
    })
    .then(async (kp: any) => {
      const vals = Utils.sortEntriesByValues(kp?.KeyPhrases)
      const csv = Utils.mapToCsv(vals)
      return await BucketUtils
        .uploadFile(`uploaded/${fileName.replace('txt', 'csv')}`, csv)
    })
    .then(async (uploadCsv: any) => {
      createDetailsCsv = uploadCsv
      log.debug('uploaded CSV file', JSON.stringify(uploadCsv))
      return await BucketUtils.deleteFile(fileName)
    })
    .then((cdMp3: any) => {
      console.log('mp3 file details', JSON.stringify(createDetailsMp3))
      console.log('CSV file details', JSON.stringify(createDetailsCsv))
      return createDetailsMp3
    })
};
