import * as PollyUtils from '../src/pollyUtils'
import * as S3Helper from '../src/bucketUtils'
import { log4TSProvider } from '../src/config/LogConfig'

const log = log4TSProvider.getLogger('PollyUtilsTest')

describe('startSynthesizeSpeech', () => {
  it('converts text to mp3', async () => {
    const chunks: any = 'Hello there, everyone'.match(/[\s\S]{1,2999}/g)
    await PollyUtils.startSynthesizeSpeech(chunks)
      .then(async (ret: any) => {
        log.debug('after conversion', ret)
        const fileUri: string = ret?.SynthesisTask?.OutputUri
        expect(fileUri).toContain('.mp3')

        return await S3Helper.deleteFile(fileUri.split('eulagy/')[1])
      })
      .then((ret: any) => {
        log.debug('Deleted as part of cleanup', JSON.stringify(ret))
      })
  })

  it('throws error when no text', async () => {
    const chunks: any = 'bcd'.match(/[a]{1,2999}/g)
    void expect(async () => await PollyUtils.startSynthesizeSpeech(chunks)).rejects.toThrow('No text')
  })
})
