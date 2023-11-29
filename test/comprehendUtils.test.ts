import * as ComprehendUtils from '../src/comprehendUtils'
import FsPromises from 'fs/promises'
import { log4TSProvider } from '../src/config/LogConfig'

const log = log4TSProvider.getLogger('ComprehendUtilsTest')

async function extractChunks (fileName: string): Promise<RegExpMatchArray> {
  return await FsPromises.readFile(fileName)
    .then((buffer: Buffer) => {
      const text: string = buffer.toString()
      const ret: any = text.match(/[\s\S]{1,4900}/g)
      return ret
    })
}

describe('detectSentiment', () => {
  it('detects sentiment of facebook', async () => {
    await extractChunks('eulas/facebook/04.19.2018.txt')
      .then(async (chunks: RegExpMatchArray) => {
        return await ComprehendUtils.detectSentiment(chunks)
      })
      .then((sentiment: any) => {
        log.debug('Facebook sentiment', sentiment)
        expect(sentiment.Sentiment).toEqual('NEUTRAL')
      })
  })

  it('detects sentiment of tumblr', async () => {
    await extractChunks('eulas/tumblr/05.15.2018.txt')
      .then(async (chunks: RegExpMatchArray) => {
        return await ComprehendUtils.detectSentiment(chunks)
      })
      .then((sentiment: any) => {
        log.debug('Tumblr sentiment', sentiment)
        expect(sentiment.Sentiment).toEqual('NEUTRAL')
      })
  })

  it('throws error when no text', async () => {
    await extractChunks('test/files/empty.txt')
      .then((chunks: RegExpMatchArray) => {
        void expect(async () => await ComprehendUtils.detectSentiment(chunks)).rejects.toThrow('Empty text')
      })
  })
})

describe('keyPhrases', () => {
  it('detects key phrases in facebook eula', async () => {
    await extractChunks('eulas/facebook/04.19.2018.txt')
      .then(async (chunks: RegExpMatchArray) => {
        return await ComprehendUtils.detectKeyPhrases(chunks)
      })
      .then((keyPhrases: any) => {
        expect(keyPhrases.KeyPhrases.length).toBeGreaterThan(10)
      })
  })

  it('throws error when no text', async () => {
    await extractChunks('test/files/empty.txt')
      .then(async (chunks: RegExpMatchArray) => {
        void expect(async () => await ComprehendUtils.detectKeyPhrases(chunks)).rejects.toThrow('Empty text')
      })
  })
})

// todo find word(s) that appear very seldom to flag unusual clauses...
