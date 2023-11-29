import {
  ComprehendClient,
  DetectKeyPhrasesCommand,
  type DetectKeyPhrasesCommandOutput,
  DetectSentimentCommand,
  type DetectSentimentCommandOutput
} from '@aws-sdk/client-comprehend'

const comprehendClient = new ComprehendClient({})

export async function detectSentiment (text: RegExpMatchArray): Promise<DetectSentimentCommandOutput> {
  if (text == null) {
    throw new Error('Empty text in detectSentiment')
  }
  const command = new DetectSentimentCommand({
    LanguageCode: 'en',
    Text: text[0]
  })
  return await comprehendClient.send(command)
};

export async function detectKeyPhrases (text: RegExpMatchArray): Promise<DetectKeyPhrasesCommandOutput> {
  if (text == null) {
    throw new Error('Empty text in detectKeyPhrases')
  }
  const command = new DetectKeyPhrasesCommand({
    LanguageCode: 'en',
    Text: text[0]
  })
  return await comprehendClient.send(command)
};
