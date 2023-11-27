import {
  DetectKeyPhrasesCommandOutput,
  DetectSentimentCommandOutput
} from '@aws-sdk/client-comprehend';
import * as ComprehendUtils from '../src/comprehendUtils';
import FsPromises from 'fs/promises';
import { log4TSProvider } from "../src/config/LogConfig";

const log = log4TSProvider.getLogger("ComprehendUtilsTest");

describe('detectSentiment', () => {
  it('detects sentiment of facebook', () => {
    return FsPromises.readFile('eulas/facebook/04.19.2018.txt')
      .then((buffer: Buffer) => {
        const text: string = buffer.toString();
        const chunks: RegExpMatchArray | null = text.match(/[\s\S]{1,4999}/g)
        return ComprehendUtils.detectSentiment(chunks);
      })
      .then((sentiment: any) => {
        log.debug('Facebook sentiment', sentiment);
        expect(sentiment.Sentiment).toEqual('NEUTRAL');
      })
  });

  it('detects sentiment of tumblr', () => {
    return FsPromises.readFile('eulas/tumblr/05.15.2018.txt')
      .then((buffer: Buffer) => {
        const text: string = buffer.toString();
        const chunks: RegExpMatchArray | null = text.match(/[\s\S]{1,4899}/g)
        return ComprehendUtils.detectSentiment(chunks);
      })
      .then((sentiment: any | null) => {
        log.debug('Tumblr sentiment', sentiment);
        expect(sentiment.Sentiment).toEqual('NEUTRAL');
      })
  });
});

describe('keyPhrases', () => {
  it('detects key phrases in facebook eula', () => {
    return FsPromises.readFile('eulas/facebook/04.19.2018.txt')
      .then((buffer: any) => {
        const text: string = buffer.toString();
        const chunks: RegExpMatchArray | null = text.match(/[\s\S]{1,4999}/g)
        return ComprehendUtils.detectKeyPhrases(chunks);
      })
      .then((keyPhrases: any) => {
        expect(keyPhrases.KeyPhrases.length).toBeGreaterThan(10);
      })
  });
});

// todo find word(s) that appear very seldom to flag unusual clauses...
