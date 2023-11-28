import * as ComprehendUtils from '../src/comprehendUtils';
import FsPromises from 'fs/promises';
import { log4TSProvider } from "../src/config/LogConfig";

const log = log4TSProvider.getLogger("ComprehendUtilsTest");

function extractChunks(fileName: string): Promise<RegExpMatchArray | null> {
  return FsPromises.readFile(fileName)
    .then((buffer: Buffer) => {
      const text: string = buffer.toString();
      const ret: any = text.match(/[\s\S]{1,4900}/g);
      return ret;
    });
}

describe('detectSentiment', () => {
  it('detects sentiment of facebook', () => {
    return extractChunks('eulas/facebook/04.19.2018.txt')
      .then((chunks: RegExpMatchArray | null) => {
        return ComprehendUtils.detectSentiment(chunks);
      })
      .then((sentiment: any) => {
        log.debug('Facebook sentiment', sentiment);
        expect(sentiment.Sentiment).toEqual('NEUTRAL');
      })
  });

  it('detects sentiment of tumblr', () => {
    return extractChunks('eulas/tumblr/05.15.2018.txt')
      .then((chunks: RegExpMatchArray | null) => {
        return ComprehendUtils.detectSentiment(chunks);
      })
      .then((sentiment: any | null) => {
        log.debug('Tumblr sentiment', sentiment);
        expect(sentiment.Sentiment).toEqual('NEUTRAL');
      })
  });

  it('throws error when no text', () => {
    return extractChunks('test/files/empty.txt')
      .then((chunks: RegExpMatchArray | null) => {
        return expect(() => ComprehendUtils.detectSentiment(chunks)).toThrow('Empty text');
      });
  });
});

describe('keyPhrases', () => {
  it('detects key phrases in facebook eula', () => {
    return extractChunks('eulas/facebook/04.19.2018.txt')
      .then((chunks: RegExpMatchArray | null) => {
        return ComprehendUtils.detectKeyPhrases(chunks);
      })
      .then((keyPhrases: any) => {
        expect(keyPhrases.KeyPhrases.length).toBeGreaterThan(10);
      })
  });

  it('throws error when no text', () => {
    return extractChunks('test/files/empty.txt')
      .then((chunks: RegExpMatchArray | null) => {
        expect(() => ComprehendUtils.detectKeyPhrases(chunks)).toThrow('Empty text');
      });
  });
});

// todo find word(s) that appear very seldom to flag unusual clauses...
