import * as BucketUtils from './bucketUtils';
import * as Utils from './utils';
import * as PollyUtils from './pollyUtils';
import * as ComprehendUtils from './comprehendUtils';
import { StartSpeechSynthesisTaskOutput } from '@aws-sdk/client-polly';
import { log4TSProvider } from './config/LogConfig';

const log = log4TSProvider.getLogger('App');

export function handler(event: any) {
  log.info('incoming event', JSON.stringify(event));
  const rec: any = event.Records[0];
  const fileName: string = rec.s3.object.key;
  log.info('processing file', fileName);

  let text: string | undefined;
  let createDetailsMp3: any;
  let createDetailsCsv: any;

  return BucketUtils.downloadFile(fileName)
    .then((data: any) => {
      return data?.Body?.transformToString();
    })
    .then((eulaText: string | undefined) => {
      log.debug('EULA text is', eulaText);
      if (eulaText?.length === 0) {
        throw new Error(`No content for file ${fileName}`);
      }
      text = eulaText;
      // raise Exception unless eulaText has value
      // const chunks: RegExpMatchArray | null | undefined = eulaText?.match(/[\s\S]{1,2999}/g)
      const chunks: any = eulaText?.match(/[\s\S]{1,2999}/g);
      return PollyUtils.startSynthesizeSpeech(chunks);
    })
    .then((mp3Generation: StartSpeechSynthesisTaskOutput | null) => {
      createDetailsMp3 = mp3Generation;
      log.debug('mp3 file location', JSON.stringify(mp3Generation));
    })
    .then((ret: any) => {
      const chunks: RegExpMatchArray | null | undefined = text?.match(/[\s\S]{1,4900}/g);
      // raise error if chunks has no value
      return ComprehendUtils.detectKeyPhrases(chunks);
    })
    .then((kp: any) => {
      const vals = Utils.sortEntriesByValues(kp?.KeyPhrases);
      const csv = Utils.mapToCsv(vals);
      return BucketUtils
        .uploadFile(`uploaded/${fileName.replace('txt', 'csv')}`, csv);
    })
    .then((uploadCsv: any) => {
      createDetailsCsv = uploadCsv;
      log.debug('uploaded CSV file', JSON.stringify(uploadCsv));
      return BucketUtils.deleteFile(fileName);
    })
    .then((cdMp3: any) => {
      console.log('mp3 file details', JSON.stringify(createDetailsMp3));
      console.log('CSV file details', JSON.stringify(createDetailsCsv));
      return createDetailsMp3;
    });
};
