
import * as BucketUtils from './bucket_utils';
import * as Utils from './utils';
import * as PollyUtils from './pollyUtils';
import * as ComprehendUtils from './comprehendUtils';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { SynthesizeSpeechOutput } from '@aws-sdk/client-polly';

export function handler(event: any) {
  const rec: any = event.Records[0];
  const fileName: string = rec.s3.object.key;

  let text: string | undefined;
  let createDetailsMp3: string;
  let createDetailsCsv: string;

  return BucketUtils.downloadFile(fileName)
    .then((data: GetObjectCommandOutput) => {
      return data?.Body?.toString();
    })
    .then((eulaText: string | undefined) => {
      text = eulaText;
      // raise Exception unless eulaText has value
      // const chunks: RegExpMatchArray | null | undefined = eulaText?.match(/[\s\S]{1,2999}/g)
      const chunks: any = eulaText?.match(/[\s\S]{1,2999}/g)
      return PollyUtils.synthesizeSpeech(chunks);
    })
    .then((mp3: SynthesizeSpeechOutput | null) => {
      return BucketUtils
        .uploadFile(`uploaded/${fileName.replace('txt', 'mp3')}`, mp3?.AudioStream);
    })
    // .then((ret: any) => {
    //   const chunks: RegExpMatchArray | null | undefined = text?.match(/[\s\S]{1,4900}/g);
    //   // raise error if chunks has no value
    //   return ComprehendUtils.detectKeyPhrases(chunks);
    // })
    // .then((kp: any) => {
    //   // this is the issue, it does not upload
    //   const vals = Utils.sortEntriesByValues(kp?.KeyPhrases);
    //   const csv = Utils.mapToCsv(vals);
    //   // return BucketUtils
    //   //   .uploadFile(`uploaded/${fileName.replace('txt', 'csv')}`, csv);
    // })
    // .then((cd: any) => {
    //   createDetailsMp3 = cd;
    //   return BucketUtils.deleteFile(fileName);
    // })
    .then((cdMp3: any) => {
      return cdMp3;
    });
};
