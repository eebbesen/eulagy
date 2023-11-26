import { PollyClient,
         SynthesizeSpeechCommand,
         SynthesizeSpeechCommandOutput } from '@aws-sdk/client-polly';

const pollyClient = new PollyClient({});

export function synthesizeSpeech(text: RegExpMatchArray | null ): Promise<SynthesizeSpeechCommandOutput> | null {
  if (!text) {
    return null;
  }
  const command = new SynthesizeSpeechCommand({
    OutputFormat: 'mp3',
    Text: text[0],
    VoiceId: 'Kimberly'
  });
  return pollyClient.send(command);
};