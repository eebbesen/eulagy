import {
  ComprehendClient,
  DetectKeyPhrasesCommand,
  DetectKeyPhrasesCommandOutput,
  DetectSentimentCommand,
  DetectSentimentCommandOutput
} from '@aws-sdk/client-comprehend';

const comprehendClient = new ComprehendClient({});

export function detectSentiment(text: RegExpMatchArray | null): Promise<DetectSentimentCommandOutput> | null {
  if (!text) {
    throw new Error('Empty text');
  }
  const command = new DetectSentimentCommand({
    LanguageCode: 'en',
    Text: text![0]
  });
  return comprehendClient.send(command);
};

export function detectKeyPhrases(text: RegExpMatchArray | null | undefined): Promise<DetectKeyPhrasesCommandOutput> | null {
  if (!text) {
    throw new Error('Empty text');
  }
  const command = new DetectKeyPhrasesCommand({
    LanguageCode: 'en',
    Text: text![0]
  });
  return comprehendClient.send(command);
};
